<template>
    <div class="landlordAuth form-wrapper">
        <div class="header">
          321321
        </div>
    </div>
</template>
<script>
  import { TENANT_TOKEN } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'landlordAuth',
    data () {
      return {}
    },
    created () {
      let token = cache.get(TENANT_TOKEN)
      console.log(token)
      if (token === null) {
        this.$router.push({ path: '/' })
      } else {
      }
    },
    methods: {
    }
  }
</script>
<style scoped>

</style>
