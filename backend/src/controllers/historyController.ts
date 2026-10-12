import { Request, Response } from 'express';
import { historyService } from '../services/historyService.js';

export const historyController = {
  async getHistory(req: Request, res: Response) {
    const type = req.query.type as string;
    const history = await historyService.getHistory(undefined, type);
    res.json(history);
  },

  async deleteItem(req: Request, res: Response) {
    const { id } = req.params;
    const success = await historyService.deleteHistoryItem(id);
    res.json({ success });
  },

  async clearHistory(req: Request, res: Response) {
    const success = await historyService.clearAllHistory();
    res.json({ success });
  },
};
