import React, { useState } from 'react';
import { Phone, Plus, Edit, Trash2, User, Shield, Heart, AlertTriangle } from 'lucide-react';
import { useData, EmergencyContact } from '../contexts/DataContext';

export function Contacts() {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, updateEmergencyContact } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    location: '',
    category: 'family' as EmergencyContact['category']
  });

  const categories = [
    { value: 'family', label: 'Family', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { value: 'friend', label: 'Friend', icon: User, color: 'bg-blue-100 text-blue-800' },
    { value: 'police', label: 'Police', icon: Shield, color: 'bg-red-100 text-red-800' },
    { value: 'medical', label: 'Medical', icon: AlertTriangle, color: 'bg-green-100 text-green-800' },
    { value: 'other', label: 'Other', icon: Phone, color: 'bg-gray-100 text-gray-800' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      relationship: '',
      location: '',
      category: 'family'
    });
    setShowAddForm(false);
    setEditingContact(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContact) {
      updateEmergencyContact(editingContact.id, formData);
    } else {
      addEmergencyContact(formData);
    }
    
    resetForm();
  };

  const startEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      location: contact.location || '',
      category: contact.category
    });
    setShowAddForm(true);
  };

  const callContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  const groupedContacts = categories.map(category => ({
    ...category,
    contacts: emergencyContacts.filter(contact => contact.category === category.value)
  })).filter(group => group.contacts.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Contacts</h1>
          <p className="text-lg text-gray-600">Manage your trusted contacts for emergency situations</p>
        </div>

        {/* Add Contact Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    required
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Mother, Friend, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EmergencyContact['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts List */}
        {groupedContacts.length > 0 ? (
          <div className="space-y-8">
            {groupedContacts.map((group) => {
              const IconComponent = group.icon;
              return (
                <div key={group.value}>
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-5 w-5 mr-2 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-900">{group.label}</h3>
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {group.contacts.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.contacts.map((contact) => {
                      const categoryInfo = getCategoryInfo(contact.category);
                      return (
                        <div key={contact.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-gray-900">{contact.name}</h4>
                              <p className="text-gray-600">{contact.relationship}</p>
                              {contact.location && (
                                <p className="text-sm text-gray-500">{contact.location}</p>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span className="font-medium">{contact.phone}</span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => callContact(contact.phone)}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                              >
                                <Phone className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => startEdit(contact)}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to remove this contact?')) {
                                    removeEmergencyContact(contact.id);
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No contacts added yet</h3>
            <p className="text-gray-600 mb-6">Add your first emergency contact to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Add Your First Contact
            </button>
          </div>
        )}

        {/* Emergency Numbers */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl mt-12">
          <h3 className="text-xl font-bold mb-4 text-center">National Emergency Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">100</div>
              <div className="text-red-100">Police Emergency</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1091</div>
              <div className="text-red-100">Women Helpline</div>
            </div>
            <div>
              <div className="text-2xl font-bold">108</div>
              <div className="text-red-100">Medical Emergency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}