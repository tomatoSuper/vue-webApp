// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import jQuery from 'jquery'
import MintUi, { DatetimePicker, Picker, Loadmore, Spinner, Indicator, Swipe, SwipeItem } from 'mint-ui'
import App from './App'
import router from './router'
// import {TENANT_TOKEN} from './assets/js/config'
// import LocalCache from './assets/js/cache'
import request from './assets/js/request'
import 'mint-ui/lib/style.css'
import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/css/searchStyle.css'
import './assets/css/formStyle.css'
Vue.config.productionTip = false
Vue.use(MintUi, DatetimePicker.name, DatetimePicker, Picker.name, Picker, Loadmore.name, Loadmore, Spinner.name, Spinner, Indicator)
Vue.use(Swipe.name, Swipe, SwipeItem.name, SwipeItem)
import Vee, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
Validator.extend('mobile', {
  messages: {
    zh_CN: field => {
      return '请输入正确的手机号码'
    }
  },
  validate: value => {
    return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
})
console.log(request)
const veeConfig = {
  errorBagName: 'errors',
  delay: 0,
  message: null,
  strict: true,
  locale: 'zh_CN'
}
Validator.addLocale(zhCN)
Vue.use(Vee, veeConfig)

// const $ = jQuery
/* eslint-disable no-new */
Vue.filter('date', function (d) {
  try {
    if (d instanceof Date || new Date(d) instanceof Date) {
      if (typeof d === 'string') {
        d = new Date(d)
      }
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      let date = d.getDate()
      date = date < 10 ? ('0' + date) : date
      return year + '-' + month + '-' + date
    } else {
      return d
    }
  } catch (e) {
    return d
  }
})
window.myVue = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  created () {
    Vue.prototype.post = request.post(this)
    Vue.prototype.get = request.get(this)
  },
  methods: {
  },
  components: { App }
})
