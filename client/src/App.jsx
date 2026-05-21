import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Catalog from './components/Catalog';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { AlertCircle, CheckCircle, Flame } from 'lucide-react';

function AppContent() {
  const { activeTab, toasts } = useApp();

  // Route view selector
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'catalog':
        return <Catalog />;
      case 'checkout':
        return <Checkout />;
      case 'orders':
      case 'tracking':
        return <OrderTracking />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Catalog />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top sticky brand header */}
      <Header />

      {/* Main routing area */}
      <main style={{ flexGrow: 1, padding: '20px 0' }}>
        {renderActiveTab()}
      </main>

      {/* Overlays */}
      <CartDrawer />
      <AuthModal />

      {/* Dynamic Notification Toast Stack */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type} glass`}>
            {t.type === 'success' ? (
              <CheckCircle size={18} color="var(--secondary)" />
            ) : (
              <AlertCircle size={18} color="var(--danger)" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-glass)',
        padding: '32px 0',
        backgroundColor: 'rgba(5, 3, 10, 0.4)',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-muted)',
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontWeight: 600 }}>
            <Flame size={14} color="var(--primary)" />
            AURA Premium E-Commerce Workspace
          </p>
          <p>© 2026 AURA Storefront Inc. All rights reserved. Powered by Node.js, Express, Sequelize, and React.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
