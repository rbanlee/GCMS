import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../services/db';
import { PageContent } from '../../types';

const About: React.FC = () => {
  const { t } = useLanguage();
  const [pageData, setPageData] = useState<PageContent | null>(null);

  useEffect(() => {
    db.getPage('about').then(setPageData);
  }, []);

  if (!pageData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            {t({ en: 'Who We Are', zh: '我们是谁' })}
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t(pageData.title)}
          </p>
          <div className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
             <p>{t(pageData.content)}</p>
          </div>
        </div>
        
        <div className="mt-16">
          <img
            className="w-full h-96 object-cover rounded-xl shadow-xl"
            src="https://picsum.photos/seed/office/1200/600"
            alt="Office"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t({en: "Our Vision", zh: "我们的愿景"})}</h3>
                <p className="text-gray-600">
                    {t({
                        en: "To become the world's most trusted partner in technology solutions, bridging the gap between complexity and usability.",
                        zh: "成为全球最值得信赖的技术解决方案合作伙伴，弥合复杂性与可用性之间的鸿沟。"
                    })}
                </p>
            </div>
             <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t({en: "Our History", zh: "发展历程"})}</h3>
                <p className="text-gray-600">
                    {t({
                        en: "From a small garage startup to a multinational corporation, our journey has been fueled by passion and resilience.",
                        zh: "从一个小车库创业公司到跨国公司，我们的旅程充满了激情和韧性。"
                    })}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;