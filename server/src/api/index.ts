import express, {Request, Response} from 'express';

import postRoute from './routes/postRoute';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'blog api v1',
  });
});

router.use('/post', postRoute);
router.use('/user', userRoute);
router.use('/auth', authRoute);

export default router;