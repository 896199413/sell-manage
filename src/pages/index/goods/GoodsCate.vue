<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品分类</span>
                <el-button @click="dialogVisible = true" style="float: right;" size="mini" type="primary" icon="el-icon-folder-add">添加分类</el-button>
            </div>
            <div>
                <div class="content" slot="content">
                    <!-- 商品分类表格 -->
                    <el-table :data="goodsaddData" style="width: 100%">
                        <!-- 序号 -->
                        <!-- 可以通过prop="id这样渲染数据，也可以通过slot-scope 插槽占位的方法渲染数据" -->
                        <el-table-column label="序号" width="180">
                            <template slot-scope="scope">
                                <!-- $index拿当前行索引，从0开始，所以+1，也可以直接scope.index -->
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>

                        <!-- 分类名称 -->
                        <el-table-column label="分类名称" width="180">
                            <template slot-scope="scope">
                                <!-- 显示分类名称 -->
                                <span v-if="!scope.row.isEdit">{{scope.row.cateName}}</span>
                                <!-- 修改分类名称 -->
                                <el-input v-else size="mini" v-model="scope.row.cateName"></el-input>
                            </template>
                        </el-table-column>

                        <!-- 是否应用 -->
                        <el-table-column label="是否应用">
                            <template slot-scope="scope">
                                <!-- scope.row拿当前行的数据 -->
                                <el-switch v-model="scope.row.state" :disabled="!scope.row.isEdit" active-color="#13ce66"></el-switch>
                            </template>
                        </el-table-column>

                        <!-- 编辑&删除 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="edit(scope.row)" v-if="!scope.row.isEdit" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="success" @click="saveEdit" v-else size="mini">完成</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 分页 -->
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" style="margin-top:30px"></el-pagination>

                    <!-- 模态框 -->
                    <el-dialog title="添加商品分类" :visible.sync="dialogVisible" width="420px">
                        <!-- 表单 -->
                        <el-form width="380" :model="addForm">
                            <!-- 分类名称 -->
                            <el-form-item label="分类名称">
                                <el-input v-model="addForm.cateName"></el-input>
                            </el-form-item>
                            <!-- 是否启用 -->
                            <el-form-item label="是否启用">
                                <el-switch v-model="addForm.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                            </el-form-item>
                        </el-form>

                        <!-- 取消确定按钮 -->
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addgoodsCate">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { API_GOODS_ADD, API_GOODS_CATE,API_DELETE_CATE,API_GOODS_EDITCATE} from "@/api/apis";
export default {
  data() {
    return {
      // 列表数据
      goodsaddData: [],
      // 分页数据
      currentPage: 1,
      pageSize: 5, //每页的条数
      total: 100, //总条数
      isEdit: false, //是否启用
      dialogVisible: false, //编辑模态框是否显示
      // 添加分类表单
      addForm: {
        //编辑表单
        cateName: "",
        state: false
      },
      //验证规则
      rules: {
        cateName: {},
        isUse: {}
      }
    };
  },
  methods: {
    // 改变当前页面后触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCateData();
    },

    // 编辑按钮
    edit(row) {
      // 点击编辑，编辑状态变为可以用(默认是禁用),所以取反
      row.isEdit = !row.isEdit;
      this.row = row;
    },

    //修改分类 编辑完成的时候，把修改后的数据发送给后台，在进行数据的重新渲染
    saveEdit(){
        API_GOODS_EDITCATE(this.row.id,this.row.cateName,this.row.state).then((res)=>{
            //console.log(res)
            if(res.data.code==0){
                this.$message({
                    type:"success",
                    message:"修改商品分类成功"
                })
                //重新渲染列表
                this.getCateData()
            }
        })
    },
    
    //删除单条数据的分类
     del(row){
        console.log(row.id)
        API_DELETE_CATE(row.id).then((res)=>{
            console.log(res)
            if(res.data.code==0){
                this.$message({
                    type:"success",
                    message:"删除分类成功"
                })
                this.getCateData()
            }
        })
     },
    //获取数据
    getCateData() {
      API_GOODS_CATE(this.currentPage, this.pageSize).then(res => {
        console.log(res.data.data);
        // 处理数据格式 获取的res.data.data是一个数组对象，要先判断里面的switch开关状态
        res.data.data.forEach(item => {
          // 判断后台传来的switch状态，1为应用，0为不启用
          item.state = item.state === 1 ? true : false;
          // 每一项添加一个字段 是否可以编辑 默认false让每个switch的都独立控制
          item.isEdit = false;
        });
        // 赋值渲染
        this.goodsaddData = res.data.data;
        this.total = res.data.total;
      });
    },

    // 确认添加按钮添加分类
    addgoodsCate() {
      // 获取switch的状态,因为后台的状态是0,1,所以先转换

      // console.log(states);

      // 发送ajax
      API_GOODS_ADD(this.addForm.cateName, this.addForm.state).then(res => {
        if (res.data.code === 0) this.getCateData(); //重新渲染
        this.dialogVisible = false;
        this.getCateData();
      });
      // chg
    }
  },
  created() {
    // 进入页面调用一次
    this.getCateData();
  }
};
</script>

<style lang="less" scoped>
</style>