import {approveReturnRequestController, rejectReturnRequestController, getAllPendingRequestController} from "../controllers/supplierController.js";
import express from 'express';

const router = express.Router();

router.get('/', getAllPendingRequestController); 
router.put('/approve/:return_id', approveReturnRequestController);
router.put('/reject/:return_id', rejectReturnRequestController);

export default router;