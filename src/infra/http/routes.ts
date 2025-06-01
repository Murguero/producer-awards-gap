import { Router } from 'express';
import WinnersIntervalController from '../../app/controller/winnersInterval/WinnersIntervalController';

const routes = Router();

routes.get('/winners', WinnersIntervalController.listWinnersByInterval);

export default routes;
