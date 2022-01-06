

import { Allow, Entity, Field, FieldType, IdEntity, Remult } from 'remult';
import { ClassType } from 'remult/classType';
import { Roles } from '../users/roles';


function LookupTableDefs(key: string) {
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
            valueConverter: {
                toJson: x => x != undefined ? x : '',
                fromJson: x => x ? x : null
            },
        })(entity);
        Entity(key, {
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


@LookupTableDefs("Countries")
export class Countries extends LookupTableBase { }
@LookupTableDefs("Types")
export class Types extends LookupTableBase { }
@LookupTableDefs("BottleType")
export class BottleTypes extends LookupTableBase { }
@LookupTableDefs("Shape")
export class Shapes extends LookupTableBase { }
@LookupTableDefs("State")
export class States extends LookupTableBase { }
@LookupTableDefs("Locations")
export class Locations extends LookupTableBase { }

declare module 'remult' {
    export interface FieldOptions {
        selectType?: ClassType<LookupTableBase>
    }
}