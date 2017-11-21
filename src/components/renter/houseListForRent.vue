<template>
    <div class="search">
      <div class="search-title clearfix">
        <a href="javascript:;" class="goBack" @click.stop="goBack"></a>
        <input type="text" id="searchWord" class="searchWord" v-model="search.searchWord" @focus.stop.prevent="onFocus" @blur.stop.prevent="onBlur">
        <a href="javascript:;" class="ico-search" @click="searchList"></a>
      </div>
      <div class="search-case-list">
        <li v-for="(searchCase, $index) in searchCaseList" :class="chosenStatus[$index] ? 'active': ''" v-bind="{ref: 'searchCase'+$index}" @click.stop="openChosenCasePanel($event, $index)"> {{searchCase}}</li>
      </div>
      <cascade ref="zoneList" v-model="zoneList.openPanel" :dataList="zoneList.dataList"  @change="zoneListChange"></cascade>
      <dblRange ref="unitPrice" v-model="unitPrice.openPanel" :options="unitPrice" @restRange="resetUnitPrice" @ensureRange="ensureUnitPrice"></dblRange>
      <dblRange ref="houseArea" v-model="houseArea.openPanel" :options="houseArea" @restRange="resetHouseArea" @ensureRange="ensureHouseArea"></dblRange>
      <radioList ref="payType" v-model="payType.openPanel" :dataList="payType.dataList" @change="payTypeChange" @resetRadio = "resetPayType"></radioList>
      <div class="list-container">
        <!--<div v-if="pageInfo.recordCount" class="list-count">一共找到<span>{{pageInfo.recordCount}}</span>条结果</div>-->
        <!--<mt-loadmore-->
          <!--:bottom-method="loadBottom"-->
          <!--:bottom-all-loaded="allLoaded"-->
          <!--:auto-fill="false"-->
          <!--ref="loadmore">-->
          <!--<ul id="deal-house-list">-->
            <!--<li v-for="house in dealHouseList">-->
              <!--<div class="deal-house-title" v-html="house.district +'&nbsp;&nbsp;'+ house.block.replace(search.searchWord,'<span>'+search.searchWord+'</span>')+'&nbsp;&nbsp;'+house.address.replace(search.searchWord,'<span>'+search.searchWord+'</span>')"></div>-->
              <!--<div class="deal-house-content clearfix">-->
                <!--<div class="deal-house-msg">-->
                  <!--<p class="deal-village" v-html="'小区：'+house.village.replace(search.searchWord,'<span>'+search.searchWord+'</span>')"></p>-->
                  <!--<p class="deal-house-area">面积：{{house.area}}  m²</p>-->
                  <!--<p class="deal-house-signDate">签约时间：{{house.signDate}}</p>-->
                  <!--<p class="deal-house-agency">成交中介：{{house.agency}}</p>-->
                <!--</div>-->
                <!--<div class="deal-price">-->
                  <!--<p class="deal-total-price">{{house.totalPrice}}万</p>-->
                  <!--<p class="deal-unit-price">{{house.unitPrice}}元/m²</p>-->
                <!--</div>-->
              <!--</div>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</mt-loadmore>-->
      </div>
      <ul v-show="BottomBarFixed" class="footer clearfix">
        <li class="toIndex" @click.stop.prevent="toIndex">首页</li>
        <li class="toUserInfo">我的</li>
      </ul>
    </div>
</template>
<script>
  import { TENANT_TOKEN, zoneListPath } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  import dblRange from '../bricksSon/doubleRange.vue'
  import cascade from '../bricksSon/zoneLink.vue'
  import radioList from '../bricksSon/radioList.vue'
  export default {
    components: {dblRange, cascade, radioList},
    name: 'houseListForRent',
    data () {
      return {
        BottomBarFixed: true,
        search: {
          searchWord: '',
          province: '',
          city: '',
          country: '',
          payType: '',
          minRent: '',
          maxRent: '',
          minArea: '',
          maxArea: ''
        },
        searchCaseList: ['区域', '月租', '面积', '付款方式'],
        zoneList: {
          openPanel: false,
          panelStatus: false,
          dataList: []
        },
        chosenStatus: [0, 0, 0, 0],
        rangeModel: {},
        unitPrice: {
          openPanel: false,
          panelStatus: false,
          title: '租金区间（元）',
          minVal: 0,
          maxVal: 3000,
          range1: {
            width: 0,
            val: 0
          },
          range2: {
            width: 0,
            val: 3000
          }
        },
        payType: {
          openPanel: false,
          panelStatus: false,
          dataList: ['不限', '一月一付', '两月一付', '三月一付', '六月一付', '一年一付']
        },
        houseArea: {
          openPanel: false,
          panelStatus: false,
          title: '房源面积(m²)',
          minVal: 0,
          maxVal: 200,
          range1: {
            width: 0,
            val: 0
          },
          range2: {
            width: 0,
            val: 200
          }
        }
      }
    },
    created () {
//      console.log('houseListForRent')
      let token = cache.get(TENANT_TOKEN)
      console.log(zoneListPath)
//      let myVue = this
      if (token === null) {
//        this.$router.push({ path: '/' })
      } else {
      }
//      let getZoneListOption = {
//        url: zoneListPath,
//        sendData: {level: 3, token: token},
//        success (data) {
//          myVue.zoneList.dataList = data.record
//          myVue.zoneList.dataList.unshift({id: '', zoneName: '不限', subZone: []})
//        }
//      }
//      this.post(getZoneListOption)
    },
    methods: {
      onFocus () {
        this.BottomBarFixed = false
      },
      onBlur () {
        this.BottomBarFixed = true
      },
      zoneListChange (data) {
        console.log(data)
        this.search.province = data[0]
        this.search.city = data[1]
        this.search.country = data[2]
        for (let i = data.length - 1; i >= 0; i--) {
          if (data[i]) {
            this.chosenStatus.splice(0, 1, 1)
            this.searchCaseList.splice(0, 1, data[i])
            break
          }
        }
      },
      searchList () {
        console.log(this.search)
      },
      goBack () {
        this.$router.push({path: '/'})
      },
      openChosenCasePanel (e, idx) {
        switch (idx) {
          case 0 :
            this.$refs.zoneList.openPanel()
            this.$refs.unitPrice.closePanel()
            this.$refs.houseArea.closePanel()
            this.$refs.payType.closePanel()
            break
          case 1 :
            this.$refs.unitPrice.openPanel()
            this.$refs.zoneList.closePanel()
            this.$refs.houseArea.closePanel()
            this.$refs.payType.closePanel()
            break
          case 2 :
            this.$refs.houseArea.openPanel()
            this.$refs.zoneList.closePanel()
            this.$refs.unitPrice.closePanel()
            this.$refs.payType.closePanel()
            break
          case 3 :
            this.$refs.payType.openPanel()
            this.$refs.houseArea.closePanel()
            this.$refs.zoneList.closePanel()
            this.$refs.unitPrice.closePanel()
            break
          default:
            this.$refs.payType.closePanel()
            this.$refs.houseArea.closePanel()
            this.$refs.zoneList.closePanel()
            this.$refs.unitPrice.closePanel()
            break
        }
      },
      resetUnitPrice (e) {
        this.chosenStatus.splice(1, 1, 0)
        this.searchCaseList.splice(1, 1, '租金')
        this.search.minRent = ''
        this.search.maxRent = ''
      },
      ensureUnitPrice (data) {
        this.chosenStatus.splice(1, 1, 1)
        let val = data.min + '~' + data.max + '元'
        this.searchCaseList.splice(1, 1, val)
        this.search.minRent = data.min
        this.search.maxRent = data.max
      },
      resetHouseArea () {
        this.chosenStatus.splice(2, 1, 0)
        this.searchCaseList.splice(2, 1, '面积')
        this.search.minArea = ''
        this.search.maxArea = ''
      },
      ensureHouseArea (data) {
        console.log(data)
        this.chosenStatus.splice(2, 1, 1)
        let val = data.min + '~' + data.max + 'm²'
        this.searchCaseList.splice(2, 1, val)
        this.search.minArea = data.min
        this.search.maxArea = data.max
      },
      resetPayType () {
        this.chosenStatus.splice(3, 1, 0)
        this.searchCaseList.splice(3, 1, '付款方式')
        this.search.payType = ''
      },
      payTypeChange (data) {
        console.log(data)
        if (data.name) {
          this.chosenStatus.splice(3, 1, 1)
          this.searchCaseList.splice(3, 1, data.name)
          this.search.payType = data.name
        }
      },
      toIndex () {
        this.$router.push({path: '/'})
      },
      toUserInfo () {
//        this.$router.push({path: '/'})
      }
    }
  }
</script>
<style scoped>
  .footer {
    position: fixed;
    width: 100%;
    bottom:0;
    left:0;
    height: 0.88rem;
    line-height:0.88rem;
    /*background-color: #ff4949;*/
  }
  .footer li {
    float: left;
    width: 50%;
    height: 100%;
    color: #fff;
  }
  .toIndex {
    background-color: #e02e08;
  }
  .toUserInfo {
    background-color: #bbbbbb;
  }
</style>
