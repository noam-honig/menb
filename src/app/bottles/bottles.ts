import { EntityClass, IdEntity, StringColumn, NumberColumn, DateColumn } from '@remult/core';

@EntityClass
export class Bottles extends IdEntity {
    country = new StringColumn("מדינה");
    name = new StringColumn("שם");
    yaran = new StringColumn("יצרן");
    comments = new StringColumn("הערות");
    bottleType = new StringColumn("סוג בקבוק");
    shape = new StringColumn("צורה");
    shapeComments = new StringColumn("הערות לצורה");
    type = new StringColumn("סוג");
    subType = new StringColumn("תת סוג");
    quantity = new NumberColumn("כמות");
    state = new StringColumn("מצב");
    location = new StringColumn("נמצא ב");
    entryDate = new DateColumn("תאריך כניסה לאוסף");
    cost = new NumberColumn({ decimalDigits: 2, caption: 'עלות' });
    exitDate = new DateColumn("תאריך הוצאה מהואסף");
    exitReason = new StringColumn("סיבה להוצאה מאוסף");
    origin = new StringColumn("הגיע מ");
    worth = new NumberColumn("שווי");


    constructor() {
        super({
            name: "Bottles",
            caption: "בקבוקים",
            allowApiCRUD: true
        });
    }
}