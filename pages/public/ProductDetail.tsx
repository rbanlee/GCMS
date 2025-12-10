import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../services/db';
import { Product, Category } from '../../types';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (id) {
      db.getProducts().then(products => {
        const found = products.find(p => p.id === id);
        setProduct(found || null);
        setActiveImageIndex(0);
        if (found) {
            db.getCategories().then(cats => {
                setCategory(cats.find(c => c.id === found.categoryId) || null);
            });
        }
      });
    }
  }, [id]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeImageIndex]); // Re-bind when index changes to capture correct closure if needed, though mostly for state updates

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t({ en: 'Back to Products', zh: '返回产品列表' })}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 aspect-[4/3] group cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img 
                src={displayImages[activeImageIndex]} 
                alt={t(product.name)} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-10 h-10 drop-shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300" />
              </div>

              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-blue-600 shadow-md ring-2 ring-blue-100' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="mb-4">
                {category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold tracking-wide uppercase">
                        {t(category.name)}
                    </span>
                )}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t(product.name)}</h1>
            <p className="text-2xl text-blue-600 font-bold mb-6">{product.price}</p>
            
            {/* Rich Text Description */}
            <div 
                className="prose prose-blue max-w-none text-gray-600 mb-8"
                dangerouslySetInnerHTML={{ __html: t(product.description) }}
            />

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t({ en: 'Key Features', zh: '主要功能' })}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t(product.features)}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t({ en: '24/7 Global Support', zh: '24/7 全球支持' })}</span>
                </li>
                 <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t({ en: 'Extended Warranty Available', zh: '提供延保服务' })}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
               <Link to="/contact" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors shadow-sm">
                   {t({ en: 'Request Quote', zh: '询价' })}
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-10 h-10" />
          </button>

          <button 
             onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
             className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
          >
             <ChevronLeft className="w-12 h-12" />
          </button>

          <img 
            src={displayImages[activeImageIndex]} 
            alt={t(product.name)}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
          />

          <button 
             onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
             className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
          >
             <ChevronRight className="w-12 h-12" />
          </button>

          {/* Dots indicator */}
          {displayImages.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {displayImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${activeImageIndex === idx ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
                      />
                  ))}
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;