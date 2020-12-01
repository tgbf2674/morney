<template>
    <layout>
        <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>
            <ol v-if="groupedList.length>0">
                <li v-for="(group,index) in groupedList" :key="index">
                    <h3 class="title">{{beautify(group.title)}} <span>￥{{group.total}}</span></h3>
                    <ol>
                        <li class="record" v-for="item in group.items" :key="item.id">
                            <span>{{tagString(item.tags)}}</span>
                            <span class="notes">{{item.notes}}</span>
                            <span>￥{{item.amount}} </span>
                        </li>
                    </ol>
                </li>
            </ol>
        <div v-else class="noResult">
            目前没有相关记录
        </div>
    </layout>
</template>
<style lang="scss" scoped>
    %item{
        padding: 0 16px;
        min-height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .title{
        @extend %item;
    }
    .record{
        background: white;
        @extend %item;

    }
    .notes{
        margin-right: auto;
        margin-left: 16px;
        color: #999999;
    }
</style>
<script lang="ts">
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import Tabs from '@/components/Tabs.vue';
    import recordTypeList from '@/constant/recordTypeList';
    import dayjs from 'dayjs';
    import clone from '@/lib/clone';

    @Component({
        components: {Tabs},
    })
    export default class Statistics extends Vue {
        tagString(tags: Tag[]){
            return tags.length ===0? '无' : tags.map(t=>t.name).join('，')
        }
        beautify(string: string){
            const now = new Date();
            if(dayjs(string).isSame(now,'day')){
                return '今天';
            }else if(dayjs(string).isSame(now.valueOf() - 86400*1000,'day')){
                return '昨天';
            }else if(dayjs(string).isSame(dayjs().subtract(2,'day'),'day')){
                return '前天';
            }else if(dayjs().isSame(dayjs(),'year')){
                return dayjs().format('M月D日');
            }
            else{
                return dayjs().format('YYYY年M月D日');
            }
        }
        get recordList(){
            return  (this.$store.state as RootState).recordList;
        }

        get groupedList() {
            const {recordList} = this;
            const newList = clone(recordList).filter(r=>r.type===this.type).sort((a,b)=>dayjs(b.createAt).valueOf() - dayjs(a.createAt).valueOf());
            if(newList.length===0){return []}
            type Result = {title: string ; total?: number;items: RecordItem[]}[]
            const result: Result = [{title: dayjs(newList[0].createAt).format('YYYY-MM-DD'),items: [newList[0]]}];
            for (let i=0;i<newList.length;i++){
                const current = newList[i];
                const last = result[result.length-1];
                if (dayjs(last.title).isSame(dayjs(current.createAt),'day')){
                    last.items.push(current)
                }else{
                    result.push({title: dayjs(current.createAt).format('YYYY-MM-DD'),items: [current]})
                }
            }
            result.map(group=>{
                group.total = group.items.reduce((sum,item)=>sum+item.amount,0);
            });
            return result;
        }

        beforeCreate(){
            this.$store.commit('fetchRecords')
        }

        type = '-';
        recordTypeList = recordTypeList;
    }
</script>

<style lang="scss" scoped>
    .noResult{
        padding: 16px;
        text-align: center;
    }
    ::v-deep {
        .type-tabs-item {
            background: white;

            &.selected {
                background: #1296db;

                &::after {
                    display: none;
                }
            }
        }

        .interval-tabs-item {
            height: 48px;

        }
    }
</style>
