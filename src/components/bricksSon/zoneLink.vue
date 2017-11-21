<template>
  <div v-show="fadeOut" class="search-case-panel" @click.stop.prevent="closePanel">
    <div id="zoneList" class="panel clearfix" @click.stop.prevent="">
      <ul id="zoneList1">
        <li v-for="zone1 in zoneList1" class="chosen">{{zone1}}</li>
      </ul>
      <ul id="zoneList2">
        <li v-for="(zone2, indexZo2) in zoneList2" :class="zone2.zoneName === chosenIdZo2.zoneName ? 'chosen' : ''" @click.stop="renderZoneList3(zone2, indexZo2)">{{zone2.zoneName}}</li>
      </ul>
      <ul id="zoneList3">
        <li v-for="zone3 in zoneList3" :class="zone3.zoneName === chosenIdZo3.zoneName ? 'chosen' : ''" @click.stop="clickZoneList3(zone3)">{{zone3.zoneName}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'cascade',
    props: ['dataList', 'initChosen', 'value'],
    data () {
      return {
        fadeOut: this.value,
        zoneList1: ['全上海'],
        zoneList2: '',
        zoneList3: '',
        chosenIdZo2: {},
        chosenIdZo3: {},
        result: ['全上海']
      }
    },
    watch: {
      result: {
        handler (curVal, oldVal) {
          this.$emit('change', curVal)
        },
        deep: true
      },
      dataList: {
        handler (curVal, oldVal) {
          this.zoneList2 = curVal
        },
        deep: true
      }
    },
    created () {
      this.zoneList2 = this.dataList
    },
    methods: {
      renderZoneList3 (data, indexZo2) {
        try {
          data.subZone[0].id !== '' ? data.subZone.unshift({id: '', zoneName: '不限', subZone: []}) : null
        } catch (e) {}
        this.zoneList3 = data.subZone
        this.chosenIdZo2 = data
        this.chosenIdZo3 = ''
        this.result.splice(2, 1, '')
        if (indexZo2 === 0) {
          this.result.splice(1, 1, '')
          this.fadeOut = false
        } else {
          this.result.splice(1, 1, data.zoneName)
        }
      },
      clickZoneList3 (data) {
        this.chosenIdZo3 = data
        let idChosen = data.id
        if (idChosen === '') {
          this.result.splice(2, 1, '')
          this.fadeOut = false
        } else {
          this.result.splice(2, 1, data.zoneName)
          this.fadeOut = false
        }
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

</style>
