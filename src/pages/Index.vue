<template>
  <el-container>
    <el-aside width="180px">
      <!-- 左侧树菜单 -->
      <el-menu :default-active="defaultActive" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router unique-opened>
        <div v-for="item in newtreelist" :key="item.index">
          <!-- submenu: 可展开带二级选项卡 -->
          <el-submenu v-if="item.children" :index="item.index">
            <template slot="title">
              <i :class="item.icls"></i>
              <span>{{ item.title }}</span>
            </template>

            <!-- 二级儿子标题 -->
            <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
              <i :class="child.icls"></i>
              <span slot="title">{{ child.title }}</span>
            </el-menu-item>
          </el-submenu>
          <!-- menu-item: 一级选项卡，不带展开 -->
          <el-menu-item v-else :index="item.index">
            <i :class="item.icls"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>

    <el-container>

      <el-header height="50px">
        <el-row>
          <el-col :span="10">
            <!-- 面包屑 -->
            <div class='breadcrumb'>
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in breadlist" :key="item">{{ item }}</el-breadcrumb-item>
              </el-breadcrumb>

            </div>
          </el-col>
          <!-- 头像 -->

          <el-col :span="14" class="right-box">
            <!-- 右侧 -->
            <!-- 下拉菜单 -->
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                欢迎你,{{info.account}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 头像 -->
            <img class="avatar" width="50" height="50" :src="info.imgUrl" alt />
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { API_TOKEN, API_USER_INFO } from "@/api/apis";
export default {
  data() {
    return {
      // treelist: 左侧动态菜单数据
      //   index: 点击树选项卡，跳转的hash值
      //   icls: 树选项卡，前面的图标
      //   title: 树选项卡的一级名字
      //   children: 一级选项卡下面的二级菜单（选项卡） 带children属性的选项卡可以展开
      treelist: [
        {
          index: "/index/home",
          icls: "el-icon-menu",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "account",
          icls: "el-icon-location",
          title: "账号管理",
          role: ["super"],
          children: [
            {
              index: "/index/addaccount",
              icls: "el-icon-menu",
              title: "添加账号"
            },
            {
              index: "/index/changepwd",
              icls: "el-icon-menu",
              title: "修改密码"
            },
            {
              index: "/index/accountlist",
              icls: "el-icon-menu",
              title: "账号列表"
            }
          ]
        },
        {
          index: "/index/order",
          icls: "el-icon-document",
          title: "订单管理",
          role: ["super"]
        },
        {
          index: "/index/shops",
          icls: "el-icon-setting",
          title: "店铺管理",
          role: ["super"]
        },
        {
          index: "sale",
          icls: "el-icon-discount",
          title: "销售统计",
          role: ["super", "normal"],
          children: [
            {
              index: "/index/goodstotal",
              icls: "el-icon-link",
              title: "商品统计"
            },
            {
              index: "/index/ordertotal",
              icls: "el-icon-menu",
              title: "订单统计"
            }
          ]
        },
        {
          index: "item",
          icls: "el-icon-location",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            {
              index: "/index/addgoods",
              icls: "el-icon-menu",
              title: "添加商品"
            },
            {
              index: "/index/goodscate",
              icls: "el-icon-message",
              title: "商品分类"
            },
            {
              index: "/index/goodslist",
              icls: "el-icon-menu",
              title: "商品列表"
            }
          ]
        }
      ],
      //面包屑数组
      breadlist: ["首页"],
      //默认选中
      defaultActive: "",
      info: {},
      //用户信息
      role: "" //把用户的角色保存到data里面
    };
  },
  methods: {
    //根据hash值变化，切换面包屑
    changeBreadlist(hash) {
      let arr = [];
      //根据hash值，改变面包屑数组,
      switch (hash) {
        case "/index/home":
          arr = ["首页"];
          break;
        case "/index/order":
          arr = ["订单管理"];
          break;
        case "/index/shops":
          arr = ["店铺管理"];
          break;

        case "/index/addaccount":
          arr = ["账号管理", "添加账号"];
          break;
        case "/index/changepwd":
          arr = ["账号管理", "修改密码"];
          break;
        case "/index/accountlist":
          arr = ["账号管理", "账号列表"];
          break;
        // 销售统计
        case "/index/ordertotal":
          arr = ["销售统计", "订单统计"];
          break;
        case "/index/goodstotal":
          arr = ["销售统计", "商品统计"];
          break;
        //商品管理
        case "/index/addgoods":
          arr = ["商品管理", "添加商品"];
          break;
        case "/index/goodscate":
          arr = ["商品管理", "商品分类"];
          break;
        case "/index/goodslist":
          arr = ["商品管理", "商品列表"];
          break;
      }

      this.breadlist = arr;
    },
    handleCommand(command) {
      if (command === "personal") {
        this.$router.push("/index/person"); // 跳转到个人中心
      } else {
        // 退出登录
        // 清除本地储存
        localStorage.clear();
        // 弹出提示信息
        this.$message({
          type: "success",
          message: "退出登录成功"
        });
        // 跳转到登录页面
        this.$router.push("/");
      }
    },
    //封装函数，用于刷新页面
    getInfor() {
      API_USER_INFO(localStorage.id).then(res => {
        //console.log(res.data.accountInfo)

        //获取用户数据成功,进行用户数据的渲染
        this.info = res.data.accountInfo;
      });
    }
  },
  // 检测某个数据(hash)的变化
  watch: {
    //监听路由对象的变化
    $route: {
      handler: val => {
        // 在这里this指向不正确，需要提前把this挂载到window上
        // 在这里取出this,调用对应的切换面包屑函数
        window._indexthis.changeBreadlist(val.path);
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    // console.log(this.$router)  --> main.js里的router对象实例（最大的vuerouter实例,指向的是实例对象）
    let hash = this.$route.path;

    //根据hash值改变左侧树菜单默认选中
    this.defaultActive = hash;
    //改变面包屑数组
    this.changeBreadlist(hash);

    //保存这个this
    window._indexthis = this;
    //进入页面的时候判定token是否在用效期内 需要先得到token数据
    //console.log(localStorage.token)
    API_TOKEN(localStorage.token).then(res => {
      // console.log(res)
      if (res.data.code === 0) {
        //表示在用户登录的有效期内
      } else {
        //token已经过了有效期，需要用户重新继续登录
        this.$message("请重新登录");
      }
    });
    //console.log(localStorage.role)
    //把用户的角色保存到数据
    this.role = localStorage.role;
    //获取用户的账号

    //发送请求，获取用户的数据
    this.getInfor();
    //接收传递过来的头像，用于页面的刷新
    // 通过中介接收数据
    this.$bus.$on("upAvatar", () => {
      // 获取头部信息
      this.getInfor();
    });
  },
  //计算属性
  computed: {
    newtreelist() {
      //通过遍历treelist来计算需要遍历的新数组，最好不要更改最原始的遍历的数组
      return this.treelist.filter(v => v.role.includes(this.role));
    }
  }
};
</script>

<style lang="less" scoped>
@base: #545c64; //主题灰色
@base2: #f0f2f5; //灰色

.el-container {
  height: 100%;
  //左侧的菜单导航栏
  .el-aside {
    background-color: @base;
    //右上面的头部
    .el-menu {
      border-right: 0;
    }
  }
  // 右侧的头部
  .el-header {
    .el-row {
      height: 60px;
      .el-col {
        height: 60px;
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 50%;
          margin-left: 10px;
          background-color: aqua;
        }
      }
      .right-box {
        justify-content: flex-end;
      }
    }
    //右边的主体内容
    .el-main {
      background-color: @base2;
    }
  }
}
</style>