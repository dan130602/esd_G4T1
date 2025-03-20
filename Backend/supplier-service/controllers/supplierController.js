import { approveReturnRequest, rejectReturnRequest} from "../services/supplierService.js";

// export const createReturnRequest = async (req, res) => {
//     try {
//         const { order_id, item_id, user_id, state_of_good, return_status, reason } = req.body;
//         const newReturnRequest = await createReturnRequest(order_id, item_id, user_id, state_of_good, return_status, reason);
//         res.status(201).json(newReturnRequest);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to create return request" });
//     }
// }

export const approveReturnRequestController  = async (req, res) => {
    try {
        const { return_id } = req.params;
        const updatedReturnRequest = await approveReturnRequest(return_id);
        if (!updatedReturnRequest)
            return res.status(404).json({ error: "Return request not found" });

        res.status(200).json(updatedReturnRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const rejectReturnRequestController = async (req, res) => {
    try {
        const { return_id } = req.params;
        const { reason } = req.body;
        const updatedReturnRequest = await rejectReturnRequest(return_id, reason);
        if (!updatedReturnRequest)
            return res.status(404).json({ error: "Return request not found" });

        res.status(200).json(updatedReturnRequest);
    } catch (error) {
        res.status(500).json({ error: "Failed to reject return request" });
    }
}