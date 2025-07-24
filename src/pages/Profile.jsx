import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import ReviewCard from '../components/ReviewCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiCalendar, FiMessageSquare, FiThumbsUp, FiEdit3, FiSave, FiX } = FiIcons;

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { getReviewsByUser } = useReviews();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || ''
  });

  const userReviews = getReviewsByUser(user?.id);
  const totalVotes = userReviews.reduce((sum, review) => sum + review.votes, 0);

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      display_name: profile?.display_name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const stats = [
    { icon: FiMessageSquare, label: 'Reviews Posted', value: userReviews.length },
    { icon: FiThumbsUp, label: 'Total Votes Received', value: totalVotes },
    { icon: FiCalendar, label: 'Member Since', value: format(new Date(user?.created_at || new Date()), 'MMM yyyy') },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile?.avatar_url}
                alt={profile?.display_name}
                className="w-24 h-24 rounded-full border-4 border-cyber-green/50"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cyber-green mb-1 font-mono">Display Name</label>
                    <input
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                      className="w-full px-3 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyber-green mb-1 font-mono">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green"
                      disabled
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-1 px-4 py-2 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-lg hover:bg-cyber-green/30 transition-colors font-mono"
                    >
                      <SafeIcon icon={FiSave} className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 px-4 py-2 bg-cyber-red/20 text-cyber-red border border-cyber-red/30 rounded-lg hover:bg-cyber-red/30 transition-colors font-mono"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-cyber-white font-mono">{profile?.display_name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-cyber-green hover:text-cyber-gold transition-colors"
                      title="Edit profile"
                    >
                      <SafeIcon icon={FiEdit3} className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-cyber-white/80 mb-4 font-mono">{user?.email}</p>
                  {profile?.is_admin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30 font-mono">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      Administrator
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyber-green/20 to-cyber-gold/20 rounded-lg mb-4 border border-cyber-green/30">
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-cyber-green" />
              </div>
              <div className="text-2xl font-bold text-cyber-white mb-2 font-mono">{stat.value}</div>
              <div className="text-cyber-white/70 font-mono">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* User Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-cyber-white mb-6 font-mono">MY REVIEWS</h2>
        {userReviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-cyber-green/20 to-cyber-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyber-green/30">
                  <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-cyber-green" />
                </div>
                <h3 className="text-xl font-semibold text-cyber-white mb-2 font-mono">NO REVIEWS YET</h3>
                <p className="text-cyber-white/70 mb-4 font-mono">
                  You haven't submitted any reviews yet. Share your thoughts on your favorite entertainment!
                </p>
                <motion.a
                  href="/#/submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold"
                >
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
                  <span>Submit Your First Review</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-gold/30 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-gold/5 to-cyber-red/5 rounded-xl"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-bold text-cyber-gold mb-2 font-mono">⚠️ DISCLAIMER</h3>
          <p className="text-cyber-white/80 font-mono text-sm">
            All reviews are personal opinions and not targeted at anyone. These are individual perspectives 
            shared by our community members for entertainment purposes only.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;