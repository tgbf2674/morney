<template>
    <layout class-prefix="layout">
        <NumberPad @submit="saveRecord" :value.sync="record.amount"/>
        <Types :value.sync="record.type"/>
        <Notes field-name="备注" @update:value="onUpdateNotes" placeholder="在这里输入备注"/>
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
    import {recordListModel} from '@/models/recordListModel';
    import {tagListModel} from '@/models/tagListModel';

    // eslint-disable-next-line no-undef
    const recordList = recordListModel.fetch();
    const tagList = tagListModel.fetch();

    @Component({
        components: {Tags, Notes, Types, NumberPad},
    })
    export default class Money extends Vue {
        tags = tagList;
        recordList: RecordItem[] = recordList;
        record: RecordItem = {tags: [], notes: '', type: '', amount: 0,createAt: new Date()};

        onUpdateTags(value: string[]) {
            this.record.tags = value;
        }

        onUpdateNotes(value: string) {
            this.record.notes = value;
        }

        saveRecord() {
            const record2: RecordItem = recordListModel.clone(this.record);
            record2.createAt = new Date();
            this.recordList.push(record2);
            console.log(this.recordList);
        }

        @Watch('recordList')
        onRecordListChanged() {
           recordListModel.save(this.recordList);
        }
    }
</script>
<style lang="scss">
    .layout-content {
        display: flex;
        flex-direction: column-reverse;

    }
</style>

