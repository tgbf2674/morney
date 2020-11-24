<template>
    <layout class-prefix="layout">{{recordList}}
        <NumberPad @submit="saveRecord" :value.sync="record.amount"/>
        <Types :value.sync="record.type"/>
        <Notes @update:value="onUpdateNotes"/>
        <Tags :data-source.sync="tags" @update:value="onUpdateTags"/>
    </layout>
</template>

<script lang="ts">
    import NumberPad from '@/components/Money/NumberPad.vue';
    import Types from '@/components/Money/Types.vue';
    import Notes from '@/components/Money/Notes.vue';
    import Tags from '@/components/Money/Tags.vue';

    import Vue from 'vue';
    import {Component, Watch} from 'vue-property-decorator';



    type Record = {
        tags: string[];
        notes: string;
        type: string;
        amount: number;
        createAt: Date | undefined;
    }
    @Component({
        components: {Tags, Notes, Types, NumberPad},
    })
    export default class Money extends Vue {
        tags = ['衣', '食', '住', '行'];
        recordList: Record[] = JSON.parse(window.localStorage.getItem('recordList') || '[]');
        record: Record = {tags: [], notes: '', type: '', amount: 0,createAt: new Date()};

        onUpdateTags(value: string[]) {
            this.record.tags = value;
        }

        onUpdateNotes(value: string) {
            this.record.notes = value;
        }

        saveRecord() {
            const record2: Record = JSON.parse(JSON.stringify(this.record));
            record2.createAt = new Date();
            this.recordList.push(record2);
            console.log(this.recordList);
        }

        @Watch('recordList')
        onRecordListChanged() {
            window.localStorage.setItem('recordList', JSON.stringify(this.recordList));
        }
    }
</script>
<style lang="scss">
    .layout-content {
        display: flex;
        flex-direction: column-reverse;

    }
</style>

