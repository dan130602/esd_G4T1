
import Shop from "../models/shopModel.js";

const ShopService = {
    async getAllItems() {
        return await Shop.findAll();
    },

    async getItemById(itemId) {
        return await Shop.findByPk(itemId);
    },

    async createItem(itemData) {
        return await Shop.create(itemData);
    },

    async updateItem(itemId, updateData) {
        const item = await Shop.findByPk(itemId);
        if (!item) return null;

        await item.update(updateData);
        return item;
    },

    async deleteItem(itemId) {
        const deleted = await Shop.destroy({ where: { item_id: itemId } });
        return deleted; // Returns number of rows deleted (0 if item not found)
    }
};

export default ShopService;
