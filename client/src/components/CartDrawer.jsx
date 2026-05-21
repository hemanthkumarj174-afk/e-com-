import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen, 
    user, 
    setIsAuthOpen, 
    setAuthMode, 
    activeTab, 
    setActiveTab,
    showToast
  } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (!user) {
      setIsCartOpen(false);
      setAuthMode('login');
      setIsAuthOpen(true);
      showToast('error', 'Please register or log in to check out.');
    } else {
      setIsCartOpen(false);
      setActiveTab('checkout');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 3, 10, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 500,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Click outside to close backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
      />

      {/* Slide Drawer Panel */}
      <div className="glass" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#0c0a1a',
        borderLeft: '1px solid var(--border-glass)',
        borderRadius: '20px 0 0 20px',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 501,
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Your Cart</h2>
            <span className="badge badge-primary" style={{ fontSize: '11px', padding: '2px 8px' }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              transition: 'var(--transition-smooth)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body - Product Items */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div 
                key={item.product.id}
                className="glass"
                style={{
                  padding: '16px',
                  display: 'flex',
                  gap: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  borderColor: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                {/* Thumb */}
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1px solid var(--border-glass)',
                  }}
                />

                {/* Details */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                      {item.product.name}
                    </h4>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--secondary)' }}>
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-glass)',
                        color: '#fff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 600, width: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-glass)',
                        color: '#fff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove Trash */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{
                    alignSelf: 'center',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                    color: '#fca5a5',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    e.currentTarget.style.color = '#fca5a5';
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              gap: '16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}>
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 600 }}>Your cart is empty</h3>
              <p style={{ fontSize: '13px', maxWidth: '240px', lineHeight: '1.5' }}>
                Browse our catalog and add items to your cart to see them listed here.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '10px 20px', marginTop: '12px' }}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer - Checkouts */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px 28px',
            borderTop: '1px solid var(--border-glass)',
            backgroundColor: 'rgba(12, 10, 26, 0.95)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                fontFamily: 'var(--font-display)',
              }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="btn btn-success"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', gap: '8px' }}
            >
              Checkout Now
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
