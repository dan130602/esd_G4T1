import { approveReturnRequest, rejectReturnRequest, getAllPendingRequest, createReturnRequest} from "../services/supplierService.js";
import { sendRefundStatus } from '../kafka/producer.js';


export const getAllPendingRequestController = async (req, res) => {
    try {
        const pendingRequests = await getAllPendingRequest();
        res.status(200).json(pendingRequests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createReturnRequestController = async (req, res) => {
    try {
        const { order_id, item_id, user_id, state_of_good, return_status, reason, quantity } = req.body;
        const newReturnRequest = await createReturnRequest(order_id, item_id, user_id, state_of_good, return_status, reason, quantity);
        res.status(201).json(newReturnRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const approveReturnRequestController  = async (req, res) => {
    try {
        const { return_id } = req.params;
        const { item_id } = req.body;
        const updatedReturnRequest = await approveReturnRequest(return_id, item_id);
        if (!updatedReturnRequest)
            return res.status(404).json({ error: "Return request not found" });

        // await sendRefundStatus({
        //     returnId: return_id,
        //     status: 'approved',
        //     timestamp: new Date().toISOString()
        //   });

        res.status(200).json(updatedReturnRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const rejectReturnRequestController = async (req, res) => {
    try {
        const { return_id } = req.params;
        const updatedReturnRequest = await rejectReturnRequest(return_id);
        if (!updatedReturnRequest)
            return res.status(404).json({ error: "Return request not found" });

        await sendRefundStatus({
            returnId: return_id,
            status: 'rejected',
            timestamp: new Date().toISOString()
          });

        res.status(200).json(updatedReturnRequest);
    } catch (error) {
        res.status(500).json({ error: "Failed to reject return request" });
    }
}