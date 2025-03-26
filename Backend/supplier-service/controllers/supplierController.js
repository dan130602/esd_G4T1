import { approveReturnRequest, rejectReturnRequest, getAllPendingRequest} from "../services/supplierService.js";


export const getAllPendingRequestController = async (req, res) => {
    try {
        const pendingRequests = await getAllPendingRequest();
        res.status(200).json(pendingRequests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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