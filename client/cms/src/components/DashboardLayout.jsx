import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './dashboard/Sidebar';

const DashboardLayout = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen p-2">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1">
        {/* Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div></div>
          <div className="flex items-center gap-6">
            {/* Language Switch */}
            <button className="text-sm font-medium hover:text-blue-500">IND | EN</button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-lg font-bold"
              >
                👤
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow z-10">
                  <button
                    onClick={() => navigate('/dashboard/setting')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Setting
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
