import {addItemToCart, getFromCart, removeItemFromCart} from "../services/cartServices.js";

export const addToCart = async (req, res) => {
	try {
		const { userId, item } = req.body;
		if (!userId || !item) {
			return res
				.status(400)
				.json({ error: "User ID and item are required" });
		}

		const updatedCart = await addItemToCart(userId, item);
		res.json({ success: true, cart: updatedCart });
	} catch (error) {
		console.error("Error adding to cart:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getCart = async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}

		const cart = await getFromCart(userId);
        console.log(cart)
		res.json({ cart: JSON.parse(cart) });
	} catch (error) {
		console.error("Error getting cart:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, decreaseBy } = req.body;
        if (!userId || !itemId || !decreaseBy) {
            return res
                .status(400)
                .json({ error: "User ID, Item ID, and decreaseBy are required" });
        }

        const updatedCart = await removeItemFromCart(userId, itemId, decreaseBy);
        res.json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
