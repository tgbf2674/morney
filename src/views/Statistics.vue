<template>
    <Layout>
        <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>
        <div class="chart-wrapper" ref="chartWrapper">
            <Chart class="chart" :options="chartOptions"/>
        </div>
        <ol v-if="groupedList.length>0">
            <li v-for="(group, index) in groupedList" :key="index">
                <h3 class="title">{{beautify(group.title)}} <span>￥{{group.total}}</span></h3>
                <ol>
                    <li v-for="item in group.items" :key="item.id"
                        class="record"
                    >
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
    </Layout>
</template>
<style lang="scss" scoped>
    %item {
        padding: 0 16px;
        min-height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        @extend %item;
    }

    .record {
        background: white;
        @extend %item;

    }

    .notes {
        margin-right: auto;
        margin-left: 16px;
        color: #999999;
    }

    .chart {
        width: 430%;

        &-wrapper {
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
</style>
<script lang="ts">
    import Vue from 'vue';
    import {Component} from 'vue-property-decorator';
    import Tabs from '@/components/Tabs.vue';
    import recordTypeList from '@/constant/recordTypeList';
    import dayjs from 'dayjs';
    import clone from '@/lib/clone';
    import Chart from '@/components/Chart.vue';
    import _ from 'lodash';
    import day from 'dayjs';

    @Component({
        components: {Tabs, Chart},
    })
    export default class Statistics extends Vue {
        tagString(tags: Tag[]) {
            return tags.length === 0 ? '无' : tags.map(t => t.name).join('，');
        }

        mounted() {
            const div = (this.$refs.chartWrapper as HTMLDivElement);
            div.scrollLeft = div.scrollWidth;
        }

        beautify(string: string) {
            const day = dayjs(string);
            const now = dayjs();
            if (day.isSame(now, 'day')) {
                return '今天';
            } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
                console.log('hi');
                return '昨天';
            } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
                return '前天';
            } else if (day.isSame(now, 'year')) {
                return day.format('M月D日');
            } else {
                return day.format('YYYY年M月D日');
            }
        }

        get keyValueList(){
            const today = new Date();
            const array = [];
            for (let i = 0; i <= 29; i++) {
                const dateString = day(today).subtract(i, 'day').format('YYYY-MM-DD');
                const found = _.find(this.groupedList, {title: dateString});
                array.push({key: dateString, value: found? found.total : 0});
            }
            array.sort((a,b)=>{
                if (a.key>b.key){
                    return 1
                }else if (a.key===b.key){
                    return 0
                }else{
                    return -1
                }
            });
            return array;
        }

        get chartOptions() {
            const keys = this.keyValueList.map(item => item.key);
            const values = this.keyValueList.map(item => item.value);
            return {
                grid: {
                    right: 0,
                    left: 0,
                },
                xAxis: {
                    type: 'category',
                    data: keys,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1296db'
                        }
                    },
                    axisLabel:{
                        formatter: function (value: string){
                            return value.substring(5);
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    show: false
                },

                series: [{
                    symbol: 'circle',
                    symbolSize: 13,
                    itemStyle: {
                        color: '#1296db'
                    },
                    data: values,
                    type: 'line',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }],
                tooltip: {
                    show: true, triggerOn: 'click',
                    formatter: '{c}' , position: 'top'
                }
            };
        }


        get recordList() {
            return (this.$store.state as RootState).recordList;
        }

        get groupedList() {
            const {recordList} = this;
            const newList = clone(recordList)
                .filter(r => r.type === this.type)
                .sort((a, b) => dayjs(b.createAt).valueOf() - dayjs(a.createAt).valueOf());
            if (newList.length === 0) {return [];}
            type Result = { title: string; total?: number; items: RecordItem[] }[]
            const result: Result = [{title: dayjs(newList[0].createAt).format('YYYY-MM-DD'), items: [newList[0]]}];
            for (let i = 1; i < newList.length; i++) {
                const current = newList[i];
                const last = result[result.length - 1];
                if (dayjs(last.title).isSame(dayjs(current.createAt), 'day')) {
                    last.items.push(current);
                } else {
                    result.push({title: dayjs(current.createAt).format('YYYY-MM-DD'), items: [current]});
                }
            }
            result.map(group => {
                group.total = group.items.reduce((sum, item) => {
                    return sum + item.amount;
                }, 0);
            });
            return result;
        }

        beforeCreate() {
            this.$store.commit('fetchRecords');
        }

        type = '-';
        recordTypeList = recordTypeList;
    }
</script>

<style lang="scss" scoped>
    .echarts {
        max-width: 100%;
        height: 400px;
    }

    .noResult {
        padding: 16px;
        text-align: center;
    }

    ::v-deep {

            &.selected {
                background: #1296db;

                &::after {
                    display: none;
                }
            }

        .interval-tabs-item {
            height: 48px;

        }
    }
</style>
