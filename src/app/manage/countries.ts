

import { Allow, Entity, Field, FieldType, IdEntity, Remult } from 'remult';
import { ClassType } from 'remult/classType';
import { Roles } from '../users/roles';


function LookupTableDefs(key: string, caption: string) {
    return (entity: ClassType<LookupTableBase>) => {
        // DataControl<{ remult: Remult }, LookupTableBase>({
        //     hideDataOnInput: true,
        //     getValue: (_, x) => x.value.name,
        //     click: async (row: { remult: Remult }, col) => {
        //         // openDialog(SelectValueDialogComponent, async x => x.args({
        //         //     values: (await row.remult.repo(entity).find()).map(item => ({ caption: item.name, item })),
        //         //     onSelect: (x) => col.value = x.item
        //         // }));
        //     }
        // }
        // )(entity);
        FieldType<LookupTableBase>({
            selectType:entity,
            displayValue: (_, x) => x?.name,
        })(entity);
        Entity(key, {
            caption,
            defaultOrderBy: { name: "asc" },
            allowApiCrud: Roles.admin,
            allowApiRead: Allow.authenticated
        })(entity)
    }
}
export class LookupTableBase extends IdEntity {
    @Field({ caption: "שם" })
    name: string = '';
    constructor(public remult: Remult) {
        super();
    }
}


@LookupTableDefs("Countries", "מדינות")
export class Countries extends LookupTableBase { }
@LookupTableDefs("Types", "סוג")
export class Types extends LookupTableBase { }
@LookupTableDefs("BottleType", "סוג בקבוק")
export class BottleTypes extends LookupTableBase { }
@LookupTableDefs("Shape", "צורה")
export class Shapes extends LookupTableBase { }
@LookupTableDefs("State", "מצב")
export class States extends LookupTableBase { }
@LookupTableDefs("Locations", "נמצא ב")
export class Locations extends LookupTableBase { }

declare module 'remult' {
    export interface FieldOptions {
        selectType?: ClassType<LookupTableBase>
    }
}