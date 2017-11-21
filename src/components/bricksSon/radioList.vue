<template>
    <div v-show="fadeOut" class="search-case-panel" @click.stop.prevent="closePanel">
      <div class="panel" @click.stop.prevent="">
        <ul class="clearfix">
          <template v-for="payType in dataList">
            <li :class="payType === chosen.name? 'chosen':''"  @click.stop.prevent="getData(payType)">{{payType}}</li>
          </template>
        </ul>
        <div class="panel-btns clearfix">
          <a href="javascript:;" class="reset" @click.stop="reset">重置</a>
          <a href="javascript:;" class="sure" @click.stop="ensure">确定</a>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'radioList',
    props: ['dataList', 'value'],
    data () {
      return {
        fadeOut: this.value,
        chosen: {}
      }
    },
    methods: {
      getData (data) {
        this.chosen = {name: data}
      },
      reset () {
        this.chosen = {}
        this.$emit('resetRadio')
      },
      ensure () {
        this.fadeOut = false
        let myVue = this
        this.$emit('change', myVue.chosen)
      },
      closePanel () {
        this.fadeOut = false
      },
      openPanel () {
        this.fadeOut = true
      }
    }
  }
</script>
<style scoped>
  .panel {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:0.2rem 0.2rem 0;
    height:3.8rem;
  }
  li {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    float: left;
    width: 30.33%;
    margin:0.2rem 1.5%;
    line-height:0.62rem;
    font-size:0.24rem;
    border-radius: 6px;
    -webkit-border-radius: 6px;
    background-color: #fff;
    border:1px solid #e02e08;
    color: #e02e08;
  }
  li.chosen {
    background-color: #e02e08;
    color: #fff;
  }
</style>
