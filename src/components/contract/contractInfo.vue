<template>
    <div class="contactInfo">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>我的租约</h2>
        </div>
      </div>
      <div class="page-container">
        <div class="contact-status">租约{{contractStatusList[contractInfo.contractStatus]}}</div>
        <div class="page-notice">合同网签编号：{{contractInfo.contractNo}}</div>
        <div class="group">
          <!--<div class="seal"></div>-->
          <div v-if="contractInfo.contractStatus==1 || contractInfo.contractTerminationDate" class="seal">
            <img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/seal2x.png" alt="签章">
          </div>
          <div class="group-title">出租房信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>出租方</label><span>{{contractInfo.landlordName}}</span></p>
            <p class="group-row clearfix"><label>联系方式</label><span>{{contractInfo.landlordPhone}}</span></p>
            <p class="group-row clearfix"><label>出租房源</label><span style="text-align: right;">{{contractInfo.leaseAddress}}</span></p>
        </div>
        </div>
        <div class="group">
          <div class="group-title">承租方信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>承租方</label><span>{{contractInfo.tenantName}}</span></p>
            <p class="group-row clearfix"><label>联系电话</label><span>{{contractInfo.tenantPhone}}</span></p>
            <p class="group-row clearfix"><label>证件号码</label><span>{{contractInfo.tenantIdCard}}</span></p>
          </div>
        </div>
        <div class="group">
          <div class="group-title">租约信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>租赁期</label><span>{{contractInfo.contractValidityStartTime | date}}--{{contractInfo.contractValidityEndTime | date}}</span></p>
            <p class="group-row clearfix"><label>总租金</label><span>{{contractInfo.totalRent}}元</span></p>
            <p class="group-row clearfix"><label>交租日</label><span>每月{{contractInfo.payRentDate}}日</span></p>
            <p class="group-row clearfix"><label>支付方式</label><span>{{contractInfo.payWay}}</span></p>
            <p class="group-row clearfix"><label>押金</label><span>{{contractInfo.deposit}}元</span></p>
            <p class="group-row clearfix"><label>提前天数</label><span>提前{{contractInfo.daysAhead}}天交租</span></p>
          </div>
        </div>
        <div class="group subsidiary">
          <div class="group-title">补充条款</div>
          <div class="group-content">
            已配门锁2把给租客，若丢失，每把需赔付20元给房东。未经房东同意，不允许饲养宠物。若要转租，需至少提前1个月通知房东。
          </div>
        </div>
      </div>
      <template v-if="contractInfo.contractStatus==0">
        <template v-if="roleName === 'landlord'">
          <div class="group-title group-btns clearfix">
            <a class="btn btn-left" :class="btnTouched.refreshContract?'actived':''" @click="getContractStatus">刷新合同状态</a>
            <a class="btn btn-right" @click="getContractPdf">查看pdf</a>
          </div>
        </template>
        <template v-else>
          <div class="group-title group-btns clearfix">
            <a v-if="!btnTouched.confirmSign" class="btn btn-left" :class="btnTouched.refuseSign?'actived':''" @click="refuseSign">拒绝签署</a>
            <a v-if="!btnTouched.refuseSign" class="btn btn-right" :class="btnTouched.confirmSign?'actived':''" @click="confirmSign">确认签约</a>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="group-title group-btns clearfix">
          <a class="btn btn-submit" :class="btnTouched.refreshContract?'actived':''" :href="contractInfo.contractFile">查看pdt</a>
        </div>
      </template>
      <div class="dialog-cover" v-if="dialogShow.signResult">
        <div class="dialog-content block-center-middle" style="height: 4.2rem;">
          <i class="dialog-icon block-center-middle" :class="signStatus === 0? 'success' : 'failed'"></i>
          <p class="sub-title" style="font-size: 0.4rem;line-height: 0.56rem;margin-top: 1.6rem;">{{signStatus === 0? '签署成功' : '签署失败'}}</p>
          <p style="font-size: 0.32rem;line-height: 0.66rem;color: #808080;padding-bottom: 0.46rem;">
            {{signStatus === 0? '您的电子合同已在雄安区块链存证' : '签署失败,该合同已被拒绝'}}
          </p>
          <p @click="closeSignResult" style="line-height: 0.88rem;border-top: 1px solid #ccc;color: #FF790E;font-size: 0.32rem;">知道了</p>
        </div>
      </div>
      <div v-if="dialogShow.landlord && contractInfo.contractStatus==0" class="dialog-cover">
        <div class="dialog-content block-center-middle" style="overflow: hidden;">
          <p style="padding: 0.8rem 0;line-height:0.52rem;font-size:0.32rem;">合同已发给租客 <br>请提醒租客及时签署</p>
          <p @click="closeLandlordDialog" style="line-height: 0.88rem;border-top: 1px solid #ccc;color: #FF790E;font-size: 0.32rem;">知道了</p>
        </div>
      </div>
    </div>
</template>
<script>
  import { TENANT_TOKEN, deviceHeight, renterLeaseDetailPath, contractStatusList } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'contractInfo',
    data () {
      return {
        deviceHeight,
        contractStatusList,
        contractNo: {},
        signStatus: 1,
        id: '',
        showRefuseDialog: true,
        btnTouched: {
          refuseSign: false,
          refreshContract: false,
          confirmSign: false
        },
        dialogShow: {
          landlord: '',
          signResult: ''
        },
        contractInfo: {}
//        contactInfo: {
//          contractNo: '',
//          status: '待确认',
//          status: '生效中',
//          landlord: {
//            name: '张三',
//            mobile: '13868511635',
//            house: '上海市浦东新区花木苑19栋64号401室'
//          },
//          renter: {
//            name: '花木兰',
//            mobile: '15821049096',
//            CertificateNo: '我是证件号码'
//          },
//          contract: {
//            startDate: '2017.11.16',
//            endDate: '2018.11.16',
//            payDate: '10',
//            deposit: '我是押金',
//            payMode: '一月一付',
//            beforeTime: '3',
//            AllRentPrice: '6000',
//            unitRentPrice: '3000'
//          }
//        }
      }
    },
    created () {
      console.log('contactInfo')
      console.log(renterLeaseDetailPath)
      console.log(contractStatusList)
      this.id = this.$route.query.id
      this.roleName = this.$route.query.roleName
      console.log(this.$route.query)
      if (this.roleName === 'landlord') {
        this.dialogShow.landlord = true
      }
      let token = cache.get(TENANT_TOKEN)
//      如果获取不到token，说明是非法强跳域名过来的，那么将路由跳转去登录页
      if (token === null) {
//        this.$router.push({ path: '/' })
      } else {
      }
    },
    mounted () {
      this.getDetails()
      let status = this.$route.query.status
      if (status) {
        this.contactInfo.status = status
      }
    },
    methods: {
      getDetails () {
        let myVue = this
        this.get({
          url: renterLeaseDetailPath + '/' + myVue.id,
          success (data) {
            console.log(data)
            myVue.contractInfo = data.contractInfo
            console.log(myVue.contractInfo)
          }
        })
      },
      goBack () {
        this.$router.go(-1)
      },
      refuseSign () {
        this.btnTouched.refuseSign = true
        setTimeout(() => {
          this.signStatus = 1
          this.dialogShow.signResult = true
        }, 1000)
      },
      confirmSign () {
        this.btnTouched.confirmSign = true
        setTimeout(() => {
          this.signStatus = 0
          this.dialogShow.signResult = true
        }, 1000)
      },
      getContractStatus () {
        this.btnTouched.refreshContract = true
        setTimeout(() => {
          this.btnTouched.refreshContract = false
        }, 2000)
      },
      getContractPdf () {
      },
      closeLandlordDialog () {
        this.dialogShow.landlord = false
      },
      closeSignResult () {
        let contractNo = this.contractNo
        console.log(contractNo)
        this.dialogShow.signResult = false
        if (this.signStatus === 0) {
          this.$router.push({path: '/contractRenter', query: {contractNo}})
        } else {
          if (this.roleName === 'landlord') {
            this.$router.push({path: '/landlord/leaseList'})
          } else {
            this.$router.push({path: '/renter/leaseList'})
          }
        }
      }
    }
  }
</script>
<style scoped>
  .group {
    position: relative;
  }
  .seal {
    position: absolute;
    top:0;
    right:10%;
    -webkit-transform: translate(0,-60%);
    -moz-transform: translate(0,-60%);
    -ms-transform: translate(0,-60%);
    -o-transform: translate(0,-60%);
    transform: translate(0,-60%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
  }
  .group-row label {
    color: #606060;
  }
  .group-row span {
    color: #808080;
    padding: 0;
  }
  .contactInfo {
    background-color: #eee;
  }
  .page-container {
    padding-top:0.9rem;
  }
  .contact-status {
    color: #FF6138;
    line-height:0.88rem;
    font-size:0.28rem;
  }
  .page-notice {
    color: #C0C0C0;
    padding:0 0.4rem;
    background-color: #fff;
    line-height:0.32rem;
    padding-top:0.2rem;
  }
  .group-title {
    font-size:0.32rem;
    background-color: #fff;
  }
  .group + .group {
    margin-top:2px;
  }
  .group.subsidiary .group-title,.group.subsidiary .group-content {
    background-color: #eeeeee;
  }
  .group.subsidiary .group-content {
    text-align: left;
    line-height:0.36rem;
  }
  .group-title.group-btns {
    background-color: #eee;
  }
  .btn {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 46%;
    border:1px solid #FF790E;
    line-height: 0.88rem;
    font-size:0.28rem;
    letter-spacing: 0;
    text-align: center;
    padding: 0;
    margin:0.4rem 0 0.6rem;
  }
  .btn-left {
    float: left;
    color: #FF790E;
    letter-spacing: 0;
    background-color: transparent;
  }
  .btn-left.actived {
    color: #888;
    border-color: #888;
  }
  .btn-right {
    float: right;
    outline:none;
    padding: 0;
    width: 46%;
    color: #fff;
    background-color: #FF790E;
  }
  .btn-right.actived {
    border-color: #aaa;
    background-color: #aaa;
    color: #fff;
  }
  .btn-submit {
    width: 100%;
    height: 0.88rem;
    line-height:0.88rem;
  }
  .dialog-content {
    position: absolute;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 6rem;
    background-color: #fff;
    border-radius: 0.3rem;
    -webkit-border-radius: 0.2rem;
  }
  .dialog-content .dialog-icon {
    position: absolute;
    width: 3rem;
    height: 3rem;
    left: 50%;
    top:0;
    /*background-color: rgba(200, 0, 0, 0.3);*/
  }
  .dialog-content .dialog-icon.success {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/notice-success-2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .dialog-content .dialog-icon.failed {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/notice-failed-2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
</style>
