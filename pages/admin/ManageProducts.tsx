import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { Product, Category, LanguageCode } from '../../types';
import { Plus, Trash, Edit, X, Upload, Search, Filter } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import RichTextEditor from '../../components/RichTextEditor';

const ManageProducts: React.FC = () => {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<LanguageCode>('en');
  const [uploading, setUploading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  // Sync active tab with global language preference when modal opens or lang changes
  useEffect(() => {
    setActiveTab(lang);
  }, [lang, isEditing]);

  const refreshData = async () => {
    const [p, c] = await Promise.all([db.getProducts(), db.getCategories()]);
    setProducts(p);
    setCategories(c);
  };

  const handleEdit = (product: Product) => {
    setEditForm({ ...product });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditForm({
      id: Math.random().toString(36).substr(2, 9),
      categoryId: categories[0]?.id || '',
      name: { en: '', zh: '' },
      description: { en: '', zh: '' },
      features: { en: '', zh: '' },
      price: '',
      imageUrl: 'https://picsum.photos/400/300',
      images: []
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editForm) {
      await db.saveProduct(editForm);
      setIsEditing(false);
      setEditForm(null);
      refreshData();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t({ en: 'Delete this product?', zh: '确认删除此产品？' }))) {
      await db.deleteProduct(id);
      refreshData();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editForm) return;
    
    setUploading(true);
    const files = Array.from(e.target.files) as File[];
    const newImages: string[] = [];

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      for (const file of files) {
        // Basic check to prevent massive files in localstorage demo
        if (file.size > 5000000) {
           alert(`File ${file.name} is too large (>5MB). Skipped.`);
           continue;
        }
        const base64 = await readFile(file);
        newImages.push(base64);
      }
      
      setEditForm(prev => prev ? {
        ...prev,
        images: [...(prev.images || []), ...newImages]
      } : null);
      
    } catch (error) {
      console.error("Error reading file", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (editForm && editForm.images) {
      const updatedImages = editForm.images.filter((_, idx) => idx !== indexToRemove);
      setEditForm({ ...editForm, images: updatedImages });
    }
  };

  // Compute filtered products
  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.en.toLowerCase().includes(term) || 
      product.name.zh.toLowerCase().includes(term);

    const matchesCategory = filterCategory === '' || product.categoryId === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t({ en: 'Manage Products', zh: '产品管理' })}</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> {t({ en: 'Add Product', zh: '添加产品' })}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder={t({en: "Search by product name...", zh: "按产品名称搜索..."})}
            className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[250px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">{t({en: "All Categories", zh: "所有分类"})}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{t(c.name)}</option>
            ))}
          </select>
        </div>
      </div>

      {isEditing && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">{editForm.id ? t({ en: 'Edit Product', zh: '编辑产品' }) : t({ en: 'New Product', zh: '新建产品' })}</h2>
               <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            
            <div className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t({ en: 'Category', zh: '所属分类' })}</label>
                  <select 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={editForm.categoryId}
                    onChange={e => setEditForm({...editForm, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
                  </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">{t({ en: 'Price', zh: '价格' })}</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                      value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t({ en: 'Main Image URL (Thumbnail)', zh: '主图 URL (缩略图)' })}</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                      value={editForm.imageUrl} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t({ en: 'Gallery Images', zh: '相册图片' })}</label>
                    
                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                        {editForm.images?.map((img, idx) => (
                           <div key={idx} className="relative group aspect-square rounded overflow-hidden border border-gray-200">
                              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove"
                              >
                                <X className="w-3 h-3" />
                              </button>
                           </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* URL Input */}
                        <div>
                             <p className="text-xs text-gray-500 mb-1">{t({ en: 'Add via URLs (one per line):', zh: '通过 URL 添加 (每行一个):' })}</p>
                             <textarea 
                                className="block w-full border border-gray-300 rounded-md p-2 font-mono text-xs whitespace-pre h-24"
                                value={editForm.images?.filter(i => i.startsWith('http')).join('\n') || ''}
                                onChange={e => {
                                   const urls = e.target.value.split('\n').filter(s => s.trim() !== '');
                                   // Keep base64 images, replace URLs
                                   const base64s = editForm.images?.filter(i => i.startsWith('data:')) || [];
                                   setEditForm({...editForm, images: [...base64s, ...urls]});
                                }}
                                placeholder="https://..."
                            />
                        </div>
                        
                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition-colors">
                           <input 
                              type="file" 
                              id="imageUpload" 
                              multiple 
                              accept="image/*" 
                              onChange={handleFileUpload}
                              className="hidden" 
                           />
                           <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                {uploading ? 'Uploading...' : t({ en: 'Upload Local Images', zh: '上传本地图片' })}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                           </label>
                        </div>
                    </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div>
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
                      🇬🇧 English Content
                    </button>
                    <button
                      onClick={() => setActiveTab('zh')}
                      className={`${
                        activeTab === 'zh'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      🇨🇳 中文内容
                    </button>
                  </nav>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {activeTab === 'en' ? 'Product Name' : '产品名称'}
                    </label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                      value={editForm.name[activeTab]} 
                      onChange={e => setEditForm({...editForm, name: {...editForm.name, [activeTab]: e.target.value}})} 
                    />
                  </div>

                  <div>
                     {/* RICH TEXT EDITOR REPLACEMENT */}
                     <RichTextEditor
                        label={activeTab === 'en' ? 'Description' : '产品描述'}
                        value={editForm.description[activeTab]}
                        onChange={(html) => setEditForm({
                          ...editForm, 
                          description: { ...editForm.description, [activeTab]: html }
                        })}
                     />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                       {activeTab === 'en' ? 'Features / Tagline' : '特点 / 标签'}
                    </label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                      value={editForm.features[activeTab]} 
                      onChange={e => setEditForm({...editForm, features: {...editForm.features, [activeTab]: e.target.value}})} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                 <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
                    {t({ en: 'Cancel', zh: '取消' })}
                 </button>
                 <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {t({ en: 'Save Product', zh: '保存产品' })}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map(product => (
            <li key={product.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                 <img src={product.imageUrl} alt="" className="h-10 w-10 rounded object-cover mr-4 bg-gray-200" />
                 <div>
                   <p className="text-sm font-medium text-gray-900">{t(product.name)}</p>
                   <p className="text-xs text-gray-500">{product.price}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900" title={t({ en: 'Edit', zh: '编辑' })}>
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900" title={t({ en: 'Delete', zh: '删除' })}>
                    <Trash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
          {filteredProducts.length === 0 && (
            <li className="px-6 py-4 text-center text-gray-500">
                {products.length === 0 
                  ? t({ en: 'No products found.', zh: '暂无产品。' }) 
                  : t({ en: 'No matching products found.', zh: '未找到匹配的产品。' })
                }
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageProducts;