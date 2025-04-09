
import Shop from "../models/shopModel.js";

const ShopService = {
    async getAllItems() {
        return await Shop.findAll();
    },

    async getItemById(itemId) {
        return await Shop.findByPk(itemId);
    },

    async updateItem(itemId, updateData) {
        const item = await Shop.findByPk(itemId);
        if (!item) return null;

        await item.update(updateData);
        return item;
    }
};

export default ShopService;
