import express from 'express';
import { RegisterRoutes } from './routes';
import * as HttpStatus from 'http-status-codes';
import './controllers/employee.controller';

interface IError {
  status?: number;
  fields?: string[];
  message?: string;
  name?: string;
}

async function bootstrap() {
  try {
    const app = express();
    const port = parseInt(process.env.PORT || '3000');

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.listen(port);
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'content-type, x-global-request-id, corban, corban-partner');

      next();
    });

    RegisterRoutes(app);

    app.use(
      (
        err: IError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const body = {
          fields: err.fields || undefined,
          message: err.message || 'An error occurred during the request.',
          name: err.name,
          requestBody: req.body,
          requestHeaders: req.headers,
          status
        };
        res.setHeader('Content-Type', 'application/json');
        res.status(status).json(body);
        next();
      }
    );

    console.log(`Server is listening on port ${port}`);
  } catch (e) {
    console.log(e);
  }
}

bootstrap().catch((err) => console.log(err));
