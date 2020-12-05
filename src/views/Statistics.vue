<template>
    <Layout>
        <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type"/>
        <div class="chart-wrapper">
            <Chart class="chart" ref="chartWrapper" :options="x"/>
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
            &::-webkit-scrollbar{
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

    @Component({
        components: {Tabs, Chart},
    })
    export default class Statistics extends Vue {
        tagString(tags: Tag[]) {
            return tags.length === 0 ? '无' : tags.map(t => t.name).join('，');
        }

        mounted() {
            (this.$refs.chartWrapper as HTMLDivElement).scrollLeft = 9999;
        }

        beautify(string: string) {
            const now = new Date();
            if (dayjs(string).isSame(now, 'day')) {
                return '今天';
            } else if (dayjs(string).isSame(now.valueOf() - 86400 * 1000, 'day')) {
                return '昨天';
            } else if (dayjs(string).isSame(dayjs().subtract(2, 'day'), 'day')) {
                return '前天';
            } else if (dayjs().isSame(dayjs(), 'year')) {
                return dayjs().format('M月D日');
            } else {
                return dayjs().format('YYYY年M月D日');
            }
        }

        get x() {
            return {
                grid: {
                    right: 0,
                    left: 0,
                },
                xAxis: {
                    type: 'category',
                    data: [
                        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
                        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
                        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
                        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
                    ],
                    axisTick:{
                        alignWithLabel:true
                    },
                    axisLine:{
                        lineStyle:{
                            color: '#1296db'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    show: false
                },

                series: [{
                    symbol:'circle',
                    symbolSize: 13,
                    itemStyle:{
                        color: '#1296db'
                    },
                    data: [
                        120, 200, 150, 80, 70, 110, 130,
                        120, 200, 150, 80, 70, 110, 130,
                        120, 200, 150, 80, 70, 110, 130,
                        120, 200, 150, 80, 70, 110, 130,
                    ],
                    type: 'line',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }],
                tooltip: {show: true,triggerOn: 'click',
                formatter: 'c', position: 'top'
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
