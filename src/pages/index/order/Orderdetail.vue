<template>
  <div>
    <el-card class="box-card">
      <div>
        <!-- 订单号 -->
        <el-form ref="form" :model="form" label-width="80px" :disabled="disabled">
          <el-form-item label="订单号" disadled>
            <el-input v-model="form.orderNo" :disabled="true"></el-input>
          </el-form-item>
          <!-- 下单时间 -->
          <el-form-item label="下单时间">
            <!-- <el-input v-model="form.orderTime"></el-input> -->
            <el-date-picker v-model="form.orderTime" type="datetime" placeholder="选择日期时间">
            </el-date-picker>

          </el-form-item>
          <!-- 联系电话 -->
          <el-form-item label="联系电话">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <!-- 收货人 -->
          <el-form-item label="收货人">
            <el-input v-model="form.consignee"></el-input>
          </el-form-item>
          <!-- 送货地址 -->
          <el-form-item label="送货地址">
            <el-input v-model="form.deliverAddress"></el-input>
          </el-form-item>
          <!-- 送达时间 -->
          <el-form-item label="送达时间 ">
            <!-- <el-input v-model="form.deliveryTime"></el-input> -->
            <el-date-picker v-model="form.deliveryTime" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
          <!-- 订单金额 -->
          <el-form-item label="订单金额 ">
            <el-input v-model="form.orderAmount"></el-input>
          </el-form-item>
          <!-- 订单状态 -->
          <el-form-item label="订单状态">
            <el-input v-model="form.orderState"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="edit" type="primary" icon="el-icon-edit">{{ disabled? "修改信息" : "保存修改"}}</el-button>
      </div>
    </el-card>
    <!-- 在订单详情页对整个详请的订单内容进行编辑 -->

  </div>
</template>

<script>
import { API_ORDER_DETAIL, API_DEIT_ORDER } from "@/api/apis";
import moment from "moment";
export default {
  data() {
    return {
      form: {},
      disabled: true
    };
  },

  methods: {
    getOrderDetail() {
      API_ORDER_DETAIL(localStorage.id).then(res => {
        //console.log(res.data.data);
        //   处理时间格式
        res.data.data.orderTime = moment(res.data.data.orderTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        res.data.data.deliveryTime = moment(res.data.data.deliveryTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.form = res.data.data;
      });
    },
    //编辑 整个表格的内容变为可以编辑的
    edit() {
      this.disabled = !this.disabled;
      if (this.disabled) {
        //如果点击保存发送请求
        API_DEIT_ORDER(
          // this.form.orderNo,

          // JSON.stringify(this.form.orderTime),
          // JSON.stringify(this.form.phone),
          // JSON.stringify(this.form.consignee),
          // this.form.deliverAddress,
          // JSON.stringify(this.form.deliveryTime),

          // JSON.stringify(this.form.remarks),
          // this.form.orderAmount,
          // this.form.orderState
          localStorage.id,
          this.form.orderNo,
          this.form.orderTime,
          this.form.phone,
          this.form.consignee,
          this.form.deliverAddress,
          this.form.deliveryTime,
          this.form.remarks,
          this.form.orderAmount,
          this.form.orderState
        ).then(res => {
          // console.log(res)
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "修改信息成功"
            });
            this.getOrderDetail();
            // this.$router.push("/index/order")
          }
        });
      }
    }
  },
  created() {
    this.getOrderDetail();
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .el-form {
    width: 500px;
  }
  .el-button {
    margin-left: 50px;
  }
}
</style>