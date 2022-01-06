import { IdEntity, Entity, OneToMany, Field, DateOnlyField, IntegerField, Remult, Allow } from 'remult';

import { Countries, BottleTypes, Shapes, Types, States, Locations } from '../manage/countries';
import { Roles } from '../users/roles';

@Entity<Bottles>(
    "Bottles", {
    caption: "בקבוקים",
    allowApiCrud: Roles.admin,
    allowApiRead: Allow.authenticated,
    defaultOrderBy: { name: "asc" },
    saving: (self) => {
        if (self.isNew())
            self.createDate = new Date();
    }
})
export class Bottles extends IdEntity {

    images = new OneToMany(this.remult.repo(BottleImages), { where: { bottleId: this.id } });

    @Field({ caption: "שם" })
    name: string = '';
    @Field({ caption: "יצרן" })
    manufacturer: string = '';

    @Field({ caption: "מדינה" })
    country?: Countries;


    @Field({ caption: "הערות" })
    comments: string = '';
    @Field({ caption: "סוג בקבוק" })
    bottleType?: BottleTypes;

    @Field({ caption: "צורה" })
    shape?: Shapes;

    @Field({ caption: "הערות לצורה" })
    shapeComments: string = '';

    @Field({ caption: "סוג" })
    type?: Types;
    @Field({ caption: "תת סוג" })
    subType: string = '';
    @Field({ caption: "כמות" })
    quantity: number = 0;

    @Field({ caption: "מצב" })
    state?: States;
    @Field({ caption: "נמצא ב" })
    location?: Locations;
    @Field({ caption: "אחוז אלכוהול" })
    alcohol: number = 0;
    @IntegerField({ caption: "נפח" })
    volume: number = 0;
    @DateOnlyField({ caption: "תאריך כניסה לאוסף" })
    entryDate?: Date;
    @Field({ caption: "הגיע מ" })
    origin: string = '';
    @Field({ caption: 'עלות' })
    cost: number = 0;
    @DateOnlyField({ caption: "תאריך הוצאה מהואסף" })
    exitDate?: Date;
    @Field({ caption: "סיבה להוצאה מאוסף" })
    exitReason: string = '';
    @Field({ caption: "שווי" })
    worth: number = 0;
    @Field({ allowApiUpdate: false })
    createDate?: Date;
    // @DataControl({
    //     width: '60',
    //     readonly: true
    // })
    @Field<Bottles>({

        caption: 'תמונה',
    }, (options, remult) => options.sqlExpression = async (self) => {
        var bi = remult.repo(BottleImages).metadata;
        return `( select count(*)>0 hasImage from ${await bi.getDbName()} where ${await bi.fields.bottleId.getDbName()} =${await bi.getDbName()}.${await self.fields.id.getDbName()} )`;
    }
    )
    hasImage: boolean = false;



    imageReloadVersion = 0;
    constructor(public remult: Remult) {
        super();
    }
}

@Entity('bottleImages', {
    allowApiCrud: Roles.admin,
    allowApiRead: Allow.authenticated,
    defaultOrderBy: { num: "asc" },
})
export class BottleImages extends IdEntity {
    @Field()
    bottleId: string = '';
    @Field()
    image: string = '';
    @Field()
    fileName: string = '';
    @IntegerField()
    num: number = 0;


}
