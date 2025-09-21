'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Blogs', href: '/dashboard/blogs', icon: FileText, userIdentity: '1' },
  { name: 'Colleges', href: '/dashboard/colleges', icon: GraduationCap, userIdentity: '2' },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen, userIdentity: '2' },
  { name: 'Compare', href: '/dashboard/compare', icon: BarChart3, userIdentity: '2' },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { userIdentity, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly) {
      // For now, allow all users to see user management
      // You can add specific admin logic here later
      return true;
    }
    return !item.userIdentity || item.userIdentity === userIdentity;
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">EduKyu Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">EduKyu Admin</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Sign out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">EduKyu Admin</h1>
        </div>
      </div>
    </>
  );
}