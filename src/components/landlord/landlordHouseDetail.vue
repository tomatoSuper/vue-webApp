<template>
    <div class="landlord-houseDetail">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>房源详情</h2>
        </div>
      </div>
      <div class="page-container">
        <div class="group">
          <div class="group-title">地址信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>所在地区</label><span>{{houseInfo.cityName + houseInfo.districtName}}</span></p>
            <p class="group-row clearfix"><label>所在小区</label><span>{{houseInfo.vilage}}</span></p>
            <p class="group-row clearfix">
              <label>详细地址</label>
              <span>
                {{houseInfo.blockNo===''?'':houseInfo.blockNo+'号楼'}}{{houseInfo.unitNo===''?'':houseInfo.unitNo+'单元'}}{{houseInfo.roomNo===''?'':houseInfo.roomNo+'室'}}
              </span>
            </p>
          </div>
        </div>
        <div class="group">
          <div class="group-title">房况信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>户型</label><span>{{houseInfo.houseType}}</span></p>
            <p class="group-row clearfix"><label>面积</label><span>{{houseInfo.buildingArea===''?'':houseInfo.buildingArea+'m²'}}</span></p>
            <p class="group-row clearfix"><label>所在楼层</label><span>{{houseInfo.floorNo===''?'':houseInfo.floorNo+'楼'}}</span></p>
            <p class="group-row clearfix"><label>朝向</label><span>{{houseInfo.direct}}</span></p>
          </div>
        </div>
        <div class="group">
          <div class="group-title">出租信息</div>
          <div class="group-content">
            <p class="group-row clearfix"><label>租赁信息</label><span>{{houseInfo.rentType}}</span></p>
            <p class="group-row clearfix"><label>房屋租金</label><span>{{houseInfo.rentalPrice===''?'':houseInfo.rentalPrice+' 元 /月'}}</span></p>
            <p class="group-row clearfix"><label>付款方式</label><span>{{houseInfo.payMode===''?'':houseInfo.payMode}}</span></p>
            <p class="group-row clearfix">
              <label>房源设施</label>
              <span class="canOpen" style="padding-right: 0.3rem;" @click.stop.prevent="openHardwareList">{{ hardwareList.length?'共'+hardwareList.length+'个':''}}</span>
            </p>
            <ul class="group-row hardware-list clearfix" :class="folding.isOpen? '':'in'" :style="{height: folding.isOpen?(Math.ceil(hardwareList.length / 4) * folding.unitHeight) +'px':'0px'}" ref="hardwareList">
              <li v-for="itm in hardwareList">{{itm}}</li>
            </ul>
            <p class="group-row clearfix"><label>房源简介</label><span>{{houseInfo.remark}}</span></p>
            <p class="group-row clearfix" @click.stop.prevent="showDetailImages">
              <label>房源图片</label>
              <span class="canOpen" style="padding-right: 0.3rem;">{{swipe.dataList.length?'共'+swipe.dataList.length+'个':'无图片信息'}}</span>
            </p>
          </div>
        </div>
        <div class="group">
          <div class="group-title">房产证照片</div>
          <div class="group-content">
            <ul class="certificate-photoList">
              <template v-if="houseInfo.houseAuthImages && houseInfo.houseAuthImages.length">
                <img v-for="img in houseInfo.houseAuthImages" :src="img.imageUrl" alt="">
              </template>
              <template v-else>
                <img src="http://dev-esheyi.yingjiashenghuo.com/xaImages/unImage.png" alt="产证图片">
              </template>
            </ul>
          </div>
        </div>
        <div class="group-content">
          <!--出租状态枚举：("空置"), ("已出租"), ("部分出租")-->
          <!--<a href="javascript:;" v-if="houseInfo.rentStatus === '空置'" class="btn goToSignUp" @click="goToSign(id)">发起签约</a>-->
          <a href="javascript:;" class="btn goToSignUp" @click="goToSign(id)">发起签约</a>
        </div>
      </div>
      <div class="dialog-cover" v-show="swipe.isShow" @click.stop.prevent="closeSwpPanel">
        <div class="banner block-center-middle" @click.stop.prevent="true">
          <mt-swipe :auto="0" :showIndicators="false" :prevent="true" @change="handleChange">
            <template v-for="img in swipe.dataList">
              <mt-swipe-item>
                <img :src="img.imageUrl" alt="">
              </mt-swipe-item>
            </template>
          </mt-swipe>
          <div v-if="swipe.dataList.length" class="swp-count">{{swipe.activeIndex}} / {{swipe.dataList.length}}</div>
        </div>
      </div>
    </div>
</template>
<script>
  import { LANDLORD_TOKEN, houseDetailPath } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'landlordHouseDetail',
    data () {
      return {
        id: '',
        houseDetailPath,
        swipe: {
          isShow: false,
          activeIndex: 1,
          dataList: []
        },
        folding: {
          unitHeight: '53',
          isOpen: false
        },
        hardwareList: [],
        houseInfo: {}
      }
    },
    created () {
      console.log('landlordHouseDetail')
      console.log(this.$route.query)
      this.id = this.$route.query.id
      let token = cache.get(LANDLORD_TOKEN)
//      如果获取不到token，说明是非法强跳域名过来的，那么将路由跳转去登录页
      if (token === null) {
//        this.$router.push({ path: '/' })
      } else {
      }
    },
    mounted () {
      this.houseInfo = {
        applyStatus: '申请状态',
        rentStatus: '空置',
        serialNum: '序列号',
        cityName: '雄安市',
        districtName: '安新县',
        address: '路信息',
        vilage: '天河小区',
        blockNo: '5',
        unitNo: '2',
        roomNo: '401',
        houseType: '3室1厅2卫',
        floorNo: '4',
        door: '01',
        parentId: '大门id',
        buildingArea: '100',
        direct: '南',
        rentType: '租房类型',
        rentalPrice: '3000',
        payMode: '付款方式',
        hardware: '洗衣机,空调,电视机,洗衣机,空调,电视机',
        houseImages: [
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123814_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123838_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'}
        ],
        houseAuthImages: [
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'}
        ],
        source: '房源来源',
        ownerId: '房东id',
        bedroomCnt: '卧室数量',
        parlourCnt: '客厅数量',
        toiletCnt: '卫生间数量',
        remark: '房源备注房源备注房源备注房源备注房源备'
      }
      this.swipe.dataList = this.houseInfo.houseImages
      this.hardwareList = this.houseInfo.hardware.split(',')
//      this.getDetail()
    },
    methods: {
      getDetail () {
        let myVue = this
        this.get({
          role: 'landlord',
          url: houseDetailPath + '/' + myVue.id,
          success (data) {
            myVue.houseInfo = data.data
            myVue.swipe.dataList = data.houseImages
          }
        })
      },
      showDetailImages () {
        this.swipe.isShow = this.houseInfo.houseImages.length ? 1 : 0
      },
      checkAuthStatus (data) {
        this.search.authStatus = data.code
      },
      goToSign (id) {
        let houseId = id
        this.$router.push({path: '/addContract', query: {houseId}})
      },
      goBack () {
        this.$router.go(-1)
      },
      handleChange (index) {
        this.swipe.activeIndex = index + 1
      },
      closeSwpPanel () {
        this.swipe.isShow = 0
      },
      openHardwareList () {
        this.folding.isOpen = !this.folding.isOpen
//        console.log(this.$refs.hardwareList.offsetHeight)
      }
    }
  }
</script>
<style scoped>
  .landlord-houseDetail {
    overflow: hidden;
    background-color: #eee;
    height: 100%;
    min-height: 100%;
  }
  .page-container {
    margin-top:0.9rem;
  }
  .group-row span {
    padding: 0;
  }
  .hardware-list {
    -webkit-transition: all 0.3s linear;
    -moz-transition: all 0.3s linear;
    -ms-transition: all 0.3s linear;
    -o-transition: all 0.3s linear;
    transition: all 0.3s linear;
    /*overflow: visible;*/
    overflow: hidden;
  }
  .hardware-list.in {
    height: 0;
  }
  .hardware-list li {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    float: left;
    width: 24%;
    margin: 0.2rem 0.5%;
    /*border:1px solid #4caf50;*/
    background-color: #4caf50;
    color: #fff;
    line-height:0.66rem;
  }
  .certificate-photoList {
    padding:0.2rem 0;
    height: 3.6rem;
    text-align: center;
    white-space:nowrap;
    overflow-x:auto;
  }
  .certificate-photoList img {
    height: 100%;
    width:auto;
  }
  .certificate-photoList img + img {
    margin-left:0.3rem;
  }
  .goToSignUp {
    margin:0.4rem 0 0.6rem;
    padding: 0;
    width: 100%;
    line-height: 0.88rem;
    letter-spacing: 5px;
    font-size:0.32rem;
    color: #fff;
    background-color: #FF790E;
  }
  ::-webkit-scrollbar {
    height: 0;
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
