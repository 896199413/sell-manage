<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>添加账号</span>

            </div>
            <div>
                <el-form :model="changepwd" status-icon ref="changepwd" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input type="password" v-model="changepwd.oldPwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input type="password" v-model="changepwd.newPwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPwd">
                        <el-input type="password" v-model="changepwd.confirmPwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="clickBtn()">确认</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import { API_CHECK_OLDPWD,API_UPDTAE_PWD } from "@/api/apis";
export default {
  methods: {
      //点击确认时候发送请求，并重新登录
    clickBtn() {
        this.$refs.changepwd.validate(valid=>{
            if(valid){
                //如果所有的验证都通过了，发送ajax请求
                API_UPDTAE_PWD(this.changepwd.newPwd,localStorage.id).then(res=>{
                    //console.log(res)
                    if(res.data.code==0){
                        localStorage.clear()
                        //跳转到登录页面
                        this.$router.push("/")
                    }
                    else{
                        this.$message.error('错了哦，修改密码失败')
                    }
                })
            }
        })
    },

    //重置密码，清空整个表单的内容
    resetForm() {
      this.$refs.changepwd.resetFields();
    }
  },
  data() {
    //定义正则表达式
    const reg = /^[a-zA-Z0-9_-]{2,8}$/; // 2-8位字母和数字组成
    //自定义表单验证 验证原密码
    var checkoldPwd = (rule, value, callback) => {
      if (value === "") {
        //非空输入的验证
        callback(new Error("请输入密码"));
      } else {
        //验证原密码是否和数据库的一致
        API_CHECK_OLDPWD(value, localStorage.id).then(res => {
          //console.log(res)
          if (res.data.code == 1) {
            callback(new Error("输入的原密码有误"));
          } else {
            callback();
          }
        });
      }
    };
    var checknewPwd = (rule, value, callback) => {
      if (value === "") {
        //非空输入的验证
        callback(new Error("请输入新密码"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("密码由2-8位数字或者字母构成"));
        } else {
          // 反向一致，即先输入确认密码后再输入新密码，这时由新密码框来进行验证两次输入是否一致
          if (this.changepwd.confirmPwd) {
            // 判断确认密码是否为空
            // 获取表单里的confirmPwd值
            this.$refs.changepwd.validateField("confirmPwd");
          }
          callback();
        }
      }
    };
    //再次确认密码的验证
    var checkConfirmPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认新密码"));
      } else if (value !== this.changepwd.newPwd) {
        // 如果确认密码与新密码的值不等
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

    return {
      changepwd: {},
      rules: {
        oldPwd: {
          trigger: "blur",
          validator: checkoldPwd //旧密码的验证
        },
        newPwd: {
          trigger: "blur",
          validator: checknewPwd
        },
        confirmPwd: {
          required: true,
          validator: checkConfirmPwd,
          trigger: "blur"
        }
      }
    };
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .el-form {
    width: 400px;
  }
}
</style>