<template>
    <layout>
        <div class="tags">
            <router-link class="tag" v-for="tag in tags" :key="tag.id" :to="`/labels/edit/${tag.id}`">
                <span>{{tag.name}}</span>
                <Icon name="right"/>
            </router-link>
        </div>
        <div class="createTag-wrapper">
            <Button class="createTag" @click="createTag">新建标签</Button>
        </div>
    </layout>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import {TagHelper} from '@/mixins/TagHelper';
    import {mixins} from 'vue-class-component';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tagHelper = require('@/mixins/TagHelper');

    @Component({
        mixins: [tagHelper],
    })
    export default class Labels extends mixins(TagHelper) {
        get tags(){
            return this.$store.state.tagList;
        }
        beforeCreate(){
            this.$store.commit('fetchTags')
        }
    }
</script>

<style lang="scss" scoped>
    .tags {
        background: white;
        font-size: 16px;
        padding-left: 16px;

        > .tag {
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e6e5e8;

            svg {
                margin-right: 16px;
                width: 20px;
                height: 20px;
            }
        }
    }

    .createTag {
        background: #1296db;
        color: white;
        border-radius: 4px;
        border: none;
        height: 40px;
        padding: 0 16px;

        &-wrapper {
            text-align: center;
            padding: 16px;
            margin-top: 28px;
        }
    }

</style>
