<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账号列表</span>
                <el-table :data="acclist" @selection-change="selectionChange" ref="acclist">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="account" label="账号" width="180">
                    </el-table-column>
                    <el-table-column prop="userGroup" label="用户组" width="180">
                    </el-table-column>

                    <el-table-column prop="ctime" label="创建时间">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页插件  -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <!-- 按钮 -->
                <el-button type="danger" size="small" @click="batchDete">批量删除</el-button>
                <el-button type="primary" size="small" @click= toggleSelection()>取消选择</el-button>

                <!-- 点击编辑的时候会出现模态框 -->
                  <el-dialog title="账号编辑" :visible.sync="dialogVisible" width="400">
          <!-- 表单 -->
          <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px">
            <!-- 账号 -->
            <!-- prop的值是和：rules对应的； v-model的值是和:model对应的 -->
            <el-form-item label="账号" prop="account">
              <el-input type="text" v-model="editForm.account" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item label="用户组" prop="userGroup">
              <el-input type="text" v-model="editForm.userGroup" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <!-- 模态框弹出后的取消和确认按钮 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </el-dialog>
            </div>
            <div>

            </div>
        </el-card>
    </div>
</template>

<script>
import {
  API_GET_ACCLIST,
  API_DELETE_ACC,
  API_DELETE_BATCHACC,
  API_EDIt_ACC
} from "@/api/apis";

//处理时间格式的
import moment from "moment";

export default {
  methods: {
    AccList() {
      API_GET_ACCLIST(this.currentPage, this.pageSize).then(res => {
        // console.log(res.data)
       
          //得到结果后需要处理下时间的格式
        res.data.data.forEach(v => {
          v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
        });
    //       /* 
    //     边界判断:当前页面内数据为空且当前的页面不是1(即大于1),
    //             就将当前页面-1，显示-1后的页码的页面内容
    //   */
    //   if (!res.data.length && this.currentPage !== 1) {
    //     // 页码-1
    //     this.currentPage -= 1;
    //     // 用减了1的currentPage再次调用函数请求数据并渲染
    //     this.AccList();
    //   }
        
        this.total = res.data.total; //总的条数
        this.acclist = res.data.data;
        
       
      });
      
    },
    //编辑
    handleEdit(row) {
          this.dialogVisible=true//控制模态框的控制和隐藏
            //进行数据的回填 
            this.editForm={...row}
    },
    //删除
    handleDelete(row) {
      console.log("删除的数据", row.id);
      //点击删除的时候发送请求

      // console.log(res)
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        API_DELETE_ACC(row.id)
          .then(res => {
            if (res.data.code === 0)
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            this.AccList(this.currentPage);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    //分页
    handleSizeChange(val) {
      //选择的每页显示的条数
      //console.log(val)
      this.pageSize = val;
      this.AccList(this.pageSize);
    },
    handleCurrentChange(val) {
      //当前的页数
      //console.log(val)
      this.currentPage = val;
      this.AccList(this.currentPage); //当前的页码数发生变化
    },
    //批量删除 需要监听的是整个表格的内容 点击确定删除的时候，删除以下的账号，在删除账号前需要判断下用户是有有进行选择
    batchDete() {
      if (!this.ids || this.ids.length == 0) {
        this.$message("请选择后再进行删除");
        return;
      }

      this.$confirm("此操作将永久删除以下账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确认的 时候在发送请求
        API_DELETE_BATCHACC(JSON.stringify(this.ids)).then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
        // 再次刷新页面
            this.AccList(this.currentPage)
          }
        });
      });
    },
    //当选择项发生变化的时候会触发该函数
    selectionChange(selection) {
      //console.log(selection) 需要得到的是里面的ids
      //遍历数组得到里面的ids
      this.ids = selection.map(v => {
        return v.id;
      });
      console.log(this.ids);
    },
    //取消选择
    toggleSelection(){
       this.$refs.acclist.clearSelection();
    },
    //点击确认的时候发送请求，更改数据
    saveEdit(){
        API_EDIt_ACC(this.editForm.id,this.editForm.account,this.editForm.userGroup).then((res)=>{
           console.log(res)
           //判断
           if(res.data.code==0){
               this.$message({
                   type:"success",
                   message:"修改成功"
               })
               //同时模态框进行关闭
               this.dialogVisible=false
               this.AccList(this.currentPage)
           }
           else{
               this.$message.error("请重新修改")
           }
        })
    }
  },
  created() {
    this.AccList(this.currentPage); //调用函数
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1, //当前的页码
      total: 0, //总的页数
      acclist: [],
      dialogVisible:false,//模态框默认是隐藏的
      editForm:{  //模态框里面的数据
      account:"",
      password:"",
      userGroup:""

      },
      rules:{}//如果需要验证的话

    };
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .el-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>