import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children, showSidebar = true, showFooter = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
