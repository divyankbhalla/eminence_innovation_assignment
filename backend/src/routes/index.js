import { Router } from 'express';
import authenticate from '../middlewares/auth.middleware.js';
const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running successfully",
    });
});

export default router;