<template>
  <div class="tags">
    <div class="new">
      <button @click="createTag">新增标签</button>
    </div>
    <ul class="current" v-if="selectedTag">
      <li v-for="tag in tagList" :key="tag.id" @click="toggle(tag)"
          :class="{selected: selectedTags[0].name === tag.name}">
        <div>
          <Icon :name="setName(tag)"></Icon>
        </div>
        {{ tag.name }}
      </li>
      <li>
        <div>
          <router-link to="/labels">
            <Icon name="edit"/>
          </router-link>
        </div>
        编辑标签
      </li>
    </ul>
    <ul class="current" v-else>
      <li v-for="tag in tagList" :key="tag.id" :class="{selected:selectedTags.indexOf(tag)>=0}" @click="toggle(tag)">
        <div>
          <Icon :name="setName(tag)"/>
        </div>
        {{ tag.name }}
      </li>
      <li>
        <div>
          <router-link to="/labels">
            <Icon name="edit"/>
          </router-link>
        </div>
        编辑标签
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Prop} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {TagHelper} from '@/mixins/TagHelper';
import {setName} from '@/lib/setName'
@Component
export default class Tags extends mixins(TagHelper) {
  selectedTags: string[] = [];

  @Prop(Object)
  selectedTag!: Tag

  @Prop(String)
  readonly show!: string

  setName(tag: Tag){
    return setName(tag)
  }

  get tagList() {
    return this.$store.state.tagList;
  }

  created() {
    this.$store.commit('fetchTags');
    if(this.selectedTag){
      this.toggle(this.selectedTag)
    }
  }

  toggle(tag: string) {
    const length = this.selectedTags.length
    if(length>0){
      this.selectedTags.pop()
    }
    this.selectedTags.push(tag)
    this.$emit('update:value', this.selectedTags);
  }
}
</script>

<style lang="scss" scoped>
.router {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.current::-webkit-scrollbar {
  display: none
}

.tags {
  background: white;
  font-size: 14px;
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column-reverse;

  > .current {
    display: flex;
    flex-wrap: wrap;
    padding-top: 4px;
    overflow-x: auto;
    list-style: none;
    margin-left: -6px;
    -webkit-tap-highlight-color: rgba(0,0,0,0);

    > li {
      align-items: center;
      display: flex;
      flex-direction: column;
      white-space: nowrap;
      padding: 0 8px;
      margin-right: 6px;
      margin-top: 4px;
      color: gray;
      font-size: 12px;
      svg{
        width: 27px;
        height: 23px;
        fill: #c4c4c4;
        display: block;
        margin-bottom: 3px;
      }
      &.selected {
        .icon{
          fill: #1296db;
        }
      }
    }
  }

  > .new {
    padding-top: 16px;

    button {
      background: transparent;
      border: none;
      color: #999;
      border-bottom: 1px solid;
      padding: 0 4px
    }
  }
}
</style>
