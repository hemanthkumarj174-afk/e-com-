import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, LogIn, LogOut, ShieldAlert, Sparkles, User, ShoppingBag } from 'lucide-react';

export default function Header() {
  const { 
    user, 
    logoutUser, 
    setIsAuthOpen, 
    setAuthMode, 
    cart, 
    setIsCartOpen, 
    activeTab, 
    setActiveTab 
  } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      margin: '16px auto',
      width: 'calc(100% - 32px)',
      maxWidth: '1200px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('catalog')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #fff 30%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            AURA
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <span 
            className={`nav-tab ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
            style={{ 
              fontSize: '15px', 
              fontWeight: 500, 
              color: activeTab === 'catalog' ? '#fff' : 'var(--text-muted)',
              padding: '6px 0',
            }}
          >
            Catalog
          </span>

          {user && user.role !== 'admin' && (
            <span 
              className={`nav-tab ${activeTab === 'orders' || activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              style={{ 
                fontSize: '15px', 
                fontWeight: 500, 
                color: activeTab === 'orders' || activeTab === 'tracking' ? '#fff' : 'var(--text-muted)',
                padding: '6px 0',
              }}
            >
              My Orders
            </span>
          )}

          {user && user.role === 'admin' && (
            <span 
              className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ 
                fontSize: '15px', 
                fontWeight: 500, 
                color: activeTab === 'admin' ? '#fff' : 'var(--text-muted)',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldAlert size={14} color="#fca5a5" />
              Admin Panel
            </span>
          )}
        </nav>

        {/* Right Action Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{user.name}</span>
                <span style={{ 
                  fontSize: '10px', 
                  color: user.role === 'admin' ? '#fca5a5' : '#6ee7b7', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {user.role}
                </span>
              </div>
              <button 
                onClick={logoutUser}
                title="Log Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  padding: '8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#fca5a5';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px', gap: '6px' }}
            >
              <LogIn size={15} />
              Sign In
            </button>
          )}

          {/* Cart Icon trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#c084fc',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)';
              e.currentTarget.style.color = '#c084fc';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.1)';
            }}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'linear-gradient(135deg, var(--secondary) 0%, #059669 100%)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-dark)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                animation: 'bounce 0.3s ease-out',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
