import ShopService from "../services/shopService.js";

// get all
export const getAllItems = async (req, res) => {
	try {
		const items = await ShopService.getAllItems();
		res.status(200).json(items);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch items" });
	}
};

// fetch by id
export const getItemById = async (req, res) => {
	try {
		const { id } = req.params;
		const item = await ShopService.getItemById(id);
		if (!item) return res.status(404).json({ error: "Item not found" });

		res.status(200).json(item);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch item" });
	}
};


export const updateItem = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedItem = await ShopService.updateItem(id, req.body);
		if (!updatedItem)
			return res.status(404).json({ error: "Item not found" });

		res.status(200).json(updatedItem);
	} catch (error) {
		res.status(500).json({ error: "Failed to update item" });
	}
};
