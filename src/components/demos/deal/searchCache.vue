<template>
    <div class="searchCache" :style="{height: deviceHeight+'px'}">
      <div class="search-title clearfix">
        <input type="text" id="searchWord" v-defaultFocus="true" class="searchWord" focus v-model="searchWord" @blur.stop="onBlur" @focus.stop="onFocus" @input.stop="onSearchInput">
        <a href="javascript:;" class="search-cancel" @click="cancelSearch">取消</a>
      </div>
      <ul id="history-list" v-show="showHistoryList">
        <li v-for="item in searchHistoryCache" @click.stop="setInput(item)">{{item}}</li>
        <li id="clear-history-list" @click.stop="clearHistory">清除搜索记录 (共 {{searchHistoryCache.length}} 条)</li>
      </ul>
      <ul id="match-list" v-show="showMatchList">
        <li class="clearfix" @click.stop="searchByVillage(searchWord)"><i class="ico-search"></i><a href="javascript:;">{{searchWord}}</a><span>小区</span></li>
        <li class="clearfix" @click.stop="searchByHouse(searchWord)"><i class="ico-search"></i><a href="javascript:;">{{searchWord}}</a><span>房源</span></li>
      </ul>
    </div>
</template>
<script>
  import { DEAL_SEARCH_HISTORY_CACHE_LIST_KEY, deviceHeight } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  export default {
    name: 'dealSearchCache',
    data () {
      return {
        searchWord: '',
        showHistoryList: 0,
        showMatchList: 0,
        searchHistoryCache: [],
        deviceHeight
      }
    },
    created () {
      let historyCache = cache.get(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY)
      this.searchHistoryCache = historyCache === null ? [] : historyCache.split(',')
      this.showHistoryList = this.searchHistoryCache.length
      let params = this.$route.params
      if (params.searchWord !== undefined && params.searchWord !== '') {
        this.searchWord = params.searchWord
        this.showMatchList = 1
      }
    },
    directives: {
      defaultFocus: {
        inserted (el, {value}) {
          if (value) {
            el.focus()
          }
        }
      }
    },
    methods: {
      say () {
      },
      onBlur () {
        let self = this
        setTimeout(function () {
          self.showHistoryList = 0
          self.showMatchList = 0
        }, 10)
      },
      onFocus () {
        this.showHistoryList = this.searchHistoryCache.length > 0 ? (this.searchWord === '' ? 1 : 0) : 0
        this.showMatchList = this.searchWord.length > 1 ? 1 : 0
      },
      onSearchInput () {
        this.showMatchList = this.searchWord.length > 1 ? 1 : 0
        let list = this.searchHistoryCache
        this.showHistoryList = this.searchWord.length === 0 ? (list.length ? 1 : 0) : 0
      },
      setInput (data) {
        let myVue = this
        this.searchWord = data
        this.setCache()
        setTimeout(() => {
          myVue.showMatchList = 1
        }, 20)
      },
      setCache () {
        let msg = this.searchWord
        let cacheList = this.searchHistoryCache
        let flag = cacheList.indexOf(msg) > -1
        if (!flag) {
          cacheList.push(msg)
          cacheList.length > 10 ? cacheList.shift() : null
        }
        cache.set(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY, cacheList.join(','))
      },
      clearHistory () {
        cache.del(DEAL_SEARCH_HISTORY_CACHE_LIST_KEY)
        this.searchHistoryCache = []
      },
      cancelSearch () {
        this.$router.go(-1)
      },
      searchByVillage (data) {
        let searchWord = this.searchWord
        this.setInput(data)
        this.$router.push({name: 'searchDealByVillage', params: {searchWord}})
      },
      searchByHouse (data) {
        let searchWord = this.searchWord
        this.setInput(data)
        this.$router.push({name: 'searchDealByHouse', params: {searchWord}})
      }
    }
  }
</script>
<style scoped>
  @import '../../../assets/css/searchStyle.css';
  .search-cancel {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    float: right;
    width: auto;
    padding:0 20px;
    border:1px solid #aaa;
    height:0.66rem;
    line-height:0.64rem;
    margin: 0.1rem 0.1rem;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    color: #666;
  }
  .search-cancel:active {
    background-color: #666;
    color: #ffffff;
  }
</style>
