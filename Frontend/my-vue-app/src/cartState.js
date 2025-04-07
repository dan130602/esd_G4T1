import { reactive, watch } from 'vue';

// Load saved quantity from localStorage (or 0 if none)
const storedQuantity = parseInt(localStorage.getItem('cartQuantity')) || 0;

// Reactive state object
export const cartState = reactive({
  totalQuantity: storedQuantity
});

// Automatically persist to localStorage whenever it changes
watch(
  () => cartState.totalQuantity,
  (newQty) => {
    localStorage.setItem('cartQuantity', newQty.toString());
  }
);
