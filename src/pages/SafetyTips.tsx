import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, Tag, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function SafetyTips() {
  const { safetyTips } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'personal', label: 'Personal Safety' },
    { value: 'travel', label: 'Travel Safety' },
    { value: 'digital', label: 'Digital Security' },
    { value: 'home', label: 'Home Safety' },
    { value: 'workplace', label: 'Workplace Safety' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredTips = safetyTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || tip.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return '👤';
      case 'travel': return '✈️';
      case 'digital': return '💻';
      case 'home': return '🏠';
      case 'workplace': return '🏢';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Tips & Guidelines</h1>
          <p className="text-lg text-gray-600">Essential safety knowledge to protect yourself in various situations</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredTips.length} of {safetyTips.length} safety tips
          </div>
        </div>

        {/* Safety Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
              
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(tip.priority)}`}>
                      {tip.priority} priority
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6">
                <p className="text-gray-600 mb-4 leading-relaxed">{tip.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tip.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-pink-100 text-pink-800 text-xs font-medium"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{tip.category} safety</span>
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">In Case of Emergency</h3>
              <p className="text-red-100">If you're in immediate danger, don't hesitate to call for help</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">1091</div>
              <div className="text-red-100 text-sm">Women Helpline</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}