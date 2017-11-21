<template>
    <div class="listingResult">
      <div class="header">
        <div class="logo">
          <router-link to="/index"><img src="../../../assets/img/logo.png" alt=""></router-link>
        </div>
        <div class="search-input">
          <input type="text" v-model='search.searchWord' placeholder="请输入小区名称">
        </div>
        <div class="search-btn act-ago" @click="searchList()">搜索</div>
        <p class="listingNum">挂牌小区中查询到<span v-if="totalNum">{{totalNum}}</span><span v-else>0</span>条结果</p>
      </div>
      <div class="scroll">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                     :auto-fill="false" ref="loadmore">
          <ul class="searchListResult">
            <li v-for="item in pageList">
              <router-link :to="{ path: '/listingList', query: {id: item.village} }" class="goNext clearfix">
                <div class="village-title" v-html="item.village.replace(search.searchWord, `<span style='color: #e02e08'>`+search.searchWord+`</span>`)"></div>
                <div class="village-location">{{item.district}}-{{item.block}}</div>
                <div class="village-data">{{item.count}}条数据</div>
              </router-link>
            </li>
          </ul>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }"><mt-spinner :class="'snakePull'" type="snake" color="#e02e08" :size="20" style="margin:0 auto"></mt-spinner></span>
            <span v-show="topStatus === 'loading'">Loading...</span>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span style="line-height:100px;height: 100px" v-show="bottomStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }"><mt-spinner :class="'snakePull'" type="fading-circle" color="#e02e08" :size="28"></mt-spinner></span>
            <span v-show="bottomStatus === 'loading'">下拉加载中...</span>
          </div>
        </mt-loadmore>
      </div>
    </div>
</template>
<script>
  import { LISTING_SEARCH_HISTORY_CACHE_LIST_KEY, ListingVillageListPath, TENANT_TOKEN } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  var historyCache = cache.get(LISTING_SEARCH_HISTORY_CACHE_LIST_KEY, false)
  historyCache = historyCache === null ? [] : historyCache.split(',')
  export default {
    name: 'searchListingResult',
    data () {
      return {
        search: {
          searchWord: ''
        },
        searchHistoryCache: historyCache,
        totalNum: '',
        searchCondition: {
          pageNo: 1,
          pageSize: '10'
        },
        pageList: [],
        allLoaded: false,
        scrollMode: 'auto',
        topStatus: '',
        bottomStatus: '',
        token: ''
      }
    },
    mounted () {
      this.token = cache.get(TENANT_TOKEN)
      this.search.searchWord = this.$route.query.village
      this.loadPageList()
    },
    methods: {
      loadTop () {
        this.$refs.loadmore.onTopLoaded()
      },
      loadBottom () {
        this.more()
        this.$refs.loadmore.onBottomLoaded()
      },
      request (opt) {
        this.loadingOpen()
        let myVue = this
        this.post({
          url: ListingVillageListPath,
          sendData: { token: myVue.token, village: this.search.searchWord, numPerPage: myVue.searchCondition.pageSize, pageNum: opt },
          success: function (data) {
            myVue.loadingClose()
            if (data.record.length < 1) {
              myVue.$toast({
                message: '亲，没有更多信息了~~~',
                position: 'middle',
                duration: 3000
              })
            }
            let pageCount = data.page.pageCount
            myVue.isHaveMore(pageCount >= myVue.searchCondition.pageNo)
            myVue.totalNum = data.page.recordCount
            myVue.pageList = myVue.pageList.concat(data.record)
            myVue.$nextTick(function () {
              myVue.scrollMode = 'touch'
            })
          }
        })
      },
      loadingOpen () {
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
      },
      loadingClose () {
        this.$indicator.close()
      },
      loadPageList () {
        if (!!this.search.searchWord && this.search.searchWord.length > 1) {
          this.request(this.searchCondition.pageNo)
        }
      },
      more () {
        this.searchCondition.pageNo = parseInt(this.searchCondition.pageNo) + 1
        this.request(this.searchCondition.pageNo)
      },
      isHaveMore (isHaveMore) {
        this.allLoaded = true
        if (isHaveMore) {
          this.allLoaded = false
        }
      },
      searchList () {
        this.pageList = []
        let myVue = this
        let msg = this.search.searchWord
        let searchHistoryList = this.searchHistoryCache
        let setCache = () => {
          let flag = searchHistoryList.indexOf(msg) > -1
          !flag ? searchHistoryList.push(msg) : console.log('已缓存')
          cache.set(LISTING_SEARCH_HISTORY_CACHE_LIST_KEY, searchHistoryList.join(','))
        }
        if (this.search.searchWord !== '' && this.search.searchWord.length > 1) {
          this.loadingOpen()
          this.post({
            url: ListingVillageListPath,
            sendData: {token: myVue.token, village: this.search.searchWord, numPerPage: myVue.searchCondition.pageSize, pageNum: 1},
            success: function (data) {
              myVue.loadingClose()
              searchHistoryList.length < 10 ? setCache() : searchHistoryList.shift() && setCache()
              myVue.totalNum = data.page.recordCount
              if (data.record.length < 1) {
                myVue.$toast({
                  message: '亲，没有查到您输入的小区，换个试试~~~',
                  position: 'middle',
                  duration: 3000
                })
              }
              myVue.pageList = data.record
            }
          })
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .snakePull{
    display: inline-block;
  }
  .listingResult{
    width:100%;
    height: 100%;
    color:#fff;
    font-size: .3rem;
    position: relative;
    /*box-shadow:0 0 1px 0 rgba(0,0,0,0.15);*/
    /*-webkit-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);*/
    /*-moz-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);*/
  }
  .header{
    height: 1.9rem;
    line-height: .9rem;
    text-align: center;
    background: #fff;
    position: fixed;
    top:0;
    left: 0;
    z-index: 10;
  }
  .header>div{
    float: left;
    position: relative;
  }
  .header>.logo{
    width: 16.5%;
    height: .54rem;
    padding: .1rem 0 .1rem .1rem;
  }
  .logo>a>img{
    width:100%;
    height: 100%;
  }
  .header .search-input{
    width:69%;
    height: .6rem;
    line-height: .6rem;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    margin: 0 .1rem;
    margin-top: .2rem;
    border-radius: .1rem;
    background:#f5f5f5;
    border:1px solid #DEDEDE;
  }
  .header>.search-btn{
    padding:0 .06rem;
    font-size: .32rem;
    color:#999999;
    background: #fff;
    position: absolute;
    top: 0;
    right: .1rem;

  }
  .search-input::before{
    content: "";
    position: absolute;
    top: 50%;
    left: 4%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    width: .4rem;
    height: .4rem;
    background: url(../../../assets/img/search@2x.png) center center no-repeat;
    background-size: contain;
  }
  .listingNum{
    float: left;
    width: calc(100% - .2rem);
    width: -webkit-calc(100% - .2rem);
    width: -moz-calc(100% - .2rem);
    padding-left: .2rem;
    margin: .2rem 0;
    font-size: .28rem;
    background: #fff;
    color: grey;
    text-align: left;
  }
  .listingNum > span {
    color: #e02e08;
  }
  .scroll{
    height: calc(100% - 1.9rem );
    height: -webkit-calc(100% - 1.9rem );
    height: -moz-calc(100% - 1.9rem );
    padding-top: 1.9rem;
  }
  .searchListResult > li{
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    color: #0F0F0F;
    padding: 0 .2rem;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: .32rem;
    margin: 1px 0;
    background: #fff;
    position: relative;
  }
  .searchListResult>li::after{
    content: '';
    position: absolute;
    top: 50%;
    right: 3%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    width: .16rem;
    height: .3rem;
    background: url(../../../assets/img/backcopy5@2x.png) center center no-repeat;
    background-size:100% 100%;
    clear: both;
  }
  .searchListResult>li>.goNext>div{
    float: left;
    text-align: center;
  }
  .searchListResult>li>a>.village-title{
    width:35%;
    text-align: left;
    font-size: .3rem;
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .village-location{
    margin-left: .6rem;
    font-size: .3rem;
  }
  .searchListResult>li>a>.village-data{
    float:right;
    margin-right: 5%;
    font-size: .28rem;
    color: #999999;
  }
</style>
