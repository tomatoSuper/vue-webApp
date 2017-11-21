<template>
  <div class="uploadIDCard" :style="{height:deviceHeight+'px'}">
    <div class="page-top">
      <div class="header">
        <a href="javascript:;" class="goBack" @click.stop.prevent="goBack"></a>
        <h2>普通签约</h2>
      </div>
    </div>
    <div class="page-container">
      <div class="group">
        <div class="group-title">请上传身份证正面照</div>
        <div class="group-content">
          <div class="upload-box"></div>
        </div>
      </div>
      <div class="group">
        <div class="group-title">请上传身份证正面照</div>
        <div class="group-content">
          <div class="upload-box"></div>
        </div>
      </div>
      <form>
        <input type="hidden" name="frontPhoto">
        <input type="hidden" name="backPhto">
        <div class="group-content" style="margin-top: 0.72rem;">
          <button type="submit" class="btn btn-submit">确认</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import { TENANT_TOKEN, deviceHeight } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'uploadIDCard',
    data () {
      return {deviceHeight}
    },
    created () {
      let token = cache.get(TENANT_TOKEN)
//      如果获取不到token，说明是非法强跳域名过来的，那么将路由跳转去登录页
      if (token === null) {
        this.$router.push({ path: '/' })
      } else {
      }
    },
    methods: {
      goBack () {
        this.$router.push({path: '/login'})
      }
    }
  }
</script>
<style scoped>
  .uploadIDCard {
    background-color: #eeeeee;
  }
  .page-container {
    margin-top:0.9rem;
  }
  .group {
    background-color: #eeeeee;
  }
  .group-content {
    background-color: transparent;
    margin-top:0.16rem;
  }
  .group-content {
    background-color: #eeeeee;
  }
  .upload-box {
    height: 4rem;
    background-color: #fff;
    border:1px dashed #e1e1e1;
  }
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
  .btn {
    width: 100%;
    font-size:0.28rem;
    letter-spacing: 5px;
  }
</style>
