import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiThumbsUp, FiThumbsDown, FiTrash2, FiClock, FiEdit3, FiSave, FiX, FiImage, FiStar } = FiIcons;

const ReviewCard = ({ review, showActions = true }) => {
  const { hasCodeAccess } = useAuth();
  const { deleteReview, updateReview, voteOnReview } = useReviews();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: review.title,
    review: review.review,
    category: review.category,
    rating: review.rating || 0,
    image_url: review.image_url
  });
  const [newImage, setNewImage] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(review.id);
    }
  };

  const handleSaveEdit = () => {
    const updates = {
      ...editData,
      image: newImage || editData.image_url
    };
    updateReview(review.id, updates);
    setIsEditing(false);
    setNewImage(null);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: review.title,
      review: review.review,
      category: review.category,
      rating: review.rating || 0,
      image_url: review.image_url
    });
    setNewImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleVote = async (voteType) => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      await voteOnReview(review.id, voteType);
    } finally {
      setIsVoting(false);
    }
  };

  const categories = [
    { value: 'movie', label: 'Movie', icon: '🎬' },
    { value: 'show', label: 'TV Show', icon: '📺' },
    { value: 'book', label: 'Book', icon: '📚' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
    { value: 'game', label: 'Game', icon: '🎮' },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      movie: 'from-cyber-red/20 to-cyber-red/10 border-cyber-red/30 text-cyber-red',
      show: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400',
      book: 'from-cyber-green/20 to-cyber-green/10 border-cyber-green/30 text-cyber-green',
      podcast: 'from-purple-500/20 to-purple-500/10 border-purple-500/30 text-purple-400',
      game: 'from-cyber-gold/20 to-cyber-gold/10 border-cyber-gold/30 text-cyber-gold',
    };
    return colors[category] || 'from-gray-500/20 to-gray-500/10 border-gray-500/30 text-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      movie: '🎬',
      show: '📺',
      book: '📚',
      podcast: '🎙️',
      game: '🎮',
    };
    return icons[category] || '📝';
  };

  // FIXED: Proper star display for decimals like 3.1
  const renderStars = (rating) => {
    if (!rating || rating === 0) return '';
    
    const fullStars = Math.floor(rating); // 3.1 -> 3 full stars
    const hasHalfStar = (rating % 1) >= 0.5; // 3.1 -> no half star, 3.5 -> half star
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars += '⭐';
    }
    
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6 hover:border-cyber-green/50 transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getCategoryIcon(review.category)}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r border ${getCategoryColor(review.category)}`}>
                {review.category.toUpperCase()}
              </span>
              {review.rating > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-cyber-gold/20 border border-cyber-gold/30 rounded-full">
                  <span className="text-cyber-gold font-mono text-sm font-bold">{review.rating}</span>
                  <span className="text-sm">{renderStars(review.rating)}</span>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green"
                />
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setEditData(prev => ({ ...prev, category: cat.value }))}
                      className={`p-2 rounded-lg border text-xs font-mono ${
                        editData.category === cat.value
                          ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                          : 'border-cyber-green/30 text-cyber-white hover:border-cyber-green/50'
                      }`}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyber-green mb-2 font-mono">
                    RATING (OUT OF 5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editData.rating}
                    onChange={(e) => setEditData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green"
                    placeholder="4.5"
                  />
                </div>
                <textarea
                  value={editData.review}
                  onChange={(e) => setEditData(prev => ({ ...prev, review: e.target.value }))}
                  className="w-full px-4 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green resize-none"
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id={`image-${review.id}`}
                  />
                  <label
                    htmlFor={`image-${review.id}`}
                    className="flex items-center space-x-2 px-3 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white hover:border-cyber-green/50 transition-all duration-300 cursor-pointer font-mono text-sm"
                  >
                    <SafeIcon icon={FiImage} className="w-4 h-4" />
                    <span>Change Image</span>
                  </label>
                  {newImage && (
                    <span className="text-cyber-green font-mono text-sm">New image selected</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-lg hover:bg-cyber-green/30 transition-all duration-300 font-mono text-sm"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4 inline mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-cyber-red/20 text-cyber-red border border-cyber-red/30 rounded-lg hover:bg-cyber-red/30 transition-all duration-300 font-mono text-sm"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h3 className="text-xl font-bold text-cyber-white mb-3 font-mono">{review.title}</h3>
            )}
          </div>
          
          {showActions && hasCodeAccess && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-cyber-gold hover:text-cyber-gold/80 transition-colors"
                title="Edit review"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-cyber-red hover:text-cyber-red/80 transition-colors"
                title="Delete review"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        {review.image_url && !isEditing && (
          <div className="mb-4">
            <img
              src={review.image_url}
              alt={review.title}
              className="w-full h-48 object-cover rounded-lg border border-cyber-green/30"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Review Content */}
        {!isEditing && (
          <blockquote className="text-cyber-white/90 text-lg italic mb-4 leading-relaxed font-mono">
            "{review.review}"
          </blockquote>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-cyber-white/70">
          <div className="flex items-center space-x-4 font-mono">
            <div className="flex items-center space-x-2">
              <img
                src={review.authorAvatar}
                alt={review.author}
                className="w-5 h-5 rounded-full border border-cyber-green/50"
              />
              <span>by {review.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="w-4 h-4" />
              <span>{format(new Date(review.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Vote Controls */}
          {showActions && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-cyber-black/60 rounded-lg p-1 border border-cyber-green/20">
                <button
                  onClick={() => handleVote('like')}
                  disabled={isVoting}
                  className="p-2 rounded-lg transition-all duration-200 text-cyber-white/60 hover:text-cyber-green hover:bg-cyber-green/20 disabled:opacity-50"
                  title="Like this review"
                >
                  <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
                </button>
                <span className="font-bold text-cyber-white font-mono px-2">
                  {(review.likes || 0) - (review.dislikes || 0)}
                </span>
                <button
                  onClick={() => handleVote('dislike')}
                  disabled={isVoting}
                  className="p-2 rounded-lg transition-all duration-200 text-cyber-white/60 hover:text-cyber-red hover:bg-cyber-red/20 disabled:opacity-50"
                  title="Dislike this review"
                >
                  <SafeIcon icon={FiThumbsDown} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;