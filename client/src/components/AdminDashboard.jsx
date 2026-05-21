import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit3, Trash2, ShieldAlert, Sparkles, ClipboardList, Check, ShoppingBag, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    fetchOrders,
    adminAddProduct, 
    adminUpdateProduct, 
    adminDeleteProduct, 
    adminUpdateOrderStatus,
    setActiveTab,
    setTrackedOrderId
  } = useApp();

  // --- Tab State ---
  const [adminTab, setAdminTab] = useState('products'); // 'products' or 'orders'

  // --- Modal Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('10');

  useEffect(() => {
    fetchOrders();
  }, [adminTab]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Electronics');
    setImageUrl('');
    setStock('10');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setStock(product.stock.toString());
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl: imageUrl || undefined,
      stock: parseInt(stock),
    };

    let success = false;
    if (editingProduct) {
      success = await adminUpdateProduct(editingProduct.id, productData);
    } else {
      success = await adminAddProduct(productData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete "${name}"?`)) {
      await adminDeleteProduct(id);
    }
  };

  const handleTrackUserOrder = (orderId) => {
    setTrackedOrderId(orderId);
    setActiveTab('tracking');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Panel */}
      <div className="glass" style={{
        padding: '24px 32px',
        marginBottom: '32px',
        border: '1px solid rgba(239, 68, 68, 0.15)',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <ShieldAlert size={20} color="#fca5a5" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '2px' }}>
              Administrative Portal
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Add/Edit catalogs, manage inventory stock, and oversee order fulfillments
            </p>
          </div>
        </div>

        {/* Toggle subtabs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setAdminTab('products')}
            className={`btn ${adminTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px' }}
          >
            Manage Products
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`btn ${adminTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px' }}
          >
            System Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* 1. PRODUCTS MANAGEMENT TAB */}
      {adminTab === 'products' ? (
        <div className="animate-fade-in">
          {/* Add product action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button className="btn btn-success" onClick={openAddModal} style={{ gap: '6px', padding: '10px 20px', borderRadius: '10px' }}>
              <Plus size={16} />
              Add New Product
            </button>
          </div>

          {/* Catalog grid inside admin panel */}
          <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Product Details</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Level</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'var(--transition-smooth)' }} className="table-row-hover">
                    <td style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--border-glass)',
                        }}
                      />
                      <div>
                        <span style={{ fontWeight: 600, color: '#fff', display: 'block', marginBottom: '2px' }}>{product.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-primary">{product.category}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {product.stock === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : product.stock <= 3 ? (
                        <span className="badge badge-warning">Low Stock ({product.stock})</span>
                      ) : (
                        <span className="badge badge-success">{product.stock} Units</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(product)}
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            color: '#c084fc',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id, product.name)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#fca5a5',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. ORDERS MANAGEMENT TAB */
        <div className="animate-fade-in">
          {orders.length > 0 ? (
            <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px',
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Order ID / Date</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Info</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Summary</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Fulfillment Status</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontWeight: 600, color: '#fff', display: 'block', fontSize: '13px' }}>
                          #{order.id.substring(0, 8)}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontWeight: 600, color: '#fff', display: 'block', fontSize: '13px' }}>
                          {order.User ? order.User.name : 'Unknown'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {order.User ? order.User.email : ''}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 500, color: '#fff' }}>
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)} Items
                        </span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                          {order.items.map((i) => i.name).join(', ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => adminUpdateOrderStatus(order.id, e.target.value)}
                          className="form-input"
                          style={{
                            height: '32px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: order.orderStatus === 'Delivered' 
                              ? 'rgba(16, 185, 129, 0.3)' 
                              : (order.orderStatus === 'Shipped' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'),
                            background: '#0c0a1a',
                            color: order.orderStatus === 'Delivered' 
                              ? '#34d399' 
                              : (order.orderStatus === 'Shipped' ? '#c084fc' : '#fbbf24'),
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending" style={{ color: '#fbbf24' }}>Pending</option>
                          <option value="Processing" style={{ color: '#fbbf24' }}>Processing</option>
                          <option value="Shipped" style={{ color: '#c084fc' }}>Shipped</option>
                          <option value="Delivered" style={{ color: '#34d399' }}>Delivered</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleTrackUserOrder(order.id)}
                          className="btn btn-secondary"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            gap: '4px',
                            borderColor: 'var(--border-glass)',
                          }}
                        >
                          <Eye size={12} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', margin: '20px auto' }}>
              <ClipboardList size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 600 }}>No Orders Placed</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.4' }}>
                There are currently no purchases in the e-commerce registry to manage.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT POPUP MODAL --- */}
      {isModalOpen && (
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
        }}>
          <div className="glass animate-slide-up" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            position: 'relative',
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Smart Watch Pro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe your e-commerce product detailing specs, dimensions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ height: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Level</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input"
                    style={{ height: '44px', background: '#080612', cursor: 'pointer' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Home">Home</option>
                    <option value="Books">Books</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Paste premium image link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ width: '120px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ flexGrow: 1 }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
