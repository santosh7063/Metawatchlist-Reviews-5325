import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLogIn, FiEye, FiEyeOff, FiUser } = FiIcons;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-cyber-black/60 rounded-xl border border-cyber-green/30 p-8 w-full max-w-md"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/10 to-cyber-gold/10 rounded-xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <SafeIcon icon={FiUser} className="w-8 h-8 text-cyber-black animate-cyber-flicker" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-cyber-gold bg-clip-text text-transparent font-mono mb-2">
              ACCESS TERMINAL
            </h1>
            <p className="text-cyber-white/70 font-mono">Enter your credentials to access the Matrix</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300"
                placeholder="user@metawatchlist.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-green hover:text-cyber-gold transition-colors"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black py-3 rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyber-black"></div>
                  <span>ACCESSING...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiLogIn} className="w-5 h-5" />
                  <span>ACCESS MATRIX</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-cyber-white/70 font-mono">
              Need access?{' '}
              <Link to="/register" className="text-cyber-green hover:text-cyber-gold font-bold transition-colors">
                REQUEST AUTHORIZATION
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;