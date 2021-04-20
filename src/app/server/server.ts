//import { CustomModuleLoader } from '../../../../../../repos/radweb/src/app/server/CustomModuleLoader';
//let moduleLoader = new CustomModuleLoader('/dist-server/repos/radweb/projects/');
import * as express from 'express';
import { initExpress } from '@remult/core/server';
import * as fs from 'fs';
import { SqlDatabase } from '@remult/core';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { PostgresDataProvider, verifyStructureOfAllEntities } from '@remult/server-postgres';
import * as forceHttps from 'express-force-https';
import * as jwt from 'jsonwebtoken';
import * as compression from 'compression';
import * as passwordHash from 'password-hash';
import '../app.module';
import { PasswordColumn } from '../users/users';
import { versionUpdate } from './version';
import { BottleImages } from '../bottles/bottles';

config(); //loads the configuration from the .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DEV_MODE ? false : { rejectUnauthorized: false }// use ssl in production but not in development. the `rejectUnauthorized: false`  is required for deployment to heroku etc...
});
let database = new SqlDatabase(new PostgresDataProvider(pool));
//SqlDatabase.LogToConsole=true;
versionUpdate(database); //This method can be run in the install phase on the server.


PasswordColumn.passwordHelper = {
    generateHash: p => passwordHash.generate(p),
    verify: (p, h) => passwordHash.verify(p, h)
}

let app = express();
app.use(compression());
if (!process.env.DEV_MODE)
    app.use(forceHttps);
let e = initExpress(app, {
    dataProvider: database,
    tokenProvider: {
        createToken: userInfo => jwt.sign(userInfo, process.env.TOKEN_SIGN_KEY),
        verifyToken: token => jwt.verify(token, process.env.TOKEN_SIGN_KEY)
    }
});
app.get('/api/images/:id', async (req, res) => {
    let context = await e.getValidContext(req);
    let i = await context.for(BottleImages).findFirst(b => b.bottleId.isEqualTo(req.params.id));
    if (!i) {
        res.sendStatus(404);
        return;
    }
    let split = i.image.value.split(',');
    let type = split[0].substring(5).replace(';base64', '');

    res.contentType(type);

    res.send(Buffer.from(split[1], 'base64'));
    //

});
app.use(express.static('dist/men-collection'));
app.use('/*', async (req, res) => {
    try {
        res.send(fs.readFileSync('dist/men-collection/index.html').toString());
    } catch (err) {
        res.sendStatus(500);
    }
});

let port = process.env.PORT || 3000;
app.listen(port);