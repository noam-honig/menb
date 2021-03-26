import { IdEntity, NumberColumn, ServerContext, SqlDatabase } from "@remult/core";
import { PostgresSchemaBuilder, verifyStructureOfAllEntities } from "@remult/server-postgres";
import { Bottles } from "../bottles/bottles";

export class VersionInfo extends IdEntity {
    version = new NumberColumn();
    constructor() {
        super({
            name: "versionInfo",
            allowApiCRUD: false
        });
    }
}

export async function versionUpdate(db: SqlDatabase) {
    let context = new ServerContext(db);
    var schemaBuilder = new PostgresSchemaBuilder(db);
    await schemaBuilder.verifyStructureOfAllEntities();
    await schemaBuilder.createIfNotExist(context.for(VersionInfo).create());
    let version = async (ver: number, what: () => Promise<void>) => {
        let v = await context.for(VersionInfo).findFirst();
        if (!v) {
            v = context.for(VersionInfo).create();
            v.version.value = 0;
        }
        if (v.version.value <= ver - 1) {
            await what();
            v.version.value = ver;
            await v.save();
        }
    };
    let b = context.for(Bottles).create();

    version(1, async () => {

        await db.execute('alter table ' + b.defs.dbName + ' drop column ' + b.alcohol.defs.dbName);
        await schemaBuilder.verifyAllColumns(b);
    });

}