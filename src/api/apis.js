import axios from 'axios'
// 设置服务器IP地址
axios.defaults.baseURL = 'http://localhost:5000'


//API： 登录
//  account: 用户名
//  password: 密码
export const API_LOGIN = (account, password) => axios.post("/users/checkLogin", { account, password })

//API: 添加账号
//  account: 用户名
//  password: 密码
//  userGroup: 用户组  超级管理员|普通管理员
export const API_ADD_ACCOUNT = (account, password, userGroup) => axios.post("/users/add", { account, password, userGroup })

//API  检查token是否到期 get的方式
export const API_TOKEN = (token) => axios.get("/users/checktoken", { params: { token } })


//API  获取账号列表
export const API_GET_ACCLIST = (currentPage, pageSize) => axios.get("/users/list", { params: { currentPage, pageSize } })

//API 删除单条的数据
export const API_DELETE_ACC = (id) => axios.get("/users/del", { params: { id } })

//批量删除多条数据

export const API_DELETE_BATCHACC = (ids) => axios.get("/users/batchdel", { params: { ids } })

//编辑账号的数据
export const API_EDIt_ACC = (id, account, userGroup) => axios.post("/users/edit", { id, account, userGroup })

//检查旧到的密码是否正确

export const API_CHECK_OLDPWD = (oldPwd, id) => axios.get("/users/checkoldpwd", { params: { oldPwd, id } })

//更改新密码
export const API_UPDTAE_PWD = (newPwd,id) => axios.post("/users/editpwd", {  newPwd,id, })

//上传头像
// export const API_UPLOAD_AVATAR = (id) => axios.post("/users/avatar_upload", {id})

//获取用户信息
export const API_USER_INFO = (id) => axios.get("/users/accountinfo", { params: { id } })


//商品分类
//添加分类
export const API_GOODS_ADD = (cateName, state) => axios.post("/goods/addcate", { cateName, state })
//获取分类
export const API_GOODS_CATE = (currentPage, pageSize) => axios.get("/goods/catelist", { params: { currentPage, pageSize } })

//删除分类
export const API_DELETE_CATE = (id) => axios.get("/goods/delcate", { params: { id } })

// 修改分类
export const API_GOODS_EDITCATE = (id, cateName, state) => axios.post("/goods/editcate", { id, cateName, state })

// 查询商品的分类
export const API_CATE_GOODS = () => axios.get("/goods/categories")


//订单查询
export const API_ORDER_lIST = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get("/order/list", { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

//获取订单的详情
export const API_ORDER_DETAIL = (id) => axios.get("/order/detail", { params: { id } })

//修改订单
export const API_DEIT_ORDER = (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => 
axios.post("/order/edit", { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState })

//添加商品
export const API_GOODS_ALL = (name,category,price,imgUrl,goodsDesc) => axios.post("/goods/add", { name,category,price,imgUrl,goodsDesc })

//获取商品列表

export const API_GOODS_LIST = (currentPage,pageSize) => axios.get("/goods/list", { params: {currentPage,pageSize } })

//删除商品
export const API_GOODS_DEL = (id) => axios.get("/goods/del", { params: {id } })

//修改商品
export const API_GOODS_EDIT = (name,category,price,imgUrl,goodsDesc,id) => axios.post("/goods/edit", { name,category,price,imgUrl,goodsDesc,id })

//获取店铺信息
export const API_SHOP_DATA = () => axios.get("/shop/info")

//修改店铺信息 
export const API_SHOPS_EDIT = (id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics) => 
axios.post("/shop/edit", { id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics })
// 获取报表的信息

export const API_HOME_DATA = () => axios.get("/order/totaldata",)

//订单统计
export const API_ORDER_DATA = (date) => axios.get("/order/ordertotal",{ params: {date} })


