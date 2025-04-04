import {approveReturnRequestController, rejectReturnRequestController, getAllPendingRequestController, createReturnRequestController} from "../controllers/supplierController.js";
import express from 'express';

const router = express.Router();

router.get('/', getAllPendingRequestController); 
router.post('/create', createReturnRequestController);
router.put('/approve/:return_id', approveReturnRequestController);
router.put('/reject/:return_id', rejectReturnRequestController);

export default router;