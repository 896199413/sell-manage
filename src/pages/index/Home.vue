<template>
  <div class="home">
    <el-card class="box-card">

      <el-row :gutter="20">
        <el-col v-for="(item, i) in dataList" :span="6" :key="i">
          <div class="item">
            <div class="icon">
              <img width="50" height="50" :src="item.iconSrc" />
            </div>
            <div class="count">
              <p>{{ item.title }}</p>
              <h1>{{ item.count }}</h1>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 下面是表格的内容 -->
      <div id="main" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { API_HOME_DATA } from "@/api/apis";
export default {
  data() {
    return {
      dataList: [
        {
          iconSrc: require("@/assets/imgs/allorder-icon.png"),
          title: "总订单",
          count: 102400
        },
        {
          iconSrc: require("@/assets/imgs/allsale-icon.png"),
          title: "总销售额",
          count: 102400
        },
        {
          iconSrc: require("@/assets/imgs/todayorder-icon.png"),
          title: "今日订单数",
          count: 102400
        },
        {
          iconSrc: require("@/assets/imgs/todaysale-icon.png"),
          title: "今日销售额",
          count: 102400
        }
      ]
    };
  },
  mounted() {
    //发送请求，获取数据

    //     xData: (7) ["2019/11/17", "2019/11/18", "2019/11/19", "2019/11/20", "2019/11/21", "2019/11/22", "2019/11/23"]
    // orderData: (7) [120, 132, 101, 134, 90, 230, 210]
    // amountData: (7) [220, 282, 191, 234, 290, 330, 310]
    var myChart = echarts.init(document.getElementById("main"));

    API_HOME_DATA().then(res => {
      //console.log(res.data);
      // 解构出数据
      let {
        xData,
        orderData,
        amountData,
        totalOrder,
        totalAmount,
        todayOrder,
        totayAmount
      } = res.data;
      //赋值数据
      this.dataList[0].count = totalOrder;
      this.dataList[1].count = totalAmount;
      this.dataList[2].count = todayOrder;
      this.dataList[3].count = totayAmount;
      myChart.showLoading();

      var option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单","金额"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单",
            type: "line",
            stack: "总量",
            data: orderData
          },
          {
            name: "金额",
            type: "line",
            stack: "总量",
            data: amountData
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.hideLoading();
    });
  }
};
</script>

<style lang="less" scoped>
.home {
  .box-card {
    background-color: #f2f2f2;
  }
  .el-row {
    .item {
      background-color: #fff;
      max-width: 260px;
      height: 100px;
      display: flex;
      margin-bottom: 40px;

      .icon {
        flex: 0 0 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .count {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
        p {
          color: #97a8be;
          margin-top: 20px;
        }
        h1 {
          font-weight: 700;
          color: orange;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>