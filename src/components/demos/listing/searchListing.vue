<template>
    <div class='listing'>
      <div class="header">
        <div class="logo">
          <router-link to="/index"><img src="../../../assets/img/logo.png" alt=""></router-link>
        </div>
        <div class="search-input">
          <input type="text" v-model='search.searchWord' placeholder="请输入小区名称">
        </div>
        <div class="search-btn act-ago" @click="searchListingSubmit">搜索</div>
      </div>
      <section>
        <div class="search-record">
          <p><span>搜索记录</span><a href="javascript:;" @click="dialogueShow()"><i></i></a></p>
          <ul class="recordParent clearfix">
              <li v-for="item in searchHistoryCache" @click="getSearchHistory(item)">{{item}}</li>
          </ul>
        </div>
      </section>
    </div>
</template>
<script>
  import { LISTING_SEARCH_HISTORY_CACHE_LIST_KEY } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  var historyCache = cache.get(LISTING_SEARCH_HISTORY_CACHE_LIST_KEY, false)
  historyCache = historyCache === null ? [] : historyCache.split(',')
  export default {
    name: 'searchListing',
    data () {
      return {
        search: {
          searchWord: ''
        },
        dialogue: '是否清空搜索记录',
        searchHistoryCache: historyCache
      }
    },
    methods: {
      dialogueShow () {
        this.$messagebox.confirm(this.dialogue).then(action => {
          cache.del(LISTING_SEARCH_HISTORY_CACHE_LIST_KEY)
          this.searchHistoryCache = []
        }, () => {
          console.log('cancle')
        })
      },
      getSearchHistory (data) {
        this.$router.push({ path: '/searchListingResult', query: { village: data } })
      },
      searchListingSubmit () {
        let msg = this.search.searchWord
        let searchHistoryList = this.searchHistoryCache
        let setCache = () => {
          let flag = searchHistoryList.indexOf(msg) > -1
          !flag ? searchHistoryList.push(msg) : console.log('已缓存')
          cache.set(LISTING_SEARCH_HISTORY_CACHE_LIST_KEY, searchHistoryList.join(','))
        }
        if (this.search.searchWord !== '' && this.search.searchWord.length > 1) {
          searchHistoryList.length < 10 ? setCache() : searchHistoryList.shift() && setCache()
//          this.$router.push({ name: 'searchListingResult', params: { village: msg } })
          this.$router.push({ path: '/searchListingResult', query: { village: msg } })
        }
      }
    }
  }
</script>
<style scoped>
.listing{
  width:100%;
  height: 100%;
  color:#fff;
  font-size: .3rem;
  position: relative;
  background: #fff;
  box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
  -webkit-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
  -moz-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
}
.header{
  height: .8rem;
  line-height: .8rem;
  padding:.1rem;
  text-align: center;
  background: #fff;
  position: fixed;
  top:0;
  left: 0;
  z-index: 10;
}
.header>div{
  float: left;
  height: .8rem;
  line-height: .8rem;
  position: relative;
}
.header>.logo{
  width: 16.5%;
  height: .54rem;
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
  margin-top: .1rem;
  border-radius: .1rem;
  background:#f5f5f5;
  border:1px solid #DEDEDE;
}
section{
  padding-top: .9rem;
}
.search-input>input{
  color:#666666;
  font-size: .32rem;
  letter-spacing: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 100%;
  padding-left: 15%;
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
.header>.search-btn{
  padding:0 .06rem;
  float: right;
  font-size: .32rem;
  color:#999999;
  background: #fff;
}
.search-record>p{
  text-align: left;
  padding:.3rem .2rem;
  font-size: .3rem;
  color:#212121;
  background: #FFFFFF;
  box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
  -webkit-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
  -moz-box-shadow:0 0 1px 0 rgba(0,0,0,0.15);
  position: relative;
}
.search-record>p>a{
  position: absolute;
  top:50%;
  right: .2rem;
  padding:.15rem;
  transform:translate(0,-50%);
  -webkit-transform:translate(0,-50%);
  -moz-transform:translate(0,-50%);
}
.search-record>p>a>i{
  display: block;
  width:.3rem;
  height:.32rem;
  background: url(../../../assets/img/delete@2x.png) no-repeat center center;
  background-size: contain;
}
.recordParent{
  padding:.23rem .1rem 0;
}
.recordParent>li{
  text-align: center;
  font-size: .24rem;
  color:#666666;
  float: left;
  padding:.18rem .2rem;
  margin:.1rem;
  border-radius: .04rem;
  background: #F5F5F5 ;
}
</style>
