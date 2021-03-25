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