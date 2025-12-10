import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t({ en: 'Dashboard', zh: '控制台' })}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">{t({ en: 'Welcome to the Content Management System.', zh: '欢迎使用内容管理系统。' })}</p>
        <p className="mt-2 text-sm text-gray-500">
          {t({ 
            en: "Select an option from the sidebar to manage your website content. Changes made here are saved to the browser's local storage and will reflect immediately on the public site.", 
            zh: '从侧边栏选择一个选项来管理您的网站内容。在此处所做的更改将保存到浏览器的本地存储中，并立即反映在公共网站上。' 
          })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-900">{t({ en: 'Multi-Language Support', zh: '多语言支持' })}</h3>
          <p className="text-sm text-blue-700 mt-2">
            {t({ en: 'Update content in English and Chinese simultaneously.', zh: '同时更新英文和中文内容。' })}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="font-bold text-green-900">{t({ en: 'Live Updates', zh: '实时更新' })}</h3>
          <p className="text-sm text-green-700 mt-2">
            {t({ en: 'Changes apply instantly without page reloads.', zh: '更改即时应用，无需重新加载页面。' })}
          </p>
        </div>
         <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="font-bold text-purple-900">{t({ en: 'Product Management', zh: '产品管理' })}</h3>
          <p className="text-sm text-purple-700 mt-2">
            {t({ en: 'Categorize and detail your product inventory.', zh: '对您的产品库存进行分类和详细说明。' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;