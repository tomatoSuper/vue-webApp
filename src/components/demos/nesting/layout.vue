<template>
  <div>
    <myDataList :dataList="dataList">
      <listColumn title="操作" :dataKey="'buyId'" :renderColumn="renderBuyId"></listColumn>
      <listColumn title="商品id" :dataKey="'buyId'"></listColumn>
      <listColumn title="商品名称" :dataKey="'commodityName,remark,taste'"></listColumn>
      <listColumn title="品牌" :dataKey="'brands,notice'"></listColumn>
      <listColumn title="价格" :dataKey="'price'"></listColumn>
    </myDataList>
  </div>
</template>

<script>
  import myDataList from './myDataList.vue'
  import listColumn from './listColumn.vue'
  import {getRandom} from '../../../assets/js/config'

  export default {
    name: 'layout',
    components: {myDataList, listColumn},
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
    created () {},
    mounted () {
    },
    methods: {
      renderBuyId (li) {
        return '<input type="checkbox" id="' + li.buyId + '" style="-webkit-appearance: checkbox;-moz-appearance: checkbox;appearance: checkbox;">'
      }
    }
  }
</script>

<style scoped>

</style>
