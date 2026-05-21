import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ClipboardList, Package, Truck, Home, Calendar, MapPin, Hash, Sparkles } from 'lucide-react';

export default function OrderTracking() {
  const { orders, fetchOrders, trackedOrderId, setTrackedOrderId, activeTab, setActiveTab } = useApp();

  // Load orders on page mount to reflect real-time admin changes!
  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Find currently active tracked order
  const activeOrder = orders.find((o) => o.id === trackedOrderId) || orders[0];

  useEffect(() => {
    if (activeOrder && activeOrder.id !== trackedOrderId) {
      setTrackedOrderId(activeOrder.id);
    }
  }, [activeOrder, trackedOrderId, setTrackedOrderId]);

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass animate-slide-up" style={{ padding: '48px', maxWidth: '520px', margin: '0 auto' }}>
          <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
            You haven't placed any orders yet. Head over to our catalog, add some premium items, and checkout to see tracking!
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('catalog')}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Define steps
  const steps = [
    { label: 'Pending', icon: ClipboardList, desc: 'Order received & queued' },
    { label: 'Processing', icon: Package, desc: 'Quality packing & preparing' },
    { label: 'Shipped', icon: Truck, desc: 'In transit to destination' },
    { label: 'Delivered', icon: Home, desc: 'Successfully delivered' },
  ];

  // Helper to determine status step number (0-3)
  const getStatusIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const activeIndex = getStatusIndex(activeOrder?.orderStatus || 'Pending');

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Selector for other orders */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '4px' }}>
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Real-time fulfillment tracking updates
          </p>
        </div>

        {/* Dropdown to switch orders */}
        <div className="glass" style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderColor: 'var(--border-glass)',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Select Order:</span>
          <select
            value={trackedOrderId || ''}
            onChange={(e) => setTrackedOrderId(e.target.value)}
            className="form-input"
            style={{
              height: '34px',
              padding: '0 32px 0 12px',
              width: '180px',
              fontSize: '13px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'var(--border-glass)',
              cursor: 'pointer',
            }}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id} style={{ background: '#120e26' }}>
                Order #{o.id.substring(0, 8)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeOrder && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '32px',
        }}>
          {/* Tracking Timeline Block */}
          <div className="glass animate-slide-up" style={{ padding: '32px' }}>
            {/* Order Meta Panel */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '36px',
              borderBottom: '1px solid var(--border-glass)',
              paddingBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={16} color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>ID:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{activeOrder.id}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--primary)" />
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Placed:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                  {new Date(activeOrder.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>

            {/* Real-time Timeline Visualization */}
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              margin: '0 20px 48px 20px',
            }}>
              {/* Progress Connector Line (Background) */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                zIndex: 0,
              }} />

              {/* Progress Connector Line (Active Fill) */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: `${(activeIndex / 3) * 100}%`,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                zIndex: 1,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />

              {/* Step Nodes */}
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = idx <= activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <div key={s.label} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2,
                    width: '80px',
                    textAlign: 'center',
                  }}>
                    {/* Node Bubble */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#080612' : '#14112e',
                      border: '2px solid',
                      borderColor: isCompleted 
                        ? (isActive ? 'var(--primary)' : 'var(--secondary)') 
                        : 'var(--border-glass)',
                      boxShadow: isActive 
                        ? '0 0 20px rgba(139, 92, 246, 0.4)' 
                        : (isCompleted ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted 
                        ? (isActive ? 'var(--primary)' : 'var(--secondary)') 
                        : 'var(--text-muted)',
                      cursor: 'default',
                      transition: 'var(--transition-smooth)',
                    }}>
                      {isCompleted && !isActive ? (
                        <Check size={18} />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>

                    {/* Node Text */}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isCompleted ? '#fff' : 'var(--text-muted)',
                      marginTop: '12px',
                      display: 'block',
                    }}>
                      {s.label}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      lineHeight: '1.3',
                      display: 'block',
                    }}>
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Items Purchased List */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
                Items Ordered
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeOrder.items.map((item) => (
                  <div 
                    key={item.productId}
                    className="glass"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      borderColor: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '52px',
                          height: '52px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--border-glass)',
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Details Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Delivery address */}
            <div className="glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--primary)" />
                Shipping Destination
              </h3>

              <div style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: '1.6' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>Address Details:</span>
                <span style={{ display: 'block' }}>{activeOrder.shippingAddress.street}</span>
                <span style={{ display: 'block' }}>
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zip}
                </span>
                <span style={{ display: 'block', color: 'var(--text-muted)' }}>{activeOrder.shippingAddress.country}</span>
              </div>
            </div>

            {/* Billing total summary */}
            <div className="glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Financial Summary</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13px',
              }}>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Price Subtotal</span>
                  <span>${(parseFloat(activeOrder.totalAmount) / 1.08).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                  <span style={{ color: 'var(--secondary)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                  <span> ${(parseFloat(activeOrder.totalAmount) * 0.08 / 1.08).toFixed(2)}</span>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '12px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 700,
                }}>
                  <span style={{ color: '#fff', fontFamily: 'var(--font-display)' }}>Paid Amount</span>
                  <span style={{ color: 'var(--secondary)', fontFamily: 'var(--font-display)' }}>
                    ${parseFloat(activeOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Realtime Updates Status Note */}
            <div className="glass" style={{ 
              padding: '16px', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              borderColor: 'rgba(139,92,246,0.15)',
              backgroundColor: 'rgba(139,92,246,0.02)',
            }}>
              <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                This tracking page updates instantly! Administrators can update fulfillment status on the Admin panel, which propagates here immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
