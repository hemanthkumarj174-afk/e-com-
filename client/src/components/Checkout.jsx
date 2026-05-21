import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Truck, ShieldCheck, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { cart, checkoutOrder, activeTab, setActiveTab, loading } = useApp();

  // --- Shipping State ---
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  // --- Payment State (Mock) ---
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form step tracker: 'shipping' or 'payment'
  const [step, setStep] = useState('shipping');

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const shippingFee = 0.00; // Free shipping promo!
  const estTax = subtotal * 0.08; // 8% estimated tax
  const grandTotal = subtotal + shippingFee + estTax;

  if (cart.length === 0 && activeTab === 'checkout') {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '40px', maxWidth: '480px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            There are no products in your cart to check out.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('catalog')}>
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    const address = { street, city, state, zip, country };
    await checkoutOrder(address);
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Return to shop */}
      <button 
        onClick={() => setActiveTab('catalog')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '14px',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'var(--transition-smooth)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} />
        Back to Catalog
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '32px',
      }}>
        {/* Step Form Panel */}
        <div className="glass" style={{ padding: '32px' }}>
          {/* Step Header Indicators */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '36px',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '20px',
          }}>
            <div 
              onClick={() => step === 'payment' && setStep('shipping')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: step === 'payment' ? 'pointer' : 'default',
                color: step === 'shipping' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: step === 'shipping' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: step === 'shipping' ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                border: '1px solid',
                borderColor: step === 'shipping' ? 'var(--primary)' : 'var(--border-glass)',
              }}>
                1
              </div>
              Shipping Details
            </div>
            <div style={{ height: '1px', flexGrow: 1, backgroundColor: 'var(--border-glass)' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: step === 'payment' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '15px',
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: step === 'payment' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: step === 'payment' ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                border: '1px solid',
                borderColor: step === 'payment' ? 'var(--primary)' : 'var(--border-glass)',
              }}>
                2
              </div>
              Secure Payment
            </div>
          </div>

          {/* Form Content */}
          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
                Where should we ship your order?
              </h3>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="123 Cosmic Way"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nebula City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="California"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="90210"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '8px' }}>
                <Truck size={16} />
                Continue to Payment
              </button>
            </form>
          ) : (
            <form onSubmit={handlePlaceOrderSubmit}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--primary)" />
                Mock Payment Details
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                We support instant secure mock processing. Input any standard dummy credentials to authorize.
              </p>

              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Jane Customer"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '28px',
              }}>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setStep('shipping')}
                  style={{ width: '120px' }}
                >
                  Go Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={loading}
                  style={{ flexGrow: 1, gap: '8px' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      Securing Order...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Authorize & Place Order (${grandTotal.toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Order Summary</h3>
            
            {/* Items list */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '20px',
              maxHeight: '200px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)',
                    }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      {item.product.name}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{
              borderTop: '1px solid var(--border-glass)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                <span>${estTax.toFixed(2)}</span>
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
                <span style={{ color: '#fff', fontFamily: 'var(--font-display)' }}>Total</span>
                <span style={{ color: 'var(--secondary)', fontFamily: 'var(--font-display)' }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Secure Note */}
          <div className="glass" style={{ 
            padding: '16px', 
            fontSize: '12px', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            borderColor: 'rgba(16, 185, 129, 0.1)',
            backgroundColor: 'rgba(16, 185, 129, 0.02)',
          }}>
            <ShieldCheck size={20} color="var(--secondary)" style={{ flexShrink: 0 }} />
            <div style={{ lineHeight: '1.4' }}>
              <span style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Aura Security Guarantee</span>
              Your data is fully encrypted with mock SSL/TLS standards. No real cards will be charged. Safe for testing!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
