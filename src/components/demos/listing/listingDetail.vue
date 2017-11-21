<template>
    <div class="listingDetail">
      <div class="topbar">
        <a class="back" @click="goHistory()" href="javascript:;"></a>
        <p>{{dataSource.village}}</p>
      </div>
      <section class="main">
        <div class="slider">
          <mt-swipe :auto="4000" :showIndicators="false" @change="handleChange">
            <template v-for="photo in photos">
              <mt-swipe-item>
                <img v-if="photo" :src="photo" alt="">
                <img src="../../../assets/img/bg-initPic.png" v-else alt="">
              </mt-swipe-item>
            </template>
          </mt-swipe>
          <div class="counting"><span class="current-index">{{activeIndex}}</span> / <span class="total-count">{{photoCount}}</span></div>
        </div>
        <div class="summary">
            <ul class="summary-info clearfix">
              <li><label class="sub-title">售价</label><br><span v-if="dataSource.totalPrice">{{dataSource.totalPrice}}万</span><span v-else>暂无</span></li>
              <li><label class="sub-title">户型</label><br><span v-if="dataSource.rooms || dataSource.halls">{{dataSource.rooms}}室{{dataSource.halls}}厅</span><span v-else>暂无</span></li>
              <li><label class="sub-title">面积</label><br><span v-if="dataSource.area">{{dataSource.area}}m²</span><span v-else>暂无</span></li>
            </ul>
        </div>
        <ul class="detail-list">
          <li><b style="font-size: .4rem">房屋信息</b></li>
          <li class="double-item">
            <div><b>楼层&nbsp;:&nbsp;</b><span v-if="dataSource.floor && dataSource.totalFloor">{{dataSource.floor}}/{{dataSource.totalFloor}}层</span><span v-else>暂无</span></div>
            <div><b>朝向&nbsp;:&nbsp;</b><span v-if="dataSource.orientation">{{dataSource.orientation}}</span><span v-else>暂无</span></div>
          </li>
          <li class="double-item">
            <div><b>装修&nbsp;:&nbsp;</b><span>暂无</span></div>
            <div><b>年代&nbsp;:&nbsp;</b><span v-text="dataSource.buildYear?dataSource.buildYear+'年' : '暂无'"></span></div>
          </li>
          <li><div><b>配套设施：</b><span>暂无</span></div></li>
          <li><b style="font-size: .4rem">小区信息</b></li>
          <li class="double-item">
            <div style="position: relative;"><b>小区名称&nbsp;:&nbsp;</b><span class="village-name" v-text="dataSource.village?dataSource.village : '暂无'"></span></div>
            <div><b>本月均价&nbsp;:&nbsp;</b><span>暂无</span></div>
          </li>
          <li><div><b>物业类型&nbsp;:&nbsp;</b><span>暂无</span></div></li>
          <li><div><b>物业公司&nbsp;:&nbsp;</b><span>暂无</span></div></li>
          <li class="clearfix" style="height: auto;">
            <div><b>小区地址：&nbsp;&nbsp;</b></div>
            <div class="address" v-if="dataSource.district && dataSource.block && dataSource.village">{{dataSource.district}}{{dataSource.block}}{{dataSource.village}}</div>
            <div class="address" v-else>暂无</div>
          </li>
        </ul>
      </section>
    </div>
</template>

<script>
    import { ListingDetailPath, TENANT_TOKEN } from '../../../assets/js/config'
    import cache from '../../../assets/js/cache'
    export default {
      name: 'listingDetail',
      data () {
        return {
          activeIndex: 1,
          photoCount: 0,
          photos: [],
          dataSource: {},
          sendData: {}
        }
      },
      mounted () {
        let id = this.$route.query.id
        const token = cache.get(TENANT_TOKEN)
        this.sendData = {token, id}
        let myVue = this
        this.post({
          url: ListingDetailPath,
          sendData: myVue.sendData,
          success: function (data) {
            myVue.dataSource = data.record
            myVue.photos = data.record.photo ? data.record.photo.split(',') : ['']
            let len = myVue.photos.length
            myVue.photoCount = len > 0 ? len : 0
          }
        })
      },
      methods: {
        goHistory (e) {
          this.$router.go(-1)
          return false
        },
        handleChange (index) {
          this.activeIndex = index + 1
        }
      }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .topbar{
    height: .86rem;
    line-height: .86rem;
    font-size: .3rem;
    text-align: center;
    color: #fff;
    background: #fff;
    position: relative;
  }
  .topbar{
    height: .86rem;
    line-height: .86rem;
    font-size: .3rem;
    text-align: center;
    color: #fff;
    background: #fff;
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
  .main{
    margin-top: .86rem;
  }
  .slider{
    height: 5rem;
    line-height:5rem;
    position: relative;
  }
  .counting{
    background: rgba(0,0,0,.3);
    width: 15%;
    bottom: 0;
    right: 0;
    height: .64rem;
    font-size: .28rem;
    color: #FFF;
    line-height: .64rem;
    position: absolute;
  }
  .summary{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: .24rem .3rem;
    background-color: #fff;
    box-shadow: 0 0 1px 0 rgba(0,0,0,.15);
    text-align: center;
  }
  .summary-info{
    margin-top:.3rem;
  }
  .summary-info>li{
    float: left;
    width: 33.33%;
  }
  .summary-info>li>label{
    font-size: .35rem;
    color: #212121;
    line-height: .5rem;
  }
  .summary-info>li>span{
    font-size: .28rem;
    color: #FF6138;
    line-height: .44rem;
  }
  .detail-list{
    margin: .2rem 0 0 0;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.15);
    text-align: left;
  }
  .detail-list>li{
    padding: 0 .3rem;
    height: .88rem;
    line-height: .88rem;
    background-color: #FFF;
  }
  .detail-list>li+li{
    margin-top:1px;
  }
  .detail-list>li>div{
    float: left;
    color: #212121;
    font-size: .28rem;
    height: .88rem;
    line-height: .88rem;
  }
  .detail-list>li.double-item>div{
    width:50%;
  }
  .detail-list>li>div>span{
    color:gray;
  }
  .detail-list>li>div.address{
    width:74%;
    height:auto;
    padding:0.2rem 0;
    line-height:.44rem;
    color:gray;
  }
  .detail-list>li.double-item>div>.village-name{
    width: 2rem;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(0,-50%);
    -webkit-transform: translate(0,-50%);
    -moz-transform: translate(0,-50%);
  }

</style>
