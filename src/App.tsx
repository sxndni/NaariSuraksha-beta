import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SOS } from './pages/SOS';
import { SafetyTips } from './pages/SafetyTips';
import { MapView } from './pages/MapView';
import { ChatAssistant } from './pages/ChatAssistant';
import { Contacts } from './pages/Contacts';
import { Profile } from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Shield } from 'lucide-react';

function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-pink-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              NaariSuraksha
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to access your safety dashboard and emergency features</p>
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignInButton mode="modal" forceRedirectUrl="/sign-up">
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-semibold border border-gray-300 transition-colors">
                Create Account
              </button>
            </SignInButton>
          </div>
          <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-medium">Emergency? Call 1091 (Women's Helpline) immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <SignedOut>
            <SignInPage />
          </SignedOut>
          <SignedIn>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
              <Navbar />
              <main className="pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sos" element={<SOS />} />
                  <Route path="/safety-tips" element={<SafetyTips />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/chat" element={<ChatAssistant />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </SignedIn>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;