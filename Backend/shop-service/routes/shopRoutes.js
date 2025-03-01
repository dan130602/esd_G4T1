import {getAllItems, getItemById, updateItem, createItem, deleteItem} from "../controllers/shopController.js";
import express from 'express';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);    
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;