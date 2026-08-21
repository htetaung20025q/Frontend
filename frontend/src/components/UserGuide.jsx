import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const UserGuide = () => {
  const guideSteps = [
    {
      title: "1. Getting Started",
      description: "Welcome to LUXE. Here's a screenshot showing how to navigate the homepage.",
      image: "/screenshots/step1.png"
    },
    {
      title: "2. Adding Products to Cart",
      description: "To buy an item, simply click the 'Add to Cart' button. Make sure you are logged in first!",
      image: "/screenshots/step2.png"
    },
    {
      title: "3. Admin Dashboard",
      description: "If you are an admin, click the Admin link in the navbar to access inventory and orders.",
      image: "/screenshots/step3.png"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <BookOpen size={24} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">User Guide</h1>
                <p className="text-sm font-medium text-slate-500">How to use the platform</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-16 max-w-4xl">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Documentation</h2>
          <p className="text-lg text-slate-600">Follow the steps below to understand how the application works. Ensure you have copied your screenshots into the <code className="bg-slate-200 px-2 py-1 rounded text-sm text-slate-800">frontend/public/screenshots/</code> folder named exactly as step1.png, step2.png, etc.</p>
        </div>

        <div className="space-y-16">
          {guideSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Text Section */}
                <div className="md:w-1/3">
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Image Section */}
                <div className="md:w-2/3">
                  <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center group">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback if image is missing */}
                    <div className="absolute inset-0 hidden flex-col items-center justify-center text-slate-400 bg-slate-50 p-6 text-center">
                      <ImageIcon size={48} className="mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-600 mb-1">Screenshot missing</p>
                      <p className="text-sm">Please copy <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{step.image.split('/').pop()}</code> into the <br/> <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">frontend/public/screenshots/</code> folder.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-16 text-center">
        <p className="text-slate-500 font-medium">Need more help? Contact our support team.</p>
      </footer>
    </div>
  );
};

export default UserGuide;
