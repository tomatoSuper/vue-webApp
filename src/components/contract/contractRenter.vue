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
        <img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/rent-sign-2-2x.png" alt="">
      </div>
      <form name="contractRenter" novalidate @submit.prevent="identityVerification"  role="form">
        <div class="group">
          <div class="group-title">租客信息</div>
          <div class="group-content">
            <!--<p class="group-row">{{ errors.first('renterMobile') }}</p>-->
            <!--<p class="group-row">{{ errors.has('renterMobile') }}</p>-->
            <p class="group-row clearfix">
              <label :class="errors.has('renterName')?'danger':renter.renterName?'success':''">租客姓名</label>
              <input v-model="renter.renterName" name="renterName" v-validate="'required'" placeholder="请输入租客姓名" autocomplete="off" type="text" />
            </p>
            <p class="group-row clearfix">
              <label :class="errors.has('renterMobile')?'danger':renter.renterMobile? 'success':''">租客手机号</label>
              <input v-model="renter.renterMobile" name="renterMobile" v-validate="'required|mobile'" maxlength="11" placeholder="请输入手机号码" autocomplete="off" type="text" />
            </p>
            <p class="group-row clearfix">
              <label :class="errors.has('certificateType')?'danger':renter.certificateType?'success':''">证件类型</label>
              <span @click.stop.prevent="certificateTypeClick">{{certificateType.placeHolder}}</span>
              <input v-model="renter.certificateType" name="certificateType" v-validate="'required'" type="hidden">
            </p>
            <p class="group-row clearfix">
              <label :class="errors.has('certificateNo')?'danger':!renter.certificateNo? '':'success'">证件号码</label>
              <input v-model="renter.certificateNo" name="certificateNo" v-validate="'required|numeric'" placeholder="请输入证件号码" autocomplete="off" type="text">
            </p>
          </div>
        </div>
        <div class="group-title">
          <button
            type="submit" class="btn"
            :class="!btnTouched.submited && renter.renterName.length && !errors.has('renterName') && renter.renterMobile.length && !errors.has('renterMobile')
            && renter.certificateType.length && !errors.has('certificateType') && renter.certificateNo.length && !errors.has('certificateNo')?'btn-submit':''"
            :disabled="btnTouched.submited || !renter.renterName.length || errors.has('renterName') || !renter.renterMobile.length || errors.has('renterMobile')
            || !renter.certificateType.length || errors.has('certificateType') || !renter.certificateNo.length || errors.has('certificateNo')">
            签约核身
          </button>
        </div>
      </form>
    </div>
    <selectPicker ref="certificateType" v-model="certificateType.showPicker" :options="certificateType.slots" @ensure="getCertificateType"></selectPicker>
  </div>
</template>
<script>
  import selectPicker from '../bricksSon/selectPicker.vue'
  import { TENANT_TOKEN, deviceHeight } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'contractRenter',
    components: {selectPicker},
    data () {
      return {
        deviceHeight,
        contractNo: '',
        renter: {
          contractNo: '',
          renterName: '',
          renterMobile: '',
          certificateType: '',
          certificateNo: ''
        },
        certificateType: {
          placeHolder: '请选择证件类型',
          slots: [{
            flex: 1,
            defaultIndex: 1,
            values: ['身份证', '护照', '学生证', '驾驶证'],
            textAlign: 'center'
          }],
          showPicker: false
        },
        btnTouched: {
          submited: false
        },
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
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      certificateTypeClick () {
        this.$refs.certificateType.showMask()
      },
      getCertificateType (data) {
        this.certificateType.placeHolder = data
        this.renter.certificateType = data
      },
      identityVerification () {
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
              this.$router.push({path: '/identityVerification'})
            }, 2000)
          }
        })
//        this.$router.push({path: '/contractInfo', query: {contractNo: myVue.contractNo, roleName: 'landlord'}})
      }
    }
  }
</script>
<style scoped>
  .sign-progress {
    background-color: #fff;
  }
  .page-container {
    padding-top:1.1rem;
  }
  .group-row label.danger {
    color: #ff5658;
  }
  .group-row label.warning {
    color: #ffc107;
  }
  .group-row label.success {
    color: #6DC50D;
  }
  button.btn {
    width: 100%;
    margin:0.4rem 0;
  }
</style>
