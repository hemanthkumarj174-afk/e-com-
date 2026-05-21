import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // --- Auth State ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // --- Catalog & Cart State ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- Orders & Tracking State ---
  const [orders, setOrders] = useState([]);
  const [trackedOrderId, setTrackedOrderId] = useState(null);

  // --- Navigation & UI State ---
  const [activeTab, setActiveTab] = useState('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync token to user details on load
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        // Simple decode JWT payload to get user role/name
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        
        // Check if token expired
        if (decoded.exp * 1000 < Date.now()) {
          logoutUser();
          showToast('error', 'Session expired. Please log in again.');
        } else {
          setUser(decoded);
        }
      } catch (e) {
        console.error('Invalid cached token:', e);
        logoutUser();
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Load products on start or tab changes
  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync orders when user changes or tab switches
  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [token, activeTab]);

  // --- Dynamic Toast System ---
  const showToast = (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Auth Actions ---
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      setToken(data.token);
      showToast('success', `Welcome back, ${data.user.name}!`);
      setIsAuthOpen(false);
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('catalog');
      }
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setToken(data.token);
      showToast('success', `Account created! Welcome, ${data.user.name}!`);
      setIsAuthOpen(false);
      setActiveTab('catalog');
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setToken('');
    setUser(null);
    setOrders([]);
    localStorage.removeItem('token');
    setActiveTab('catalog');
    showToast('success', 'Logged out successfully.');
  };

  // --- Catalog Actions ---
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const url = `/api/products?${queryParams.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products.');
      }

      setProducts(data);
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    
    // Check stock ceiling
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    if (product.stock < currentQtyInCart + quantity) {
      showToast('error', `Cannot add more. Only ${product.stock} items in stock.`);
      return;
    }

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart((prev) => [...prev, { product, quantity }]);
    }
    
    showToast('success', `Added ${product.name} to cart.`);
  };

  const removeFromCart = (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast('success', `Removed ${item.product.name} from cart.`);
    }
  };

  const updateCartQty = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (item.product.stock < newQuantity) {
      showToast('error', `Only ${item.product.stock} items available in stock.`);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Order Actions ---
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders.');
      }
      setOrders(data);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
    }
  };

  const checkoutOrder = async (shippingAddress) => {
    if (!token) {
      setIsAuthOpen(true);
      showToast('error', 'Please log in to place an order.');
      return false;
    }

    if (cart.length === 0) {
      showToast('error', 'Your cart is empty.');
      return false;
    }

    setLoading(true);
    try {
      // Map cart to expected format in backend
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: orderItems, shippingAddress }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed.');
      }

      showToast('success', 'Order placed successfully! Thank you.');
      clearCart();
      
      // Update local catalogs (since stocks changed!)
      fetchProducts();
      
      // Set tracking focus and redirect
      setTrackedOrderId(data.id);
      setActiveTab('tracking');
      
      // Refresh user orders list
      fetchOrders();
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Admin Product CRUD ---
  const adminAddProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product.');
      }

      showToast('success', `Successfully added product: ${data.name}`);
      fetchProducts(); // Refresh catalog
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminUpdateProduct = async (productId, productData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product.');
      }

      showToast('success', `Updated product: ${data.name}`);
      fetchProducts(); // Refresh catalog
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminDeleteProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product.');
      }

      showToast('success', 'Product deleted successfully.');
      fetchProducts(); // Refresh catalog
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Admin Order Controls ---
  const adminUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status.');
      }

      showToast('success', `Order status updated to '${newStatus}'`);
      fetchOrders(); // Refresh order listings
      return true;
    } catch (error) {
      showToast('error', error.message);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        token,
        loginUser,
        registerUser,
        logoutUser,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        
        // Catalog & Cart
        products,
        fetchProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        
        // Orders & Tracking
        orders,
        fetchOrders,
        trackedOrderId,
        setTrackedOrderId,
        checkoutOrder,
        
        // UI Navigation
        activeTab,
        setActiveTab,
        toasts,
        showToast,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
