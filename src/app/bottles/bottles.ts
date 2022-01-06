import { IdEntity, Entity, OneToMany, Field, DateOnlyField, IntegerField, Remult, Allow } from 'remult';

import { Countries, BottleTypes, Shapes, Types, States, Locations } from '../manage/countries';
import { Roles } from '../users/roles';

@Entity<Bottles>(
    "Bottles", {
    
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

    @Field()
    name: string = '';
    @Field()
    manufacturer: string = '';

    @Field()
    country?: Countries;


    @Field()
    comments: string = '';
    @Field()
    bottleType?: BottleTypes;

    @Field()
    shape?: Shapes;

    @Field()
    shapeComments: string = '';

    @Field()
    type?: Types;
    @Field()
    subType: string = '';
    @Field()
    quantity: number = 0;

    @Field()
    state?: States;
    @Field()
    location?: Locations;
    @Field()
    alcohol: number = 0;
    @IntegerField()
    volume: number = 0;
    @DateOnlyField()
    entryDate?: Date;
    @Field()
    origin: string = '';
    @Field()
    cost: number = 0;
    @DateOnlyField()
    exitDate?: Date;
    @Field()
    exitReason: string = '';
    @Field()
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
