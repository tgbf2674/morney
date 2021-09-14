<template>
  <div class="tabsWrapper">
    <ul class="tabs" :class="{[classPrefix+'-tabs']: classPrefix}">
      <li v-for="item in dataSource" :key="item.value" class="tabs-item"
          :class="liClass(item)" @click="select(item)">{{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

type DataSourceItem = { text: string; value: string }
@Component
export default class Tabs extends Vue {
  @Prop({required: true, type: Array})
  dataSource!: DataSourceItem[];
  @Prop(String)
  readonly value!: string;
  @Prop(String)
  classPrefix?: string;
  @Prop({type: String, default: '64px'})
  height!: string;

  liClass(item: DataSourceItem) {
    return {
      [this.classPrefix + '-tabs-item']: this.classPrefix,
      selected: item.value === this.value
    };
  }

  select(item: DataSourceItem) {
    this.$emit('update:value', item.value);
  }
}
</script>

<style lang="scss" scoped>
.tabsWrapper {
  background: #1296db;
  height: 60px;
  display: flex;
  align-items: center;

  .tabs {
    display: flex;
    text-align: center;
    font-size: 20px;
    width: 40%;
    margin: 0 auto;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    border-collapse: collapse;
    color: white;
    .tabs-item:first-of-type {
      width: 50%;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 4px 0 0 4px;
    }

    .tabs-item:last-of-type {
      width: 50%;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 0 4px 4px 0;
    }

    .selected {
      color: #1296db;
      background: white;
    }
  }
}

</style>
