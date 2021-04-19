import { EntityClass, IdEntity, StringColumn, NumberColumn, DateColumn, Context, DateTimeColumn, IdColumn, BoolColumn, Entity, SpecificEntityHelper, ColumnSettings } from '@remult/core';
import { extend, getValueList, openDialog, SelectValueDialogComponent } from '@remult/angular';
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

    name = new StringColumn({ caption: "שם"});
    manufacturer = new StringColumn({ caption: "יצרן"});
    country = new LookupColumn1(this.context.for(Countries), { caption: "מדינה" });


    comments = new StringColumn({ caption: "הערות"});
    bottleType = new LookupColumn(this.context, BottleTypes, "סוג בקבוק");

    shape = new LookupColumn(this.context, Shapes, "צורה");

    shapeComments = new StringColumn({ caption: "הערות לצורה"});
    type = new LookupColumn(this.context, Types, "סוג");
    subType = new StringColumn({ caption: "תת סוג"});
    quantity = new NumberColumn({ caption: "כמות"});
    state = new LookupColumn(this.context, States, "מצב");
    location = new LookupColumn(this.context, Locations, "נמצא ב");
    alcohol = new NumberColumn({ caption: "אחוז אלכוהול", decimalDigits: 2 });
    volume = new NumberColumn({ caption: "נפח"});

    entryDate = new DateColumn({ caption: "תאריך כניסה לאוסף"});
    origin = new StringColumn({ caption: "הגיע מ"});
    cost = new NumberColumn({ decimalDigits: 2, caption: 'עלות' });
    exitDate = new DateColumn({ caption: "תאריך הוצאה מהואסף"});
    exitReason = new StringColumn({ caption: "סיבה להוצאה מאוסף"});
    worth = new NumberColumn({ caption: "שווי", decimalDigits: 2 });
    createDate = new DateTimeColumn({ allowApiUpdate: false });
    hasImage = extend(new BoolColumn({
        caption: 'תמונה',
        sqlExpression: () => {
            var bi = this.context.for(BottleImages).create();
            var sql = new SqlBuilder();
            sql.addEntity(this, "Bottles");
            return '(' + sql.query({ select: () => ["count(*)>0 hasImage"], from: bi, where: () => [sql.eq(bi.bottleId, this.id)] }) + ')';
        }
    })).dataControl(s => {
        s.width = '60';
        s.getValue = () => '';
        s.readOnly = true;
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
    fileName = new StringColumn();
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
        super({caption});
        extend(this).dataControl(s => {
            s.getValue = () => this.displayValue;
            s.hideDataOnInput = true;
            s.click = async () => openDialog(SelectValueDialogComponent, async x => x.args({
                values: await getValueList(this.context.for(entityType)),
                onSelect: (x) => this.value = x.id
            }))
        });
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

export class LookupColumn1<T extends Entity<string>> extends StringColumn {
    constructor(private provider: SpecificEntityHelper<string, T>, private settings?: {
        lookupDisplayValue?: (entity: T) => string
    } & ColumnSettings<string>) {
        super(settings);
        if (!this.settings) {
            this.settings = {};
        }
        if (!this.settings.lookupDisplayValue) {
            this.settings.lookupDisplayValue = x => {
                for (const col of x.columns) {
                    if (col instanceof StringColumn && col != x.columns.idColumn)
                        return col.displayValue;
                }
            };
        }
    }

    get lookup(): T {
        return this.provider.lookup(this);
    }
    async lookupAsync(): Promise<T> {
        return this.provider.lookupAsync(this);
    }
    get displayValue(): string {
        return this.settings.lookupDisplayValue(this.lookup);
    }
    async displayValueAsync(): Promise<string> {
        return this.settings.lookupDisplayValue(await this.lookupAsync());
    }
}