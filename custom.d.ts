type RootState = {
    recordList: RecordItem[];
    createRecordError: Error |null;
    tagList: Tag[];
    currentTag?: Tag;
}
type RecordItem = {
    tags: Tag[];
    notes: string;
    type: string;
    amount: number;
    createAt?: string;
}

type Tag = {
    id: string;
    name: string;
}
type TagListModel = {
    data: Tag[];
    fetch: () => Tag[];
    create: (name: string) => 'success' | 'duplicated';
    update: (id: string, name: string) => 'success' | 'not found' | 'duplicated';
    save: () => void;
    remove: (id: string) => boolean;

}


