<template>
    <div>
        <el-card>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="expand">
                    <!-- 放详细信息的地方 -->
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <!-- 商品的名称 -->
                            <el-form-item label="商品名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <!-- 商品分类 -->
                            <el-form-item label="商品分类">
                                <span>{{ props.row.category }}</span>
                            </el-form-item>
                            <!-- 商品价格 -->
                            <el-form-item label="商品价格">
                                <span>{{ props.row.price }}</span>
                            </el-form-item>
                            <!-- 商品的图片 -->
                            <el-form-item label="商品图片">
                                <span>{{ props.row.imgUrl }}</span>
                            </el-form-item>
                            <!-- 商品创建时间 -->
                            <el-form-item label="商品图片">
                                <span>{{ props.row.ctime|filterCtime }}</span>
                            </el-form-item>
                            <!-- 商品评价-->
                            <el-form-item label="商品评价">
                                <span>{{ props.row.rating }}</span>
                            </el-form-item>
                            <!-- 商品销量 -->
                            <el-form-item label="商品评价">
                                <span>{{ props.row.sellCount }}</span>
                            </el-form-item>
                            <!-- 商品描述 -->

                            <el-form-item label="商品描述">
                                <span>{{ props.row.goodsDesc }}</span>
                            </el-form-item>

                            <!-- 操作 -->

                        </el-form>
                    </template>
                </el-table-column>
                <!-- 商品名称 -->
                <el-table-column label="商品名称" prop="name" width="180px"></el-table-column>
                <!-- 商品分类 -->
                <el-table-column label="商品分类" prop="category" width="130px"></el-table-column>
                <!-- 商品价格 -->
                <el-table-column label="商品价格" prop="price" width="130px"></el-table-column>
                <!-- 商品图片 -->
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img class="goodsImg" width="50" height="50" :src="baseImgUrl+scope.row.imgUrl" alt="商品图片" />
                    </template>
                </el-table-column>
                <!-- 商品描述 -->
                <el-table-column label="商品描述" prop="goodsDesc">
                    <template slot-scope="scope">{{scope.row.goodsDesc}}</template>
                </el-table-column>
                <!-- 商品操作 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="editBtn(scope.row)" size="mini">编辑</el-button>
                        <el-button type="danger" @click="del(scope.row)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页的设置 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10,15,10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 点击编辑的时候出现模态框 -->
            <el-dialog title="商品编辑" id="motai" :visible.sync="dialogVisible" width="400px">
                <!-- 商品表单 -->
                <el-form :model="editForm" :rules="rules" size="small" status-icon ref="editForm" label-width="70px">
                    <!-- 商品名称 -->
                    <el-form-item label="商品名称">
                        <el-input v-model="editForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 所属分类 -->
                    <!-- 商品分类 -->
                    <el-form-item label="商品分类">
                        <el-select v-model="editForm.category" placeholder="请选择商品分类">
                            <!-- <el-option label="粥品" value="粥品"></el-option> -->
                            <el-option v-for="item in categories" :key="item.cateName" :label="item.cateName" :value="item.cateName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 价格 -->
                    <!-- 商品价格 -->
                    <el-form-item label="商品价格">
                        <template>
                            <el-input-number v-model="editForm.price" :min="1" :max="99999" label="描述文字"></el-input-number>
                        </template>
                    </el-form-item>
                    <!-- 图片 -->
                    <!-- 商品图片 -->
                    <el-form-item label="商品图片">
                        <el-upload class="avatar-uploader" action="http://127.0.0.1:5000/goods/goods_img_upload" :show-file-list="false" :on-success="handleImgSuccess" :before-upload="beforeImgUpload">
                            <img v-if="editForm.imgUrl" :src="baseImgUrl+editForm.imgUrl" class="avatar" width="100" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item label="商品描述">
                        <el-input type="textarea" v-model="editForm.goodsDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="edit">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {
  API_GOODS_LIST,
  API_GOODS_DEL,
  API_CATE_GOODS,
  API_GOODS_EDIT
} from "@/api/apis";
import moment from "moment";
export default {
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      tableData: [],
      total: 0,
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/",
      categories: [],
      editForm: {},
      rules: {},
      dialogVisible: false //模态框
    };
  },
  methods: {
    getGoodsList() {
      API_GOODS_LIST(this.currentPage, this.pageSize).then(res => {
        // console.log(res.data);
        this.total = res.data.total;
        this.tableData = res.data.data;
      });
    },
    //   分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },
    //删除
    del(row) {
      //console.log(row.id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //发送请求
        API_GOODS_DEL(row.id).then(res => {
         // console.log(res.data.code);
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getGoodsList()
          }
        });
      });
    },
    //编辑
    // 修改
    editBtn(row) {
      // 打开模态框
      this.dialogVisible = true;
      this.editForm = { ...row };
    },
    //获取商品的分类
    getGoodsCate() {
      API_CATE_GOODS().then(res => {
        //console.log(res)
        this.categories = res.data.categories;
      });
    },
    //图片的上传
    handleImgSuccess(res) {
      console.log(res);
      if (res.code == 0) {
        this.editForm.imgUrl = res.imgUrl;
      }
    },
    beforeImgUpload() {},
    //点击确定的时候更改数据
    edit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //   this.dialogVisible = false;
          //   API_GOODS_EDIT(
          //this.editForm.name,
          //   this.editForm.category
          //   .this.editForm.price,
          //   this.editForm.imgUrl,
          //   this.editForm.goodsDesc,
          //   row.id).then((res)=>{
          //       console.log(res)
          //   })
          this.dialogVisible = false;
          this.getGoodsList();
          API_GOODS_EDIT(
            this.editForm.name,
            this.editForm.category,
            this.editForm.price,
            this.editForm.imgUrl,
            this.editForm.goodsDesc,
            this.editForm.id
          ).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "修改商品成功"
              });
            }
            this.getGoodsList()
          });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getGoodsList();
    this.getGoodsCate();
  },
  filters: {
    //处理时间格式
    filterCtime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
</style>