import Supplier from "../models/supplierModel.js";

// const createReturnRequest = async (order_id, item_id, user_id, state_of_good, return_status, reason) => {
//     return await Supplier.create({
//         order_id,
//         item_id,
//         user_id,
//         state_of_good,
//         return_status,
//         reason,
//     });   
// }

const getAllPendingRequest = async () => {
    return await Supplier.findAll(
        {where: { return_status: "PENDING" }}
    );
}

const approveReturnRequest = async (return_id) => {
    return await Supplier.update(
        { return_status: "approved", reason: null , updated_at: new Date() },
        { where: { return_id } }
    );
}

const rejectReturnRequest = async (return_id, givenReason) => {
    if (!givenReason) {
        throw new Error("Rejection reason is required.");
    }
    return await Supplier.update(
        { return_status: "rejected" , reason: givenReason, updated_at: new Date() },   
        { where: { return_id } }
    );
}

export { getAllPendingRequest, approveReturnRequest, rejectReturnRequest };