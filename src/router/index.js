import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
//引入验证token的有效期
import { API_TOKEN } from "@/api/apis"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Login',
      meta: { role: ["super", "normal"] },
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../pages/Index'),
      children: [
        {//首页
          path: '/index/home',
          name: 'home',
          meta: { role: ["super", "normal"] },

          component: () => import('../pages/index/Home'),
        },
        // 订单
        {
          path: '/index/order',
          name: 'order',
          meta: { role: ["super"] },
          component: () => import('../pages/index/order/Order'),

        },
        //订单详情页
        {
          path: '/index/orderdetail',
          name: 'orderdetail',
          meta: { role: ["super"] },
          component: () => import('../pages/index/order/Orderdetail.vue'),

        },
        {  //店铺管理
          path: '/index/shops',
          name: 'shops',
          meta: { role: ["super",] },
          component: () => import('../pages/index/Shops'),
        },
        // ---------------------  账号管理 -------------------------------//
        {
          path: '/index/addaccount',  //添加账号
          name: 'addaccount',
          meta: { role: ["super"] },
          component: () => import('../pages/index/account/AddAccount'),
        },
        {
          path: '/index/changepwd',  //修改密码
          name: 'changepwd',
          meta: { role: ["super"] },
          component: () => import('../pages/index/account/ChangePwd'),
        },
        {
          path: '/index/accountlist',  //账号列表
          name: 'accountlist',
          meta: { role: ["super"] },
          component: () => import('../pages/index/account/AccountList'),
        },
        {
          path: '/index/person',  //个人中心
          name: 'person',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/account/Person.vue'),
        },
        //商品列表
        {
          path: '/index/addgoods',  //添加商品
          name: 'addgoods',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/goods/GoodsAdd'),
        },
        {
          path: '/index/goodscate',  //商品分类
          name: 'goodscate',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/goods/GoodsCate'),
        },
        {
          path: '/index/goodslist',  //商品列表

          name: 'goodslist',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/goods/GoodsList'),
        },
        // 统计
        {
          path: '/index/goodstotal',  //商品统计
          name: 'goodstotal',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/total/GoodsTotal'),
        },
        {
          path: '/index/ordertotal',  //订单统计
          name: 'ordertotal',
          meta: { role: ["super", "normal"] },
          component: () => import('../pages/index/total/OrderTotal'),
        },
      ]
    },


  ]
})
//路由守卫
router.beforeEach((to, from, next) => {
  //to代表的是要去往的页面，from代表的是当前的页面，next代表的放行
  //判断是否在在登录的页面
  from
  if (to.path !== "/") {
    //表示用户不在登录的页面，需要验证的是用户的token是否在有效期内
    API_TOKEN(localStorage.token).then((res) => {
      console.log(to.meta)
      if (res.data.code == 0) {
        //表示是在有效期内，可以放行 路由权限 
        if (to.meta.role.includes(localStorage.role)) {
          next()
        }
        else {
          next(from.path)
        }
        //console.log(to.meta)
        //权限拦截  // to.meta  localStorage.role//拿到当前路由对象的参数
        
      }
      else {
        next("/")
      }
    })
  }
  //表示用户在登录的页面，可以进行下一步
  else {
    next()
  }
})

export default router