import { Router } from 'express';
import { historyController } from '../controllers/historyController.js';

export const historyRouter = Router();

historyRouter.get('/', historyController.getHistory);
historyRouter.delete('/:id', historyController.deleteItem);
historyRouter.delete('/', historyController.clearHistory);
