<template>
  <div class="list-container">
    <mt-loadmore
      @top-status-change="topStatusChange"
      :topDistance="40"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="bottomLoaded"
      :auto-fill="false"
      ref="loadmore">
      <ul class="leaseList">
        <li v-for="lease in leaseList" style="background-color: #fff;line-height: 0.88rem;" @click.stop.prevent="goToLeaseDetail(lease)">
          <p class="lease-title clearfix">
            <span class="house-address">{{lease.leaseAddress}}</span>
            <span class="lease-status" :class="lease.contractStatus ==='0'?'warning':lease.contractStatus ==='1'?'info':'default'">{{contractStatusList[lease.contractStatus]}}</span>
          </p>
          <div class="lease-content">
            <p>编码：{{lease.contractNo}}</p>
            <p>租客姓名：{{lease.tenantName}}</p>
            <!--<p>租约时间：{{lease.contractValidityStartTime | date}} &#45;&#45; {{lease.contractValidityEndTime | date}}</p>-->
            <p>租约时间：{{lease.contractValidityStartTime}}</p>
          </div>
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
</template>
<script>
  import { LANDLORD_TOKEN, LANDLORD_INFO, renterLeaseListPath, contractStatusList } from '../../assets/js/config'
  // 获取缓存对象，使用缓存方法
  import cache from '../../assets/js/cache'
  export default {
    name: 'leaseList',
    data () {
      return {
        contractStatusList,
        sendData: {
          role: 'landlord',
          order: 'asc',
          sidx: '',
//          id: '',
          page: 1,
          limit: 10
        },
        leaseList: [],
        dataList: [],
        noMoreData: false,
        topLoading: false,
        bottomLoaded: false
      }
    },
    created () {
      let token = cache.get(LANDLORD_TOKEN)
      console.log(token)
//      if (token === null) {
//        this.$router.push({ path: '/' })
//      } else {}
      this.dataList = [
        {
          leaseAddress: '天河小区19号楼2单元 101室',
          contractStatus: '0',
          tenantName: '张维真',
          contractValidityStartTime: '2017/11/13-2018/11/12',
          contractNo: 'XAFY09765'
        },
        {
          leaseAddress: 'ewq小区19号楼2单元 101室',
          contractStatus: '0',
          tenantName: '王麻子',
          contractValidityStartTime: '2017/11/13-2018/11/12',
          contractNo: 'XAFY09765'
        },
        {
          leaseAddress: 'ss小区19号楼2单元 101室',
          contractStatus: '1',
          tenantName: '张小泉',
          contractValidityStartTime: '2017/11/13-2018/11/12',
          contractNo: 'XAFY09765'
        },
        {
          leaseAddress: '和谐小区19号楼2单元 101室',
          contractStatus: '2',
          tenantName: '李二狗',
          contractValidityStartTime: '2017/11/13-2018/11/12',
          contractNo: 'XAFY09765'
        },
        {
          leaseAddress: '共康小区19号楼2单元 101室',
          contractStatus: '0',
          tenantName: '郭德纲',
          contractValidityStartTime: '2017/11/13-2018/11/12',
          contractNo: 'XAFY09765'
        }
      ]
    },
    mounted () {
//      从缓存中获取房东角色的用户信息，由于要获取成对象类型的数据，所以要在第二个参数中传入 true
      let landlordInfo = cache.get(LANDLORD_INFO, true)
      console.log(landlordInfo)
//      this.sendData.id = landlordInfo.id
//      this.getLeaseList()
      this.topLoading = true
      this.renderList()
    },
    methods: {
      renderList () {
        let myVue = this
        console.log(myVue.sendData.page)
        setTimeout(s => {
          if (myVue.sendData.page < 3 && myVue.sendData.page > 0) {
            this.topLoading = false
            this.dataList.forEach(function (ele) {
              myVue.leaseList.push(ele)
            })
            myVue.sendData.page++
            myVue.bottomLoaded = false
          } else {
            myVue.bottomLoaded = false
            myVue.noMoreData = true
          }
        }, 1000)
      },
      getLeaseList () {
        let myVue = this
        this.get({
          url: renterLeaseListPath,
          sendData: myVue.sendData,
          success (data) {
            if (data.page && data.page.list && data.page.list.length) {
              data.page.list.forEach(function (ele) {
                myVue.leaseList.push(ele)
              })
              myVue.sendData.page++
              myVue.bottomLoaded = false
            } else {
              myVue.bottomLoaded = false
              myVue.noMoreData = true
            }
          }
        })
      },
      topStatusChange (status) {
        let myVue = this
        if (status === 'drop') {
          if (!this.topLoading) {
            this.topLoading = true
            setTimeout(s => {
              myVue.sendData.page = 1
              myVue.leaseList = []
              myVue.topLoading = false
              myVue.noMoreData = false
//              myVue.getLeaseList()
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
//        this.getLeaseList()
        this.renderList()
      },
      goToLeaseDetail (data) {
        let id = data.id
        let status = data.status
        this.$router.push({path: '/contractInfo', query: {id, status, roleName: 'landlord'}})
      }
    }
  }
</script>
<style scoped>
  .list-container {
    margin-top:2rem;
    padding-top:0;
    /*margin-bottom:1.2rem;*/
  }
  .leaseList {
  }
  .leaseList li {
    text-align: left;
    background-color: #ffffff;
    line-height:0.66rem;
  }
  .leaseList li .lease-title {
    padding:0 0.4rem;
    border-bottom:1px solid #eee;
  }
  .house-address {
    float: left;
    font-size:0.28rem;
  }
  .lease-status {
    float: right;
  }
  .leaseList li .lease-content {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:0 0.4rem;
    font-size:0.28rem;
    color: #808080;
  }
  .leaseList li + li {
    margin-top:0.2rem;
  }
  .lease-status.warning {
    color: #F23939;
  }
  .lease-status.default {
    color: #808080;
  }
  .lease-status.info {
    color: #6DC50D;
  }
  .mint-loadmore {
    background-color: transparent;
  }
  .loadingMore {
    margin-top:0.16rem;
  }
</style>
