import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { Category, LanguageCode } from '../../types';
import { Plus, Trash, Edit, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ManageCategories: React.FC = () => {
  const { t, lang } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>('en');

  useEffect(() => { refreshData(); }, []);

  useEffect(() => { setActiveTab(lang); }, [lang, isEditing]);

  const refreshData = async () => {
    const data = await db.getCategories();
    setCategories(data);
  };

  const handleEdit = (category: Category) => {
    setEditForm({ ...category });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditForm({
      id: Math.random().toString(36).substr(2, 9),
      parentId: null,
      name: { en: '', zh: '' }
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editForm) {
      await db.saveCategory(editForm);
      setIsEditing(false);
      setEditForm(null);
      refreshData();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t({ en: 'Delete this category?', zh: '删除此分类？' }))) {
      await db.deleteCategory(id);
      refreshData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t({ en: 'Manage Categories', zh: '分类管理' })}</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> {t({ en: 'Add Category', zh: '添加分类' })}
        </button>
      </div>

      {isEditing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">{editForm.id ? t({ en: 'Edit Category', zh: '编辑分类' }) : t({ en: 'New Category', zh: '新建分类' })}</h2>
               <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t({ en: 'Parent Category', zh: '父级分类' })}</label>
                <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={editForm.parentId || ''}
                  onChange={e => setEditForm({...editForm, parentId: e.target.value || null})}
                >
                  <option value="">{t({ en: 'None (Top Level)', zh: '无 (顶级分类)' })}</option>
                  {categories.filter(c => c.id !== editForm.id).map(c => (
                     <option key={c.id} value={c.id}>{t(c.name)}</option>
                  ))}
                </select>
              </div>

               <div className="mt-4">
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                        onClick={() => setActiveTab('en')}
                        className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'en' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setActiveTab('zh')}
                        className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'zh' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
                    >
                        中文
                    </button>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">
                          {activeTab === 'en' ? 'Category Name' : '分类名称'}
                      </label>
                      <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                        value={editForm.name[activeTab]} 
                        onChange={e => setEditForm({...editForm, name: {...editForm.name, [activeTab]: e.target.value}})} 
                      />
                  </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                 <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
                    {t({ en: 'Cancel', zh: '取消' })}
                 </button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {t({ en: 'Save', zh: '保存' })}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {categories.map(cat => {
            const parent = categories.find(c => c.id === cat.parentId);
            return (
                <li key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                    <p className="text-sm font-medium text-gray-900">{t(cat.name)}</p>
                    {parent && <p className="text-xs text-gray-500">{t({ en: 'Child of:', zh: '父类:' })} {t(parent.name)}</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-900"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900"><Trash className="w-5 h-5" /></button>
                </div>
                </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ManageCategories;