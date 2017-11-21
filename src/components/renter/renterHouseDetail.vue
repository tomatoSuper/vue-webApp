<template>
    <div class="house-detail" :style="{minHeight: deviceHeight+'px'}">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>房源详情</h2>
        </div>
      </div>
      <div class="page-container">
        <div class="banner">
          <mt-swipe :auto="2000" @change="handleChange">
            <template v-for="img in banners">
              <mt-swipe-item>
                <img :src="img.imageUrl" alt="">
              </mt-swipe-item>
            </template>
          </mt-swipe>
          <div v-if="banners.length" class="swp-count">{{activeIndex}} / {{banners.length}}</div>
        </div>
        <div class="group">
          <div class="group-content">
            <p class="group-row clearfix" style="border-bottom: 1px solid #eee;text-align: left;">
              <span style="float: none;font-size: 0.32rem;">{{houseInfo.address+houseInfo.vilage}}</span>
              <span style="float: right;color: #FF6138;font-size: 0.36rem;">¥{{houseInfo.rentalPrice}} <i style="color: #808080;font-size: 0.24rem;">/ 月</i></span>
            </p>
            <ul class="baseInfo clearfix">
              <li>类型：{{houseInfo.rentType}}</li>
              <li>户型：{{houseInfo.houseType}}</li>
              <li style="text-align: right;">朝向：{{houseInfo.direct}}</li>
              <li>楼层：{{houseInfo.floorNo}}层</li>
              <li>面积：{{houseInfo.buildingArea}}m²</li>
            </ul>
          </div>
        </div>
        <div v-if="houseInfo.hardware" class="group">
          <div class="group-title">房间配置</div>
          <div class="group-content">
            <ul class="hardware-list clearfix">
              <li v-for="(itm, idx) in houseInfo.hardware.split(',')">
                <i :class="houseInfo.hardwaresClass.split(',')[idx]"></i><br><span>{{itm}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="group" style="margin-bottom: 1.08rem;">
          <div class="group-title">房间描述</div>
          <p class="group-content" style="text-align: left;line-height: 0.4rem;min-height: 2rem;padding: 0.2rem 0.4rem;font-size: 0.28rem;">
            {{houseInfo.remark}}
          </p>
        </div>
      </div>
      <div class="footer">
        <a href="javascript:;" class="btn btn-submit">联系房东</a>
      </div>
    </div>
</template>
<script>
  // 获取token的缓存字段
  import { TENANT_TOKEN, deviceHeight, houseDetailPath } from '../../assets/js/config'
  // 获取缓存对象，使用缓存方法
  import cache from '../../assets/js/cache'
  export default {
    name: 'renterHouseDetail',
    data () {
      return {
        deviceHeight,
        id: '',
        houseInfo: {},
        banners: [],
        activeIndex: 1,
        allLoaded: false
      }
    },
    created () {
      console.log(this.$route.query)
      this.id = this.$route.query.id
      console.log(houseDetailPath)
      let token = cache.get(TENANT_TOKEN)
      console.log(token)
      if (token === null) {
        this.$router.push({ path: '/' })
      }
      let id = this.$route.query.id
      console.log(id)
    },
    mounted () {
      this.houseInfo = {
        serialNum: '171114603z',
        blockNo: '4',
        unitNo: '3',
        roomNo: '601',
        floorNo: '6',
        door: '',
        bedroomCnt: '2',
        parlourCnt: '1',
        toiletCnt: '1',
        payMode: '三月付一',
        hardware: '冰箱,洗衣机,热水器,衣橱,电视机,空调,微波炉,wifi,床,燃气灶,沙发,餐桌,书桌,椅子,油烟机',
        hardwaresClass: 'icebox,washer,heater,ambry,television,air,microwave,wifi,bed,stove,sofa,eattable,desk,chair,rangeHoods',
        remark: '万达广场附近,万达广场附近,万达广场附近,万达广场附近,万达广场附近,万达广场附近,万达广场附近,万达广场附近',
        ownerId: 'bigbohoiohoh',
        rentType: '整租',
        direct: '南',
        districtName: '新安县',
        address: '永安路33号',
        vilage: '测试小区',
        houseType: '3室1厅2卫',
        buildingArea: '50',
        rentalPrice: '4500',
        houseImages: [
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png'},
          {imageUrl: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'}
        ],
        sa3: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
        'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png,' +
        'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
      }
      this.banners = this.houseInfo.houseImages
      let myVue = this
      this.get({
        url: houseDetailPath + '/' + myVue.id,
        success (data) {
          console.log(data)
        }
      })
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      handleChange (index) {
        this.activeIndex = index + 1
      }
    }
  }
</script>
<style scoped>
  @import '../../assets/css/houseDetailIcon.css';
  .page-container {
    margin-top:1.1rem;
  }
  .banner {
    height: 3.8rem;
    position: relative;
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
  .group-row span{
    width:auto;
  }
  .baseInfo {
    padding:0.2rem 0;
  }
  .baseInfo > li {
    float: left;
    width: 33.33%;
    text-align: left;
    line-height: 0.72rem;
    font-size:0.28rem;
  }
  .group + .group {
    margin-top:0.24rem;
  }
  .group-content {
    padding: 0 0.3rem;
  }
  .group-title {
    color: #808080;
    font-size:0.32rem;
    background-color: #ffffff;
    border-bottom:1px solid #eeeeee;
  }
  .hardware-list {
    padding:0.3rem 0;
    /*height:4.2rem;*/
  }
  .hardware-list li {
    float: left;
    width: 20%;
    text-align: center;
  }
  .hardware-list li span,.hardware-list li i {
    display: inline-block;
  }
  .hardware-list li i {
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .hardware-list li span {
    line-height:0.48rem;
    font-size:0.24rem;
    color: #808080;
  }
  .footer {
    position: fixed;
    bottom:0;
    width: 100%;
    left:0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:0 0.4rem;
  }
  .footer .btn {
    width: 100%;
    line-height:0.88rem;
    font-size:0.3rem;
  }
</style>
