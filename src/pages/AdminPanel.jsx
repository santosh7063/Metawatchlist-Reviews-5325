import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import ReviewCard from '../components/ReviewCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiUsers, FiMessageSquare, FiBarChart3, FiShield, FiPlus, FiSend } = FiIcons;

const AdminPanel = () => {
  const { reviews, pendingReviews, submitReview, fetchReviews, fetchPendingReviews } = useReviews();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    review: '',
    category: 'movie'
  });

  useEffect(() => {
    fetchReviews();
    fetchPendingReviews();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'pending', label: 'Pending Reviews', icon: FiMessageSquare },
    { id: 'reviews', label: 'All Reviews', icon: FiMessageSquare },
    { id: 'add', label: 'Add Review', icon: FiPlus },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const categories = [
    { value: 'movie', label: 'Movie', icon: '🎬' },
    { value: 'show', label: 'TV Show', icon: '📺' },
    { value: 'book', label: 'Book', icon: '📚' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
    { value: 'game', label: 'Game', icon: '🎮' },
  ];

  const stats = [
    { 
      icon: FiMessageSquare, 
      label: 'Total Reviews', 
      value: reviews.length, 
      color: 'from-cyber-green/20 to-cyber-green/10 border-cyber-green/30 text-cyber-green' 
    },
    { 
      icon: FiMessageSquare, 
      label: 'Pending Reviews', 
      value: pendingReviews.length, 
      color: 'from-cyber-gold/20 to-cyber-gold/10 border-cyber-gold/30 text-cyber-gold' 
    },
    { 
      icon: FiUsers, 
      label: 'Total Users', 
      value: Math.ceil(reviews.length / 2), 
      color: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400' 
    },
    { 
      icon: FiShield, 
      label: 'System Status', 
      value: 'ONLINE', 
      color: 'from-cyber-green/20 to-cyber-green/10 border-cyber-green/30 text-cyber-green' 
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    const reviewData = {
      ...formData,
      author: user?.email || 'Admin',
      authorId: user?.id
    };
    
    await submitReview(reviewData);
    setFormData({ title: '', review: '', category: 'movie' });
    setShowAddForm(false);
    fetchReviews();
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyber-gold to-cyber-red rounded-lg flex items-center justify-center animate-pulse-glow">
          <SafeIcon icon={FiShield} className="w-6 h-6 text-cyber-black animate-cyber-flicker" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-gold to-cyber-red bg-clip-text text-transparent font-mono">
          ADMIN CONTROL PANEL
        </h1>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-gold/30 p-2"
      >
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap font-mono font-bold ${
                activeTab === tab.id
                  ? 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30'
                  : 'text-cyber-white hover:text-cyber-gold hover:bg-cyber-gold/10'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-gradient-to-r ${stat.color}`}>
                      <SafeIcon icon={stat.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-cyber-white mb-2 font-mono">{stat.value}</div>
                    <div className="text-cyber-white/70 font-mono text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-cyber-green mb-4 font-mono">RECENT ACTIVITY</h3>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 bg-cyber-black/60 rounded-lg border border-cyber-green/20">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-cyber-white font-mono">{review.title}</span>
                          <span className="px-2 py-1 bg-cyber-green/20 text-cyber-green rounded-full text-xs font-mono">
                            {review.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-cyber-white/70 text-sm font-mono">by {review.author}</p>
                      </div>
                      <div className="text-sm text-cyber-white/50 font-mono">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-gold/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-gold/5 to-cyber-red/5 rounded-xl"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-cyber-gold mb-4 font-mono">PENDING APPROVAL ({pendingReviews.length})</h3>
                {pendingReviews.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingReviews.map((review) => (
                      <ReviewCard 
                        key={review.id} 
                        review={review} 
                        showActions={false}
                        showAdminActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✨</div>
                    <h4 className="text-xl font-bold text-cyber-white mb-2 font-mono">ALL CLEAR</h4>
                    <p className="text-cyber-white/70 font-mono">No pending reviews to approve</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-cyber-green mb-4 font-mono">ALL REVIEWS ({reviews.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-cyber-green mb-6 font-mono">ADD NEW REVIEW</h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-bold text-cyber-green mb-3 font-mono">
                      CONTENT CATEGORY
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                            formData.category === category.value
                              ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                              : 'border-cyber-green/30 hover:border-cyber-green/50 text-cyber-white'
                          }`}
                        >
                          <span className="text-2xl">{category.icon}</span>
                          <span className="text-sm font-mono font-bold">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                      CONTENT TITLE
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter the title..."
                      className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Review Input */}
                  <div>
                    <label htmlFor="review" className="block text-sm font-bold text-cyber-green mb-2 font-mono">
                      REVIEW (ONE SENTENCE)
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      value={formData.review}
                      onChange={handleInputChange}
                      placeholder="Write your honest, one-sentence review..."
                      rows={4}
                      maxLength={280}
                      className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300 resize-none"
                      required
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-cyber-white/50 font-mono">
                        Keep it concise and impactful
                      </p>
                      <span className="text-sm font-mono text-cyber-green">
                        {formData.review.length}/280
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold"
                  >
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                    <span>DEPLOY REVIEW</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-cyber-green mb-4 font-mono">SYSTEM CONFIGURATION</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-cyber-black/60 rounded-lg border border-cyber-green/20">
                  <div>
                    <h4 className="font-bold text-cyber-white font-mono">REVIEW MODERATION</h4>
                    <p className="text-sm text-cyber-white/70 font-mono">Require admin approval for new reviews</p>
                  </div>
                  <div className="w-12 h-6 bg-cyber-green rounded-full relative">
                    <div className="w-5 h-5 bg-cyber-black rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-cyber-black/60 rounded-lg border border-cyber-green/20">
                  <div>
                    <h4 className="font-bold text-cyber-white font-mono">USER REGISTRATION</h4>
                    <p className="text-sm text-cyber-white/70 font-mono">Allow new users to register</p>
                  </div>
                  <div className="w-12 h-6 bg-cyber-green rounded-full relative">
                    <div className="w-5 h-5 bg-cyber-black rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-cyber-black/60 rounded-lg border border-cyber-green/20">
                  <div>
                    <h4 className="font-bold text-cyber-white font-mono">MATRIX RAIN EFFECT</h4>
                    <p className="text-sm text-cyber-white/70 font-mono">Enable background animations</p>
                  </div>
                  <div className="w-12 h-6 bg-cyber-green rounded-full relative">
                    <div className="w-5 h-5 bg-cyber-black rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;