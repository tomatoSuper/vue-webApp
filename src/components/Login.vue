<template>
  <div class="login" :style="{height:deviceHeight+'px'}">
    <router-view></router-view>
    <form id="loginForm" name="loginForm" novalidate @submit.prevent="submit" role="form">
        <div>
          <input  tabindex="1" type="text" v-validate="'required|mobile'" name="phone" onautocomplete="off" placeholder="请输入您的手机号码"  autocomplete="off" maxlength="11" v-model="loginData.phone">
          <a href="javascript:;" class="btn" :class="errors.has('phone') || btnSms.touched?'':loginData.phone.length ? 'ok':''" @click="getSMScode">{{btnSms.text}}</a>
        </div>
        <p><span v-show="errors.has('phone')" class="help is-danger">{{ errors.first('phone') }}</span></p>
        <div>
          <input tabindex="2" v-bind ="{'type':type}" v-validate="'required'" name="code" onautocomplete="off" placeholder="请输入验证码" minlength="6" maxlength="10" v-model="loginData.code">
          <i id="icon-eyes" :class="type == 'password'?'close':'open'" @click="showPwd"></i>
        </div>
        <p><span v-show="errors.has('code')" class="help is-danger">{{ errors.first('code') }}</span></p>
        <button type="submit" :class="!btnSubmit.touched && !errors.has('phone') && !errors.has('code') && loginData.phone.length && loginData.code ? 'ok': ''">登录</button>
        <p class="explain">未注册的用户将自动注册,点击登录视为同意注册</p>
        <p class="footer">©2017 研耀(上海)信息科技有限公司</p>
    </form>
  </div>
</template>
<script>
  import { Validator } from 'vee-validate'
  import { loginPath, getSmsPath, TENANT_TOKEN, TENANT_INFO, deviceHeight, TENANT_ACCOUNT, LANDLORD_TOKEN, LANDLORD_INFO, LANDLORD_ACCOUNT } from '../assets/js/config'
  import cache from '../assets/js/cache'
  export default {
    name: 'login',
    data () {
      return {
        btnSms: {
          timeMax: 30,
          textInit: '获取验证码',
          time: 30,
          text: '获取验证码',
          counter: '',
          touched: false
        },
        loginData: {
          phone: '',
          code: '',
          loginType: ''
        },
        btnSubmit: {
          touched: false
        },
        toastTimer: '',
        type: 'password',
        deviceHeight
      }
    },
    created () {
      let path = this.$route.path
      path = path.split('/')
      this.loginData.loginType = path[path.length - 1]
      const dictionary = {
        zh_CN: {
          custom: {
            phone: {required: '请输入手机号码'},
            code: {required: '请输入验证码'}
          }
        }
      }
      Validator.updateDictionary(dictionary)
      if (this.loginData.loginType === 'TENANT') {
        let renterNo = cache.get(TENANT_ACCOUNT)
        if (renterNo) {
          this.loginData.phone = renterNo
        }
      } else {
        let landlordNo = cache.get(LANDLORD_ACCOUNT)
        if (landlordNo) {
          this.loginData.phone = landlordNo
        }
      }
    },
    methods: {
      getSMScode () {
        let myVue = this
        let _case = this.errors.has('phone') ? 0 : !this.btnSms.touched && this.loginData.phone.length ? 1 : 0
        if (_case) {
          this.btnSms.touched = true
          if (myVue.btnSms.time > 0) {
            myVue.btnSms.text = myVue.btnSms.time --
            this.btnSms.counter = setInterval(() => {
              myVue.btnSms.text = myVue.btnSms.time --
              if (myVue.btnSms.time < 0) {
                clearInterval(myVue.btnSms.counter)
                myVue.btnSms.text = myVue.btnSms.textInit
                myVue.btnSms.time = myVue.btnSms.timeMax
                myVue.btnSms.touched = false
              }
            }, 1000)
          }
        }
      },
      btnGetSMS () {
        let myVue = this
        let url = getSmsPath + '/' + this.loginData.phone
        this.get({
          url,
          success (data) {
            myVue.$toast({
              message: data.msg,
              duration: 1000
            })
          }
        })
      },
      submit (e) {
        this.$validator.validateAll().then((result) => {
          if (result && !this.btnSubmit.touched) {
            this.btnSubmit.touched = true
            if (this.loginData.loginType === 'TENANT') {
              cache.set(TENANT_TOKEN, new Date().getTime())
              this.$router.push({ path: '/renter' })
            } else {
              cache.set(LANDLORD_TOKEN, new Date().getTime())
              this.$router.push({ path: '/landlord' })
            }
          }
        })
        return false
      },
      loginSubmit () {
        const myVue = this
        this.post({
          url: loginPath,
          sendData: myVue.login,
          success (data) {
            myVue.$toast({
              message: '登录成功',
              duration: 1000
            })
            if (myVue.loginData.loginType === 'TENANT') {
              cache.set(TENANT_ACCOUNT, myVue.loginData.phone)
              cache.set(TENANT_TOKEN, data.token)
              cache.set(TENANT_INFO, JSON.stringify(data.userInfo))
              myVue.$router.push({ path: '/renter' })
            } else {
              cache.set(LANDLORD_ACCOUNT, myVue.loginData.phone)
              cache.set(LANDLORD_TOKEN, data.token)
              cache.set(LANDLORD_INFO, JSON.stringify(data.userInfo))
              myVue.$router.push({ path: '/landlord' })
            }
          },
          failed (data, obj, x, h) {
            clearTimeout(myVue.toastTimer)
            myVue.toastTimer = setTimeout(function () {
              myVue.btnSubmit.touched = false
            }, 2000)
            if (obj.$toast) {
              obj.$toast({
                message: data.msg,
                duration: 2000
              })
            }
          },
          error () {
            clearTimeout(myVue.toastTimer)
            myVue.toastTimer = setTimeout(() => {
              myVue.btnSubmit.touched = false
            }, 2000)
          }
        })
      },
      showPwd () {
        this.type = this.type === 'password' ? 'text' : 'password'
      }
    }
  }
</script>
<style scoped>
    .login {
      overflow: hidden;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      padding-top: 1rem;
      width: 100%;
      height: 100%;
      background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/Group3@2x.png") center center no-repeat;
    }
    form {
      margin: 0 1rem;
    }
    form div {
      height: .8rem;
      line-height: .8rem;
      font-size: .3rem;
      text-align: left;
      position: relative;
      border-bottom: 1px solid #D0D0D0;
    }
    form div > input {
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      height: 1rem;
      padding: .2rem 0;
      width: 70%;
      line-height: .6rem;
      text-indent: .02rem;
      font-size: .3rem;
    }
    button {
      border:0 none;
      width: 100%;
      height: 0.8rem;
      line-height:0.8rem;
      background-color: #aaa;
      color: #fff;
      margin:1rem auto 0;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      font-size:0.32rem;
      letter-spacing: 6px;
      font-family:'Microsoft YaHei';
      text-align: center;
      -webkit-transition: all 0.2s ;
      -moz-transition: all 0.2s;
      transition: all 0.2s;
    }
    button.ok {
      background-color: #e02e08;
      /*color: #fff;*/
    }
    .btn {
      position: absolute;
      right:0;
      top: 50%;
      width: 7em;
      text-align: center;
      border-radius: 4px;
      -webkit-border-radius: 4px;
      -webkit-transform: translate(0,-50%);
      -moz-transform: translate(0,-50%);
      -ms-transform: translate(0,-50%);
      -o-transform: translate(0,-50%);
      transform: translate(0,-50%);
      background-color: #aaa;
      color: #fff;
      -webkit-transition: all 0.2s ;
      -moz-transition: all 0.2s;
      transition: all 0.2s;
    }
    .btn.ok {
      background-color: #e02e08;
      /*color: #fff;*/
    }
    .act-ago {
      color: #fff;
    }
    .act-yet {
      color: #888;
    }
    .explain,.footer {
      text-align: center;
    }
    form > p {
      text-align: left;
      line-height:0.36rem;
      height: 0.36rem;
    }
    form > p .help {
      font-size:0.24rem;
      color: #e02e08;
    }
    p.explain {
      font-size:0.24rem;
      line-height:0.5rem;
      height: 0.5rem;
      color: grey;
      margin-top:0.2rem;
    }
    .footer {
      -webkit-transform: translate(0,2.4rem);
      -moz-transform: translate(0,2.4rem);
      -ms-transform: translate(0,2.4rem);
      -o-transform: translate(0,2.4rem);
      transform: translate(0,2.4rem);
      color: #999;
    }
    #icon-eyes{
      position: absolute;
      height: .5rem;
      width: .5rem;
      top: .25rem;
      right: 0;
      background-size: contain;
      -webkit-background-size: contain;
      z-index:9999;
    }
    .close {
      background: url('../assets/img/ic_eye_close.png')  center no-repeat;
    }
    .open {
      background: url('../assets/img/ic_eye.png')  center no-repeat;
    }
</style>
