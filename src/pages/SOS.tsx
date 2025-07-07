import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Shield, CheckCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export function SOS() {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const { emergencyContacts } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isActivated) {
      sendSOSAlert();
    }
    return () => clearInterval(interval);
  }, [countdown, isActivated]);

  const activateSOS = () => {
    setIsActivated(true);
    setCountdown(5); // 5 second countdown
  };

  const cancelSOS = () => {
    setIsActivated(false);
    setCountdown(0);
  };

  const sendSOSAlert = () => {
    // Simulate sending SOS alert
    console.log('SOS Alert Sent!');
    console.log('User:', user?.name);
    console.log('Location:', location);
    console.log('Contacts notified:', emergencyContacts.length);
    
    // In a real app, this would:
    // 1. Send SMS/calls to emergency contacts
    // 2. Send location to authorities
    // 3. Trigger app notifications
    // 4. Log the incident
  };

  const callEmergency = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const quickMessages = [
    "I need help immediately. This is an emergency.",
    "I'm in an unsafe situation. Please call police.",
    "Send help to my location. Emergency situation.",
    "I feel threatened. Please contact authorities."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency SOS</h1>
          <p className="text-lg text-gray-600">Press and hold the SOS button in case of emergency</p>
        </div>

        {/* SOS Status */}
        {isActivated ? (
          <div className="bg-red-500 text-white p-8 rounded-xl shadow-lg mb-8 text-center">
            <div className="animate-pulse">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">SOS ACTIVATED</h2>
              {countdown > 0 ? (
                <>
                  <p className="text-xl mb-4">Alert will be sent in {countdown} seconds</p>
                  <button
                    onClick={cancelSOS}
                    className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-xl">Alert Sent Successfully!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center border-2 border-red-100">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Press SOS for Emergency</h2>
            <button
              onClick={activateSOS}
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200 ring-4 ring-red-200"
            >
              SOS
            </button>
            <p className="text-gray-600 mt-4">This will alert your emergency contacts and authorities</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Emergency Contacts */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-pink-600" />
              Quick Dial Emergency
            </h3>
            <div className="space-y-3">
              {emergencyContacts.slice(0, 5).map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => callEmergency(contact.phone)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contact.category === 'police' ? 'bg-red-100 text-red-800' :
                      contact.category === 'medical' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {contact.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="space-y-6">
            {/* Location Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-pink-600" />
                Location Status
              </h3>
              {location ? (
                <div className="text-green-600">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Location Detected</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </p>
                </div>
              ) : (
                <div className="text-yellow-600">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Getting Location...</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Enable location services for accurate emergency response
                  </p>
                </div>
              )}
            </div>

            {/* Quick Messages */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Quick Emergency Messages</h3>
              <div className="space-y-2">
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Emergency Alert',
                          text: `${message} - ${user?.name}. Location: ${location ? `${location.lat}, ${location.lng}` : 'Unknown'}`
                        });
                      }
                    }}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Instructions */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl mt-8">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Emergency Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="mb-2">• Stay calm and assess your surroundings</p>
              <p className="mb-2">• Move to a safe location if possible</p>
              <p className="mb-2">• Keep your phone charged and ready</p>
            </div>
            <div>
              <p className="mb-2">• Share your live location with trusted contacts</p>
              <p className="mb-2">• Avoid isolated areas when feeling unsafe</p>
              <p className="mb-2">• Trust your instincts and seek help immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}