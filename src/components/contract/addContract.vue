<template>
    <div class="addContract">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>合同信息</h2>
        </div>
      </div>
      <div class="page-container">
        <div class="sign-progress">
          <img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/contract-progress-1-2x.png" alt="">
        </div>
        <form novalidate @submit.prevent="goToNext"  role="form">
          <div class="group">
            <div class="group-title">房源信息</div>
            <div class="group-content clearfix houseInfo">
              <div class="cover-photo">
                <img @click="swipe.isShow = true" v-if="swipe.dataList && swipe.dataList.length" :src="swipe.dataList[0].imageUrl" alt="封面图片">
                <img v-else :src="'http://dev-esheyi.yingjiashenghuo.com/xaImages/unImage.png'" alt="封面图片">
              </div>
              <div class="house-msg">
                <p class="house-address">
                  {{houseInfo.cityName + houseInfo.districtName + houseInfo.address + houseInfo.village}}
                  {{houseInfo.blockNo===''?'':houseInfo.blockNo+'号楼'}}{{houseInfo.unitNo===''?'':houseInfo.unitNo+'单元'}}{{houseInfo.roomNo===''?'':houseInfo.roomNo+'室'}}
                </p>
                <p class="houseNo">编码：{{houseInfo.serialNum}}</p>
              </div>
            </div>
          </div>
          <div class="page-notice warning">*以下信息请和租客沟通后再填写，避免被驳回</div>
          <div class="group">
            <div class="group-title">租客信息</div>
            <div class="group-content">
              <p class="group-row clearfix" style="text-align: left;">
                <label :class="errors.has('tenantName')?'danger':contract.tenantName?'success':''">租客姓名</label>
                <input v-model="contract.tenantName" v-validate="'required'" name="tenantName" placeholder="请输入租客姓名" autocomplete="off" maxlength="11" type="text" />
              </p>
              <p class="group-row clearfix" style="text-align: left;">
                <label :class="errors.has('tenantPhone')?'danger':contract.tenantPhone?'success':''">租客手机号</label>
                <input v-model="contract.tenantPhone" v-validate="'required|mobile'" name="tenantPhone" placeholder="请输入租客手机号码" autocomplete="off" maxlength="11" type="text" />
                <!--<i v-show="errors.has('tenantPhone')" class="help is-danger">{{ errors.first('tenantPhone') }}</i>-->
              </p>
              <p class="group-row clearfix">
                <label :class="errors.has('certificateType')?'danger':contract.certificateType?'success':''">证件类型</label>
                <span @click.stop.prevent="certificateTypeClick">{{certificateType.placeHolder}}</span>
                <input v-model="contract.certificateType" name="certificateType" v-validate="'required'" type="hidden">
              </p>
              <p class="group-row clearfix">
                <label :class="errors.has('tenantIdCard')?'danger':!contract.tenantIdCard? '':'success'">证件号码</label>
                <input v-model="contract.tenantIdCard" name="tenantIdCard" v-validate="'required'" placeholder="请输入证件号码" autocomplete="off" type="text">
              </p>
            </div>
          </div>
          <div class="group">
            <div class="group-title">租约时间</div>
            <div class="group-content">
              <p class="group-row clearfix">
                <label :class="errors.has('contractValidityStartTime')?'danger' : contract.contractValidityStartTime?'success':''">起始时间</label>
                <span class="canOpen" @click="startDateClick">{{startDate.placeHolder}}</span>
                <input v-model="contract.contractValidityStartTime" name="contractValidityStartTime" v-validate="'required'" type="hidden" />
              </p>
              <!--<p class="group-row">{{ errors.first('startDate') }}</p>-->
              <p class="group-row clearfix">
                <label :class="errors.has('totalMonth')?'danger' : contract.totalMonth?'success':''">租期</label>
                <span class="canOpen" @click.stop.prevent="totalMonthClick">{{totalMonth.placeHolder}}</span>
                <input v-model="contract.totalMonth" name="totalMonth" v-validate="'required'" type="hidden" />
              </p>
            </div>
          </div>
          <div class="group">
            <div class="group-title">租金支付</div>
            <div class="group-content">
              <p class="group-row clearfix">
                <label :class="errors.has('monthRent')?'danger' : contract.monthRent?'success':''">租金(元/月)</label>
                <input v-model="contract.monthRent" name="monthRent" v-validate="'required|decimal'" placeholder="请输入租金金额" autocomplete="off" type="text" /></p>
              <p class="group-row clearfix">
                <label :class="errors.has('payWay')?'danger':contract.payWay?'success':''">支付方式</label>
                <span class="canOpen" @click.stop.prevent="payWayClick">{{payWay.placeHolder}}</span>
                <input v-model="contract.payWay" name="payWay" v-validate="'required'" type="hidden">
              </p>
              <p class="group-row clearfix">
                <label :class="errors.has('deposit')?'danger':contract.deposit?'success':''">押金</label>
                <input v-model="contract.deposit" name="deposit" v-validate="'required|decimal'" placeholder="请输入押金金额" autocomplete="off" type="text">
              </p>
            </div>
          </div>
          <div class="group">
            <div class="group-title">交租时间</div>
            <div class="group-content">
              <p class="group-row clearfix">
                <label :class="errors.has('advanceDays')?'danger' : contract.advanceDays?'success':''">提前天数</label>
                <span class="canOpen" @click.stop.prevent="advanceDaysClick">{{advanceDays.placeHolder}}</span>
                <input v-model="contract.advanceDays" name="advanceDays" v-validate="'required'" type="hidden" /></p>
            </div>
          </div>
          <div class="page-notice">示例：租期8月15日开始，提前3天即12日需交租</div>
          <div class="group" style="margin-top: 0.4rem;">
            <div class="">
              <textarea v-model="contract.remark" placeholder="如有补充信息请在此输入"></textarea>
            </div>
          </div>
          <div class="group-title">
            <button type="submit" class="btn"
            :class="contract.tenantName && !errors.has('tenantName') && contract.tenantPhone && !errors.has('tenantPhone')
            && contract.certificateType && !errors.has('certificateType') && contract.tenantIdCard && !errors.has('tenantIdCard')
            && contract.contractValidityStartTime && !errors.has('contractValidityStartTime') && contract.advanceDays && !errors.has('advanceDays') && contract.deposit && !errors.has('deposit')
            && contract.monthRent && !errors.has('monthRent') && contract.payWay && !errors.has('payWay') && contract.totalMonth && !errors.has('totalMonth')?
            'btn-submit':''"
            >下一步</button>
          </div>
        </form>
      </div>
      <div class="dialog-cover" v-show="swipe.isShow" @click.stop.prevent="closeSwpPanel">
        <div class="banner block-center-middle" @click.stop.prevent="true">
          <mt-swipe :auto="0" :showIndicators="false" @change="handleChange">
            <template v-for="img in swipe.dataList">
              <mt-swipe-item>
                <img :src="img.imageUrl" alt="">
              </mt-swipe-item>
            </template>
          </mt-swipe>
          <div v-if="swipe.dataList.length" class="swp-count">{{swipe.activeIndex}} / {{swipe.dataList.length}}</div>
        </div>
      </div>
      <mt-datetime-picker
        ref="dateStart"
        type="date"
        :startDate="startDate.dateStart"
        :endDate="startDate.dateEnd"
        @confirm="ensureStartDate"
        :id="'date-start'"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        v-model="startDate.dateCur">
      </mt-datetime-picker>
      <selectPicker ref="certificateType" v-model="certificateType.showPicker" :options="certificateType.slots" @ensure="getCertificateType"></selectPicker>
      <selectPicker ref="totalMonth" v-model="totalMonth.showPicker" :valueKey="totalMonth.valueKey" :options="totalMonth.slots" @ensure="gettotalMonth"></selectPicker>
      <selectPicker ref="payWay" v-model="payWay.showPicker" :options="payWay.slots" @ensure="getpayWay"></selectPicker>
      <selectPicker ref="advanceDays" v-model="advanceDays.showPicker" :valueKey="advanceDays.valueKey" :options="advanceDays.slots" @ensure="getadvanceDays"></selectPicker>
    </div>
</template>
<script>
  import { LANDLORD_TOKEN, houseDetailPath, createContractPath } from '../../assets/js/config'
  import selectPicker from '../bricksSon/selectPicker.vue'
  import cache from '../../assets/js/cache'
  export default {
    name: 'addContract',
    components: {selectPicker},
    data () {
      let advanceDaysList = []
      for (let i = 1; i < 28; i++) {
        advanceDaysList.push({text: i + '天', val: i})
      }
      return {
        contract: {
          houseId: '',
          tenantName: '',
          tenantPhone: '',
          certificateType: '',
          tenantIdCard: '',
          contractValidityStartTime: '',
          advanceDays: '',
          deposit: '',
          monthRent: '',
          payWay: '',
          totalMonth: '',
          remark: ''
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
        totalMonth: {
          placeHolder: '请选择租期时长',
          valueKey: 'text',
          slots: [{
            flex: 1,
            defaultIndex: 1,
            values: [
              {text: '一个月', val: '1'},
              {text: '两个月', val: '2'},
              {text: '三个月', val: '3'},
              {text: '半年', val: '6'},
              {text: '一年', val: '12'},
              {text: '两年', val: '24'}
            ],
            textAlign: 'center'
          }],
          showPicker: false
        },
        payWay: {
          placeHolder: '请选择支付方式',
          slots: [{
            flex: 1,
            defaultIndex: 1,
            values: ['一月一付', '两月一付', '三月一付', '六月一付', '一年一付'],
            textAlign: 'center'
          }],
          showPicker: false
        },
        advanceDays: {
          placeHolder: '请选择提前天数',
          valueKey: 'text',
          slots: [{
            flex: 1,
            defaultIndex: 1,
            values: advanceDaysList,
            textAlign: 'center'
          }],
          showPicker: false
        },
        startDate: {
          placeHolder: '请选择起始时间',
          dateStart: new Date('2016-01-01'),
          dateEnd: new Date('2020-12-31'),
          dateCur: new Date()
        },
        houseInfo: {},
        swipe: {
          isShow: false,
          activeIndex: 1,
          dataList: []
        },
        houseImages: []
      }
    },
    created () {
      console.log(this.$route.query)
      let token = cache.get(LANDLORD_TOKEN)
      console.log(token)
      if (token === null) {
//        this.$router.push({ path: '/' })
      } else {
      }
    },
    watch: {
    },
    mounted () {
      this.contract.houseId = this.$route.query.houseId
      this.houseInfo = {
        cityName: '雄安市',
        districtName: '安新县',
        address: 'XX路',
        village: '天河小区',
        blockNo: '9',
        unitNo: '2',
        roomNo: '302',
        serialNum: 'XA_137897123',
        houseImages: [
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123814_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123838_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'}
        ]
      }
      this.swipe.dataList = this.houseInfo.houseImages
//      this.getHouseDetail()
    },
    methods: {
      getHouseDetail () {
        let myVue = this
        this.get({
          role: 'landlord',
          url: houseDetailPath + '/' + myVue.contract.houseId,
          success (data) {
            myVue.houseInfo = data.data
            myVue.swipe.dataList = data.houseImages
            console.log(myVue.houseInfo)
          }
        })
      },
      handleChange (index) {
        this.swipe.activeIndex = index + 1
      },
      closeSwpPanel () {
        this.swipe.isShow = false
      },
      certificateTypeClick () {
        this.$refs.certificateType.showMask()
      },
      getCertificateType (data) {
        this.certificateType.placeHolder = data
        this.contract.certificateType = data
      },
      startDateClick () {
        this.$refs.dateStart.open()
      },
      ensureStartDate (d) {
        if (d instanceof Date || new Date(d) instanceof Date) {
          let year = d.getFullYear()
          let month = d.getMonth() + 1
          month = month < 10 ? ('0' + month) : month
          let date = d.getDate()
          date = date < 10 ? ('0' + date) : date
          let result = year + '-' + month + '-' + date
          this.contract.contractValidityStartTime = result
          this.startDate.placeHolder = result
        }
      },
      totalMonthClick () {
        this.$refs.totalMonth.showMask()
      },
      gettotalMonth (data) {
        console.log(data)
        this.totalMonth.placeHolder = data.text
        this.contract.totalMonth = data.val
        console.log(this.contract.totalMonth)
      },
      payWayClick () {
        this.$refs.payWay.showMask()
      },
      getpayWay (data) {
        this.payWay.placeHolder = data
        this.contract.payWay = data
      },
      advanceDaysClick () {
        this.$refs.advanceDays.showMask()
      },
      getadvanceDays (data) {
        this.advanceDays.placeHolder = data.text
        this.contract.advanceDays = data.val
        console.log(this.contract.advanceDays)
      },
      goToNext () {
        console.log(this.contract)
        let myVue = this
        let houseId = this.contract.houseId
        this.$validator.validateAll().then((result) => {
          console.log(createContractPath)
          if (houseId) {
            if (result) {
              this.$router.push({path: '/uploadFile', query: {contractNo: new Date().getTime()}})
            }
          } else {
            myVue.$toast({
              message: '无房源信息!!',
              duration: 1000
            })
          }
        })
      },
      submitForm () {
        let myVue = this
        myVue.contract.contractValidityStartTime += ' 00:00:00'
        myVue.post({
          role: 'landlord',
          url: createContractPath,
          sendData: myVue.contract,
          success (data) {
            console.log(data)
//                  ac2cc473d580477f8988651882e72888
            console.log(321312)
            let id = data.data
            this.$router.push({path: '/contractInfo', query: {id, roleName: 'landlord'}})
          },
          failed (data) {
            console.log(data)
          },
          error (d) {
            console.log(d)
          }
        })
      },
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .group-row label {
    color: #212121;
  }
  .group-row span {
    color: #808080;
  }
  textarea {
    border:0 none;
    width: 100%;
    height: 3rem;
    padding:0.3rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .addContract {
    background-color: #eee;
  }
  .page-container {
    padding-top:1.1rem;
  }
  .sign-progress {
    background-color: #fff;
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
  .houseInfo {
    padding:0.3rem 0.4rem;
  }
  .cover-photo,.house-msg{
    float: left;
  }
  .cover-photo {
    width: 30%;
  }
  .house-msg {
    padding-left:5%;
    width: 65%;
  }
  .house-address {
    font-size:0.32rem;
    line-height:0.48rem;
    text-align: left;
  }
  .houseNo {
    text-align: right;
    color: #808080;
    line-height:0.32rem;
  }
  .page-notice {
    padding:0.16rem 0.4rem;
  }
  .mint-datetime {
    height: 40%;
    width: 101%
  }
  button.btn {
    width: 100%;
    margin:0.4rem 0;
  }
  .banner {
    position: absolute;
    width: 100%;
    height:4.8rem;
    /*background-color: #fff;*/
  }
  .swp-count {
    position: absolute;
    bottom:0;
    right:0;
    padding:0 0.3rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    line-height:0.6rem;
    font-size:0.32rem;
  }
</style>
