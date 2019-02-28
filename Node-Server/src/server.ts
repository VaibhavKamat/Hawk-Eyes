import * as config from 'config';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as dbUtils from './utils/db-utils';
import {intiateSocketFlow} from './mainController';

const SWAGGER_UX_PATH = '/docs';
const SWAGGER_UX_API_PATH = '/api-docs';
const DEV_ENDPOINT = 'dev_endpoints';
const SWAGGER_CONFIG = 'swagger';

let app: express.Application = express();
let port: number = config.get('port') as number;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// //CORS Middleware
// app.use(function (req, res, next) {
//   //Enabling CORS
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//   next();
// });

if (isNaN(port)) {
  console.log(`Invalid port config value: ${port}`);
  process.exit(1);
}

let swaggerPath = path.resolve(__dirname, './swagger.yaml');
let controllerPath = path.resolve(__dirname, './actions');
let rootPath = '/hawkeyes/v1';
intiateSocketFlow();

try {
  initExpress();
} catch (err) {
  console.log('An error occurred starting the service...');
  console.log(err);
  process.exit(1);
}

function initExpress(): void {
  setupSwaggerToolsStack(app, rootPath, swaggerPath, controllerPath, port);
}

function setupSwaggerToolsStack(app: express.Application, rootPath: string, yamlPath: string, controllerPath: string, port?: number): void {
  let yaml = require('js-yaml');
  let swagger = require('swagger-tools');

  let swaggerDefinition = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));

  swagger.initializeMiddleware(swaggerDefinition, (middleware) => {
    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator({ validateResponse: false }));
    app.use(middleware.swaggerRouter({ controllers: controllerPath }));

    if (isSwaggerToolsUXEnabled()) {
      let swaggerToolsUXPath = getDocsURL(SWAGGER_UX_PATH, rootPath);
      let swaggerToolsAPIPath = getDocsURL(SWAGGER_UX_API_PATH, rootPath);
      console.log(`Swagger Tools UX docs path registered at ${swaggerToolsUXPath}`);
      console.log(`Swagger Tools UX api-docs path registered at ${swaggerToolsAPIPath}`);
      app.use(middleware.swaggerUi({
        swaggerUi: swaggerToolsUXPath,
        apiDocs: swaggerToolsAPIPath
      }));
    } else {
      console.log(`Swagger Tools UX is not enabled`);
    }
    if (port != null) {
      console.log(`Listening on port ${port}`);
      app.listen(port);
    }
  });
}

function getDocsURL(defaultPath: string, rootPath?: string): string {
  if (rootPath != null) {
    return rootPath + defaultPath;
  } else {
    return defaultPath;
  }
}
function isSwaggerToolsUXEnabled(): boolean {
  let enabled = false;
  if (config.has(DEV_ENDPOINT)) {
    let dev: any = config.get(DEV_ENDPOINT);
    if (dev.has(SWAGGER_CONFIG)) {
      enabled = String(dev.get(SWAGGER_CONFIG)) === String(true);
    }
  }
  return enabled;
}

export const server = app;
