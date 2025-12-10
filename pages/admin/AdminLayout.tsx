import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, FileText, Users, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return null; // Will redirect via useEffect

  const links = [
    { path: '/admin', label: { en: 'Dashboard', zh: '控制台' }, icon: LayoutDashboard },
    { path: '/admin/products', label: { en: 'Products', zh: '产品管理' }, icon: ShoppingBag },
    { path: '/admin/categories', label: { en: 'Categories', zh: '分类管理' }, icon: FolderTree },
    { path: '/admin/pages', label: { en: 'Pages Content', zh: '页面内容' }, icon: FileText },
  ];

  if (user?.role === 'super_admin') {
      links.push({ path: '/admin/users', label: { en: 'Users', zh: '用户管理' }, icon: Users });
  }

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0 flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold tracking-wider uppercase">
            {t({ en: 'CMS Admin', zh: '网站后台' })}
          </h2>
          <div className="mt-2 text-xs text-gray-400">
             {t({ en: 'Logged in as:', zh: '登录用户:' })} <span className="font-bold text-white">{user?.username}</span>
          </div>
        </div>
        
        <nav className="mt-4 flex-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
            <button 
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
            >
                <LogOut className="w-5 h-5 mr-3" />
                {t({ en: 'Logout', zh: '退出登录' })}
            </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;