import { processRefund } from '../services/refundService.js';

export const processRefundController = async (req, res) => {
    const { userId, orderId, refundAmount, reason } = req.body;

    try {
        const result = await processRefund(userId, orderId, refundAmount, reason);

        if (result.success) {
            return res.status(200).json({ message: 'Refund request processed successfully' });
        } else {
            return res.status(400).json({ message: result.message });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};