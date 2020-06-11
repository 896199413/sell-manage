<template>
    <div class="addaccount">

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加账号</span>

            </div>
            <div>
                <el-form :model="accadd" status-icon ref="accadd" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accadd.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password">
                        <el-input type="password" v-model="accadd.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 选择用户组 -->
                    <el-form-item label="请选择用户组" >
                        <el-select v-model="accadd.userGroup" placeholder="请选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通管理员" value="普通管理员"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="clickBtn()">添加</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

    </div>
</template>

<script>
// import { API_ADD_ACCOUNT } from '../../../api/apis'
import { API_ADD_ACCOUNT } from "@/api/apis";
// @/跳转到src的根目录
export default {
  methods: {
    //确认密码 里面传入需要传的参数
    clickBtn() {
      API_ADD_ACCOUNT(this.accadd.account,this.accadd.password,this.accadd.userGroup).then(res => {
       // console.log(res);
        //判断添加是否成功
        if(res.data.code===0){
            this.$message({
                type:"success",
                message:"添加成功"
            })
            //跳转到添加账号列表
            this.$router.push('/index/accountlist')
        }
         else{
             this.$message.error("添加失败")
         }
      });
    },

    //重置
    resetForm() {
          this.$refs.accadd.resetFields();
    }
  },
  data() {
    return {
      accadd: {
        account: "",
        password: "",
        userGroup: ""
      }
    };
  }
};
</script>

<style lang="less" scoped>
 .addaccount{
     .box-card{
         .el-form{
             width:300px;
         }
     }
 }
</style>