<template>
    <div>

    </div>
</template>
<script>
  import { TENANT_TOKEN } from '../../assets/js/config'
  import cache from '../../assets/js/cache'
  export default {
    name: 'rentInfo',
    data () {
      return {}
    },
    created () {
      console.log('rentInfo')
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
