import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../services/db';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    await db.sendMessage(formData);
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t({ en: 'Get in Touch', zh: '联系我们' })}
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            {t({ en: "We'd love to hear from you. Here's how to reach us.", zh: '我们期待您的来信。以下是联系方式。' })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Section */}
          <div className="bg-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-blue-900 mb-8">{t({ en: 'Contact Information', zh: '联系方式' })}</h3>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{t({ en: 'Headquarters', zh: '总部地址' })}</h4>
                  <p className="mt-2 text-base text-gray-600">
                    123 Innovation Drive<br />
                    Tech Park, Silicon Valley<br />
                    CA 94025, USA
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{t({ en: 'Phone', zh: '电话' })}</h4>
                  <p className="mt-2 text-base text-gray-600">
                    +1 (555) 123-4567<br />
                    Mon-Fri 9am to 6pm PST
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{t({ en: 'Email', zh: '电子邮箱' })}</h4>
                  <p className="mt-2 text-base text-gray-600">
                    contact@futurecorp.com<br />
                    support@futurecorp.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t({ en: 'Send us a message', zh: '发送留言' })}</h3>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                {t({ en: 'Message sent successfully!', zh: '留言发送成功！' })}
                <button 
                  onClick={() => setStatus('idle')} 
                  className="block mt-2 text-sm font-bold underline"
                >
                  {t({ en: 'Send another', zh: '再发一条' })}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t({ en: 'Full Name', zh: '姓名' })}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t({ en: 'Email', zh: '邮箱' })}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {t({ en: 'Message', zh: '内容' })}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {status === 'submitting' 
                    ? t({ en: 'Sending...', zh: '发送中...' }) 
                    : (
                      <span className="flex items-center">
                        {t({ en: 'Send Message', zh: '发送信息' })} <Send className="ml-2 w-4 h-4" />
                      </span>
                    )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;