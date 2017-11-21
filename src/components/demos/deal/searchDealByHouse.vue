<template>
    <div class="search">
      <div class="search-title clearfix">
        <a href="javascript:;" class="goBack" @click.stop="goBack"></a>
        <input type="text" id="searchWord" class="searchWord" v-model="search.searchWord" @focus.stop="onFocus">
        <a href="javascript:;" class="ico-search" @click="searchList"></a>
      </div>
      <div class="search-case-list">
        <li v-for="(searchCase, $index) in searchCaseList" :class="chosenStatus[$index] ? 'active': ''" v-bind="{ref: 'searchCase'+$index}" @click.stop="openChosenCasePanel($event, $index)"> {{searchCase}}</li>
      </div>
      <div class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openBlockPanel">
          <div id="zoneList" class="panel clearfix">
            <ul id="zoneList1" @click.stop>
              <li v-for="zone1 in zoneList1" class="chosen">{{zone1}}</li>
            </ul>
            <ul id="zoneList2">
              <li v-for="(zone2, indexZo2) in zoneList2" :class="zone2.zoneName === chosenIdZo2.zoneName ? 'chosen' : ''" @click.stop="renderZoneList3(zone2, indexZo2)">{{zone2.zoneName}}</li>
            </ul>
            <ul id="zoneList3">
              <li v-for="zone3 in zoneList3" :class="zone3.zoneName === chosenIdZo3.zoneName ? 'chosen' : ''" @click.stop="clickZoneList3(zone3)">{{zone3.zoneName}}</li>
            </ul>
          </div>
      </div>
      <div id="unit-price" class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openPricePanel">
        <div class="panel" @click.stop>
          <div class="panel-content clearfix">
            <div class="range-title">{{uinitPrice.title}} ( 万元 )</div>
            <div class="range-content">
              <div class="range-bar" ref="uinitPrice" @touchstart.stop.prevent="touchRange($event)" @touchmove.stop.prevent="range1Move($event)">
                <div class="range1" :style="{width: uinitPrice.range1.width + 'px'}">
                  <p class="range-lump"><i>{{uinitPrice.range1.val}}</i></p>
                </div>
                <div class="range2" :style="{width: uinitPrice.range2.width + 'px'}">
                  <p class="range-lump"><i>{{uinitPrice.range2.val}}</i></p></div>
              </div>
            </div>
          </div>
          <div class="panel-btns clearfix">
            <a href="javascript:;" class="reset" @click.stop="resetUnitPrice">重置</a>
            <a href="javascript:;" class="sure" @click.stop="ensureUnitPrice">确定</a>
          </div>
        </div>
      </div>
      <div id="signTime" class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openSignTimePanel">
        <div class="panel" @click.stop>
          <div class="range-title">签约时间</div>
          <div class="panel-content">
              <div class="date-select clearfix" :class="chosenStatus[2] ? 'active': ''">
                <p>{{signDate.start | date}}</p>
                <span  class="col-line"></span>
                <p>{{signDate.end | date}}</p>
              </div>
          </div>
          <mt-datetime-picker
            ref="dateStart"
            type="date"
            :startDate="startDate"
            :endDate="endDate"
            :id="'date-start'"
            v-model="signDate.start">
          </mt-datetime-picker>
          <mt-datetime-picker
            ref="dateEnd"
            type="date"
            cancelText="重置"
            :startDate="startDate"
            :endDate="endDate"
            :id="'date-end'"
            v-model="signDate.end">
          </mt-datetime-picker>
          <div class="panel-btns clearfix">
            <a href="javascript:;" class="reset" @click.stop="resetSignDate">重置</a>
            <a href="javascript:;" class="sure" @click.stop="selectSignDate">确定</a>
          </div>
        </div>
      </div>
      <div id="more-cases" class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openMoreCasePanel">
        <div class="panel" @click.stop>
          <p class="panel-title">总价区间 （万元）</p>
          <div class="panel-content clearfix">
            <input type="tel" v-model="totalPrice.min" placeholder="总价最低"><span class="col-line"></span><input type="tel" v-model="totalPrice.max" placeholder="总价最高">
          </div>
          <p class="panel-title">房源面积</p>
          <div class="panel-content clearfix">
            <input type="tel" v-model="houseArea.min" placeholder="面积最小"><span class="col-line"></span><input type="tel" v-model="houseArea.max" placeholder="面积最大">
          </div>
          <p class="panel-title">房源类型</p>
          <ul class="houseType-list panel-content clearfix">
            <li v-for="houseType in houseTypeList" :class="houseType === houseTypeChosen ? 'chosen' : ''" @click.stop="chosenHouseType(houseType)">{{houseType}}</li>
          </ul>

          <div class="panel-btns clearfix">
            <a href="javascript:;" class="reset" @click.stop="resetMoreCases">重置</a>
            <a href="javascript:;" class="sure" @click.stop="ensureMoreCases">确定</a>
          </div>
        </div>
      </div>
      <div v-if="dealHouseList.length" class="list-container">
        <div v-if="pageInfo.recordCount" class="list-count">一共找到<span>{{pageInfo.recordCount}}</span>条结果</div>
        <mt-loadmore
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          ref="loadmore">
          <ul id="deal-house-list">
            <li v-for="house in dealHouseList">
              <div class="deal-house-title" v-html="house.district +'&nbsp;&nbsp;'+ house.block.replace(search.searchWord,'<span>'+search.searchWord+'</span>')+'&nbsp;&nbsp;'+house.address.replace(search.searchWord,'<span>'+search.searchWord+'</span>')"></div>
              <div class="deal-house-content clearfix">
                <div class="deal-house-msg">
                  <p class="deal-village" v-html="'小区：'+house.village.replace(search.searchWord,'<span>'+search.searchWord+'</span>')"></p>
                  <p class="deal-house-area">面积：{{house.area}}  m²</p>
                  <p class="deal-house-signDate">签约时间：{{house.signDate}}</p>
                  <p class="deal-house-agency">成交中介：{{house.agency}}</p>
                </div>
                <div class="deal-price">
                  <p class="deal-total-price">{{house.totalPrice}}万</p>
                  <p class="deal-unit-price">{{house.unitPrice}}元/m²</p>
                </div>
              </div>
            </li>
          </ul>
        </mt-loadmore>
      </div>
      <mt-spinner
        type="snake"
        color="#e02e08"
        :size='20'
        :class="'loadingMore'"
        v-show="allLoaded"
      ></mt-spinner>
    </div>
</template>
<script>
  import Vue from 'vue'
  import { TENANT_TOKEN, DEAL_SEARCH_HISTORY_CACHE_LIST_KEY, zoneListPath, dealHouseListPath, deviceWidth, deviceHeight, houseTypeList } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  let historyCache = cache.get(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY)
  historyCache = historyCache === null ? [] : historyCache.split(',')
  export default {
    name: 'searchDealByHouse',
    data () {
      return {
        deviceHeight,
        allLoaded: false,
        search: {
          searchWord: '',
          district: '',
          block: '',
          type: '',
          village: '',
          minTotalPrice: '',
          maxTotalPrice: '',
          minUnitPrice: 0,
          maxUnitPrice: 30,
          minSignDate: '2015-01-01',
          maxSignDate: '2017-12-31',
          minArea: '',
          maxArea: '',
          pageNum: 1,
          numPerPage: 10,
          token: ''
        },
        dealHouseList: [],
        pageInfo: {},
        searchHistoryCache: historyCache,
        showMatchList: 0,
        showSearchCasePanel: 0,
        showHistoryList: 0,
        searchCaseList: ['区域', '单价', '签约时间', '更多'],
        zoneList1: ['全上海'],
        zoneList2: '',
        zoneList3: '',
        chosenIdZo2: {},
        chosenIdZo3: {},
        openPanel: {
          openBlockPanel: 0,
          openPricePanel: 0,
          openSignTimePanel: 0,
          openMoreCasePanel: 0
        },
        chosenStatus: [ 0, 0, 0, 0 ],
        uinitPrice: {
          title: '单价区间',
          width: '',
          paddingLeft: '',
          minVal: 0,
          maxVal: 30,
          rangeDistance: '',
          range1: {
            width: 0,
            val: 0
          },
          range2: {
            width: 0,
            val: 30
          }
        },
        startDate: new Date('2015-01-01'),
        endDate: new Date('2017-12-31'),
        signDate: {
          start: new Date('2015-01-01'),
          end: new Date('2017-12-31')
        },
        houseTypeList,
        houseTypeChosen: '',
        totalPrice: {
          min: '',
          max: ''
        },
        houseArea: {
          min: '',
          max: ''
        }
      }
    },
    created () {
      let searchNavList = ['区域', '单价', '签约时间', '更多']
      let myVue = this
      this.search.token = cache.get(TENANT_TOKEN)
      let params = this.$route.params
      let getZoneListOption = {
        url: zoneListPath,
        sendData: {level: 3, token: myVue.search.token},
        success (data) {
          data.record.unshift({id: '', zoneName: '不限', subZone: []})
          myVue.zoneList2 = data.record
          if (params.searchWord !== undefined) {
            myVue.search.searchWord = params.searchWord
            myVue.search.village = params.village
            if (params.district) {
              myVue.chosenIdZo2.zoneName = myVue.search.district = params.district
              myVue.zoneList2.map(function (ele, idx) {
                if (ele.zoneName === myVue.chosenIdZo2.zoneName) {
                  myVue.zoneList3 = ele.subZone
                }
              })
              if (params.block) {
                myVue.chosenIdZo3.zoneName = myVue.search.block = params.block
                myVue.searchCaseList.splice(0, 1, myVue.chosenIdZo3.zoneName)
                myVue.chosenStatus.splice(0, 1, 1)
              } else {
                myVue.searchCaseList.splice(0, 1, myVue.chosenIdZo2.zoneName)
                myVue.chosenStatus.splice(0, 1, 1)
              }
            } else {
              myVue.searchCaseList = searchNavList
            }
            myVue.getDealHouseList()
          }
        }
      }
      this.post(getZoneListOption)
    },
    mounted () {
    },
    methods: {
      goBack () {
        this.closeChosenCasePanel()
        this.$router.push({path: '/'})
      },
      onFocus () {
        this.closeChosenCasePanel()
        let searchWord = this.search.searchWord
        this.$router.push({name: 'dealSearchCache', params: {searchWord}})
      },
      searchList () {
        this.closeChosenCasePanel()
        this.dealHouseList = []
        this.search.pageNum = 1
        this.getDealHouseList()
      },
      loadBottom () {
        this.getDealHouseList()
        this.$refs.loadmore.onBottomLoaded()
      },
      getDealHouseList () {
        this.allLoaded = true
        let myVue = this
        let getHouseListOption = {
          url: dealHouseListPath,
          sendData: myVue.search,
          success (data) {
            console.log(data)
            let dataList = data.record
            myVue.pageInfo = data.page
            console.log(myVue.pageInfo)
            if (dataList.length < 10) {
              myVue.$toast({
                message: '没有更多数据了',
                duration: 1000
              })
            }
            dataList.map(function (ele, idx) {
              myVue.dealHouseList.push(ele)
            })
            myVue.search.pageNum++
            myVue.allLoaded = false
          }
        }
        this.post(getHouseListOption)
      },
      clearHistory () {
        cache.del(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY)
        this.searchHistoryCache = []
      },
      openChosenCasePanel ($event, index) {
        switch (index) {
          case 0 :
            this.openPanel = {
              openBlockPanel: !this.openPanel.openBlockPanel,
              openPricePanel: 0,
              openSignTimePanel: 0,
              openMoreCasePanel: 0
            }
            break
          case 1 :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: !this.openPanel.openPricePanel,
              openSignTimePanel: 0,
              openMoreCasePanel: 0
            }
            break
          case 2 :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: 0,
              openSignTimePanel: !this.openPanel.openSignTimePanel,
              openMoreCasePanel: 0
            }
            this.$refs.dateStart.open()
            this.$refs.dateEnd.open()
            break
          case 3 :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: 0,
              openSignTimePanel: 0,
              openMoreCasePanel: !this.openPanel.openMoreCasePanel
            }
            break
          default :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: 0,
              openSignTimePanel: 0,
              openMoreCasePanel: 0
            }
            break
        }
      },
      closeChosenCasePanel () {
        this.openPanel = {
          openBlockPanel: 0,
          openPricePanel: 0,
          openSignTimePanel: 0,
          openMoreCasePanel: 0
        }
      },
      renderZoneList3 (data, indexZo2) {
        try {
          data.subZone[0].id !== '' ? data.subZone.unshift({id: '', zoneName: '不限', subZone: []}) : null
        } catch (e) {}
        this.zoneList3 = data.subZone
        this.chosenIdZo2 = data
        this.chosenIdZo3 = ''
        this.search.district = data.zoneName === '不限' ? '' : data.zoneName
        if (indexZo2 === 0) {
          this.searchCaseList.splice(0, 1, '全上海')
          this.closeChosenCasePanel()
          this.searchList()
        } else {
          this.searchCaseList.splice(0, 1, this.zoneList2[indexZo2].zoneName)
        }
        this.chosenStatus.splice(0, 1, 1)
      },
      clickZoneList3 (data) {
        this.chosenIdZo3 = data
        let idChosen = data.id
        if (idChosen === '') {
          this.search.block = ''
          this.searchCaseList.splice(0, 1, this.chosenIdZo2.zoneName)
//          this.closeChosenCasePanel()
        } else {
          this.search.block = data.zoneName
          this.searchCaseList.splice(0, 1, data.zoneName)
        }
        this.chosenStatus.splice(0, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      },
      resetUnitPrice () {
        let myRange = this.uinitPrice
        this.search.minUnitPrice = 0
        this.search.maxUnitPrice = 30
        this.searchCaseList.splice(1, 1, '单价')
        this.chosenStatus.splice(1, 1, 0)
        this.resetRange(myRange)
      },
      ensureUnitPrice () {
        this.searchCaseList.splice(1, 1, this.search.minUnitPrice + '--' + this.search.maxUnitPrice + ' 万')
        this.chosenStatus.splice(1, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      },
      range1Move (e) {
        let myVue = this
        let myRange = this.uinitPrice
        this.moveRange(e, myRange, function () {
          myVue.search.minUnitPrice = myRange.range1.val
          myVue.search.maxUnitPrice = myRange.range2.val
        })
      },
      touchRange (e) {
        let myRange = this.uinitPrice
        myRange.width = this.$refs.uinitPrice.offsetWidth
        myRange.paddingLeft = (deviceWidth - myRange.width) / 2
        this.moveRange(e, myRange)
      },
      moveRange (event, myRange, callback) {
        let touchPointX = event.touches[0].clientX
        let rangeBarWidth = myRange.width
        let paddingLeft = myRange.paddingLeft
        myRange.rangeDistance = rangeBarWidth - myRange.range1.width - myRange.range2.width
        let touchPointOnDistanceX = touchPointX - paddingLeft - myRange.range1.width
        if (touchPointOnDistanceX > (myRange.rangeDistance / 2)) {
          let w = parseInt(deviceWidth - touchPointX - paddingLeft)
          myRange.range2.width = w > 0 ? w : 0
          myRange.range2.val = parseInt(((rangeBarWidth - myRange.range2.width) / rangeBarWidth) * myRange.maxVal)
        } else {
          let w = parseInt(touchPointX - paddingLeft)
          myRange.range1.width = w > 0 ? w : 0
          myRange.range1.val = parseInt((myRange.range1.width / rangeBarWidth) * myRange.maxVal)
        }
        !!callback && typeof callback === 'function' && callback()
      },
      resetRange (myRange) {
        myRange.range1.width = 0
        myRange.range2.width = 0
        myRange.range1.val = 0
        myRange.range2.val = 30
      },
      resetSignDate () {
        this.signDate.start = new Date('2015-01-01')
        this.signDate.end = new Date('2017-12-31')
        this.search.minSignDate = '2015-01-01'
        this.search.maxSignDate = '2017-12-31'
        this.chosenStatus.splice(2, 1, 0)
      },
      selectSignDate (v) {
        let format = Vue.filter('date')
        this.search.minSignDate = format(this.signDate.start)
        this.search.maxSignDate = format(this.signDate.end)
        this.chosenStatus.splice(2, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      },
      chosenHouseType (data) {
        this.houseTypeChosen = data
      },
      resetMoreCases () {
        this.search.minArea = this.houseArea.min = ''
        this.search.maxArea = this.houseArea.max = ''
        this.search.minTotalPrice = this.totalPrice.min = ''
        this.search.maxTotalPrice = this.totalPrice.max = ''
        this.search.type = this.houseTypeChosen = ''
        this.chosenStatus.splice(3, 1, 0)
      },
      ensureMoreCases () {
        this.search.minArea = this.houseArea.min
        this.search.maxArea = this.houseArea.max
        this.search.minTotalPrice = this.totalPrice.min
        this.search.maxTotalPrice = this.totalPrice.max
        this.search.type = this.houseTypeChosen
        this.chosenStatus.splice(3, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      }
    }
  }
</script>
<style scoped>
  @import '../../../assets/css/searchStyle.css';
</style>
