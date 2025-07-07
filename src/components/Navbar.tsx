import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, AlertTriangle, BookOpen, Map, MessageCircle, Phone, User, Menu, X } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/sos', icon: AlertTriangle, label: 'SOS' },
    { to: '/safety-tips', icon: BookOpen, label: 'Tips' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/contacts', icon: Phone, label: 'Contacts' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-pink-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                NaariSuraksha
              </span>
            </Link>
            
            <div className="flex items-center space-x-1">
              {navItems.slice(0, -1).map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
              <div className="ml-4">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-pink-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                NaariSuraksha
              </span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7"
                  }
                }}
              />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {isOpen && (
            <div className="pb-4">
              <div className="grid grid-cols-2 gap-2">
                {navItems.slice(0, -1).map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(to)
                        ? 'bg-pink-100 text-pink-700'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-pink-100 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive(to)
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}