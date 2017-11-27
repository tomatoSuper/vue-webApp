<template>
  <div>
    <ul class="list-title clearfix">
      <li v-for="title in listTitle">{{title}}</li>
    </ul>
    <slot></slot>
    <ul class="list-content clearfix">
      <li v-for="listInfo in dataList" class="clearfix">
          <div class="list-column" v-for="(key, columnIdx) in dataKey">
            <template v-for="k in key">
              <template v-if="renderColumn[columnIdx]">
                <p :class="k" v-html="renderColumn[columnIdx](listInfo)"></p>
              </template>
              <template v-else>
                <p :class="k" v-html="listInfo[k]"></p>
              </template>
            </template>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'myDataList',
    data () {
      return {
        listTitle: [],
        renderColumn: [],
        dataKey: []
      }
    },
    props: {
      dataList: {
        type: Array,
        default: []
      }
    },
    created () {},
    mounted () {
      let myVue = this
      console.log(this.$slots)
      this.$children.forEach((ele) => {
        myVue.listTitle.push(ele.$props.title)
        console.log(ele.$props.renderColumn)
        myVue.renderColumn.push(ele.$props.renderColumn)
        myVue.dataKey.push(ele.$props.dataKey.split(','))
      })
    },
    methods: {}
  }
</script>

<style scoped>
  .list-title li {
    float: left;
    line-height:0.88rem;
    font-size:0.32rem;
    width: 20%;
  }
  .list-content li .list-column{
    float: left;
    line-height:0.48rem;
    font-size:14px;
    width: 20%;
  }
  .list-content .list-column .remark {
    line-height:0.4rem;
    color: #e02e08;
  }
</style>
