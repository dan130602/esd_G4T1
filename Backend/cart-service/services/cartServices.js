import client from '../config/redis.js';
import axios from 'axios';

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

// const sendToOrder = async (userId) => {
//     try {
//         const cartKey = `cart:${userId}`;
//         let cart = await client.get(cartKey);
//         cart = cart ? JSON.parse(cart) : [];
//         let cartJson = cart[0]
//         console.log(cartJson)

//         // Send cart to order service
//         const response = await axios.post('http://order-service:5001/api/order', { user_id: userId, items: cartJson });
//         console.log(response.data)
//         // Clear the cart after sending
//         await client.del(cartKey);

//         return response.data;
//     } catch (err) {
//         console.error("Error in sendToOrder:", err);
//         return false;
//     }
// }

const sendToOrder = async (userId) => {
    try {
        const cartKey = `cart:${userId}`;
        let cart = await client.get(cartKey);
        cart = cart ? JSON.parse(cart) : [];

        // Make sure we have items in the cart
        if (cart.length === 0) {
            return { error: "Cart is empty" };
        }

        // Modify the cart items to match the order service's expected format
        const formattedCart = cart.map(item => ({
            item_id: item.item_id,
            item_name: item.item_name,
            item_price: item.unit_price,  // Rename price to item_price if needed
            quantity: item.quantity
        }));

        // Send cart to order service (properly formatted as an array)
        const response = await axios.post('http://order-service:5001/api/order', {
            user_id: userId,
            items: formattedCart  // Send the entire array, not just the first item
        });

        console.log(response.data);

        // Clear the cart after sending
        await client.del(cartKey);

        return response.data;
    } catch (err) {
        console.error("Error in sendToOrder:", err);
        return false;
    }
}

export {addItemToCart, getFromCart, removeItemFromCart, sendToOrder};