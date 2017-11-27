<template>
  <div></div>
</template>

<script>
  export default {
    name: 'listColumn',
    props: {
      dataKey: {
        type: String || Array,
        default: '' || []
      },
      title: {
        type: String,
        default: ''
      },
      renderColumn: {
        type: Function,
        default: null
      }
    }
  }
</script>

<style scoped>

</style>
