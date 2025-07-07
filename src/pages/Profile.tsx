import React, { useState } from 'react';
import { User, Edit, Shield, Phone, Mail, MapPin, Bell, Lock, Heart } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { UserProfile } from '@clerk/clerk-react';

export function Profile() {
  const { user, isSignedIn } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    safetyTips: true,
    locationSharing: true,
    communityUpdates: false
  });

  const [preferences, setPreferences] = useState({
    autoLocationSharing: true,
    emergencyContactsOnly: false,
    voiceActivation: true,
    biometricLock: false
  });

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">Sign in to access your profile and settings</p>
        </div>
      </div>
    );
  }

  if (showUserProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setShowUserProfile(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              ← Back to Settings
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <UserProfile 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0"
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your account and safety preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user.fullName || user.firstName || 'User'}
              </h2>
              <p className="text-gray-600 mb-4">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              
              <div className="space-y-3">
                {user.primaryPhoneNumber && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{user.primaryPhoneNumber.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  onClick={() => setShowUserProfile(true)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
              <h3 className="font-bold text-lg mb-4">Safety Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency Contacts</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Tips Read</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Safe</span>
                  <span className="font-bold text-green-600">365</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-pink-600" />
                Notification Settings
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'emergencyAlerts' && 'Receive alerts during emergency situations'}
                        {key === 'safetyTips' && 'Get daily safety tips and advice'}
                        {key === 'locationSharing' && 'Allow trusted contacts to see your location'}
                        {key === 'communityUpdates' && 'Updates from the safety community'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-pink-600" />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600">
                        {key === 'autoLocationSharing' && 'Automatically share location during emergencies'}
                        {key === 'emergencyContactsOnly' && 'Limit data sharing to emergency contacts only'}
                        {key === 'voiceActivation' && 'Enable voice commands for emergency features'}
                        {key === 'biometricLock' && 'Use fingerprint/face unlock for sensitive features'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Information */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-pink-600" />
                Emergency Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Allergies</label>
                  <input 
                    type="text" 
                    placeholder="None" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                  <textarea 
                    placeholder="Any medical conditions emergency responders should know about..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* App Information */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-pink-600" />
                About NaariSuraksha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2"><strong>Version:</strong> 1.0.0</p>
                  <p className="mb-2"><strong>Last Updated:</strong> Today</p>
                </div>
                <div>
                  <p className="mb-2"><strong>Emergency Hotline:</strong> 1091</p>
                  <p className="mb-2"><strong>Support:</strong> help@naarisuraksha.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}