import { EntityClass, IdEntity, StringColumn, NumberColumn, DateColumn, Context, DateTimeColumn, IdColumn, BoolColumn } from '@remult/core';
import { SelectValueDialogComponent } from '@remult/angular';
import { SqlBuilder } from '../common/sql-builder';
import { Countries, BottleTypes, Shapes, Types, States, Locations } from '../manage/countries';
import { Roles } from '../users/roles';

@EntityClass
export class Bottles extends IdEntity {
    async findImage() {
        let r = await this.context.for(BottleImages).findFirst(x => x.bottleId.isEqualTo(this.id));
        if (!r) {
            r = this.context.for(BottleImages).create();
            r.bottleId.value = this.id.value;
        }
        return r;
    }

    name = new StringColumn("שם");
    manufacturer = new StringColumn("יצרן");
    country = new LookupColumn(this.context, Countries, "מדינה");

    comments = new StringColumn("הערות");
    bottleType = new LookupColumn(this.context, BottleTypes, "סוג בקבוק");

    shape = new LookupColumn(this.context, Shapes, "צורה");

    shapeComments = new StringColumn("הערות לצורה");
    type = new LookupColumn(this.context, Types, "סוג");
    subType = new StringColumn("תת סוג");
    quantity = new NumberColumn("כמות");
    state = new LookupColumn(this.context, States, "מצב");
    location = new LookupColumn(this.context, Locations, "נמצא ב");
    alcohol = new NumberColumn({ caption: "אחוז אלכוהול", decimalDigits: 2 });
    volume = new NumberColumn("נפח");

    entryDate = new DateColumn("תאריך כניסה לאוסף");
    origin = new StringColumn("הגיע מ");
    cost = new NumberColumn({ decimalDigits: 2, caption: 'עלות' });
    exitDate = new DateColumn("תאריך הוצאה מהואסף");
    exitReason = new StringColumn("סיבה להוצאה מאוסף");
    worth = new NumberColumn({ caption: "שווי", decimalDigits: 2 });
    createDate = new DateTimeColumn({ allowApiUpdate: false });
    hasImage = new BoolColumn({
        caption: 'תמונה',
        dataControlSettings: () => ({
            width: '60',
            getValue: () => '',
            readOnly: true
        }),
        sqlExpression: () => {
            var bi = this.context.for(BottleImages).create();
            var sql = new SqlBuilder();
            sql.addEntity(this, "Bottles");
            return '(' + sql.query({ select: () => ["count(*)>0 hasImage"], from: bi, where: () => [sql.eq(bi.bottleId, this.id)] }) + ')';
        }
    })


    constructor(private context: Context) {
        super({
            name: "Bottles",
            caption: "בקבוקים",
            allowApiCRUD: Roles.admin,
            allowApiRead: context => context.isSignedIn(),
            defaultOrderBy: () => this.name,
            saving: () => {
                if (this.isNew())
                    this.createDate.value = new Date();
            }
        });
    }
}

@EntityClass
export class BottleImages extends IdEntity {
    bottleId = new IdColumn();
    image = new StringColumn();
    constructor() {
        super({
            name: 'bottleImages',
            allowApiCRUD: Roles.admin,
            allowApiRead: context => context.isSignedIn()
        });
    }
}
export class LookupColumn extends StringColumn {
    constructor(private context: Context, private entityType: {
        new(...args: any[]): lookupEntity;
    }, caption: string) {
        super({
            caption,
            dataControlSettings: () => ({
                getValue: () => this.displayValue,
                hideDataOnInput: true,
                click: async () => context.openDialog(SelectValueDialogComponent, async x => x.args({
                    values: await this.context.for(entityType).getValueList(),
                    onSelect: (x) => this.value = x.id
                }))
            })
        })
    }
    get displayValue() {
        return this.context.for(this.entityType).lookup(this).name.value;
    }
    async getNameAsync() {
        return (await this.context.for(this.entityType).lookupAsync(this)).name.value;
    }

}
interface lookupEntity extends IdEntity {
    name: StringColumn;
}