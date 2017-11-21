<template>
    <div class="layout" :style="{height:deviceHeight+'px'}">
        <div class="main">
          <p class="title">欢迎使用雄安租房</p>
          <p><a class="deal-search" @click="toLanlord" href="javascript:;"><img src="../assets/img/ico-deal.png" alt=""></a><span>我是房东</span></p>
          <p><a class="listing-search" @click="toRenter" href="javascript:;"><img src="../assets/img/ico-listing.png" alt=""></a><span>我是租客</span></p>
        </div>
        <p class="footer">©2017 研耀(上海)信息科技有限公司</p>
    </div>
</template>
<script>
  import { TENANT_TOKEN, LANDLORD_TOKEN, deviceHeight } from '../assets/js/config'
  import cache from '../assets/js/cache'
  export default {
    name: 'index',
    data () {
      return {
        deviceHeight,
        token: {
          landlord: '',
          renter: ''
        }
      }
    },
    created () {
      this.token.renter = cache.get(TENANT_TOKEN)
      this.token.landlord = cache.get(LANDLORD_TOKEN)
    },
    methods: {
      toLanlord () {
        this.token.landlord ? this.$router.push({ path: '/landlord' }) : this.$router.push({ path: '/login/LANDLORD' })
      },
      toRenter () {
        this.token.renter ? this.$router.push({ path: '/renter' }) : this.$router.push({ path: '/login/TENANT' })
//        this.$router.push({ path: '/renter' })
      }
    }
  }
</script>
<style scoped>
  .layout {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: url("../assets/img/indebg.png") center center no-repeat;
    background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
    overflow: hidden;
    position: relative;
  }
  .main {
    width: 90%;
    padding-bottom: 1.8rem;
    background: url("../assets/img/hangbg.png") center center no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
  .main > p {
    padding-top: .8rem;
  }
  .main > .title {
    height: 1rem;
    line-height: 1rem;
    padding-top: .96rem;
    font-size: .48rem;
    text-align: center;
    color: #404040;
  }
  .main > p > a {
    height: 2rem;
    width: 2rem;
    line-height: 2rem;
    border-radius: .1rem;
    margin: 0 auto;
    display: block;
    font-size: .4rem;
    text-align: center;
    color: #fff;
  }
  .main > p > span {
    display: block;
    margin: .3rem auto 0;
    text-align: center;
    color: #555;
    font-size: .32rem;
  }
  .footer {
    position: absolute;
    width: 100%;
    left:0;
    bottom:5%;
    text-align: center;
    color: #fff;
  }
</style>
