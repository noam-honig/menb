//import { CustomModuleLoader } from '../../../../../../repos/radweb/src/app/server/CustomModuleLoader';
//let moduleLoader = new CustomModuleLoader('/dist-server/repos/radweb/projects/');
import * as express from 'express';
import { remultExpress } from 'remult/remult-express';
import { config } from 'dotenv';
import sslRedirect from 'heroku-ssl-redirect'
import { createPostgresConnection } from 'remult/postgres';
import * as swaggerUi from 'swagger-ui-express';
import * as helmet from 'helmet';
import * as jwt from 'express-jwt';
import * as compression from 'compression';
import { getJwtTokenSignKey } from '../app/auth.server.service';
import '../app/bottles/bottles';
import { BottleImages } from '../app/bottles/bottles';

async function startup() {
    config(); //loads the configuration from the .env file
    const app = express();
    app.use(sslRedirect());
    app.use(jwt({ secret: getJwtTokenSignKey(), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
    const dataProvider = async () => {
        //if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", autoCreateTables: false, sslInDev: true })
        //return undefined;
    }
    let api = remultExpress({
        dataProvider
    });
    app.use(api);
    app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' })));
    app.get('/api/images/:id', async (req, res) => {
        let remult = await api.getRemult(req);
        let i = await remult.repo(BottleImages).findFirst({ bottleId: req.params.id });
        if (!i) {
            res.sendStatus(404);
            return;
        }
        let split = i.image.split(',');
        let type = split[0].substring(5).replace(';base64', '');

        res.contentType(type);

        res.send(Buffer.from(split[1], 'base64'));
        //

    });



    app.use(express.static('dist/men-collection'));
    app.use('/*', async (req, res) => {
        try {
            res.sendFile(process.cwd() + '/dist/men-collection/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });
    let port = process.env['PORT'] || 3000;
    app.listen(port);
}
startup();

/*
* V - paging, repeats the same page all the time.
* V - replace home with bottles.
* search in type, country, name,manfacture,comment
* space is and - in the search.
* V - In the home lage, show latest bottles
* V - make ltr 
* make advanced search
* show older bottles first
*/