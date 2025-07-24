import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CodeAccessModal from './CodeAccessModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiSearch, FiPlus, FiTrendingUp, FiMenu, FiX, FiEye, FiLogOut } = FiIcons;

const Header = () => {
  const { hasCodeAccess, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleUploadClick = () => {
    if (hasCodeAccess) {
      window.location.href = '#/submit';
    } else {
      setShowCodeModal(true);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/browse', label: 'Browse', icon: FiSearch },
    { path: '/top', label: 'Top Reviews', icon: FiTrendingUp },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative z-50 backdrop-blur-md bg-cyber-black/80 border-b border-cyber-green/30 sticky top-0"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-lg flex items-center justify-center animate-pulse-glow">
                <SafeIcon icon={FiEye} className="w-6 h-6 text-cyber-black animate-cyber-flicker" />
              </div>
              <div className="absolute inset-0 bg-cyber-green rounded-lg blur-sm opacity-30 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-cyber-gold bg-clip-text text-transparent font-mono">
              Meta Watchlist
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                    : 'text-cyber-white hover:text-cyber-green hover:bg-cyber-green/10'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
                <span className="font-mono">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-cyber-green/10 rounded-lg blur-sm"></div>
                )}
              </Link>
            ))}
            
            {/* Upload Button */}
            <button
              onClick={handleUploadClick}
              className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>UPLOAD</span>
            </button>
          </nav>

          {/* Access Status */}
          <div className="flex items-center space-x-4">
            {hasCodeAccess && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-lg font-mono text-sm">
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                  <span>ACCESS GRANTED</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-cyber-white hover:text-cyber-red hover:bg-cyber-red/10 rounded-lg transition-all duration-300 font-mono"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-cyber-white hover:text-cyber-green transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cyber-green/30 py-4 backdrop-blur-md"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                      : 'text-cyber-white hover:text-cyber-green hover:bg-cyber-green/10'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span className="font-mono">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Upload Button */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleUploadClick();
                }}
                className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black rounded-lg transition-all duration-300 font-mono font-bold"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
                <span>UPLOAD REVIEW</span>
              </button>
              
              {hasCodeAccess && (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-lg font-mono text-sm">
                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                    <span>ACCESS GRANTED</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-cyber-white hover:text-cyber-red hover:bg-cyber-red/10 rounded-lg transition-all duration-300 text-left font-mono"
                  >
                    <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Code Access Modal */}
      <CodeAccessModal 
        isOpen={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
      />
    </motion.header>
  );
};

export default Header;