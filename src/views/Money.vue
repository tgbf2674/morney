<template>
  <layout class-prefix="layout">
    <NumberPad @submit="saveRecord" :value.sync="record.amount"/>
    <div class="notes">
      <FormItem field-name="备注" :value.sync="record.notes" placeholder="在这里输入备注">
        <DatePick @timeupdate="onUpdateTime"></DatePick>
      </FormItem>
    </div>
    <Tags @update:value="record.tags = $event"/>
    <Tabs :data-source="recordTypeList" :value.sync="record.type"/>
  </layout>
</template>

<script lang="ts">
import NumberPad from '@/components/Money/NumberPad.vue';
import FormItem from '@/components/Money/FormItem.vue';
import Tags from '@/components/Money/Tags.vue';
import Vue from 'vue';
import {Component,} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import DatePick from '@/components/datePick.vue';
import recordTypeList from '@/constant/recordTypeList';

// eslint-disable-next-line no-undef

@Component({
  components: {Tabs, FormItem, Tags, NumberPad,DatePick},

})
export default class Money extends Vue {
  get recordList() { return this.$store.state.recordList;}

  recordTypeList = recordTypeList;

  record: RecordItem = {tags: [], notes: '', type: '-', amount: 0, createAt: new Date().toISOString()};

  onUpdateNotes(value: string) {
    this.record.notes = value;
  }
  onUpdateTime(value: string){
    this.record.createAt = value
  }
  created() {
    this.$store.commit('fetchRecords');
  }

  saveRecord() {
    if (!this.record.tags || this.record.tags.length === 0) {
      return window.alert('请至少选择一个标签');
    }
    if (!this.record.type || this.record.type.length === 0) {
      return window.alert('请至少选择一个记账类型收入或支出');
    }
    this.$store.commit('createRecord', this.record);
    if (this.$store.state.createRecordError === null) {
      window.alert('已保存');
      this.record.notes = '';
    }
  }
}
</script>
<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;

}

.notes {
  padding: 12px 0;
}
</style>

