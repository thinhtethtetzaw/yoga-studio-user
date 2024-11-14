import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  classId: number;
  className: string;
  courseName: string;
  courseId: number;
  date: string;
  instructorName: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (classId: number) => void;
  clearCart: () => void;
  isInCart: (classId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    if (!isInCart(item.classId)) {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (classId: number) => {
    setCartItems(cartItems.filter((item) => item.classId !== classId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (classId: number) => {
    return cartItems.some((item) => item.classId === classId);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
