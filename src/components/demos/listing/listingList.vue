<template>
    <div class="listingList">
      <div class="topbar">
        <a class="back" @click="goHistory()" href="javascript:;"></a>
        <p>{{sendData.village}}</p>
        <router-link :to="{ name: 'searchDealByVillage', params: { searchWord: sendData.village}}" class="check-sale">查看成交</router-link>
      </div>
      <div class="formFilter">
        <div class="parent-list">
          <ul class="clearfix">
            <li v-for="(item, $index) in parentList" @click.stop="parentNav(item, $index)" :class="{ 'marker': parentCheckedClass[$index], 'chosen': parentSelectedClass[$index]}"><span class="show-name">{{item}}</span><span class="icon-down"></span></li>
          </ul>
        </div>
        <div class="priceToggle radioList" v-show="controlToggle.priceToggle" ref="priceToggle">
          <ul>
            <li v-for="(item,$index) in parentPrice" @click.stop="priceRadioClick(item.content,$index)" :class="radioChosen.priceChosen === item.content? 'chosen' : '' ">{{item.content}}</li>
          </ul>
        </div>
        <div class="houseTypeToggle" v-show="controlToggle.houseTypeToggle" ref="houseTypeToggle">
          <ul id="house-type">
            <li v-for="(item, $index) in parentHouseType" @click.top="checkHouseType(item, $index)" :class="{'chosen': checkedClass[$index]}"><span>{{item}}</span><i></i></li>
          </ul>
          <p class="submitFilterHouseType" @click.stop="submitFilterHouseType()" ref="submitFilterHouseType">确定</p>
        </div>
        <div class="areaToggle radioList" v-show="controlToggle.areaToggle" ref="areaToggle">
          <ul>
            <li v-for="(item, $index) in parentArea" @click.stop="areaRadioClick(item, $index)" :class="radioChosen.areaChosen === item.content? 'chosen' : '' ">{{item.content}}</li>
          </ul>
        </div>
        <div class="moreToggle" v-show="controlToggle.moreToggle" ref="moreToggle">
          <div class="price-sort">
            <p>价格排序</p>
            <ul class="price-sort-child clearfix">
              <li v-for="(item, $index) in parentMore.priceSort" @click.stop="priceSortRadioClick(item, $index)" :class="{'chosen': radioChosen.priceSortChosen[$index]}">{{item}}</li>
            </ul>
          </div>
          <div class="source-sort">
            <p>来源</p>
            <ul class="source-sort-child clearfix">
              <li v-for="(item, $index) in parentMore.sourceData" @click.stop="sourceRadioClick(item, $index)" :class="{'chosen': radioChosen.sourceChosen[$index]}">{{item}}</li>
            </ul>
          </div>
          <div class="more-footer clearfix">
            <ul>
              <li @click.stop="moreResetSubmit">重置</li>
              <li @click.stop="moreSureSubmit">确定</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mask" v-show="controlMask" @click.stop="maskClick()"></div>
      <div class="list-panel">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                     :auto-fill="false" ref="loadmore">
          <ul class="house-list">
            <li class="panel" v-for="(data, $index) in dataList">
              <router-link :to="{ path: '/listingDetail', query: {id: data.id} }">
                <div class="cover-image">
                  <img v-if="data.photo" :src="data.photo.split(',')[0]">
                  <img src="../../../assets/img/bg-initPic.png" v-else>
                </div>
                <div class="house-info">
                  <p class="houseTotalPrice"><span class="totalPrice" v-if="data.totalPrice">{{data.totalPrice}}万</span><span class="unit-price" v-if="data.unitPrice">{{data.unitPrice}}元/m²</span></p>
                  <p class="houseAddressText" v-if="data.rooms && data.halls && data.area">房型：{{data.rooms}}室{{data.halls}}厅&nbsp;&nbsp;{{data.area}}m²</p>
                  <p class="houseAddressText" v-else-if="data.rooms && data.area" >房型：{{data.rooms}}室&nbsp;&nbsp;{{data.area}}m²</p>
                  <p class="houseAreaText" v-if="data.floor && data.totalFloor">楼层：{{data.floor}}/{{data.totalFloor}}层</p>
                  <p class="housereSource" v-if="data.source">数据来源：{{data.source}}</p>
                </div>
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
  import { ListingHouseListPath, TENANT_TOKEN } from '../../../assets/js/config'
  import cache from '../../../assets/js/cache'
  export default {
    name: 'listingList',
    data () {
      return {
        searchCondition: {
          pageNo: '1',
          pageSize: '10'
        },
        allLoaded: false,
        scrollMode: 'auto',
        topStatus: '',
        bottomStatus: '',
        value: [],
        sendData: {
          token: '',
          village: '',
          minTotalPrice: '',
          maxTotalPrice: '',
          minArea: '',
          maxArea: '',
          jg: '',
          ht: '',
          source: '',
          numPerPage: 10,
          pageNum: 1
        },
        dataList: [],
        htArr: [],
        parentCheckedClass: [0, 0, 0, 0],
        parentSelectedClass: [0, 0, 0, 0],
        checkedClass: [ 0, 0, 0, 0, 0, 0, 0 ],
        parentList: ['总价', '房型', '面积', '更多'],
        parentPrice: [
          {content: '不限', minPrice: '', maxPrice: ''},
          {content: '100万以下', minPrice: '0', maxPrice: '100'},
          {content: '100-200万', minPrice: '100', maxPrice: '200'},
          {content: '200-300万', minPrice: '200', maxPrice: '300'},
          {content: '300-400万', minPrice: '300', maxPrice: '400'},
          {content: '400-500万', minPrice: '400', maxPrice: '500'},
          {content: '500-600万', minPrice: '500', maxPrice: '600'},
          {content: '600万以上', minPrice: '600', maxPrice: '1000000000'}
        ],
        parentHouseType: ['不限', '一居', '二居', '三居', '四居', '五居', '五居以上'],
        parentArea: [
          {content: '不限', minArea: '', maxArea: ''},
          {content: '50m²以下', minArea: '0', maxArea: '50'},
          {content: '50-70m²', minArea: '50', maxArea: '70'},
          {content: '70-90m²', minArea: '70', maxArea: '90'},
          {content: '90-110m²', minArea: '90', maxArea: '110'},
          {content: '110-130m²', minArea: '110', maxArea: '130'},
          {content: '130-150m²', minArea: '130', maxArea: '150'},
          {content: '150m²以上', minArea: '150', maxArea: '1000000000'}
        ],
        parentMore: {
          priceSort: ['总价最高', '总价最低', '单价最高', '单价最低'],
          sourceData: ['链家', '房多多']
        },
        marker: '',
        radioChosen: {
          priceChosen: '',
          areaChosen: '',
          priceSortChosen: [0, 0, 0, 0],
          sourceChosen: [0, 0]
        },
        controlToggle: {
          priceToggle: false,
          houseTypeToggle: false,
          areaToggle: false,
          moreToggle: false
        },
        controlMask: false
      }
    },
    mounted () {
      this.sendData.token = cache.get(TENANT_TOKEN)
      this.sendData.village = this.$route.query.id
      this.requestPost()
    },
    methods: {
      goHistory (e) {
        this.$router.go(-1)
        return false
      },
      parentNav (item, index) {
//        this.marker = item
//        this.parentCheckedClass.splice(index, 1, !this.parentCheckedClass[index])
        switch (index) {
          case 0:
            this.controlToggle = {
              priceToggle: !this.controlToggle.priceToggle,
              houseTypeToggle: false,
              areaToggle: false,
              moreToggle: false
            }
            this.controlMask = this.controlToggle.priceToggle ? 1 : 0
            this.parentCheckedClass = [!this.parentCheckedClass[index], 0, 0, 0]
//            this.marker = this.controlToggle.priceToggle ? this.parentList[0] : ''
            break
          case 1:
            this.controlToggle = {
              priceToggle: false,
              houseTypeToggle: !this.controlToggle.houseTypeToggle,
              areaToggle: false,
              moreToggle: false
            }
            this.controlMask = this.controlToggle.houseTypeToggle ? 1 : 0
            this.parentCheckedClass = [0, !this.parentCheckedClass[index], 0, 0]
//            this.marker = this.controlToggle.houseTypeToggle ? this.parentList[1] : ''
            break
          case 2:
            this.controlToggle = {
              priceToggle: false,
              houseTypeToggle: false,
              areaToggle: !this.controlToggle.areaToggle,
              moreToggle: false
            }
            this.controlMask = this.controlToggle.areaToggle ? 1 : 0
            this.parentCheckedClass = [0, 0, !this.parentCheckedClass[index], 0]
//            this.marker = this.controlToggle.areaToggle ? this.parentList[2] : ''
            break
          case 3:
            this.controlToggle = {
              priceToggle: false,
              houseTypeToggle: false,
              areaToggle: false,
              moreToggle: !this.controlToggle.moreToggle
            }
            this.controlMask = this.controlToggle.moreToggle ? 1 : 0
            this.parentCheckedClass = [0, 0, 0, !this.parentCheckedClass[index]]
//            this.marker = this.controlToggle.moreToggle ? this.parentList[3] : ''
            break
          default:
            this.controlToggle = {
              priceToggle: false,
              houseTypeToggle: false,
              areaToggle: false,
              moreToggle: false
            }
            this.controlMask = false
            this.parentCheckedClass = [0, 0, 0, 0]
//            this.marker = item
        }
      },
      priceRadioClick (item, index) {
        this.radioChosen.priceChosen = item
        this.parentList.splice(0, 1, item)
        this.controlMask = false
        if (index === 0) {
          this.sendData.minTotalPrice = ''
          this.sendData.maxTotalPrice = ''
          this.parentList.splice(0, 1, '总价')
        } else {
          this.sendData.minTotalPrice = this.parentPrice[index].minPrice
          this.sendData.maxTotalPrice = this.parentPrice[index].maxPrice
        }
        this.init()
        this.parentList[0] === '总价' ? this.parentSelectedClass.splice(0, 1, 0) : this.parentSelectedClass.splice(0, 1, 1)
        this.initPageNum()
        this.requestPost()
      },
      areaRadioClick (item, index) {
        this.radioChosen.areaChosen = item.content
        this.parentList.splice(2, 1, item.content)
        this.controlMask = false
        if (index === 0) {
          this.sendData.minArea = ''
          this.sendData.maxArea = ''
          this.parentList.splice(2, 1, '面积')
        } else {
          this.sendData.minArea = this.parentArea[index].minArea
          this.sendData.maxArea = this.parentArea[index].maxArea
        }
        this.init()
        this.parentList[2] === '面积' ? this.parentSelectedClass.splice(2, 1, 0) : this.parentSelectedClass.splice(2, 1, 1)
        this.initPageNum()
        this.requestPost()
      },
      priceSortRadioClick (item, index) {
        switch (index) {
          case 0:
            this.radioChosen.priceSortChosen = [!this.radioChosen.priceSortChosen[0], 0, 0, 0]
            this.sendData.jg = this.radioChosen.priceSortChosen[0] ? index + 1 : ''
            break
          case 1:
            this.radioChosen.priceSortChosen = [0, !this.radioChosen.priceSortChosen[1], 0, 0]
            this.sendData.jg = this.radioChosen.priceSortChosen[1] ? index + 1 : ''
            break
          case 2:
            this.radioChosen.priceSortChosen = [0, 0, !this.radioChosen.priceSortChosen[2], 0]
            this.sendData.jg = this.radioChosen.priceSortChosen[2] ? index + 1 : ''
            break
          case 3:
            this.radioChosen.priceSortChosen = [0, 0, 0, !this.radioChosen.priceSortChosen[3]]
            this.sendData.jg = this.radioChosen.priceSortChosen[3] ? index + 1 : ''
            break
          default :
            this.radioChosen.priceSortChosen = [ 0, 0, 0, 0 ]
            this.sendData.jg = ''
        }
      },
      sourceRadioClick (item, index) {
        switch (index) {
          case 0:
            this.radioChosen.sourceChosen = [!this.radioChosen.sourceChosen[0]]
            this.sendData.source = this.radioChosen.sourceChosen[0] ? '链家' : ''
            break
          case 1:
            this.radioChosen.sourceChosen = [0, !this.radioChosen.sourceChosen[1]]
            this.sendData.source = this.radioChosen.sourceChosen[1] ? '房多多' : ''
            break
          default :
            this.radioChosen.priceSortChosen = [ 0, 0, 0, 0 ]
            this.sendData.source = ''
        }
      },
      init () {
        this.controlToggle = {
          priceToggle: false,
          houseTypeToggle: false,
          areaToggle: false,
          moreToggle: false
        }
        this.parentCheckedClass = [0, 0, 0, 0]
      },
      maskClick () {
        this.controlMask = false
        this.init()
      },
      requestPost () {
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        let myVue = this
        this.post({
          url: ListingHouseListPath,
          sendData: myVue.sendData,
          success: function (data) {
            myVue.$indicator.close()
            let pageCount = data.page.pageCount
            myVue.isHaveMore(pageCount >= myVue.searchCondition.pageNo)
            if (data.record.length < 1) {
              myVue.$toast({
                message: '亲，已经很努力了，没有更多信息了~~~',
                position: 'middle',
                duration: 3000
              })
            }
            myVue.dataList = myVue.dataList.concat(data.record)
            myVue.$nextTick(function () {
              myVue.scrollMode = 'touch'
            })
          }
        })
      },
      checkHouseType (item, index) {
        if (index === 0) {
          this.parentList.splice(1, 1, '房型')
          this.checkedClass = [1, 0, 0, 0, 0, 0, 0]
          this.controlMask = false
          this.init()
          this.htArr = []
          this.sendData.ht = ''
          this.initPageNum()
          this.requestPost()
        } else {
          let type = this.htArr
          let delIndex = type.indexOf(index)
          this.checkedClass.splice(0, 1, 0)
          this.checkedClass.splice(index, 1, !this.checkedClass[index])
          delIndex > -1 ? type.splice(delIndex, 1) : type.push(index)
        }
        this.parentList[1] === '房型' ? this.parentSelectedClass.splice(1, 1, 0) : this.parentSelectedClass.splice(1, 1, 1)
      },
      submitFilterHouseType () {
        let type = this.htArr
        let self = this
        if (type.length > 1) {
          this.parentList.splice(1, 1, '多选')
        } else if (type.length === 1) {
          this.parentList.splice(1, 1, self.parentHouseType[type[0]])
        } else if (type.length < 1) {
          this.parentList.splice(1, 1, '房型')
        }
        this.parentList[1] === '房型' ? this.parentSelectedClass.splice(1, 1, 0) : this.parentSelectedClass.splice(1, 1, 1)
        this.sendData.ht = this.htArr.join('-')
        this.controlMask = false
        this.init()
        this.initPageNum()
        this.requestPost()
      },
      sortInit () {
        this.radioChosen.priceSortChosen = [0, 0, 0, 0]
        this.radioChosen.sourceChosen = [0, 0]
        this.sendData.jg = ''
        this.sendData.source = ''
        this.controlMask = false
        this.init()
      },
      moreResetSubmit () {
        this.parentSelectedClass.splice(3, 1, 0)
        this.parentList.splice(3, 1, '更多')
        this.sortInit()
        this.initPageNum()
        this.requestPost()
      },
      moreSureSubmit () {
        let type = this.parentList
        let jg = this.sendData.jg
        let source = this.sendData.source
        this.parentSelectedClass.splice(3, 1, 1)
        if (!!jg && !!source) {
          type.splice(3, 1, '多选')
        } else if (jg === '' && source === '') {
          type.splice(3, 1, '更多')
          this.parentSelectedClass.splice(3, 1, 0)
        } else if (!!jg && source === '') {
          type.splice(3, 1, this.parentMore.priceSort[jg - 1])
        } else if (!!source && jg === '') {
          type.splice(3, 1, source)
        }
        this.controlMask = false
        this.init()
        this.initPageNum()
        this.requestPost()
      },
      initPageNum () {
        this.sendData.pageNum = 1
        this.dataList = []
      },
      loadTop () {
        this.$refs.loadmore.onTopLoaded()
      },
      loadBottom () {
        this.more()
        this.$refs.loadmore.onBottomLoaded()
      },
      loadPageList () {
        this.sendData.pageNum = this.searchCondition.pageNo
        this.requestPost()
      },
      more () {
        this.searchCondition.pageNo = parseInt(this.searchCondition.pageNo) + 1
        this.sendData.pageNum = this.searchCondition.pageNo
        this.requestPost()
      },
      isHaveMore (isHaveMore) {
        this.allLoaded = true
        if (isHaveMore) {
          this.allLoaded = false
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .listingList{
    border-top:1px solid transparent;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .topbar,.check-sale{
    height: .86rem;
    line-height: .86rem;
    font-size: .3rem;
    text-align: center;
    color: #fff;
    background: #fff;
    position: relative;
  }
  .topbar{
    width: 100%;
    z-index: 1000;
    position: fixed;
    left: 0;
    top:0;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
  }
  .back{
    width: 0.24rem;
    height: 100%;
    border-top-width: 0.23rem;
    border-bottom-width: 0.23rem;
    background: url(../../../assets/img/back@2x.png) center center no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
    position: absolute;
    top: 0;
    left: 0;
    border: 0 solid rgba(255,255,255,0);
    border-right-width: .37rem;
    border-left-width: .37rem;
  }
  .topbar > p {
    width:50%;
    display:block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    text-align: center;
    margin:0 auto;
    color:#212121 ;
    font-size: .36rem;
  }
  .check-sale{
    display: block;
    color:#999999;
    font-size:.32rem;
    width: 1.5rem;
    position: absolute;
    top: 0;
    right: 5%;
  }
  .formFilter{
    position: fixed;
    top: .84rem;
    left: 0;
    width: 100%;
    z-index: 1000;
    border-top: 1px solid #F5F5F5;
    background: #fff;
  }
  .parent-list>ul>li{
    float: left;
    position: relative;
    width: 25%;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #212121;
    text-align: center;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    line-height: .88rem;
    height: .88rem;
    font-size:.2rem;
  }
  .parent-list>ul>li>span.show-name{
    display: inline-block;
    max-width: 70%;
    min-width: 35%;
    line-height: .88rem;
    height: .88rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .parent-list>ul>li>span.icon-down{
    display: inline-block;
    position: relative;
    left: .1rem;
    top: -.38rem;
    width: 0;
    height: 0;
    line-height: .88rem;
    border-top: 6px solid #a3a3a3;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  .parent-list>ul>li+li::before{
    content: "";
    position: absolute;
    width: 1px;
    height: .6rem;
    left: 0;
    top: 50%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    -moz-transform: translate(0,-50%);
    background: #F5F5F5;
  }
  .parent-list>ul>li.marker{
    color: #e02e08;
  }
  .parent-list>ul>li.marker>.show-name{
    color:#e02e08
  }
  .parent-list>ul>li.marker>.icon-down{
    border-top: 0;
    border-bottom: 6px solid #e02e08;
  }
  .parent-list>ul>li.chosen>span{
    color:#e02e08;
  }
  .radioList>ul>li{
    padding: .28rem .3rem;
    text-align: left;
    color: #333;
    font-size: .28rem;
    background: #fff;
    border-top: 1px solid #f8f8f8;
    position: relative;
  }
  .radioList>ul>li.chosen{
    color:#e02e08;
  }
  .radioList>ul>li.chosen::before{
    content: "";
    width: .36rem;
    height: .18rem;
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    -moz-transform: translate(0,-50%);
    background: url(../../../assets/img/right.png) center center no-repeat;
    background-size: 100% 100%;
  }
  .houseTypeToggle{
    position: absolute;
    width: 100%;
    z-index: 10;
    top: .88rem;
    left: 0;
  }
  .houseTypeToggle>ul>li{
    padding: .28rem .3rem;
    text-align: left;
    color: #333;
    font-size: .28rem;
    background: #fff;
    border-top: 1px solid #f8f8f8;
    position: relative;
  }
  .houseTypeToggle>ul>li>span{
    float: left;
    margin-left: 10%;
    display: block;
  }
  .houseTypeToggle>ul>li>i{
    display: block;
    width: .3rem;
    height: .3rem;
    border: 1px solid #dedede;
    border-radius: 2px;
  }
  .houseTypeToggle>ul>li.chosen{
    color:#e02e08;
  }
  .houseTypeToggle>ul>li.chosen>i{
    background: url(../../../assets/img/right.png) center center no-repeat;
    background-size: contain;
    border-color: #e02e08;
  }
  .houseTypeToggle>.submitFilterHouseType{
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    background: #e02e08;
    color: #fff;
    font-size: .3rem;
  }
  .moreToggle{
    border-top: 1px solid #F5F5F5;
  }
  .price-sort{
    padding-bottom: .4rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .price-sort>p,.source-sort>p{
    text-align: left;
    padding: .4rem .2rem;
    color: #333;
    font-size: .28rem;
  }
  .price-sort>ul>li{
    float: left;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width: calc(25% - .3rem);
    width: -webkit-calc(25% - .3rem);
    width: -moz-calc(25% - .3rem);
    padding: .2rem 0;
    margin: 0 .15rem;
    text-align: center;
    color: #666;
    font-size: .24rem;
    border-radius: .1rem;
    border: 1px solid #AAA;
  }
  .source-sort>ul>li{
    float: left;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width: calc(25% - .3rem);
    width: -webkit-calc(25% - .3rem);
    width: -moz-calc(25% - .3rem);
    padding: .2rem 0;
    margin: 0 .15rem;
    text-align: center;
    color: #666;
    font-size: .24rem;
    border-radius: .1rem;
    border: 1px solid #AAA;
  }
  .more-footer{
    padding: 1rem 0 0;
    margin: 0 auto;
  }
  .more-footer>ul>li{
    float: left;
    padding: .26rem 0;
    width: 50%;
    text-align: center;
    font-size: .28rem;
    background: #fff;
    color: #666;
    border-top: 1px solid #F5F5F5;
  }
  .more-footer>ul>li+li{
    color: #fff;
    background: #e02e08;
  }
  .moreToggle>div>ul>li.chosen{
    color: #fff;
    border-color: #e02e08;
    background: #e02e08;
  }
  .mask{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    z-index:9
  }
  /*列表样式*/
  .list-panel{
    margin-top:1.76rem;
  }
  .house-list{
    width:100%;
    height: 100%;
    color: #212121;
  }
  .house-list>li{
    height: 2.62rem;
    width:100%;
    padding: .2rem;
    background: #fff;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    zoom: 1;
    margin-bottom: 1px;
    position: relative;
  }
  .house-list>li::after{
    content: "";
    width: .2rem;
    height: .3rem;
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    -moz-transform: translate(0,-50%);
    background: url(../../../assets/img/backcopy5@2x.png) center center no-repeat;
    background-size: 100% 100%;
  }
  .cover-image{
    float: left;
    position: relative;
    background: url(../../../assets/img/bg-sub-init.png) center center no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    height: 2.2rem;
    width: 35%;
    line-height: 2.2rem;
    text-align: center;
    color: grey;
  }
  .cover-image>img{
    height:100%;
  }
  .house-info{
    float: left;
    width: 65%;
    box-sizing: border-box;
    padding: 0 .2rem;
    color: #212121;
  }
  .house-info>p{
    line-height: .52rem;
    color: #666;
    padding: 0 0 0 .24rem;
    background: #fff;
    position: relative;
    text-align: left;
    font-size: .28rem;
  }
  .house-info>p::before{
    width: .26rem;
    height: .26rem;
    content: "";
    display: block;
    position: absolute;
    top: 45%;
    left: -2%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
  }
  .houseTotalPrice>.totalPrice{
    font-size: .48rem;
    color: #FF6138;
    line-height: .48rem;
  }
  .houseTotalPrice>.unit-price{
    font-size: .24rem;
    color: #666;
    margin-left: .1rem;
    line-height: .24rem;
  }
  .houseAddressText{
    margin-top: .1rem;
  }
  .house-info>.houseAddressText::before{
    background: url(../../../assets/img/house@2x.png) center center no-repeat;
    background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
  }
  .house-info>.houseAreaText::before{
    background: url(../../../assets/img/floors@3x.png) center center no-repeat;
    background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
  }
  .house-info>.housereSource::before{
    background: url(../../../assets/img/digitial@3x.png) center center no-repeat;
    background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
  }
  .snakePull{
    display: inline-block;
  }
</style>
