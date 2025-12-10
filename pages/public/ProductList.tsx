import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../services/db';
import { Category, Product } from '../../types';
import { ChevronRight, Filter } from 'lucide-react';

const ProductList: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([db.getCategories(), db.getProducts()]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  }, []);

  // Filter products based on selected category (and its children)
  const getFilteredProducts = () => {
    if (!selectedCategory) return products;
    
    // Find category and its children IDs
    const categoryIds = new Set<string>([selectedCategory]);
    
    // Simple 1-level depth check for demo, real app would be recursive
    categories.forEach(c => {
        if (c.parentId === selectedCategory) categoryIds.add(c.id);
    });

    return products.filter(p => categoryIds.has(p.categoryId));
  };

  const filteredProducts = getFilteredProducts();

  // Recursive category renderer
  const renderCategoryTree = (parentId: string | null = null, depth = 0) => {
    const children = categories.filter(c => c.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <ul className={`space-y-1 ${depth > 0 ? 'ml-4 border-l border-gray-200 pl-2' : ''}`}>
        {children.map(cat => (
          <li key={cat.id}>
            <button
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                selectedCategory === cat.id 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {t(cat.name)}
            </button>
            {renderCategoryTree(cat.id, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-center p-2 bg-gray-100 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Filter className="w-5 h-5 mr-2" />
          {t({en: 'Categories', zh: '分类'})}
        </button>

        {/* Sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4 text-gray-900">{t({ en: 'Categories', zh: '产品分类' })}</h2>
            <button 
                onClick={() => setSelectedCategory(null)}
                className={`mb-2 w-full text-left px-2 py-1.5 rounded-md text-sm font-medium ${!selectedCategory ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`}
            >
                {t({ en: 'All Products', zh: '所有产品' })}
            </button>
            {renderCategoryTree(null)}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
               {selectedCategory 
                 ? t(categories.find(c => c.id === selectedCategory)?.name || { en: 'Products', zh: '产品' }) 
                 : t({ en: 'All Products', zh: '所有产品' })}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                {t({ en: `Showing ${filteredProducts.length} results`, zh: `显示 ${filteredProducts.length} 个结果` })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Link key={product.id} to={`/products/${product.id}`} className="group">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 relative h-48">
                    <img 
                      src={product.imageUrl} 
                      alt={t(product.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {t(product.name)}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{t(product.description)}</p>
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-900">{product.price}</span>
                        <span className="text-sm text-blue-600 flex items-center">
                            {t({ en: 'Details', zh: '详情' })} <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
             <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">{t({ en: 'No products found in this category.', zh: '此分类下暂无产品。' })}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;