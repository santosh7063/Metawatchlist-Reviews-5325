import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUserPlus, FiEye, FiEyeOff, FiShield } = FiIcons;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    const result = await register(formData.email, formData.password, formData.name);
    
    if (result.success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name.trim() && formData.email.trim() && 
                     formData.password.length >= 6 && passwordsMatch;

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
              <SafeIcon icon={FiShield} className="w-8 h-8 text-cyber-black animate-cyber-flicker" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-cyber-gold bg-clip-text text-transparent font-mono mb-2">
              JOIN THE MATRIX
            </h1>
            <p className="text-cyber-white/70 font-mono">Request access to Meta Watchlist</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                DISPLAY NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300"
                placeholder="Neo"
                required
              />
            </div>

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
                placeholder="neo@metawatchlist.com"
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
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-green hover:text-cyber-gold transition-colors"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-cyber-white/50 mt-1 font-mono">Minimum 6 characters required</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-cyber-black/60 border rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:ring-1 transition-all duration-300 ${
                    formData.confirmPassword && !passwordsMatch 
                      ? 'border-cyber-red focus:border-cyber-red focus:ring-cyber-red' 
                      : 'border-cyber-green/30 focus:border-cyber-green focus:ring-cyber-green'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-green hover:text-cyber-gold transition-colors"
                >
                  <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 font-mono ${passwordsMatch ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  {passwordsMatch ? 'PASSWORDS MATCH' : 'PASSWORDS DO NOT MATCH'}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-mono font-bold transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black hover:shadow-lg hover:shadow-cyber-green/25'
                  : 'bg-cyber-black/60 text-cyber-white/50 cursor-not-allowed border border-cyber-green/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyber-black"></div>
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
                  <span>REQUEST ACCESS</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Terms */}
          <div className="mt-6 p-4 bg-cyber-black/60 rounded-lg border border-cyber-green/20">
            <p className="text-xs text-cyber-white/70 text-center font-mono">
              By requesting access, you agree to the{' '}
              <span className="text-cyber-green hover:text-cyber-gold cursor-pointer">Matrix Protocol</span>
              {' '}and{' '}
              <span className="text-cyber-green hover:text-cyber-gold cursor-pointer">Data Privacy Terms</span>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-cyber-white/70 font-mono">
              Already connected?{' '}
              <Link to="/login" className="text-cyber-green hover:text-cyber-gold font-bold transition-colors">
                ACCESS TERMINAL
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;