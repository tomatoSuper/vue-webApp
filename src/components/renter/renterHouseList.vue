<template>
  <div class="renter-houseList" style="overflow: hidden;">
    <div class="list-container">
      <mt-loadmore
        @top-status-change="topStatusChange"
        :topDistance="40"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="bottomLoaded"
        :auto-fill="false"
        ref="loadmore">
        <ul class="houseList">
          <li class="clearfix" v-for="house in houseList" @click.stop.prevent="goToHouseDetail(house)">
            <p class="house-image">
              <img v-if="house.houseImages && house.houseImages.length" :src="house.houseImages[0].imageUrl" alt="封面图片">
              <img v-else :src="'http://dev-esheyi.yingjiashenghuo.com/xaImages/unImage.png'" alt="封面图片">
            </p>
            <div class="house-info">
              <p class="house-title">{{house.districtName}}-{{house.vilage}}</p>
              <p>{{house.houseType}}-{{house.buildingArea}}m²</p>
              <p class="clearfix">{{house.address}} <span class="rental-price">{{house.rentalPrice}}元/月</span></p>
            </div>
          </li>
        </ul>
        <div slot="top" class="topLoading" :class="{'onLoading':topLoading}">
            <mt-spinner :class="'snakePull'" type="snake" color="#e02e08" :size="20"></mt-spinner>
        </div>
        <div class="spinner-bottom">
          <mt-spinner
            type="snake"
            color="#e02e08"
            :size='20'
            :class="'loadingMore'"
            v-show="bottomLoaded"
          ></mt-spinner>
        </div>
      </mt-loadmore>
      <div v-if="noMoreData" class="no-more-data">
        <span>没有更多数据了</span>
      </div>
    </div>
  </div>
</template>
<script>
  // 获取token的缓存字段
  import { renterHouseListPath } from '../../assets/js/config'
  export default {
    name: 'landlordHouseList',
    data () {
      return {
        houseList: [],
        sendData: {
          page: 1,
          limit: 10
        },
        topLoading: false,
        bottomLoaded: false,
        noMoreData: false
      }
    },
    created () {
    },
    mounted () {
//      this.houseList = [
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        },
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50m²',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        },
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50m²',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        },
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50m²',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        },
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50m²',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        },
//        {
//          houseNo: 'hqwuiejq12131',
//          districtName: '新安县',
//          address: '永安路33号',
//          vilage: '测试小区',
//          houseType: '3室1厅2卫',
//          buildingArea: '50m²',
//          rentalPrice: '4500',
//          houseImages: 'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123820_20170510103843.png,' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123827_20170510103843.png' +
//          'http://120.55.66.146:8080/esheyi-res/public/uploads/sale/f540fdb8b0d6462881f1d6bdea9f3fbc/QQ截图20170509123833_20170510103843.png'
//        }
//      ]
      this.getHouseList()
    },
    methods: {
      getHouseList () {
        let myVue = this
        this.get({
          url: renterHouseListPath,
          sendData: myVue.sendData,
          success (data) {
            if (data.page && data.page.list && data.page.list.length) {
              data.page.list.forEach(function (ele) {
                myVue.houseList.push(ele)
              })
              myVue.sendData.page++
              myVue.bottomLoaded = false
            } else {
              myVue.bottomLoaded = false
              myVue.noMoreData = true
            }
          },
          failed (data) {
            myVue.$toast({
              message: data.msg,
              duration: 1000
            })
          },
          error (data) {}
        })
      },
      topStatusChange (status) {
        let myVue = this
        if (status === 'drop') {
          if (!this.topLoading) {
            this.topLoading = true
            setTimeout(s => {
              myVue.sendData.page = 1
              myVue.houseList = []
              this.topLoading = false
              myVue.noMoreData = false
              myVue.getHouseList()
            }, 1000)
          }
        }
      },
      loadTop (id) {
        this.$refs.loadmore.onTopLoaded(id)
      },
      loadBottom () {
        this.bottomLoaded = true
        this.$refs.loadmore.onBottomLoaded()
        this.getHouseList()
      },
      goToHouseDetail (data) {
        let id = data.id
        this.$router.push({path: '/renterHouseDetail', query: {id}})
      }
    }
  }
</script>
<style scoped>
  .list-container {
    padding-top:1.82rem;
  }
  .houseList li {
    padding:0.2rem 0.3rem;
    background-color: #fff;
  }
  .houseList li + li {
    margin-top:0.1rem;
  }
  .houseList li .house-image,.houseList li .house-info {
    float: left;
  }
  .houseList li .house-image{
    width: 34%;
    height: 1.74rem;
    line-height:1.74rem;
  }
  .houseList li .house-image img {
  }
  .houseList li .house-info {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:0.3rem;
    width: 66%;
    text-align: left;
  }
  .houseList li .house-info p.house-title {
    font-size:0.32rem;
    line-height:0.66rem;
    color: #212121;
  }
  .houseList li .house-info p {
    line-height:0.56rem;
    color: #808080;
  }
  .rental-price {
    float: right;
    font-size:0.32rem;
    color: #FF6138;
  }
  .mint-loadmore {
    background-color: transparent;
  }
  /*.loadingMore {*/
    /*margin-top:0.16rem;*/
  /*}*/
</style>
