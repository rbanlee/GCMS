import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../services/db';
import { PageContent, Product } from '../../types';
import { ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const page = await db.getPage('home');
      const products = await db.getProducts();
      if (page) setPageData(page);
      setFeaturedProducts(products.slice(0, 3)); // Just take first 3 for demo
    };
    loadData();
  }, []);

  if (!pageData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/techcorp/1920/1080" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t(pageData.title)}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-10">
            {t(pageData.content)}
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-colors"
          >
            {t({ en: 'Explore Products', zh: '探索产品' })}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t({ en: 'Featured Solutions', zh: '精选解决方案' })}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200">
                <img 
                  src={product.imageUrl} 
                  alt={t(product.name)} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t(product.name)}</h3>
                <p className="text-gray-600 line-clamp-2 mb-4">{t(product.description)}</p>
                <div className="flex items-center text-sm text-blue-600 font-medium mb-4">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {t(product.features)}
                </div>
                <Link 
                  to={`/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  {t({ en: 'Learn more', zh: '了解更多' })} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Stats / Trust Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
               <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
               <div className="text-gray-600 font-medium">{t({ en: 'Global Clients', zh: '全球客户' })}</div>
            </div>
            <div className="p-6">
               <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
               <div className="text-gray-600 font-medium">{t({ en: 'Expert Support', zh: '专家支持' })}</div>
            </div>
            <div className="p-6">
               <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
               <div className="text-gray-600 font-medium">{t({ en: 'Years Experience', zh: '行业经验' })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;