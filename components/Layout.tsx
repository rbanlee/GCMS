import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Menu, X, ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { lang, setLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleLang = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
  };

  const navLinks = [
    { path: '/', label: { en: 'Home', zh: '首页' } },
    { path: '/about', label: { en: 'About', zh: '公司简介' } },
    { path: '/products', label: { en: 'Products', zh: '产品介绍' } },
    { path: '/contact', label: { en: 'Contact', zh: '联系我们' } },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                <span className="font-bold text-xl text-gray-800">FutureCorp</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {!isAdmin && navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              
              {isAdmin && (
                <div className="flex gap-4">
                   <Link to="/admin" className="text-blue-600 font-medium">Dashboard</Link>
                   <Link to="/" className="text-gray-500 hover:text-gray-700">Exit Admin</Link>
                </div>
              )}

              <button
                onClick={toggleLang}
                className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none flex items-center gap-1 text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'EN' : '中文'}
              </button>
              
              {!isAdmin && (
                <Link to="/admin" className="ml-2 text-gray-400 hover:text-gray-600" title="Admin Login">
                  <ShieldCheck className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="block w-6 h-6" /> : <Menu className="block w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <button
                onClick={() => { toggleLang(); setIsMenuOpen(false); }}
                className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                 {lang === 'en' ? 'Switch to 中文' : '切换到 English'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FutureCorp</h3>
              <p className="text-gray-400 text-sm">
                {lang === 'en' 
                  ? 'Innovating for a better tomorrow. Leading the industry with cutting-edge solutions.' 
                  : '为更美好的明天而创新。以尖端解决方案引领行业。'}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t({ en: 'Quick Links', zh: '快速链接' })}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                 <li><Link to="/products" className="hover:text-white">{t({ en: 'Products', zh: '产品中心' })}</Link></li>
                 <li><Link to="/about" className="hover:text-white">{t({ en: 'About Us', zh: '关于我们' })}</Link></li>
                 <li><Link to="/contact" className="hover:text-white">{t({ en: 'Contact', zh: '联系方式' })}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t({ en: 'Contact', zh: '联系信息' })}</h4>
              <p className="text-gray-400 text-sm">
                123 Tech Avenue<br />
                Silicon Valley, CA 94025<br />
                info@futurecorp.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; 2024 FutureCorp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;