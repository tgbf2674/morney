<template>
  <div>
    <div @click="showPopup" class="dateWrapper">
      {{ now }}
      <span>▼</span>
    </div>
    <div class="iconWrapper">
    </div>
    <Popup position="bottom" round v-model="show" :style="{ height: '60%' }">
      <DatetimePicker type="date" @confirm="check" v-model="currentDate" :min-date="minDate" :max-date="maxDate"
                      title="选择年月日"/>
    </Popup>
  </div>
</template>

<script>
import {Popup, DatetimePicker} from 'vant'
import "vant/lib/popup/style"
import "vant/lib/datetime-picker/style"
import dayjs from 'dayjs'

export default {
  name: 'datePick',
  components: {Popup, DatetimePicker},
  data: () => {
    return {
      show: false,
      now: dayjs().format('MM月DD日'),
      minDate: new Date(2018, 0, 1),
      currentDate: new Date(),
      maxDate: new Date()
    }
  },
  methods: {
    check(value){
      this.show = false
      this.now= dayjs(value.toISOString()).format('MM月DD日')
      this.$emit('timeupdate',value.toISOString())
    },
    showPopup(){
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.dateWrapper {
  background: #e8e8e8;
  display: inline-block;
  padding: 3px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 10px;
span {
  color: #bfbdbd;
}
}
</style>
