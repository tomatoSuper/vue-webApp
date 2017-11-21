<template>
  <div class="search">
    <div class="search-title clearfix">
      <a href="javascript:;" class="goBack" @click.stop="goBack"></a>
      <input type="text" id="searchWord" class="searchWord" v-model="search.village" @focus.stop="onFocus">
      <a href="javascript:;" class="ico-search" @click="searchList"></a>
    </div>
    <ul id="history-list" v-show="showHistoryList">
      <li v-for="item in searchHistoryCache" @click.stop="setInput(item)">{{item}}</li>
      <li id="clear-history-list" @click.stop="clearHistory">清除搜索记录 (共 {{searchHistoryCache.length}} 条)</li>
    </ul>
    <div class="search-case-list">
      <li v-for="(searchCase, $index) in searchCaseList" :class="chosenStatus[$index] ? 'active': ''" v-bind="{ref: 'searchCase'+$index}" @click.stop="openChosenCasePanel($event, $index)"> {{searchCase}}</li>
    </div>
    <div class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openBlockPanel">
      <div id="zoneList" class="panel clearfix">
        <ul id="zoneList1" @click.stop>
          <li v-for="zone1 in zoneList1" class="chosen">{{zone1}}</li>
        </ul>
        <ul id="zoneList2">
          <li v-for="(zone2, indexZo2) in zoneList2" :class="zone2.id === chosenIdZo2.id ? 'chosen' : ''" @click.stop="renderZoneList3(zone2, indexZo2)">{{zone2.zoneName}}</li>
        </ul>
        <ul id="zoneList3">
          <li v-for="zone3 in zoneList3" :class="zone3.id === chosenIdZo3.id ? 'chosen' : ''" @click.stop="clickZoneList3(zone3)">{{zone3.zoneName}}</li>
        </ul>
      </div>
    </div>
    <div id="unit-price" class="search-case-panel" @click.stop.prevent="closeChosenCasePanel" v-show="openPanel.openPricePanel">
      <div class="panel" @click.stop>
        <div class="panel-content clearfix">
          <div class="range-title">{{averagePrice.title}} ( 万 元 )</div>
          <div class="range-content">
            <div class="range-bar" ref="averagePrice" @touchstart.stop.prevent="touchRange($event)" @touchmove.stop.prevent="range1Move($event)">
              <div class="range1" :style="{width: averagePrice.range1.width + 'px'}">
                <p class="range-lump"><i>{{averagePrice.range1.val}}</i></p>
              </div>
              <div class="range2" :style="{width: averagePrice.range2.width + 'px'}">
                <p class="range-lump"><i>{{averagePrice.range2.val}}</i></p></div>
            </div>
          </div>
        </div>
        <div class="panel-btns clearfix">
          <a href="javascript:;" class="reset" @click.stop="resetAvgPrice">重置</a>
          <a href="javascript:;" class="sure" @click.stop="ensureAvgPrice">确定</a>
        </div>
      </div>
    </div>
    <div class="list-container">
      <mt-loadmore
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false"
        ref="loadmore">
        <div class="data-count-total"></div>
        <ul id="deal-village-list">
          <li v-for="village in dealVillageList" @click.stop="toDealHouseList(village)">
            <div class="deal-village-title" v-html="village.village.replace(search.village,'<span>'+search.village+'</span>')"></div>
            <div class="deal-village-content clearfix">
              <div class="deal-village-position">
                <p v-html="'区域：'+village.district.replace(search.village,'<span>'+search.village+'</span>')"></p>
                <p v-html="'板块：'+village.block.replace(search.village,'<span>'+search.village+'</span>')"></p>
              </div>
              <div class="deal-village-info">
                <p>成交数量：{{village.count}} 套</p>
                <p>小区均价：{{village.avg}} 元/m²</p>
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
  import { TENANT_TOKEN, DEAL_SEARCH_HISTORY_CACHE_LIST_KEY, zoneListPath, dealVillageListPath, deviceWidth, deviceHeight } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  let historyCache = cache.get(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY)
  historyCache = historyCache === null ? [] : historyCache.split(',')
  export default {
    name: 'dealByVillage',
    data () {
      return {
        deviceHeight,
        allLoaded: false,
        params: '',
        search: {
          village: '',
          district: '',
          block: '',
          minPrice: 0,
          maxPrice: 30,
          pageNum: 1,
          numPerPage: 10,
          token: ''
        },
        dealVillageList: [],
        searchHistoryCache: historyCache,
        showSearchCasePanel: 0,
        showHistoryList: 0,
        searchCaseList: ['区域', '成交均价'],
        zoneList1: ['全上海'],
        zoneList2: '',
        zoneList3: '',
        chosenIdZo2: '',
        chosenIdZo3: '',
        openPanel: {
          openBlockPanel: 0,
          openPricePanel: 0
        },
        chosenStatus: [ 0, 0 ],
        averagePrice: {
          title: '均价区间',
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
        }
      }
    },
    created () {
      let searchNavList = ['区域', '成交均价']
      this.search.token = cache.get(TENANT_TOKEN)
      let myVue = this
      let params = this.$route.params
      this.params = params
      let getZoneListOption = {
        url: zoneListPath,
        sendData: {level: 3, token: myVue.search.token},
        success (data) {
          data.record.unshift({id: '', zoneName: '不限', subZone: []})
          myVue.zoneList2 = data.record
        }
      }
      this.post(getZoneListOption)
      let searchWord = params.searchWord
      if (searchWord !== undefined) {
        this.searchCaseList = searchNavList
        this.search.village = searchWord
        this.searchList()
      }
    },
    mounted () {
    },
    methods: {
      goBack () {
        this.closeChosenCasePanel()
        this.$router.go(-1)
      },
      onFocus () {
        this.closeChosenCasePanel()
        let village = this.search.village
        this.$router.push({name: 'dealSearchCache', params: {searchWord: village}})
      },
      searchList () {
        this.closeChosenCasePanel()
        this.dealVillageList = []
        this.search.pageNum = 1
        this.getDealVillageList()
      },
      loadBottom () {
        this.getDealVillageList()
        this.$refs.loadmore.onBottomLoaded()
        this.allLoaded = true
      },
      getDealVillageList () {
        let myVue = this
        let getHouseListOption = {
          url: dealVillageListPath,
          sendData: myVue.search,
          success (data) {
            let dataList = data.record
            if (dataList.length < 10) {
              myVue.$toast({
                message: '没有更多数据了',
                duration: 1000
              })
            }
            dataList.map(function (ele, idx) {
              myVue.dealVillageList.push(ele)
            })
            myVue.search.pageNum++
            myVue.allLoaded = false
          }
        }
        this.allLoaded = true
        this.post(getHouseListOption)
      },
      toDealHouseList (data) {
        let village = data.village
        this.$router.push({name: 'searchDealByHouse', params: {searchWord: village, village, district: data.district, block: data.block}})
      },
      setInput (msg) {
        this.search.village = msg
        this.showMatchList = 1
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
              openPricePanel: 0
            }
            break
          case 1 :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: !this.openPanel.openPricePanel
            }
            break
          default :
            this.openPanel = {
              openBlockPanel: 0,
              openPricePanel: 0
            }
            break
        }
      },
      closeChosenCasePanel () {
        this.openPanel = {
          openBlockPanel: 0,
          openPricePanel: 0
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
        } else {
          this.search.block = data.zoneName
          this.searchCaseList.splice(0, 1, data.zoneName)
        }
        this.chosenStatus.splice(0, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      },
      resetAvgPrice () {
        let myRange = this.averagePrice
        this.search.minPrice = 0
        this.search.maxPrice = 30000
        this.searchCaseList.splice(1, 1, '成交均价')
        this.chosenStatus.splice(1, 1, 0)
        this.resetRange(myRange)
      },
      ensureAvgPrice () {
        this.searchCaseList.splice(1, 1, this.search.minPrice + '--' + this.search.maxPrice + ' 万')
        this.chosenStatus.splice(1, 1, 1)
        this.closeChosenCasePanel()
        this.searchList()
      },
      range1Move (e) {
        let myVue = this
        let myRange = this.averagePrice
        this.moveRange(e, myRange, function () {
          myVue.search.minPrice = myRange.range1.val
          myVue.search.maxPrice = myRange.range2.val
        })
      },
      touchRange (e) {
        let myRange = this.averagePrice
        myRange.width = this.$refs.averagePrice.offsetWidth
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
      }
    }
  }
</script>
<style scoped>
  @import '../../../assets/css/searchStyle.css';
  .search-case-list li {
    width: 50%;
  }
</style>
