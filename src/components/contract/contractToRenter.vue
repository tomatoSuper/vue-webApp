<template>
    <div class="contractToRenter" :style="{height:deviceHeight+'px'}">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>合同信息</h2>
        </div>
      </div>
      <div class="page-container">
        <div class="sign-progress">
          <img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/contract-progress-2-2x.png" alt="">
        </div>
        <form name="send" novalidate @submit.prevent="sendToRenter"  role="form">
          <div class="group">
            <div class="group-content">
              <p class="group-row clearfix" style="text-align: left;">
                <label style="color: #212121;">租客手机号</label>
                <input v-validate="'required|mobile'" autocomplete="off" name="renterMobile" placeholder="请输入租客手机号码" maxlength="11" type="text" v-model="renterMobile" @focus.stop.prevent="renterMobileFocus" />
                <i v-show="errors.has('renterMobile')" class="help is-danger">{{ errors.first('renterMobile') }}</i>
              </p>
            </div>
          </div>
          <div class="group-title">
            <button type="submit" class="btn" :class="!btnTouched.submited && !errors.has('renterMobile') && renterMobile.length?'btn-submit':''" :disabled="btnTouched.submited || errors.has('renterMobile') || !renterMobile.length">发送</button>
          </div>
        </form>
      </div>
    </div>
</template>
<script>
  import { TENANT_TOKEN, deviceHeight } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'contactToRenter',
    data () {
      return {
        deviceHeight,
        btnTouched: {
          submited: false
        },
        contractNo: '',
        renterMobile: ''
      }
    },
    created () {
      this.contractNo = this.$route.query.contractNo
      let token = cache.get(TENANT_TOKEN)
//      如果获取不到token，说明是非法强跳域名过来的，那么将路由跳转去登录页
      if (token === null) {
        this.$router.push({ path: '/' })
      } else {
      }
    },
    mounted () {
      console.log(this.errors.has('renterMobile'))
      console.log(!this.renterMobile.length)
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      renterMobileFocus () {
        console.log(123)
      },
      sendToRenter () {
//        let myVue = this
        console.log(this.$validator.validateAll())
        this.$validator.validateAll().then((result) => {
          console.log(result)
          console.log(this.btnTouched.submited)
          if (this.btnTouched.submited) {
            console.log('已提交')
            return false
          }
          if (result) {
            this.btnTouched.submited = true
            setTimeout(() => {
              this.btnTouched.submited = false
            }, 2000)
            this.$router.push({path: '/contractInfo', query: {roleName: 'landlord'}})
          }
        })
//        this.$router.push({path: '/contractInfo', query: {contractNo: myVue.contractNo, roleName: 'landlord'}})
      }
    }
  }
</script>
<style scoped>
  .contractToRenter {
    height: 100%;
    background-color: #eee;
  }
  .page-container {
    padding-top:1.1rem;
  }
  .sign-progress {
    background-color: #fff;
  }
  .group {
    margin-top:0.2rem;
  }
  .btn {
    width: 100%;
    margin:0.2rem 0;
  }
  .btn-submit {
    background-color: #FF790E;
  }
</style>
