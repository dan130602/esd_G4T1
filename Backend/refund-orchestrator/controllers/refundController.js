import processRefund from '../services/refundService.js';
export const processRefund = async (req, res) => {
    const { userId, orderId, refundAmount } = req.body;

    try {
        const result = await refundService.processRefund(userId, orderId, refundAmount);

        if (result.success) {
            return res.status(200).json({ message: 'Refund processed successfully' });
        } else {
            return res.status(400).json({ message: result.message });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};