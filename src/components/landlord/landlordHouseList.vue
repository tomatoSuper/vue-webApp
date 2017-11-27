<template>
    <div class="landlord-houseList" style="overflow: hidden;">.
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
            <li v-for="house in houseList">
              <div class="house-title clearfix">
                <span class="address">{{ house.village + house.blockNo + '号楼' + (house.unitNo?house.unitNo + '单元':'') + house.roomNo + '室'}}</span>
                <span class="houseNo">编码：{{house.serialNum}}</span>
                <!--'整租','合租'-->
                <i class="icon-rentType" :class="house.rentType === '整租'?'unshared' : 'shared'"></i>
              </div>
              <ul v-if="house.rentType === '合租'" class="roomList clearfix">
                <!--("空置"), ("已出租"), ("部分出租")-->
                <li v-for="room in house.children" :class="room.rentStatus === '已出租'? 'rented':'unrented'" @click.stop.prevent="goToHouseDetail(room)">
                  <i class="icon-rentStatus"></i>
                  <div>
                    <p class="roomName">{{room.door}}</p>
                    <p class="rentInfo"><span>{{room.renterName}}</span><br><span>{{room.rentalPrice}}元 / 月</span></p>
                  </div>
                </li>
              </ul>
              <template v-else>
                <ul class="roomList clearfix">
                  <li :class="house.rentStatus === '已出租'? 'rented':'unrented'" @click.stop.prevent="goToHouseDetail(house)">
                    <i class="icon-rentStatus"></i>
                    <div>
                      <p class="roomName">{{house.door}}</p>
                      <p class="rentInfo"><span>{{house.renterName}}</span><br><span>{{house.rentalPrice}}元 / 月</span></p>
                    </div>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
          <div slot="top" class="topLoading" :class="{'onLoading':topLoading}">
            <mt-spinner :class="'snakePull'" type="snake" color="#e02e08" :size="20"></mt-spinner>
          </div>
          <mt-spinner
            type="snake"
            color="#e02e08"
            :size='20'
            :class="'loadingMore'"
            v-show="bottomLoaded"
          ></mt-spinner>
          <div v-if="noMoreData" class="no-more-data">
            <span>没有更多数据了</span>
          </div>
        </mt-loadmore>
      </div>
    </div>
</template>
<script>
  // 获取token的缓存字段
  import { landlordHouseListPath, LANDLORD_INFO } from '../../assets/js/config'
  // 获取缓存对象，使用缓存方法
  import cache from '../../assets/js/cache'
  export default {
    name: 'landlordHouseList',
    data () {
      return {
        sendData: {
          page: 1,
          limit: 10,
          landlordId: ''
        },
        houseList: [],
        dataList: [],
        topLoading: false,
        bottomLoaded: false,
        noMoreData: false
      }
    },
    created () {
      console.log(landlordHouseListPath)
//      let token = cache.get(TENANT_TOKEN)
//      console.log(token)
//      if (token === null) {
//        this.$router.push({ path: '/' })
//      } else {
//      }
      this.dataList = [
        {
          id: 'xa-012312o3i12',
          houseNo: '0000001',
          village: '天河小区',
          blockNo: '11',
          unitNo: '1',
          roomNo: '101',
          address: '11号楼1单元101',
          rentType: '合租',
          children: [
          {id: 'xa-3u08u3io12', roomName: '房间A', rentStatus: '已出租', renterName: '张维真', rentalPrice: '3000'},
          {id: 'xa-3u08u3io12', roomName: '房间B', rentStatus: '已出租', renterName: '陈碧', rentalPrice: '3000'},
          {id: 'xa-3u08u3io12', roomName: '房间C', rentStatus: '已出租', renterName: '王二', rentalPrice: '1000'},
          {id: 'xa-3u08u3io12', roomName: '房间D', rentStatus: '已出租', renterName: '张三丰', rentalPrice: '5000'},
          {id: 'xa-3u08u3io12', roomName: '房间E', rentStatus: '未租', renterName: '', rentalPrice: '3200'},
          {id: 'xa-3u08u3io12', roomName: '房间F', rentStatus: '未租', renterName: '', rentalPrice: '3000'}
          ]
        },
        {
          id: 'xa-012312o3i12',
          houseNo: '0000002',
          village: '宏源小区',
          blockNo: '3',
          unitNo: '1',
          roomNo: '901',
          address: '3号楼1单元901',
          rentType: '整租',
          rentStatus: '已出租',
          renterName: '王小明',
          rentalPrice: '3000',
          children: []
        },
        {
          id: 'xa-012312o3i12',
          houseNo: '0000003',
          village: '平安小区',
          blockNo: '16',
          unitNo: '',
          roomNo: '301',
          address: '16号楼301',
          rentType: '整租',
          rentStatus: '未租',
          renterName: '',
          rentalPrice: '3000',
          children: []
        },
        {
          id: 'xa-012312o3i12',
          houseNo: '0000001',
          village: '天河小区',
          blockNo: '11',
          unitNo: '1',
          roomNo: '101',
          address: '11号楼1单元101',
          rentType: '合租',
          children: [
            {id: 'xa-3u08u3io12', roomName: '房间A', rentStatus: '已出租', renterName: '张维真', rentalPrice: '3000'},
            {id: 'xa-3u08u3io12', roomName: '房间B', rentStatus: '已出租', renterName: '陈碧', rentalPrice: '3000'},
            {id: 'xa-3u08u3io12', roomName: '房间C', rentStatus: '已出租', renterName: '王二', rentalPrice: '1000'},
            {id: 'xa-3u08u3io12', roomName: '房间D', rentStatus: '已出租', renterName: '张三丰', rentalPrice: '5000'},
            {id: 'xa-3u08u3io12', roomName: '房间E', rentStatus: '未租', renterName: '', rentalPrice: '3200'},
            {id: 'xa-3u08u3io12', roomName: '房间F', rentStatus: '未租', renterName: '', rentalPrice: '3000'}
          ]
        },
        {
          id: 'xa-012312o3i12',
          houseNo: '0000002',
          village: '宏源小区',
          blockNo: '3',
          unitNo: '1',
          roomNo: '901',
          address: '3号楼1单元901',
          rentType: '整租',
          rentStatus: '已出租',
          renterName: '李狗蛋',
          rentalPrice: '3000',
          children: []
        },
        {
          id: 'xa-012312o3i12',
          houseNo: '0000003',
          village: '平安小区',
          blockNo: '16',
          unitNo: '0',
          roomNo: '301',
          address: '16号楼301',
          rentType: '整租',
          children: []
        }
      ]
    },
    mounted () {
//      从缓存中获取房东角色的用户信息，由于要获取成对象类型的数据，所以要在第二个参数中传入 true
      let landlordInfo = cache.get(LANDLORD_INFO, true)
      this.sendData.landlordId = landlordInfo ? landlordInfo.id : ''
//      this.getHouseList()
      this.topLoading = true
      this.renderList()
    },
    methods: {
      renderList () {
        let myVue = this
        setTimeout(s => {
          if (myVue.sendData.page < 3 && myVue.sendData.page > 0) {
            this.topLoading = false
            this.dataList.forEach(function (ele) {
              myVue.houseList.push(ele)
            })
            myVue.sendData.page++
            myVue.bottomLoaded = false
          } else {
            myVue.bottomLoaded = false
            myVue.noMoreData = true
          }
        }, 1000)
      },
      getHouseList () {
        let myVue = this
        this.get({
          role: 'landlord',
          url: landlordHouseListPath,
          sendData: myVue.sendData,
          success (data) {
            console.log(data)
            if (data.page.list && data.page.list.length) {
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
              myVue.topLoading = false
              myVue.noMoreData = false
//              myVue.getHouseList()
              myVue.renderList()
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
//        this.getHouseList()
        this.renderList()
      },
      goToHouseDetail (data) {
        console.log(data)
        let id = data.id
        this.$router.push({path: '/landlordHouseDetail', query: {id}})
      }
    }
  }
</script>
<style scoped>
  .list-container {
    margin-top:1.8rem;
    padding-top:0;
  }
  .houseList {
  }
  .houseList > li {
    background-color: #fff;
  }
  .houseList > li + li {
    margin-top:10px;
  }
  .houseList .house-title {
    position: relative;
    height: 0.88rem;
    padding:0 0.3rem;
    line-height:0.88rem;
    border-bottom:1px solid #eee;
    text-align: left;
  }
  .address {
    float: none;
    font-size:0.28rem;
  }
  .houseNo {
    float: right;
    font-size:0.24rem;
    color: #808080;
  }
  .icon-rentType,.icon-rentStatus {
    position: absolute;
    right:0;
    top: 0;
  }
  .icon-rentType{
    width: 0.6rem;
    height: 0.6rem;
  }
  .icon-rentType.shared {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/flatShare2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .icon-rentType.unshared {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/entireRent2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .icon-rentStatus {
    width: 0.6rem;
    height: 0.6rem;
  }
  .roomList {
    padding-bottom:0.3rem;
  }
  .roomList li {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:0 0.12rem 0.2rem;
    float: left;
    width:27.33%;
    margin:0.2rem 3% 0;
    position: relative;
  }
  .roomName {
    color: #fff;
    height: 0.68rem;
    line-height:0.68rem;
    font-size:0.28rem;
  }
  .rentInfo {
    padding:0.2rem 0;
  }
  .rentInfo span {
    line-height:0.48rem;
  }
  .unrented .icon-rentStatus {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/unRented2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .rented .icon-rentStatus {
    background: url("http://dev-esheyi.yingjiashenghuo.com/xaImages/rented2x.png") center center no-repeat;
    -webkit-background-size: contain;
    background-size: contain;
  }
  .roomList li.rented {
    background-color: #7899E8;
  }
  .roomList li.unrented {
    background-color:#F16868;

  }
  .roomList li.rented .rentInfo{
    background-color: #BFD2FF;
    color: #2C56B9;
  }
  .roomList li.unrented .rentInfo {
    background-color: #FFA1A1;
    color: #9A1515;
  }
  .mint-loadmore {
    background-color: transparent;
  }
  .loadingMore {
    margin-top:0.16rem;
  }
</style>
