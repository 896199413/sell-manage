<template>
  <div>
    <el-card class="box-card">
      <el-form>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="时间范围">
              <el-date-picker
      v-model="formInline.date"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd HH:mm:ss"
      unlink-panels
      >
    </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-form>
      <!--  -->
      <div id="main" style="height:400px; width:90%"></div>
    </el-card>

    <!--  -->

  </div>
</template>

<script>
import echarts from "echarts";
import { API_ORDER_DATA } from "@/api/apis";
import moment from "moment"
export default {
  data() {
    return {
     
      formInline: { date: [],},
      xData:[],
      yData:[],
    };
  },
  methods: {
    //点击查询的时候，重新渲染数据
    onSubmit() {
     this.getOrderData()
      //console.log(this.formInline.date)
    },
    // 封装函数
    getOrderData(){
         var myChart = echarts.init(document.getElementById("main"));
    //获取数据
    // this.getOrderData()
    API_ORDER_DATA(JSON.stringify(this.formInline.date)).then(res => {
      //console.log(res.data.data);
      //处理时间格式
     this.xData=  res.data.data.map(v => {
           return moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss")
       });
     //Y轴数据
     this.yData=res.data.data.map(item=>{
       return  item.orderAmount
     })
      var option = {
       title: {
          text: "订单统计"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["订单金额"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
         
          {
            name: "订单金额",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.yData
          }
        ]
      };
      myChart.setOption(option);
    });
    
    }  
  },

  mounted() {
     this.getOrderData()
  },
  created(){
   
  }
};
</script>

<style lang="less" scoped>
</style>