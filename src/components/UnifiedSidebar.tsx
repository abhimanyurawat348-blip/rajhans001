import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Zap, 
  FileText, 
  UserCheck, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Map,
  Beaker,
  Crown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const UnifiedSidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student-home' },
    { id: 'study', label: 'Study', icon: BookOpen, path: '/study-resources' },
    { id: 'flashcards', label: 'Flashcards', icon: Zap, path: '/student-home' },
    { id: 'results', label: 'Results', icon: FileText, path: '/student-home' },
    { id: 'attendance', label: 'Attendance', icon: UserCheck, path: '/student-home' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/learning-insights' },
    { id: 'learning-path', label: 'Learning Path', icon: Map, path: '/student-home' },
    { id: 'virtual-lab', label: 'Virtual Lab', icon: Beaker, path: '/student-home' },
    { id: 'connect', label: 'Connect', icon: MessageSquare, path: '/student-home' },
    { id: 'premium', label: 'Premium', icon: Crown, path: '/student-home' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/student-home' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg text-gray-700 hover:bg-gray-100"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:w-64 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Student Portal</h2>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500">
              RHPS Group © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedSidebar;