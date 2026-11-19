import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  features: string[];
  badge: string;
}

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  product: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

interface ProductContextType {
  product: Product;
  orders: Order[];
  updateProduct: (product: Product) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
}

const defaultProduct: Product = {
  name: 'Premium Wireless Headphones',
  description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers, gamers, and professionals who demand the best sound quality.',
  price: 79.99,
  originalPrice: 149.99,
  imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  features: [
    'Active Noise Cancellation (ANC)',
    '40-Hour Battery Life',
    'Bluetooth 5.3 Technology',
    'Memory Foam Ear Cushions',
    'Built-in Microphone',
    'Foldable Design'
  ],
  badge: 'Best Seller'
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product>(() => {
    const saved = localStorage.getItem('product_data');
    return saved ? JSON.parse(saved) : defaultProduct;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('product_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('product_data', JSON.stringify(product));
  }, [product]);

  useEffect(() => {
    localStorage.setItem('product_orders', JSON.stringify(orders));
  }, [orders]);

  const updateProduct = (newProduct: Product) => {
    setProduct(newProduct);
  };

  const addOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status } : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <ProductContext.Provider value={{ product, orders, updateProduct, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
