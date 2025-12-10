import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { PageContent, LanguageCode } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

const ManagePages: React.FC = () => {
  const { t, lang } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<LanguageCode>('en');

  useEffect(() => {
    loadPage(selectedSlug);
  }, [selectedSlug]);

  useEffect(() => {
    setActiveTab(lang);
  }, [lang]);

  const loadPage = async (slug: string) => {
    setLoading(true);
    const data = await db.getPage(slug);
    if (data) setPageData(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (pageData) {
      await db.savePage(pageData);
      alert(t({ en: 'Page updated successfully!', zh: '页面更新成功！' }));
    }
  };

  if (loading || !pageData) return <div>{t({ en: 'Loading...', zh: '加载中...' })}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t({ en: 'Manage Page Content', zh: '页面内容管理' })}</h1>
      
      <div className="flex gap-4 mb-6">
        {['home', 'about', 'contact'].map(slug => (
          <button
            key={slug}
            onClick={() => setSelectedSlug(slug)}
            className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
              selectedSlug === slug ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t({
                home: { en: 'Home', zh: '首页' },
                about: { en: 'About', zh: '关于' },
                contact: { en: 'Contact', zh: '联系' }
            }[slug] || slug)}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        
        {/* Language Tabs */}
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('en')}
                className={`${
                activeTab === 'en'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                🇬🇧 English Version
            </button>
            <button
                onClick={() => setActiveTab('zh')}
                className={`${
                activeTab === 'zh'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
                🇨🇳 中文版本
            </button>
            </nav>
        </div>

        <div className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'en' ? 'Page Title' : '页面标题'}
            </label>
            <input 
              type="text" 
              className="w-full border-gray-300 rounded-md shadow-sm border p-2"
              value={pageData.title[activeTab]}
              onChange={e => setPageData({...pageData, title: {...pageData.title, [activeTab]: e.target.value}})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'en' ? 'Content' : '页面内容'}
            </label>
            <textarea 
              rows={12}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 font-mono text-sm"
              value={pageData.content[activeTab]}
              onChange={e => setPageData({...pageData, content: {...pageData.content, [activeTab]: e.target.value}})}
            />
             <p className="mt-1 text-xs text-gray-500">
                 {activeTab === 'en' ? 'Supports plain text.' : '支持纯文本输入。'}
             </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium shadow-sm transition-colors"
          >
            {t({ en: 'Save Changes', zh: '保存更改' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePages;