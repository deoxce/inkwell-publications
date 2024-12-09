import { Router } from 'express';
import { verifyUserToken } from '../middleware/auth.js';
import { signUp, signIn, getUserData } from '../controllers/user.js'

const router = Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/user', verifyUserToken, getUserData);

export default router;