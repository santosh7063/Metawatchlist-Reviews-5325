import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter } = FiIcons;

const SearchBar = ({ onSearch, onFilterChange, currentFilter = 'all' }) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📝' },
    { value: 'movie', label: 'Movies', icon: '🎬' },
    { value: 'show', label: 'TV Shows', icon: '📺' },
    { value: 'book', label: 'Books', icon: '📚' },
    { value: 'podcast', label: 'Podcasts', icon: '🎙️' },
    { value: 'game', label: 'Games', icon: '🎮' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (category) => {
    onFilterChange(category);
    setIsFilterOpen(false);
  };

  const currentCategory = categories.find(cat => cat.value === currentFilter);

  return (
    <div className="relative backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-6 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl"></div>
      
      <form onSubmit={handleSearch} className="relative z-10 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyber-green w-5 h-5" />
          <input
            type="text"
            placeholder="Search the Matrix... title, content, or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg text-cyber-white font-mono placeholder-cyber-white/50 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all duration-300"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-3 px-4 py-3 bg-cyber-black/60 border border-cyber-green/30 rounded-lg hover:border-cyber-green/50 transition-all duration-300 min-w-[180px] text-cyber-white font-mono"
          >
            <span className="text-lg">{currentCategory.icon}</span>
            <span>{currentCategory.label}</span>
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-cyber-green" />
          </button>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-cyber-black/95 border border-cyber-green/30 rounded-lg shadow-2xl z-[9999] backdrop-blur-md"
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleFilterChange(category.value)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-cyber-green/10 transition-all duration-300 font-mono first:rounded-t-lg last:rounded-b-lg ${
                    currentFilter === category.value
                      ? 'bg-cyber-green/20 text-cyber-green border-l-4 border-cyber-green'
                      : 'text-cyber-white'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black rounded-lg hover:shadow-lg hover:shadow-cyber-green/25 transition-all duration-300 flex items-center space-x-2 font-mono font-bold"
        >
          <SafeIcon icon={FiSearch} className="w-4 h-4" />
          <span>SCAN</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;