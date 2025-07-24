import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CodeAccessModal from './CodeAccessModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEye, FiPlus } = FiIcons;

const Footer = () => {
  const { hasCodeAccess } = useAuth();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleUploadClick = () => {
    if (hasCodeAccess) {
      window.location.href = '#/submit';
    } else {
      setShowCodeModal(true);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-md bg-cyber-black/80 border-t border-cyber-green/30 mt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5"></div>
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center space-x-3 group mb-4">
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
            <p className="text-cyber-white/70 font-mono text-sm mb-6 max-w-md">
              Discover entertainment through one-sentence reviews. No fluff. Just honest opinions from the Matrix.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cyber-green font-mono font-bold mb-4">QUICK ACCESS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cyber-white/70 hover:text-cyber-green transition-colors font-mono text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-cyber-white/70 hover:text-cyber-green transition-colors font-mono text-sm">
                  Browse Reviews
                </Link>
              </li>
              <li>
                <Link to="/top" className="text-cyber-white/70 hover:text-cyber-green transition-colors font-mono text-sm">
                  Top Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Upload Section */}
          <div>
            <h3 className="text-cyber-green font-mono font-bold mb-4">CONTRIBUTE</h3>
            <p className="text-cyber-white/70 font-mono text-sm mb-4">
              Share your entertainment reviews with the community
            </p>
            <button
              onClick={handleUploadClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>UPLOAD REVIEW</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-cyber-green/30 mt-8 pt-8 text-center">
          <p className="text-cyber-white/50 font-mono text-sm">
            © 2025 Meta Watchlist. All reviews are personal opinions shared for entertainment purposes only.
          </p>
        </div>
      </div>
      
      {/* Code Access Modal */}
      <CodeAccessModal 
        isOpen={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
      />
    </motion.footer>
  );
};

export default Footer;