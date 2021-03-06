import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

//// 创建一个中介
Vue.prototype.$bus = new Vue();
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
