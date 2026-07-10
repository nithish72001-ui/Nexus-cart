import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products from Express backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching products:', err);
          setLoading(false);
        });
  }, []);

  // Cart action functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
        prevCart
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean)
    );
  };

  // Bulletproof checkout request sending all common structural variations
  const checkout = async () => {
    if (cart.length === 0) return;

    try {
      // We send the data in multiple structures simultaneously.
      // This stops the backend "Cart is empty" error regardless of how req.body is structured.
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart,       // Option A: req.body.cart
          items: cart,      // Option B: req.body.items
          products: cart,   // Option C: req.body.products
          array: cart       // Option D: fallback array key
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(`🎉 Order #${data.orderId || data.id || 'Success'} placed successfully! Thank you for your purchase.`);
        setCart([]);
        setIsCartOpen(false);
      } else {
        alert(`⚠️ Server Error Debug Log: ${data.message || 'Checkout Failed'}`);
      }
    } catch (error) {
      alert('❌ Failed to submit your order request. Make sure backend is running.');
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>

        {/* ================= MODERN BRAND NAVBAR ================= */}
        <nav className="navbar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.8rem 2.5rem',
          background: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Logo and Brand Name Layout */}
          <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => window.location.reload()}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="9" width="18" height="12" rx="3" fill="#2563eb"/>
              <circle cx="9" cy="13" r="1" fill="#ffffff"/>
              <circle cx="15" cy="13" r="1" fill="#ffffff"/>
            </svg>
            <span style={{ fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.8px', color: '#1e293b' }}>
            NEXUS<span style={{ color: '#2563eb' }}>CART</span>
          </span>
          </div>

          {/* Clean Top Search Input */}
          <div style={{ position: 'relative', width: '35%' }}>
            <input
                type="text"
                placeholder="Search premium electronics..."
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.3rem',
                  borderRadius: '99px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.85rem' }}>🔍</span>
          </div>

          {/* Right Nav Options and Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', cursor: 'pointer' }}>Discover</span>

            <div
                onClick={() => setIsCartOpen(!isCartOpen)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  background: '#f1f5f9',
                  padding: '0.6rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>

              {totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239,68,68,0.3)'
                  }}>
                {totalItems}
              </span>
              )}
            </div>
          </div>
        </nav>

        {/* ================= PRODUCT DISPLAY GRID ================= */}
        <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem' }}>Featured Products</h2>

          {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#64748b' }}>Loading products catalog...</div>
          ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
              }}>
                {products.map((product) => (
                    <div key={product.id} style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '220px', objectFit: 'cover', backgroundColor: '#f1f5f9' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400'; }}
                      />
                      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.4', margin: '0 0 1.25rem 0' }}>{product.description}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2563eb', marginBottom: '1rem' }}>
                            ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <button
                              onClick={() => addToCart(product)}
                              style={{
                                width: '100%',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 0',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease'
                              }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* ================= SLIDEOUT SHOPPING CART SIDEBAR ================= */}
        {isCartOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '380px',
              height: '100vh',
              background: 'white',
              boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'system-ui, sans-serif'
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Your Cart ({totalItems})</h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
              </div>

              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
                {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', marginTop: '3rem' }}>Your basket is currently empty.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                          <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                          <div style={{ flexGrow: 1 }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: '#1e293b' }}>{item.name}</h4>
                            <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', background: '#f8fafc', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                            </div>
                          </div>
                        </div>
                    ))
                )}
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem', color: '#1e293b', marginBottom: '1rem' }}>
                  <span>Total Due:</span>
                  <span style={{ color: '#10b981' }}>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <button
                    onClick={checkout}
                    disabled={cart.length === 0}
                    style={{
                      width: '100%',
                      background: cart.length === 0 ? '#cbd5e1' : '#1e293b',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 0',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                  Checkout Now
                </button>
              </div>
            </div>
        )}

      </div>
  );
}

export default App;