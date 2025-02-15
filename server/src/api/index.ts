import express, {Request, Response} from 'express';

import postRoute from './routes/postRoute';
import userRoute from './routes/userRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'blog api v1',
  });
});

router.use('/post', postRoute);
router.use('/user', userRoute);

export default router;