
import { DataControlInfo, DataControlSettings, getFieldDefinition, GridSettings } from '@remult/angular';
import { FieldMetadata } from 'remult';


const storageEntryName = 'grid-state';
export class columnOrderAndWidthSaver {
    suspend = false;
    constructor(private grid: GridSettings<any>) {
    }
    getStorage() {
        let state = localStorage.getItem(storageEntryName);
        if (state) {
            let st = JSON.parse(state);
            if (st)
                return st;
        }
        return {};
    }
    load(key: string) {
        let items: storedColumn[] = this.getStorage()[key];
        if (items) {
            let cols = items.map(x => {
                let r: DataControlSettings;
                if (x.key) {
                    r = this.grid.columns.items.find(c => c.field && getFieldDefinition(c.field).key == x.key)!;
                } else {
                    r = this.grid.columns.items.find(c => !c.field && c.caption == x.caption)!;
                }
                if (x.width && r)
                    r.width = x.width;
                return r;
            }).filter(x => x !== undefined);
            sortColumns(this.grid, cols);
        }
        this.grid.columns.onColListChange(() => {
            if (this.suspend)
                return;
            let x: storedColumn[] = [];
            for (let index = 0; index <= this.grid.columns.numOfColumnsInGrid; index++) {
                const element = this.grid.columns.items[index];
                if (element)
                    if (element.field) {
                        x.push({ key: getFieldDefinition(element.field).key, width: element.width! });
                    }
                    else
                        x.push({ caption: element.caption, width: element.width! });
            }
            let s = this.getStorage();
            s[key] = x;
            localStorage.setItem(storageEntryName, JSON.stringify(s));
        });
    }
}
export interface storedColumn {
    key?: string;
    caption?: string;
    width: string;
}

export function sortColumns(list: GridSettings<any>, columns: DataControlInfo<any>[]) {

    if (list.origList && list.origList.length > 0)
        list.resetColumns();
    list.columns.items.sort((a, b) => a.caption! > b.caption! ? 1 : a.caption! < b.caption! ? -1 : 0);
    list.columns.numOfColumnsInGrid = columns.length;
    for (let index = 0; index < columns.length; index++) {
        const origItem = columns[index];
        let item: DataControlSettings<any>;
        let defs = origItem as FieldMetadata<any>;
        if (defs && defs.valueType) {
            item = list.columns.items.find(x => x.field == defs)!;
        }
        else item = origItem as DataControlSettings<any>;
        let origIndex = list.columns.items.indexOf(item);
        list.columns.moveCol(item, -origIndex + index);
    }


}