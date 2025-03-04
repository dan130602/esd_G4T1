import { addToCart, getCart, removeFromCart } from '../controller/cartController.js';
import { Router } from 'express';

const router = Router();

router.post('/', addToCart);
router.get('/:userId', getCart);
router.post('/remove', removeFromCart);

export default router;