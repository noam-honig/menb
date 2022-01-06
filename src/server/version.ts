import { Entity, Field, IdEntity, Remult, SqlDatabase } from "remult";
import { PostgresSchemaBuilder } from "remult/postgres";
import { Bottles } from "src/app/bottles/bottles";

@Entity(undefined!, {
    dbName: "versionInfo"
})
export class VersionInfo extends IdEntity {
    @Field()
    version: number = 0;

}

export async function versionUpdate(db: SqlDatabase) {
    let remult = new Remult(db);
    var schemaBuilder = new PostgresSchemaBuilder(db);
    await schemaBuilder.verifyStructureOfAllEntities(remult);
    await schemaBuilder.createIfNotExist(remult.repo(VersionInfo).metadata);
    let version = async (ver: number, what: () => Promise<void>) => {
        let v = await remult.repo(VersionInfo).findFirst();
        if (!v) {
            v = remult.repo(VersionInfo).create();
            v.version = 0;
        }
        if (v.version <= ver - 1) {
            await what();
            v.version = ver;
            await v.save();
        }
    };
    let b = remult.repo(Bottles).metadata;

    version(1, async () => {

        await db.execute('alter table ' + await b.getDbName() + ' drop column ' + await b.fields.alcohol.getDbName());
        await schemaBuilder.verifyAllColumns(b);
    });

}