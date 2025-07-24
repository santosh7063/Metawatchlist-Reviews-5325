import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import ReviewCard from '../components/ReviewCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiMessageSquare, FiStar, FiArrowRight, FiEye, FiZap } = FiIcons;

const Home = () => {
  const { user } = useAuth();
  const { reviews, getTopReviews } = useReviews();

  const topReviews = getTopReviews().slice(0, 3);
  const totalReviews = reviews.length;
  const totalVotes = reviews.reduce((sum, review) => sum + review.votes, 0);

  const stats = [
    { icon: FiMessageSquare, label: 'TOTAL REVIEWS', value: totalReviews },
    { icon: FiUsers, label: 'ACTIVE USERS', value: Math.ceil(totalReviews / 2) },
    { icon: FiStar, label: 'TOTAL VOTES', value: totalVotes },
  ];

  return (
    <div className="space-y-16 relative">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 relative"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 relative"
        >
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-1/4 text-cyber-green text-4xl opacity-30"
            >
              🎬
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-20 right-1/4 text-cyber-gold text-3xl opacity-30"
            >
              📚
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-16 left-1/3 text-cyber-green text-2xl opacity-30"
            >
              🎮
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-full flex items-center justify-center animate-pulse-glow">
                <SafeIcon icon={FiEye} className="w-8 h-8 text-cyber-black animate-cyber-flicker" />
              </div>
              <SafeIcon icon={FiZap} className="w-8 h-8 text-cyber-gold animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-cyber-white mb-6 font-mono">
              META{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green via-cyber-gold to-cyber-green animate-glow">
                WATCHLIST
              </span>
            </h1>
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-xl md:text-2xl text-cyber-white/80 font-mono leading-relaxed">
                <span className="text-cyber-green">&gt;</span> Discover entertainment through{' '}
                <span className="text-cyber-gold font-bold">one-sentence reviews</span>
              </p>
              <p className="text-lg text-cyber-white/60 font-mono mt-2">
                No fluff. Just honest opinions from the Matrix.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center relative z-10"
        >
          <Link
            to="/browse"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black px-8 py-4 rounded-lg hover:shadow-2xl hover:shadow-cyber-green/25 transition-all duration-300 text-lg font-mono font-bold"
          >
            <span>BROWSE MATRIX</span>
            <SafeIcon icon={FiArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="relative group"
          >
            <div className="backdrop-blur-md bg-cyber-black/40 rounded-xl border border-cyber-green/30 p-8 text-center hover:border-cyber-green/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-gold/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyber-green/20 to-cyber-gold/20 rounded-lg mb-4 border border-cyber-green/30">
                  <SafeIcon icon={stat.icon} className="w-8 h-8 text-cyber-green" />
                </div>
                <div className="text-4xl font-bold text-cyber-white mb-2 font-mono">{stat.value}</div>
                <div className="text-cyber-green font-mono text-sm font-bold">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Featured Reviews Section */}
      {topReviews.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-cyber-white flex items-center space-x-4 font-mono">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-green to-cyber-gold rounded-lg flex items-center justify-center animate-pulse-glow">
                <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-cyber-black" />
              </div>
              <span>TOP REVIEWS</span>
            </h2>
            <Link
              to="/top"
              className="text-cyber-green hover:text-cyber-gold font-mono font-bold flex items-center space-x-2 group transition-colors"
            >
              <span>VIEW ALL</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {topReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="relative"
      >
        <div className="backdrop-blur-md bg-gradient-to-r from-cyber-green/20 to-cyber-gold/20 rounded-2xl p-12 text-center border border-cyber-green/30 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/10 to-cyber-gold/10"></div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-32 h-32 bg-cyber-green/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-0 w-40 h-40 bg-cyber-gold/20 rounded-full blur-xl"
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-cyber-white mb-4 font-mono">
              READY TO JACK IN?
            </h3>
            <p className="text-xl mb-8 text-cyber-white/80 font-mono">
              Discover the best entertainment through{' '}
              <span className="text-cyber-gold font-bold">quick takes</span> from the community
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyber-green to-cyber-gold text-cyber-black px-8 py-4 rounded-lg hover:shadow-2xl hover:shadow-cyber-green/25 transition-all duration-300 font-mono font-bold text-lg"
            >
              <span>EXPLORE REVIEWS</span>
              <SafeIcon icon={FiEye} className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;