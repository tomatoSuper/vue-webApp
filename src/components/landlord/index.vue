<template>
    <div class="landlord-container">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="toIndex"></a>
          <h2>Role_A列表</h2>
        </div>
        <ul class="tabBar clearfix">
          <li v-for="tab in tabList" :class="tab.code === search.type? 'chosen':''" @click.stop.prevent="checkAuthStatus(tab)"><span>{{tab.text}}</span></li>
        </ul>
      </div>
      <transition name="transform">
        <router-view></router-view>
      </transition>
    </div>
</template>
<script>
  import { LANDLORD_TOKEN } from '../../assets/js/config'
  // 获取缓存对象，使用缓存方法
  import cache from '../../assets/js/cache'
  export default {
    name: 'landlord',
    data () {
      return {
        search: {
          type: '1'
        },
        tabList: [{text: '房源', code: '1'}, {text: '租约', code: '2'}]
      }
    },
    created () {
      if (this.$route.path === '/landlord') {
        this.search.type = '1'
      } else {
        this.search.type = '2'
      }
      let landlordToken = cache.get(LANDLORD_TOKEN)
      console.log(landlordToken)
    },
    methods: {
      toIndex () {
        this.$router.push({ path: '/' })
      },
      checkAuthStatus (data) {
        this.search.type = data.code
        if (data.code === '2') {
          this.$router.push({ path: '/landlord/leaseList' })
        } else {
          this.$router.push({ path: '/landlord' })
        }
      }
    }
  }
</script>
<style scoped>
  .tabBar {
    background-color: #fff;
    margin-top:1px;
  }
  .tabBar >li {
    float: left;
    width:45%;
    margin:0 2.5%;
    font-size:0.28rem;
  }
  .tabBar >li span {
    display: inline-block;
    line-height: 0.88rem;
    padding:0 0.3rem;
  }
  .tabBar >li.chosen {
    color: #FF790E;
  }
  .tabBar >li.chosen span {
    border-bottom:1px solid #FF790E;
  }
</style>
