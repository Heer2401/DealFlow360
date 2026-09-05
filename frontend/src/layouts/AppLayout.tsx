import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">DealFlow360</h1>
        </div>
        <nav className="p-4">
          <p className="text-sm text-gray-500 mb-2">Navigation</p>
          <ul>
            <li className="mb-2 text-blue-600 font-medium">Dashboard</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <p className="text-sm text-gray-500">Header</p>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-semibold">{user?.name}</span>
              <span className="text-gray-500 ml-2">({user?.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
