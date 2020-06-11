<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品添加</span>

      </div>
      <div>
        <el-form ref="goodsAddForm" :model="goodsAddForm" label-width="80px">
          <!-- 商品名称 -->
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.name"></el-input>
          </el-form-item>

          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-select v-model="goodsAddForm.category" placeholder="请选择商品类型">
              <el-option v-for="item in categories" :key="item.cateName" :label="item.cateName" :value="item.cateName"></el-option>
            </el-select>
          </el-form-item>

          <!-- 商品价格 -->
          <el-form-item label="商品价格">
            <el-input-number v-model="goodsAddForm.price" :min="0" :max="1000" label="商品价格"></el-input-number>
          </el-form-item>

          <!-- 上传商品图片 -->
          <el-form-item label="商品图片">
            <el-upload class="avatar-uploader" action="http://127.0.0.1:5000/goods/goods_img_upload" :show-file-list="false" :on-success="handleImgSuccess" :before-upload="beforeImgUpload">
              <img v-if="goodsAddForm.imgUrl" :src="baseImgUrl+goodsAddForm.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 商品描述 -->
          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="goodsAddForm.goodsDesc"></el-input>
          </el-form-item>

          <!-- 添加商品按钮 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
import { API_CATE_GOODS, API_GOODS_ALL } from "@/api/apis";
export default {
  methods: {
    //点击添加商品的时候，验证整个表格的内容是否符合验证
    onSubmit() {
      API_GOODS_ALL(
        this.goodsAddForm.name,
        this.goodsAddForm.category,
        this.goodsAddForm.price,
        this.goodsAddForm.imgUrl,
        this.goodsAddForm.goodsDesc

      ).then(res => {
        console.log(res);
        if(res.data.code==0){
          this.$message({
            type:"success",
            message:"添加商品成功"
          })
          this.goodsAddForm={}
          this.$router.push('/index/goodslist')
        }
      });
    },
    //图片的上传
    handleImgSuccess(res) {
      //console.log(res)
      if (res.code == 0) {
        this.goodsAddForm.imgUrl = res.imgUrl;
      }
    },
    beforeImgUpload() {} //图片上传成功前的样式
  },
  data() {
    return {
      goodsAddForm: {
        imgUrl: "",
        price: 0
      },
      categories: [],

      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/"
    };
  },
  created() {
    //获取商品的分类
    API_CATE_GOODS().then(res => {
      // console.log(res.data.categories);

      this.categories = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .el-form {
    width: 500px;
    /deep/ .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
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
  }
}
</style>