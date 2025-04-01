import Supplier from "../models/supplierModel.js";
import axios from "axios";
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

const createReturnRequest = async (order_id, item_id, user_id, state_of_good, return_status, reason) => {
    return await Supplier.create({
        order_id,
        item_id,
        user_id,
        state_of_good,
        return_status,
        reason,
    });   
}

const approveReturnRequest = async (return_id,item_id) => {
    const [updatedCount, updatedReturns] = await Supplier.update(
        { return_status: "approved", reason: null , updated_at: new Date() },
        { where: { return_id }, returning: true }
    );
    
    const response = await axios.get(`http://shop-service:3006/shop/${item_id}`)
    const currentQuantity = response.data["quantity"]
    await axios.put(`http://shop-service:3006/shop/${item_id}`, {
        item_id: response.data.item_id,
        item_name: response.data.item_name,
        price: response.data.price,
        quantity: currentQuantity + 1
      });

    return updatedReturns[0];

}

const rejectReturnRequest = async (return_id, givenReason) => {
    if (!givenReason) {
        throw new Error("Rejection reason is required.");
    }
    return await Supplier.update(
        { return_status: "rejected" , reason: givenReason, updated_at: new Date() },   
        { where: { return_id }, returning: true }
    );
}

export { getAllPendingRequest, approveReturnRequest, rejectReturnRequest, createReturnRequest };