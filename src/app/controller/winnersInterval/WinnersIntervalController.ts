import { Request, Response } from 'express';
import WinnersIntervalService from '../../services/winnersInterval/WinnersIntervalService';

class WinnersInterval {
  async listWinnersByInterval(_req: Request, res: Response): Promise<Response> {
    const response = await WinnersIntervalService.execute();
    return res.status(200).json(response);
  }
}

export default new WinnersInterval();
