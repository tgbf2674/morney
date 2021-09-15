<template>
  <div class="numberPad">
    <div class="output">{{ output }}</div>
    <div class="button">
      <button @click="inputContent">1</button>
      <button @click="inputContent">2</button>
      <button @click="inputContent">3</button>
      <button @click="remove">删除</button>
      <button @click="inputContent">4</button>
      <button @click="inputContent">5</button>
      <button @click="inputContent">6</button>
      <button @click="clear">清空</button>
      <button @click="inputContent">7</button>
      <button @click="inputContent">8</button>
      <button @click="inputContent">9</button>
      <button @click="inputContent" class="zero">0</button>
      <button @click="inputContent" class="dot">.</button>
      <button @click="ok" class="ok">OK</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class NumberPad extends Vue {
  @Prop(Number) readonly value!: number;
  output = this.value.toString();

  inputContent(event: MouseEvent) {
    const button = (event.target as HTMLButtonElement);
    const input = button.textContent as string;
    if (this.output.length === 16) {
      return;
    }
    if (this.output === '0') {
      if ('01234566789'.indexOf(input) >= 0) {
        this.output = input;
      } else {
        this.output += button.textContent;
      }
      return;
    }
    if (this.output.indexOf('.') >= 0 && input === '.') {
      return;
    }
    this.output += input;
  }

  remove() {
    if (this.output.length === 1) {
      this.output = '0';
    } else {
      this.output = this.output.slice(0, -1);
    }
  }

  clear() {
    this.output = '0';
  }

  ok() {
    const number = parseFloat(this.output);
    this.$emit('update:value', number);
    this.$emit('submit', number);
    this.output = '0';
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";

.numberPad {
  background: #fafafa;

  .output {
    @extend %clearFix;
    @extend %innerShadow;
    font-size: 36px;
    font-family: Consolas, monospace;
    padding: 9px 16px;
    text-align: right;
    height: 72px;
  }

  .button {
    @extend %clearFix;
    background: rgb(245,245,245);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    position: relative;

    > button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 10px 10px;
      float: left;
      background: #fff;
      box-shadow: 0 0 3px $color-shadow;
      border: none;
      font-weight: bold;
      &.ok {
        float: right;
        width: 252px;
        border-radius: 80px;
        background-color: #1296db;
        color: #ffffff;
        font-weight: bold;
        font-size: 40px;
      }
      &.dot{
        font-size: 34px;
      }
    }
  }
}
</style>
