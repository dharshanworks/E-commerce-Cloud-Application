import { Outlet } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { AuthContext } from '../context/AuthContextObject.js';
import { CartContext } from '../context/CartContextObject.js';

export const MainLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 py-8">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
