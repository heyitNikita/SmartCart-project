import React, { useState, useEffect } from 'react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', price: 2999, category: 'Electronics' },
    { id: 2, name: 'Smart Watch', price: 4999, category: 'Electronics' },
    { id: 3, name: 'Running Shoes', price: 1999, category: 'Footwear' },
    { id: 4, name: 'Cotton T-Shirt', price: 799, category: 'Fashion' }
  ]);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.log('Backend sync status:', err));
  }, []);

  // Cart mein item add karna ya quantity increase karna
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Quantity change karna (+1 ya -1)
  const handleUpdateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const updatedQty = item.quantity + delta;
            return updatedQty > 0 ? { ...item, quantity: updatedQty } : null;
          }
          return item;
        })
        .filter(Boolean); // Agar quantity 0 ho jaye toh item remove ho jayega
    });
  };

  // Cart se item remove karna
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Total price calculate karna
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Total item count
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', margin: 0 }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#0f172a', color: '#fff' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setShowCart(false)}>🛒 SmartCart</h2>
        <button 
          onClick={() => setShowCart(!showCart)}
          style={{ background: '#2563eb', color: '#fff', padding: '0.5rem 1.2rem', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Cart: {totalItemsCount} items
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        {!showCart ? (
          <>
            <h1 style={{ textAlign: 'center', color: '#1e293b' }}>SmartCart Products</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {products.map((product) => (
                <div key={product.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0.5rem 0', color: '#0f172a' }}>{product.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{product.category}</p>
                  <h4 style={{ color: '#059669', fontSize: '1.2rem', margin: '0.5rem 0' }}>₹{product.price}</h4>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    style={{ marginTop: '0.8rem', padding: '0.5rem 1.2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Cart View Section */
          <div style={{ background: '#fff', borderRadius: '10px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2>Your Shopping Cart</h2>
              <button 
                onClick={() => setShowCart(false)} 
                style={{ padding: '0.4rem 1rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ← Back to Products
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>Your cart is empty!</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.3rem 0', color: '#0f172a' }}>{item.name}</h4>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>₹{item.price} each</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Quantity Controller Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 0.8rem', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          style={{ background: '#f1f5f9', border: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontWeight: 'bold', color: '#059669', minWidth: '70px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                      
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
                  <h3>Total Amount: <span style={{ color: '#059669' }}>₹{totalPrice}</span></h3>
                  <button 
                    onClick={() => alert('Order Placed Successfully!')}
                    style={{ marginTop: '1rem', padding: '0.7rem 1.5rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}