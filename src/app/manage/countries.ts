import { IdEntity, StringColumn, EntityClass } from '@remult/core';

@EntityClass
export class Countries extends IdEntity {
    name = new StringColumn("שם מדינה");
    constructor() {
        super({
            name: "Countries",
            caption:"מדינות",
            allowApiCRUD:true
        });
    }
}
@EntityClass
export class Types extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Types",
            caption:"סוג",
            allowApiCRUD:true
        });
    }
}
@EntityClass
export class BottleTypes extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "BottleType",
            caption:"סוג בקבוק",
            allowApiCRUD:true
        });
    }
}
@EntityClass
export class Shapes extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Shape",
            caption:"צורה",
            allowApiCRUD:true
        });
    }
}
@EntityClass
export class States extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "State",
            caption:"מצב",
            allowApiCRUD:true
        });
    }
}
@EntityClass
export class Locations extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Locations",
            caption:"נמצא ב",
            allowApiCRUD:true
        });
    }
}