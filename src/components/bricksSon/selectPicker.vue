<template>
  <div class="cover-mask" v-show="fadeOut" @click.stop.prevnet="closeMask">
    <div class="picker-select" @click.stop.prevent="">
      <div class="btn-groups clearfix">
        <a href="javascript:;" class="btn btn-cancel" @click.stop.prevent="pickerCancel">取消</a>
        <a href="javascript:;" class="btn btn-ensure" @click.stop.prevent="pickerEnsure">确认</a>
      </div>
      <mt-picker :slots="options" :valueKey="valueKey" :visibleItemCount="3" @change="onValuesChange"></mt-picker>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'selectPicker',
      data () {
        return {
          fadeOut: this.value,
          pickedVal: ''
        }
      },
      props: ['options', 'value', 'valueKey'],
      methods: {
        onValuesChange (picker, val) {
          let myVue = this
          if (!val[0]) {
            setTimeout(() => {
              picker.setSlotValue(0, myVue.options[0].values[1])
            }, 10)
          }
          myVue.pickedVal = val
        },
        pickerCancel () {
          this.fadeOut = false
        },
        pickerEnsure () {
          let myVue = this
          this.fadeOut = false
          this.$emit('ensure', myVue.pickedVal[0])
        },
        closeMask () {
          this.fadeOut = false
        },
        showMask () {
          this.fadeOut = true
        }
      }
    }
</script>

<style scoped>
  .cover-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .btn-groups {
    /*border-bottom:1px solid #ddd;*/
    -webkit-box-shadow: 0 -1px 2px #eee, 0 1px 1px #eee;
    -moz-box-shadow: 0 -1px 2px #eee, 0 1px 1px #eee;
    box-shadow: 0 -1px 2px #eee,0 1px 1px #eee;
  }
  .btn-groups .btn {
    float: left;
    width: 50%;
    line-height:40px;
    font-size:16px;
    text-align: center;
    background-color: #fff;
    color: #FF790E;
  }
  .btn-cancel {

  }
</style>
