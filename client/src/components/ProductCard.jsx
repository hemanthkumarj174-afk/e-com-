import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="glass glass-hover animate-slide-up" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: '16px',
      height: '100%',
    }}>
      {/* Image Container with Hover Scale */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '65%', // Aspect ratio 16:10ish
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Category Badge */}
        <span className="badge badge-primary" style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backdropFilter: 'blur(8px)',
        }}>
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="badge badge-danger" style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(8px)' }}>
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="badge badge-warning" style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(8px)', animation: 'pulse 2s infinite' }}>
            Only {product.stock} Left
          </span>
        ) : (
          <span className="badge badge-success" style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            {product.stock} Available
          </span>
        )}
      </div>

      {/* Content Details */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
          fontFamily: 'var(--font-display)',
          lineHeight: '1.4',
        }}>
          {product.name}
        </h3>
        
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '13px',
          lineHeight: '1.5',
          marginBottom: '20px',
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {product.description}
        </p>

        {/* Action Panel */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--secondary)',
              fontFamily: 'var(--font-display)',
              textShadow: '0 0 10px rgba(16, 185, 129, 0.15)',
            }}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <button
            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-success'}`}
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              gap: '6px',
            }}
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
