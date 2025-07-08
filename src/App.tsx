import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { SOS } from './pages/SOS';
import { SafetyTips } from './pages/SafetyTips';
import { MapView } from './pages/MapView';
import { ChatAssistant } from './pages/ChatAssistant';
import { Contacts } from './pages/Contacts';
import { Profile } from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  const { isLoaded } = useUser();

  // Show loading screen while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NaariSuraksha...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public route for sign-in */}
            <Route path="/sign-in" element={<SignIn />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <Home />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/sos" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <SOS />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/safety-tips" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <SafetyTips />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/map" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <MapView />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <ChatAssistant />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/contacts" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <Contacts />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                  <Navbar />
                  <main className="pb-20">
                    <Profile />
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;