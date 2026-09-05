import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">DealFlow360</h1>
        </div>
        <nav className="p-4">
          <p className="text-sm text-gray-500">Navigation</p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <p className="text-sm text-gray-500">Header / Topbar</p>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
