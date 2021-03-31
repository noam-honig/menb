import { EntityClass, IdEntity, StringColumn, NumberColumn, DateColumn, Context, DateTimeColumn, IdColumn } from '@remult/core';
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
    country = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(Countries).getValueList()
        }),
        caption: "מדינה",
    });
    getCountry() {
        return this.context.for(Countries).lookup(this.country);
    }
    comments = new StringColumn("הערות");
    bottleType = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(BottleTypes).getValueList()
        }),
        caption: "סוג בקבוק"
    });
    shape = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(Shapes).getValueList()
        }),
        caption: "צורה"
    });
    shapeComments = new StringColumn("הערות לצורה");
    type = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(Types).getValueList()
        }),
        caption: "סוג"
    });
    subType = new StringColumn("תת סוג");
    quantity = new NumberColumn("כמות");
    state = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(States).getValueList()
        }),
        caption: "מצב"
    });
    location = new StringColumn({

        dataControlSettings: () => ({
            valueList: this.context.for(Locations).getValueList()
        }),
        caption: "נמצא ב"
    });
    alcohol = new NumberColumn({ caption: "אחוז אלכוהול", decimalDigits: 2 });
    volume = new NumberColumn("נפח");

    entryDate = new DateColumn("תאריך כניסה לאוסף");
    origin = new StringColumn("הגיע מ");
    cost = new NumberColumn({ decimalDigits: 2, caption: 'עלות' });
    exitDate = new DateColumn("תאריך הוצאה מהואסף");
    exitReason = new StringColumn("סיבה להוצאה מאוסף");
    worth = new NumberColumn({ caption: "שווי", decimalDigits: 2 });
    createDate = new DateTimeColumn({ allowApiUpdate: false });


    constructor(private context: Context) {
        super({
            name: "Bottles",
            caption: "בקבוקים",
            allowApiCRUD: Roles.admin,
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
            allowApiCRUD: Roles.admin
        });
    }
}