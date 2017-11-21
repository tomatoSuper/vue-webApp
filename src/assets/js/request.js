import $ from 'jquery'
import cache from './cache'
import { TENANT_TOKEN, LANDLORD_TOKEN } from './config'
class Request {
  constructor () {
    this.name = 'request.js'
  }
  post (obj) {
    return function (opt) {
      $.ajax({
        url: opt.url,
        method: 'POST',
        data: opt.sendData || '',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json',
        timeout: 30000,
        beforeSend (xhr) {
          let token = ''
          if (opt.role === 'landlord') {
            token = cache.get(LANDLORD_TOKEN)
          } else {
            token = cache.get(TENANT_TOKEN)
          }
          if (token) {
            // console.log('POST---------缓存中有token，可以在请求头里设置token')
            xhr.setRequestHeader('token', token)
          }
          typeof opt.beforeSend === 'function' ? opt.beforeSend(xhr) : null
        },
        success (data, x, h) {
          if (typeof data === 'string') {
            data = JSON.parse(data)
          }
          const code = parseInt(data.code)
          if (code === 0) {
            // const newData = data.res.data
            typeof opt.success === 'function' ? opt.success(data) : null
          } else if (code === 101 || code === 102) {
            obj.$toast({
              message: '权限已过期',
              duration: 1000
            })
            obj.$router.push({ path: '/' })
          } else {
            typeof opt.failed === 'function' ? opt.failed(data, obj, x, h) : null
          }
        },
        error (x, h, r) {
          obj.$toast({
            message: '网络不畅，请稍后重试',
            duration: 2000
          })
          typeof opt.failed === 'function' ? opt.failed(x, h, r) : null
        }
      })
    }
  }
  get (obj) {
    return function (opt) {
      $.ajax({
        url: opt.url,
        method: 'GET',
        data: opt.sendData || '',
        // dataType: 'json',
        timeout: 30000,
        beforeSend (xhr) {
          let token = ''
          if (opt.role === 'landlord') {
            token = cache.get(LANDLORD_TOKEN)
          } else {
            token = cache.get(TENANT_TOKEN)
          }
          console.log(token)
          if (token) {
            // console.log('GET---------缓存中有token，可以在请求头里设置token')
            xhr.setRequestHeader('token', token)
          }
          typeof opt.beforeSend === 'function' ? opt.beforeSend(xhr) : null
        },
        success (data) {
          if (typeof data === 'string') {
            data = JSON.parse(data)
          }
          const code = parseInt(data.code)
          if (code === 0) {
            typeof opt.success === 'function' ? opt.success(data) : null
          } else if (code === 101 || code === 102) {
            obj.$toast({
              message: '权限已过期',
              duration: 1000
            })
            obj.$router.push({ path: '/' })
          } else {
            typeof opt.failed === 'function' ? opt.failed(data) : null
          }
        },
        error (x, h, r) {
          obj.$toast({
            message: '网络不畅，请稍后重试',
            duration: 2000
          })
          typeof opt.failed === 'function' ? opt.failed(x, h, r) : null
        }
      })
    }
  }
}
export default new Request()
