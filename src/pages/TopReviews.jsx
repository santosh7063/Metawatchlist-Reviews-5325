import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '../contexts/ReviewContext';
import ReviewCard from '../components/ReviewCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiAward, FiFilter } = FiIcons;

const TopReviews = () => {
  const { getTopReviews } = useReviews();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📝' },
    { value: 'movie', label: 'Movies', icon: '🎬' },
    { value: 'show', label: 'TV Shows', icon: '📺' },
    { value: 'book', label: 'Books', icon: '📚' },
    { value: 'podcast', label: 'Podcasts', icon: '🎙️' },
    { value: 'game', label: 'Games', icon: '🎮' },
  ];

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const getFilteredReviews = () => {
    let reviews = getTopReviews();

    // Filter by category
    if (categoryFilter !== 'all') {
      reviews = reviews.filter(review => review.category === categoryFilter);
    }

    // Filter by time (simplified for demo)
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (timeFilter) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      if (timeFilter !== 'all') {
        reviews = reviews.filter(review => new Date(review.created_at) >= cutoff);
      }
    }

    return reviews;
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-lg flex items-center justify-center animate-pulse-glow">
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-cyber-black" />
          </div>
          <h1 className="text-4xl font-bold text-cyber-white font-mono">
            TOP{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-gold">
              REVIEWS
            </span>
          </h1>
        </div>
        <p className="text-xl text-cyber-white/80 font-mono">
          The most upvoted reviews from our community
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-cyber-green mb-3 font-mono font-bold">
                FILTER BY CATEGORY
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setCategoryFilter(category.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 font-mono text-sm whitespace-nowrap ${
                      categoryFilter === category.value
                        ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                        : 'border-cyber-green/30 hover:border-cyber-green/50 text-cyber-white hover:text-cyber-green'
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div className="lg:w-48 relative">
              <label className="block text-sm font-medium text-cyber-green mb-3 font-mono font-bold">
                TIME PERIOD
              </label>
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono focus:border-cyber-green focus:ring-1 focus:ring-cyber-green appearance-none relative z-10"
                >
                  {timeFilters.map((filter) => (
                    <option
                      key={filter.value}
                      value={filter.value}
                      className="bg-cyber-black text-cyber-white"
                    >
                      {filter.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <SafeIcon icon={FiFilter} className="w-4 h-4 text-cyber-green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-cyber-white font-mono">
            {filteredReviews.length} Top Review{filteredReviews.length !== 1 ? 's' : ''}
          </h2>
          {(categoryFilter !== 'all' || timeFilter !== 'all') && (
            <button
              onClick={() => {
                setCategoryFilter('all');
                setTimeFilter('all');
              }}
              className="text-cyber-green hover:text-cyber-gold font-medium font-mono"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredReviews.length > 0 ? (
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Ranking Badge */}
                {index < 3 && (
                  <div className="absolute -left-4 -top-4 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0
                          ? 'bg-cyber-gold'
                          : index === 1
                          ? 'bg-gray-400'
                          : 'bg-orange-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                )}
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
                  <SafeIcon icon={FiAward} className="w-12 h-12 text-cyber-green" />
                </div>
                <h3 className="text-xl font-semibold text-cyber-white mb-2 font-mono">
                  NO REVIEWS FOUND
                </h3>
                <p className="text-cyber-white/70 font-mono">
                  No reviews match your current filter criteria.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-gold/30 p-6 mt-12"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-gold/5 to-cyber-red/5 rounded-xl"></div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-bold text-cyber-gold mb-2 font-mono">⚠️ DISCLAIMER</h3>
          <p className="text-cyber-white/80 font-mono text-sm">
            All reviews are personal opinions and not targeted at anyone. These are individual
            perspectives shared by our community members for entertainment purposes only.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TopReviews;