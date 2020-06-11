<template>
    <div>
        <!-- 订单管理 -->
        <el-card class="box-card">
            <div>
                <!-- 查询的条件 -->
                <el-form :inline="true" :model="searchform" class="demo-form-inline" size="small">
                    <el-form-item label="订单号">
                        <el-input v-model="searchform.orderNo" placeholder="订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人">
                        <el-input v-model="searchform.consignee" placeholder="收货人"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="searchform.phone" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select v-model="searchform.orderState" placeholder="订单状态">
                            <el-option label="未受理" value="未受理"></el-option>
                            <el-option label="已受理" value="已受理"></el-option>
                            <el-option label="派送中" value="派送中"></el-option>
                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 选择时间 -->
                    <el-form-item label="选择时间 ">
                        <el-date-picker v-model="searchform.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格的内容 -->
                <el-table :data="tableData" border style="width: 90%">
                    <!-- 订单号 -->

                    <el-table-column fixed prop="orderNo" label="订单号" width="150">
                    </el-table-column>
                    <!-- 下单时间 -->

                    <el-table-column prop="orderTime" label="下单时间" width="120">
                    </el-table-column>
                    <!-- 联系电话 -->
                    <el-table-column prop="phone" label="联系电话" width="120">
                    </el-table-column>
                    <!-- 收货人 -->
                    <el-table-column prop="consignee" label="收货人 " width="120">
                    </el-table-column>
                    <!-- 送货地址 -->
                    <el-table-column prop="deliverAddress" label="送货地址" width="120">
                    </el-table-column>
                    <!-- 送达时间 -->
                    <el-table-column prop="deliveryTime" label="送达时间 " width="120">
                    </el-table-column>
                    <!-- 备注 -->
                    <el-table-column prop="remarks" label="备注 " width="120">
                    </el-table-column>
                    <!-- 订单金额 -->
                    <el-table-column prop="orderAmount" label="订单金额 " width="120">
                    </el-table-column>
                    <!-- 订单状态 -->
                    <el-table-column prop="orderState" label="订单状态 " width="120">
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        
                        </template>
                    </el-table-column>

                </el-table>

                <!-- 分页 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,8,10,15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>

<script>
import { API_ORDER_lIST } from "@/api/apis";
//处理时间格式
import moment from "moment";
export default {
  methods: {
    //查看
    handleClick(row) {
        //console.log(row)
        //同时跳转到订单详情的页面 同时把相关的订单的内容保存到本地，然后在进行数据的渲染
        this.$router.push("/index/orderdetail")
        localStorage.id=row.id
    },
    onSubmit() {
        this.getOrderList()
    },
    //分页
    handleSizeChange(val) {
        this.pageSize=val
        this.getOrderList()

    },
    handleCurrentChange(val) {
        this.currentPage=val
        this.getOrderList()
    },
  

    //封装调用的函数
    getOrderList() {
      API_ORDER_lIST(
        this.currentPage,
        this.pageSize, // 必须的选项
        //默认的选项
        this.searchform.orderNo,
        this.searchform.consignee,
        this.searchform.phone,
        this.searchform.orderState,
        JSON.stringify(this.searchform.date)
      ).then(res => {
        //console.log(res.data.data);
        res.data.data.forEach(v => {
          v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD HH:mm:ss");
          v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");

          this.tableData = res.data.data;
          this.total = res.data.total;
        });
      });
    }
  },
  data() {
    return {
      tableData: [],
      orderState: [],
      searchform: {},
      value1: "",
      currentPage: 1, //当前的页面
      pageSize: 5, //每页显示的条数
      total: 0, //总的条数
    };
  },
  created() {
    //调用函数需要封装函数，在后续的查询中多次使用
    this.getOrderList();
  }
};
</script>

<style lang="less" scoped>
</style>