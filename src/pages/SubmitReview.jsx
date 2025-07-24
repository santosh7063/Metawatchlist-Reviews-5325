import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import CodeAccessModal from '../components/CodeAccessModal';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiCheck, FiLock, FiImage, FiX, FiStar } = FiIcons;

const SubmitReview = () => {
  const { hasCodeAccess } = useAuth();
  const { submitReview } = useReviews();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    review: '',
    category: 'movie',
    rating: 0,
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { value: 'movie', label: 'Movie', icon: '🎬' },
    { value: 'show', label: 'TV Show', icon: '📺' },
    { value: 'book', label: 'Book', icon: '📚' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
    { value: 'game', label: 'Game', icon: '🎮' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'review') {
      setCharCount(value.length);
    }
  };

  const handleRatingChange = (e) => {
    const rating = parseFloat(e.target.value) || 0;
    setFormData(prev => ({ ...prev, rating: Math.min(5, Math.max(0, rating)) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasCodeAccess) {
      setShowCodeModal(true);
      return;
    }

    if (!formData.title.trim() || !formData.review.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(formData);
      navigate('/browse');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIXED: Proper star display for decimals like 3.1
  const renderStars = (rating) => {
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

  const isFormValid = formData.title.trim() && formData.review.trim() && charCount <= 280;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyber-white mb-4 font-mono">
              UPLOAD{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-gold">
                REVIEW
              </span>
            </h1>
            <p className="text-cyber-white/80 font-mono">
              Share your quick take on entertainment content in one powerful sentence
            </p>
            {!hasCodeAccess && (
              <div className="mt-4 p-4 bg-cyber-gold/20 border border-cyber-gold/30 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-cyber-gold font-mono text-sm">
                  <SafeIcon icon={FiLock} className="w-4 h-4" />
                  <span>Access code required to upload reviews</span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-cyber-green mb-3 font-mono font-bold">
                CONTENT CATEGORY
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 ${
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
              <label htmlFor="title" className="block text-sm font-medium text-cyber-green mb-2 font-mono font-bold">
                CONTENT TITLE
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of the movie, show, book, podcast, or game..."
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-200"
                required
              />
            </div>

            {/* Rating Input */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-cyber-green mb-2 font-mono font-bold">
                RATING (OUT OF 5) {formData.rating > 0 && `- ${formData.rating} ${renderStars(formData.rating)}`}
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleRatingChange}
                placeholder="4.5"
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-200"
              />
              <p className="text-sm text-cyber-white/70 mt-1 font-mono">
                Enter a decimal rating (e.g., 4.3, 3.7) or leave as 0 for no rating
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-cyber-green mb-2 font-mono font-bold">
                IMAGE (OPTIONAL)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white hover:border-cyber-green/50 transition-all duration-300 cursor-pointer font-mono"
                >
                  <SafeIcon icon={FiImage} className="w-4 h-4" />
                  <span>Choose Image</span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 text-cyber-red hover:text-cyber-red/80 transition-colors"
                    title="Remove image"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-cyber-green/30"
                  />
                </div>
              )}
            </div>

            {/* Review Input */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-cyber-green mb-2 font-mono font-bold">
                YOUR ONE-SENTENCE REVIEW
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="Write your honest, one-sentence review..."
                rows={4}
                maxLength={280}
                className="w-full px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-200 resize-none"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-cyber-white/70 font-mono">
                  Keep it concise and impactful - one sentence that captures your opinion
                </p>
                <span className={`text-sm font-medium font-mono ${
                  charCount > 280 ? 'text-cyber-red' : 
                  charCount > 240 ? 'text-cyber-gold' : 'text-cyber-green'
                }`}>
                  {charCount}/280
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-lg font-medium transition-all duration-200 font-mono font-bold ${
                isFormValid
                  ? 'bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black hover:shadow-lg hover:shadow-cyber-green/25'
                  : 'bg-cyber-black/60 text-cyber-white/50 cursor-not-allowed border border-cyber-green/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyber-black"></div>
                  <span>UPLOADING...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={hasCodeAccess ? FiSend : FiLock} className="w-5 h-5" />
                  <span>{hasCodeAccess ? 'UPLOAD REVIEW' : 'ENTER CODE TO UPLOAD'}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 backdrop-blur-md bg-cyber-black/40 rounded-lg border border-cyber-green/30 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="font-medium text-cyber-green mb-2 flex items-center space-x-2 font-mono">
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>UPLOAD GUIDELINES</span>
              </h3>
              <ul className="text-sm text-cyber-white/80 space-y-1 font-mono">
                <li>• Keep your review to one powerful sentence</li>
                <li>• Rate out of 5 stars (decimals allowed: 4.3, 3.7, etc.)</li>
                <li>• Images are optional but enhance your review</li>
                <li>• Be honest and constructive in your feedback</li>
                <li>• Avoid spoilers and personal attacks</li>
                <li>• Focus on your personal experience with the content</li>
              </ul>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 backdrop-blur-md bg-cyber-black/40 rounded-lg border border-cyber-gold/30 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-gold/5 to-cyber-red/5 rounded-lg"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-sm font-bold text-cyber-gold mb-1 font-mono">⚠️ DISCLAIMER</h3>
              <p className="text-cyber-white/70 font-mono text-xs">
                All reviews are personal opinions and not targeted at anyone. These are individual perspectives shared for entertainment purposes only.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Code Access Modal */}
      <CodeAccessModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
      />
    </div>
  );
};

export default SubmitReview;