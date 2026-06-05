import { createContext } from 'react';

export const CartContext = createContext({
  cart: null,
  loading: false,
  error: null,
  fetchCart: async () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  itemCount: 0,
});
