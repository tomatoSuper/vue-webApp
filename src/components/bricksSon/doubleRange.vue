<template>
    <div v-show="fadeOut" class="search-case-panel" @click.stop.prevent="closePanel">
      <div class="range-panel panel" @click.stop.prevent="">
        <div class="panel-content">
          <div class="range-title">{{dblRange.title}}</div>
          <div class="range-content">
            <div class="range-bar" ref="dblRange" @touchstart.stop.prevent="touchRange($event)" @touchmove.stop.prevent="range1Move($event)">
              <div class="range1" :style="{width: dblRange.range1.width + 'px'}">
                <p class="range-lump"><i>{{dblRange.range1.val}}</i></p>
              </div>
              <div class="range2" :style="{width: dblRange.range2.width + 'px'}">
                <p class="range-lump"><i>{{dblRange.range2.val}}</i></p></div>
            </div>
          </div>
        </div>
        <div class="panel-btns clearfix">
          <a href="javascript:;" class="reset" @click.stop="reset">重置</a>
          <a href="javascript:;" class="sure" @click.stop="ensure">确定</a>
        </div>
      </div>
    </div>
</template>
<script>
  import { deviceWidth } from '../../assets/js/config'
  export default {
    name: 'dblRange',
    data () {
      return {
        deviceWidth,
        fadeOut: this.value,
        dblRange: {
          title: '无标题',
          width: '',
          paddingLeft: '',
          minVal: 0,
          maxVal: 300,
          rangeDistance: '',
          range1: {
            width: 0,
            val: 0
          },
          range2: {
            width: 0,
            val: 300
          }
        }
      }
    },
    props: ['options', 'value'],
    watch: {
      options (cur) {
        let myVue = this
        myVue.dblRange = Object.assign(myVue.dblRange, cur)
      }
    },
    created () {
      let myVue = this
      myVue.dblRange = Object.assign(myVue.dblRange, myVue.options)
    },
    methods: {
      reset () {
        let myVue = this
        let myRange = this.dblRange
        this.resetRange(myRange)
        this.$emit('restRange', myVue.isShow)
      },
      ensure () {
        let myVue = this
        let rangeData = {min: myVue.dblRange.range1.val, max: myVue.dblRange.range2.val}
        this.fadeOut = false
        this.$emit('ensureRange', rangeData)
      },
      range1Move (e) {
        let myRange = this.dblRange
        this.moveRange(e, myRange, function () {
        })
      },
      touchRange (e) {
        let myRange = this.dblRange
        myRange.width = this.$refs.dblRange.offsetWidth
        myRange.paddingLeft = (deviceWidth - myRange.width) / 2
        this.moveRange(e, myRange)
      },
      moveRange (event, myRange, callback) {
        let touchPointX = event.touches[0].clientX
        let rangeBarWidth = myRange.width
        let paddingLeft = myRange.paddingLeft
        myRange.rangeDistance = rangeBarWidth - myRange.range1.width - myRange.range2.width
        let touchPointOnDistanceX = touchPointX - paddingLeft - myRange.range1.width
        if (touchPointOnDistanceX > (myRange.rangeDistance / 2)) {
          let w = parseInt(deviceWidth - touchPointX - paddingLeft)
          myRange.range2.width = w > 0 ? w : 0
          myRange.range2.val = parseInt(((rangeBarWidth - myRange.range2.width) / rangeBarWidth) * myRange.maxVal)
        } else {
          let w = parseInt(touchPointX - paddingLeft)
          myRange.range1.width = w > 0 ? w : 0
          myRange.range1.val = parseInt((myRange.range1.width / rangeBarWidth) * myRange.maxVal)
        }
        !!callback && typeof callback === 'function' && callback()
      },
      resetRange (myRange) {
        myRange.range1.width = 0
        myRange.range2.width = 0
        myRange.range1.val = 0
        myRange.range2.val = 30
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
  .range-panel {
    height: 3.8rem;
    position: relative;
  }
</style>
