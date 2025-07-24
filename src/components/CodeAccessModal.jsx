import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiX, FiKey } = FiIcons;

const CodeAccessModal = ({ isOpen, onClose }) => {
  const { verifyCode } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = verifyCode(code);
    if (success) {
      onClose();
      setCode('');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative backdrop-blur-md bg-cyber-black/90 rounded-xl border border-cyber-green/50 p-6 w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/10 to-cyber-gold/10 rounded-xl"></div>
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiLock} className="w-5 h-5 text-cyber-black" />
              </div>
              <h2 className="text-xl font-bold text-cyber-green font-mono">ACCESS CODE</h2>
            </div>
            <button
              onClick={onClose}
              className="text-cyber-white/70 hover:text-cyber-red transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          <p className="text-cyber-white/80 font-mono text-sm mb-6">
            Enter the access code to submit reviews
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyber-green mb-2 font-mono">
                ACCESS CODE
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300 text-center text-2xl tracking-widest"
                placeholder="****"
                required
                maxLength={4}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading || !code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black py-3 rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyber-black"></div>
                  <span>VERIFYING...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiKey} className="w-5 h-5" />
                  <span>VERIFY CODE</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodeAccessModal;