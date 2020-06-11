<template>
  <div class="login-div">
    <el-card class="box-card">
      <h4>餐饮管理系统</h4>
      <el-input v-model="acc" placeholder="请输入管理员账号"></el-input>
      <el-input class="pwd-input" v-model="pwd" placeholder="请输入密码"  type="password"></el-input>
      
      <el-button @click="clickLogin" type="primary" class="btn">登录</el-button>
    </el-card>
  </div>
</template>

<script>
import { API_LOGIN } from "../api/apis";

export default {
  data() {
    return {
      acc: "",
      pwd: "",
     
      isreq: true //点击后是否发送请求 true: 发送登录请求   false: 不发送请求
    };
  },
  methods: {
    clickLogin() {
      // 防抖节流： 3秒定时器..点击一次发送一次请求后，3秒后才能发送下一次请求
      if (this.isreq == false) return;

      //发送一次登录请求，把标识设置为false
      this.isreq = false;

      //发送请求
      API_LOGIN(this.acc, this.pwd).then(res => {
       // console.log(res);
        if (res.data.code == 0) {
          //登录成功!
          this.$message({
            message: "登陆成功!",
            type: "success"
          });
          //登录成功后是，可以获取到token ,把token保存到本地
          localStorage.token = res.data.token;
          //账号保存到本地
          localStorage.account = this.acc
          //把用户的id保存到本地
          localStorage.id = res.data.id;
          //登录的时候把用户的角色保存到本地
          localStorage.role=res.data.role,

          setTimeout(() => {
            this.$router.push("/index/home"); //找到main.js中router对象实例， 调用push()函数改变hash地址
          }, );
        } else {
          this.$message.error("登录失败,用户名或密码错误");
          // this.error_text = true;
        }
      });

      setTimeout(() => {
        this.isreq = true; //3秒后，又可以进行点击
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
@base: #2d3a4b;

.login-div {
  width: 100%;
  height: 100%;
  background-color: @base;
  display: flex;
  justify-content: center;
  align-items: center;

  .box-card {
    width: 400px;
    text-align: center;

    h4 {
      color: @base;
      margin: 14px 0;
    }

    .pwd-input {
      margin-top: 10px;
    }
    .btn {
      margin-top: 12px;
      width: 100%;
    }
  }
}
</style>