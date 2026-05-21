import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, FilterX, HelpCircle, PackageOpen } from 'lucide-react';

export default function Catalog() {
  const { products, fetchProducts, loading } = useApp();

  // --- Filter states ---
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Categories list
  const categories = ['All', 'Electronics', 'Apparel', 'Home', 'Books'];

  // Apply filters on changes (debounced search would be nice, let's trigger search on filter changes or manual submit)
  useEffect(() => {
    fetchProducts({ category, search, minPrice, maxPrice, sort });
  }, [category, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts({ category, search, minPrice, maxPrice, sort });
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    fetchProducts({ category: 'All' });
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Banner / Hero Section */}
      <div className="glass animate-slide-up" style={{
        padding: '48px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow Spheres */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          filter: 'blur(60px)',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '38px',
            fontWeight: 800,
            marginBottom: '12px',
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Explore the Aura Collection
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
            Immerse yourself in our curated selection of high-quality electronics, handcrafted apparel, modern home essentials, and creative books.
          </p>
        </div>
      </div>

      {/* Catalog Controls Grid */}
      <div style={{ marginBottom: '32px' }}>
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Category Pill Selectors */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            maxWidth: '100%',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: category === cat ? 'var(--primary)' : 'var(--border-glass)',
                  background: category === cat ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: category === cat ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                  boxShadow: category === cat ? '0 0 12px rgba(139, 92, 246, 0.15)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (category !== cat) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  if (category !== cat) e.currentTarget.style.borderColor = 'var(--border-glass)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Action Panel */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '480px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '48px', height: '44px' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0 20px', height: '44px', borderRadius: '12px' }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
              style={{
                width: '44px',
                height: '44px',
                padding: 0,
                borderRadius: '12px',
                borderColor: showFilters ? 'var(--primary)' : 'var(--border-glass)',
                background: showFilters ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                color: showFilters ? '#fff' : 'var(--text-muted)',
              }}
              title="Toggle Advanced Filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </form>

        {/* Advanced Filters Sliding Drawer */}
        {showFilters && (
          <div className="glass animate-slide-up" style={{
            marginTop: '16px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            backgroundColor: 'rgba(18, 14, 38, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {/* Price Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price Range</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ height: '38px', padding: '8px 12px' }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>to</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ height: '38px', padding: '8px 12px' }}
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sort Products</label>
              <div style={{ position: 'relative' }}>
                <ArrowUpDown size={14} style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-input"
                  style={{
                    height: '38px',
                    padding: '8px 32px 8px 12px',
                    appearance: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="" style={{ background: '#1c1936' }}>Newest Arrivals</option>
                  <option value="priceAsc" style={{ background: '#1c1936' }}>Price: Low to High</option>
                  <option value="priceDesc" style={{ background: '#1c1936' }}>Price: High to Low</option>
                  <option value="nameAsc" style={{ background: '#1c1936' }}>Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fetchProducts({ category, search, minPrice, maxPrice, sort })}
                className="btn btn-primary"
                style={{ flexGrow: 1, height: '38px', fontSize: '13px', padding: 0 }}
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FilterX size={14} />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Grid Section */}
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 0',
          gap: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(139, 92, 246, 0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading products...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid animate-fade-in">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass" style={{
          padding: '60px 24px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '40px auto',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <PackageOpen size={48} color="var(--text-muted)" />
          <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 600 }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            We couldn't find any products matching your active filters. Try adjusting your search term, resetting filters, or selecting a different category.
          </p>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleResetFilters}
            style={{ fontSize: '13px', padding: '10px 20px', marginTop: '8px' }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
