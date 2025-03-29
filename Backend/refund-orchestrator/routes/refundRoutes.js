import { processRefundController} from "../controllers/refundController.js";
import express from 'express';

const router = express.Router();

router.post('/', processRefundController); 

export default router;