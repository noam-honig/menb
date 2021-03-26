import { IdEntity, StringColumn, EntityClass } from '@remult/core';
import { Roles } from '../users/roles';

@EntityClass
export class Countries extends IdEntity {
    name = new StringColumn("שם מדינה");
    constructor() {
        super({
            name: "Countries",
            caption: "מדינות",
            defaultOrderBy: () => this.name,
            allowApiCRUD: Roles.admin
        });
    }
}
@EntityClass
export class Types extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Types",
            caption: "סוג",
            defaultOrderBy: () => this.name,
            allowApiCRUD: Roles.admin
        });
    }
}
@EntityClass
export class BottleTypes extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "BottleType",
            caption: "סוג בקבוק",
            defaultOrderBy: () => this.name,
            allowApiCRUD: Roles.admin
        });
    }
}
@EntityClass
export class Shapes extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Shape",
            defaultOrderBy: () => this.name,
            caption: "צורה",
            allowApiCRUD: Roles.admin
        });
    }
}
@EntityClass
export class States extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "State",
            defaultOrderBy: () => this.name,
            caption: "מצב",
            allowApiCRUD: Roles.admin
        });
    }
}
@EntityClass
export class Locations extends IdEntity {
    name = new StringColumn("שם");
    constructor() {
        super({
            name: "Locations",
            defaultOrderBy: () => this.name,
            caption: "נמצא ב",
            allowApiCRUD: Roles.admin
        });
    }
}