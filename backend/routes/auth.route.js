import express from 'express'
import { registerUser, loginUser, logoutUser, getMe, checkToken } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'


const router = express.Router();

router.get("/", checkToken);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe)

export default router;