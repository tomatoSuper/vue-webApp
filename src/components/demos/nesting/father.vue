<template>
  <div>
    <ul>
      <li v-for="d in dataList">
        {{d.buyId}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {getRandom} from '../../../assets/js/config'
  import son from './son.vue'
  export default {
    name: 'father',
    components: {son},
    data () {
      return {
        dataList: [
          {
            buyId: 'sp' + getRandom(),
            commodityName: '洗衣粉',
            brands: '纳爱斯',
            remark: '红色装',
            picture: '封面图片',
            price: '¥10.00'
          },
          {
            buyId: 'sp' + getRandom(),
            commodityName: '辣椒酱',
            brands: '老干妈',
            taste: '超级辣',
            picture: '封面图片',
            price: '¥18.00'
          },
          {
            buyId: 'sp' + getRandom(),
            commodityName: '滑板鞋',
            brands: '阿迪达斯',
            notice: '原厂正版',
            picture: '封面图片',
            price: '¥888.00'
          }
        ]
      }
    },
    props: {
    },
    created () {},
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
