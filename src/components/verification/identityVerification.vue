<template>
    <div class="identityVerification" :style="{minHeight:deviceHeight+'px'}">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>芝麻可信电子合约</h2>
        </div>
      </div>
      <div class="banner">
        <!--<img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/banner-heShen2x.png" alt="">-->
        <img src="../../assets/img/banner-heShen2x.png" alt="">
      </div>
      <div class="group">
        <div class="group-title">请确认以下合约内容，签约成功后即具备法律效力</div>
        <div class="group-content" style="border-bottom: 1px solid #eee;">
          <p class="page-notice" style="text-align: center;">-芝麻信用将竭诚保障你的签约流程安全可靠-</p>
          <div style="margin-top: 0.3rem;padding:0 0.3rem 0.2rem;border: 1px solid #eee;border-bottom: 0 none;">
            <p class="group-row clearfix"><label>甲方姓名</label><span>{{contractInfo.landlordName}}</span></p>
            <p class="group-row clearfix"><label>身份证号</label><span>{{contractInfo.idNo}}</span></p>
            <p class="group-row clearfix"><label>所属公司</label><span>{{contractInfo.company}}</span></p>
          </div>
        </div>
        <div class="group-content shadow">
          <p class="clearfix contractPdf">
            <span>{{contractInfo.contractName}}</span>
            <a :href="contractInfo.contractUrl" class="btn btn-detail">查看</a>
          </p>
        </div>
      </div>
      <div class="footer">
        <p class="page-notice">同意 <a href="#">《芝麻认证协议》</a><a href="#">《芝麻可信电子合约协议》</a>用以完以上电子合约签署成</p>
        <a href="javascript:;" class="btn btn-submit">立即签约</a>
      </div>
    </div>
</template>
<script>
  import selectPicker from '../bricksSon/selectPicker.vue'
  import { TENANT_TOKEN, deviceHeight } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'identityVerification',
    components: {selectPicker},
    data () {
      return {
        deviceHeight,
        contractNo: '',
        contractInfo: {
          contractNo: '',
          contractName: '《房屋租赁合同XTF12345》',
          landlordName: '*信',
          idNo: '411889322255552',
          company: '盈家生活',
          contractUrl: 'http://www.baidu.com'
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
            }, 2000)
//            this.$router.push({path: '/contractInfo', query: {roleName: 'landlord'}})
          }
        })
//        this.$router.push({path: '/contractInfo', query: {contractNo: myVue.contractNo, roleName: 'landlord'}})
      }
    }
  }
</script>
<style scoped>
  .identityVerification {
    position: relative;
  }
  .banner {
    background-color: #fff;
    /*height: 4.5rem;*/
    /*background-color: rgba(100, 0, 0, 0.3);*/
  }
  .shadow {
    -webkit-box-shadow: 0 1px 3px #ccc;
    -moz-box-shadow: 0 1px 3px #ccc;
    box-shadow: 0 2px 5px #ccc;
  }
  .group-title {
    background-color: #fff;
    font-size:0.3rem;
  }
  .group-row {
    border:0 none;
  }
  .group-row label, .group-row span {
    font-size:0.24rem;
    color: #404040;
    line-height:0.66rem;
  }
  .page-notice a {
    color: #26a2ff;
  }
  .contractPdf span {
    float: left;
    height:1.2rem;
    line-height:1.2rem;
    font-size:0.28rem;
    padding-left:0.64rem;
    position: relative;
  }
  .contractPdf span::before {
    content: '';
    position: absolute;
    left:0;
    top:0;
    width: 0.5rem;
    height: 100%;
    /*background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/icon-file-2x.png") center center no-repeat;*/
    background: url("../../assets/img/icon-file-2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .contractPdf a {
    line-height:0.56rem;
    float: right;
    margin:0.32rem 0 0;
    border: 1px solid #00D1CD;
    color: #00d1cd;
    border-radius: 2px;
    padding:0 0.4rem;
    -webkit-border-radius: 2px;
    background-color: #fff;
  }
  .footer {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    bottom:0;
    left:0;
    width: 100%;
    background-color: #fff;
    padding:0.4rem;
    -webkit-box-shadow: 0 -1px 3px #ccc;
    -moz-box-shadow: 0 -1px 3px #ccc;
    box-shadow: 0 -1px 3px #ccc;
  }
  .footer .btn {
    line-height: 0.88rem;
    width: 100%;
    margin-top:0.2rem;
    background-color: #00D3CD;
  }
</style>
