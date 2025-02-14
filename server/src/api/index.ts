import express, {Request, Response} from 'express';

import postRoute from './routes/postRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'blog api v1',
  });
});

router.use('/post', postRoute);

export default router;