<template>
    <div class="unAuth" :style="{height:deviceHeight+'px'}">
      <div class="page-top">
        <div class="header">
          <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
          <h2>异常</h2>
        </div>
      </div>
      <div class="list-container">
        <p class="notice-img"></p>
        <p class="notice-msg">您尚未认证，请前往雄安新区 <br> 公共租赁办事处认证</p>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'unAuth',
    data () {
      return {}
    },
    created () {
    },
    methods: {
      goBack () {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
<style scoped>
  .notice-img {
    width: 3rem;
    height: 3rem;
    background-color: rgba(200, 0, 0, 0.3);
    margin: 0.8rem auto;
  }
  .notice-msg {
    font-size:0.32rem;
    text-align: center;
    color: #808080;
  }
</style>
