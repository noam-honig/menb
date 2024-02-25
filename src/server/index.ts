//import { CustomModuleLoader } from '../../../../../../repos/radweb/src/app/server/CustomModuleLoader';
//let moduleLoader = new CustomModuleLoader('/dist-server/repos/radweb/projects/');
import * as express from 'express';
import { remultExpress } from 'remult/remult-express';
import { config } from 'dotenv';
import sslRedirect from 'heroku-ssl-redirect';
import {
  createPostgresConnection,
  PostgresClient,
  PostgresDataProvider,
  PostgresPool,
  PostgresSchemaBuilder,
} from 'remult/postgres';
import * as swaggerUi from 'swagger-ui-express';
import * as helmet from 'helmet';
import * as jwt from 'express-jwt';
import * as compression from 'compression';
import { getJwtTokenSignKey } from '../app/users/users';
import '../app/bottles/bottles';
import { BottleImages, SmallImages } from '../app/bottles/bottles';
import * as sharp from 'sharp';
import { Pool, QueryResult } from 'pg';
import { Remult, SqlDatabase } from 'remult';
import { getFromS3, playWithS3, config as s3Config } from './play-with-s3';

export class PostgresSchemaWrapper implements PostgresPool {
  constructor(private pool: Pool, private schema: string) {}
  async connect(): Promise<PostgresClient> {
    let r = await this.pool.connect();

    await r.query('set search_path to ' + this.schema);
    return r;
  }
  async query(queryText: string, values?: any[]): Promise<QueryResult> {
    let c = await this.connect();
    try {
      return await c.query(queryText, values);
    } finally {
      c.release();
    }
  }
}

async function startup() {
  config(); //loads the configuration from the .env file
  const app = express();
  app.use(sslRedirect());
  app.use(
    jwt({
      secret: getJwtTokenSignKey(),
      credentialsRequired: false,
      algorithms: ['HS256'],
    })
  );
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  const dataProvider = async () => {
    if (process.env['DATABASE_URL']) {
      const pool = new Pool({
        connectionString: process.env['DATABASE_URL'],
        ssl: {
          rejectUnauthorized: false,
        },
      });
      const schema = process.env['SCHEMA'] || 'menb';
      s3Config.schema = schema;
      const result = new SqlDatabase(
        new PostgresDataProvider(new PostgresSchemaWrapper(pool, schema))
      );
      var sb = new PostgresSchemaBuilder(result, schema);
      const remult = new Remult();
      remult._dataSource = result;
      await sb.verifyStructureOfAllEntities(remult);
      return result;
    }
    return undefined;
  };
  let api = remultExpress({
    dataProvider,
  });
  app.use(api);
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' }))
  );
  app.get('/api/test-noam', async (req, res) => {
    const { writeToResponse } = await getFromS3(
      'c0626bdf-4d6b-4638-8e36-1fb71a3d821c'
    );
    await writeToResponse(res);
  });
  app.get('/api/images/:id', async (req, res) => {
    try {
      const noImage = () =>
        res.sendFile(process.cwd() + '/dist/men-collection/assets/wine.png');

      if (process.env['NO_IMAGE']) {
        return noImage();
      }
      let remult = await api.getRemult(req);
      const getImage = async () => {
        let num = req.query['num'];
        let i = await remult.repo(BottleImages).findFirst({
          bottleId: req.params.id,
          num: num ? Number(num) : undefined,
        });
        if (!i) {
          return { buffer: undefined, type: '' };
        }
        if (i.image === 's3') {
          const r = await getFromS3(i.id);
          return { buffer: await r.getBuffer(), type: r.ContentType! };
        }
        let split = i.image.split(',');
        let type = split[0].substring(5).replace(';base64', '');
        return { buffer: Buffer.from(split[1], 'base64'), type };
      };

      if (req.query['small'] === '1') {
        const smallImage = await remult
          .repo(SmallImages)
          .findFirst({ bottleId: req.params.id }, { createIfNotFound: true });
        if (smallImage.isNew()) {
          let { buffer, type } = await getImage();
          if (!buffer) return noImage();
          smallImage.image = await (
            await sharp(buffer).resize(200).withMetadata().toBuffer()
          ).toString('base64');
          smallImage.contentType = type;
          await smallImage.save();
        }
        res.contentType(smallImage.contentType);
        res.send(Buffer.from(smallImage.image, 'base64'));
        return;
      } else {
        let { buffer, type } = await getImage();
        if (!buffer) {
          return noImage();
        }
        res.contentType(type);
        res.send(buffer);
      }
    } catch (err: any) {
      console.log({ url: req.url, err });
      res.status(500).json(err);
    }
  });

  app.use(express.static('dist/men-collection'));
  app.use('/*', async (req, res) => {
    try {
      res.sendFile(process.cwd() + '/dist/men-collection/index.html');
    } catch (err) {
      res.sendStatus(500);
    }
  });
  await playWithS3(await api.getRemult({} as any));
  let port = process.env['PORT'] || 3000;
  app.listen(port);
}
startup();

/*
 * V - paging, repeats the same page all the time.
 * V - replace home with bottles.
 * V - search in type, country, name,manfacture,comment
 * V - space is and - in the search.
 * V - In the home lage, show latest bottles
 * V - make ltr
 * V - make advanced search
 * show older bottles first
 * V - Add bottle type
 */
