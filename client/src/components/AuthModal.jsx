import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User } from 'lucide-react';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, loginUser, registerUser, loading } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      await loginUser(email, password);
    } else {
      await registerUser(name, email, password);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 3, 10, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(139, 92, 246, 0.2)',
        animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Close Button */}
        <button 
          onClick={() => setIsAuthOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '8px', 
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          {authMode === 'login' 
            ? 'Sign in to access your cart and track orders.' 
            : 'Register to unlock checkout and personalized tracking.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', marginBottom: '20px' }}
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
        }}>
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span 
                onClick={() => setAuthMode('register')} 
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span 
                onClick={() => setAuthMode('login')} 
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In
              </span>
            </p>
          )}
        </div>

        {/* Seed helper information */}
        <div className="glass" style={{ 
          marginTop: '20px', 
          padding: '12px 16px', 
          fontSize: '12px',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          borderColor: 'rgba(139, 92, 246, 0.15)',
        }}>
          <p style={{ color: '#c084fc', fontWeight: 600, marginBottom: '4px' }}>⚡ Seed Accounts for Testing:</p>
          <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span>• <b>Admin:</b> admin@ecom.com / admin123</span>
            <span>• <b>User:</b> user@ecom.com / user123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
