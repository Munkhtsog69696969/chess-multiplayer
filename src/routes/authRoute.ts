import express from 'express';
import { register, login, verifyToken } from '../controllers/authController';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = express.Router();


router.post('/register', validationMiddleware, register);

router.post('/login', login);

router.get('/verify', verifyToken);

export default router;
