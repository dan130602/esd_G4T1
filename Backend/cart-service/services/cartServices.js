import client from '../config/redis.js';

const addItemToCart = async (userId, item) => {
    try {
        const cartKey = `cart:${userId}`;
        let cart = await client.get(cartKey);
        cart = cart ? JSON.parse(cart) : [];
        const existingItemIndex = cart.findIndex((i) => i.item_id === item.item_id);
        if (existingItemIndex !== -1) {
            // If item exists, update quantity
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Otherwise, add new item
            cart.push(item);
        }
        
        await client.set(cartKey, JSON.stringify(cart), {
            EX: 3600  // Expire in 1 hr
        });
    
        return cart;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const getFromCart = async (userId) => {
    try {
        const cartKey = `cart:${userId}`;
        const cart = await client.get(cartKey);
        console.log(cart)
        return cart;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const removeItemFromCart = async (userId, itemId, decreaseBy) => {
    try {
        const cartKey = `cart:${userId}`;
        let cart = await client.get(cartKey);
        cart = cart ? JSON.parse(cart) : [];

        // Find the item in the cart
        const existingItemIndex = cart.findIndex((i) => i.item_id === itemId);

        if (existingItemIndex !== -1) {
            // If item exists, decrease quantity
            cart[existingItemIndex].quantity -= decreaseBy;

            // If quantity is 0 or less, remove item completely
            if (cart[existingItemIndex].quantity <= 0) {
                cart.splice(existingItemIndex, 1);
            }
        }

        await client.set(cartKey, JSON.stringify(cart), "EX", 3600);

        return cart;
    } catch (err) {
        console.error("Error in removeItemFromCart:", err);
        return false;
    }
};

export {addItemToCart, getFromCart, removeItemFromCart};