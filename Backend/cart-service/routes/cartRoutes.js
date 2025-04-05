import { addToCart, getCart, removeFromCart, addToOrder } from '../controller/cartController.js';
import { Router } from 'express';

const router = Router();

router.post('/', addToCart);
router.get('/:userId', getCart);
router.post('/remove', removeFromCart);
router.post('/send', addToOrder);

export default router;