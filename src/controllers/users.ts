import { Request, Response } from 'express';

export default {
  list: (req: Request, res: Response) => {
    res.json(123);
  },
};
