<template>
  <div class="personal">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员信息</span>

      </div>
      <div>
        <p>管理员ID:
          <span class="info">{{ info.id }}</span>
        </p>
        <el-divider></el-divider>
        <p>账号: {{ info.account }}</p>
        <el-divider></el-divider>
        <p>用户组: {{ info.userGroup }} </p>
        <el-divider></el-divider>
        <p>创建时间: {{ info.ctime |filterCtime }} </p>
        <el-divider></el-divider>
        <div>
          <h3 class="text">管理员头像:</h3>

          <!-- 头像上传 -->
          <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="data" class="avatar-uploader" action="http://127.0.0.1:5000/users/avatar_upload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar" width="150" height="150" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </div>
      </div>
    </el-card>

  </div>
</template>

<script>

import moment from "moment";
import {  API_USER_INFO } from "@/api/apis"; //上传头像的接口

export default {
    components:{
       
    },
  data() {
    return {
      // 用户数据对象
      info: {},
      imgUrl: "",
      data:{id:localStorage.id},
      //baseImgUrl: "http://127.0.0.1:5000/upload/imgs/acc_img/"
    };
  },
  methods: {
    // 上传成功
    handleAvatarSuccess() {
      this.updateimg()
      // window.location.reload()
    },
    // 上传之前
    beforeAvatarUpload() {},
    //封装函数
    updateimg(){
        API_USER_INFO(localStorage.id).then((res)=>{
      //console.log(res.data.accountInfo)
     
        this.info=res.data.accountInfo
        this.imgUrl =res.data.accountInfo.imgUrl
         // 将头像通过中介传给头部，让头部改变头像
        this.$bus.$emit("upAvatar");
      
    })
    }
    
  },
  created(){
    //获取用户的数据
    //console.log(localStorage.id)
    //封装函数
     this.updateimg()
    
  },
  filters:{
    // 过滤器
    filterCtime(time){
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
<style lang='less' scoped>
.personal {
  .content {
    .text {
      margin-bottom: 30px;
    }
    .el-button {
      margin-top: 20px;
    }
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
    .info {
      padding-left: 20px;
    }
  }
}
</style>