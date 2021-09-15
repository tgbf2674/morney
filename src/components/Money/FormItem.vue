<template>
  <div class="formWrapper">
    <div class="formItem">
      <label>
        <span class="name">{{ this.fieldName }}</span>
        <input :value="value" @input="onValueChanged($event.target.value)" :type="type || 'text'"
               :placeholder="placeholder">
      </label>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import dayjs from 'dayjs';

@Component
export default class FormItem extends Vue {
  @Prop({default: ''}) readonly value!: string;

  @Prop({required: true}) fieldName!: string;
  @Prop() placeholder?: string;
  @Prop() type?: string;

  onValueChanged(value: string) {
    this.$emit('update:value', value);
  }

  x(isoString: string) {
    return dayjs(isoString).format('YYYY-MM-DD');
  }
}
</script>

<style lang="scss" scoped>
.formItem {
  font-size: 14px;
  padding-left: 16px;
  display: flex;
  align-items: center;
  label{
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  > div{
    flex-shrink: 0;
  }
  .name {
    padding-right: 16px;
  }

  input {
    height: 40px;
    flex-grow: 1;
    background: transparent;
    border: none;
    padding-right: 16px;
  }
}
</style>
