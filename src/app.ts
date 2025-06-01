import express from 'express';
import routes from './infra/http/routes';
import LoadExcelFile from './app/services/loadExcelFile/LoadExcelFile';

const app = express();

app.use(routes);

LoadExcelFile.execute();

export default app;
