import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ReviewProvider } from './contexts/ReviewContext';
import MatrixRain from './components/MatrixRain';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseReviews from './pages/BrowseReviews';
import SubmitReview from './pages/SubmitReview';
import TopReviews from './pages/TopReviews';

function App() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-cyber-black via-cyber-black to-gray-900 relative overflow-hidden">
            {/* Matrix Rain Background */}
            <MatrixRain />
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<BrowseReviews />} />
                  <Route path="/top" element={<TopReviews />} />
                  <Route path="/submit" element={<SubmitReview />} />
                </Routes>
              </main>
              <Footer />
            </div>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-center"
              containerStyle={{
                zIndex: 9999,
              }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(13, 2, 8, 0.95)',
                  color: '#00ff41',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                },
                success: {
                  iconTheme: {
                    primary: '#00ff41',
                    secondary: '#0d0208',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff0040',
                    secondary: '#0d0208',
                  },
                  style: {
                    color: '#ff0040',
                    border: '1px solid rgba(255, 0, 64, 0.3)',
                  }
                }
              }}
            />
          </div>
        </Router>
      </ReviewProvider>
    </AuthProvider>
  );
}

export default App;