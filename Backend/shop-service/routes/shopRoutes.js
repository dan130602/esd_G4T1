import {getAllItems, getItemById, updateItem} from "../controllers/shopController.js";
import express from 'express';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);    
router.put('/:id', updateItem);

export default router;