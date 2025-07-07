import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, MapPin, MessageCircle, BookOpen, Phone, Star, Users, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user, isAuthenticated } = useAuth();

  const quickActions = [
    { to: '/sos', icon: AlertTriangle, label: 'Emergency SOS', color: 'bg-red-500 hover:bg-red-600', urgent: true },
    { to: '/contacts', icon: Phone, label: 'Emergency Contacts', color: 'bg-pink-500 hover:bg-pink-600' },
    { to: '/map', icon: MapPin, label: 'Find Help Centers', color: 'bg-purple-500 hover:bg-purple-600' },
    { to: '/chat', icon: MessageCircle, label: 'Safety Assistant', color: 'bg-teal-500 hover:bg-teal-600' }
  ];

  const features = [
    {
      icon: Shield,
      title: '24/7 Protection',
      description: 'Round-the-clock safety monitoring and emergency response system'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other women and share safety experiences'
    },
    {
      icon: MapPin,
      title: 'Location Services',
      description: 'Find nearby police stations, hospitals, and safe spaces instantly'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Instant alerts to your emergency contacts and authorities'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Women Protected' },
    { number: '500+', label: 'Help Centers' },
    { number: '24/7', label: 'Support Available' },
    { number: '99.9%', label: 'Response Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-600 via-purple-600 to-pink-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Safety,
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              NaariSuraksha empowers women with smart safety tools, emergency assistance, and a supportive community.
            </p>
            {isAuthenticated && (
              <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-w-md mx-auto">
                <p className="text-lg">Welcome back, <span className="font-semibold">{user?.name}</span>!</p>
                <p className="text-pink-200">Stay safe and connected.</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/sos"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <AlertTriangle className="h-6 w-6" />
                <span>Emergency SOS</span>
              </Link>
              <Link
                to="/safety-tips"
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-md border border-white/20 transform hover:scale-105 transition-all duration-200"
              >
                Learn Safety Tips
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map(({ to, icon: Icon, label, color, urgent }) => (
              <Link
                key={to}
                to={to}
                className={`${color} text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                  urgent ? 'ring-4 ring-red-200 animate-pulse' : ''
                }`}
              >
                <Icon className="h-12 w-12 mb-4" />
                <h3 className="font-semibold text-lg">{label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose NaariSuraksha?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <Icon className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map(({ number, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold mb-2">{number}</div>
                <div className="text-pink-100">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Today's Safety Tip</h2>
            <p className="text-gray-600">Stay informed with daily safety advice</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-xl border border-pink-100 max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Trust Your Instincts</h3>
                <p className="text-gray-600 mb-4">
                  If a situation feels wrong, trust your gut feeling. Your instincts are your first line of defense and have evolved to protect you.
                </p>
                <Link
                  to="/safety-tips"
                  className="inline-flex items-center space-x-2 text-pink-600 font-medium hover:text-pink-700"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View All Tips</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}