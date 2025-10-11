import React from 'react';
import { BookOpen, Shirt, PenTool } from 'lucide-react';

const ShopLinksCard: React.FC = () => {
  const shopLinks = [
    {
      id: 1,
      title: "Purchase Books",
      description: "Textbooks & Reference Materials",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-500",
      href: "#"
    },
    {
      id: 2,
      title: "Purchase Uniforms",
      description: "School Uniforms & Sports Wear",
      icon: <Shirt className="h-6 w-6" />,
      color: "bg-purple-500",
      href: "#"
    },
    {
      id: 3,
      title: "Purchase Stationery",
      description: "Notebooks, Pens & Supplies",
      icon: <PenTool className="h-6 w-6" />,
      color: "bg-green-500",
      href: "#"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">School Shop</h2>
      
      <div className="space-y-4">
        {shopLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className={`${link.color} p-3 rounded-lg text-white`}>
              {link.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{link.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{link.description}</p>
            </div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShopLinksCard;