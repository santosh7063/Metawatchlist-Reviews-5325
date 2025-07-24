import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReviews } from '../contexts/ReviewContext';
import ReviewCard from '../components/ReviewCard';
import SearchBar from '../components/SearchBar';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch } = FiIcons;

const BrowseReviews = () => {
  const { searchReviews } = useReviews();
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const results = searchReviews(searchQuery, categoryFilter);
      setFilteredReviews(results);
      setLoading(false);
    };

    performSearch();
  }, [searchQuery, categoryFilter, searchReviews]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (category) => {
    setCategoryFilter(category);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-cyber-white mb-4 font-mono">
          BROWSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-gold">REVIEWS</span>
        </h1>
        <p className="text-xl text-cyber-white/80 font-mono">
          Discover what others think about movies, shows, books, podcasts, and games
        </p>
      </motion.div>

      {/* Search and Filter */}
      <SearchBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentFilter={categoryFilter}
      />

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-green"></div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-cyber-white font-mono">
                {filteredReviews.length} Review{filteredReviews.length !== 1 ? 's' : ''} Found
              </h2>
              {(searchQuery || categoryFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                  }}
                  className="text-cyber-green hover:text-cyber-gold font-medium font-mono"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                      <SafeIcon icon={FiSearch} className="w-12 h-12 text-cyber-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-cyber-white mb-2 font-mono">NO REVIEWS FOUND</h3>
                    <p className="text-cyber-white/70 mb-4 font-mono">
                      {searchQuery || categoryFilter !== 'all' 
                        ? 'Try adjusting your search terms or filters.' 
                        : 'No reviews have been submitted yet.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-gold/30 p-6 mt-12"
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

export default BrowseReviews;