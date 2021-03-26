import { EntityClass, IdEntity, StringColumn, NumberColumn, DateColumn, Context, DateTimeColumn } from '@remult/core';
import { Countries, BottleTypes, Shapes, Types, States, Locations } from '../manage/countries';

@EntityClass
export class Bottles extends IdEntity {
    country = new StringColumn({
        dataControlSettings: () => ({
            valueList: this.context.for(Countries).getValueList()
        }),
        caption: "מדינה",
    });
    name = new StringColumn("שם");
    manufacturer = new StringColumn("יצרן");
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
            allowApiCRUD: true,
            saving: () => {
                if (this.isNew())
                    this.createDate.value = new Date();
            }
        });
    }
}