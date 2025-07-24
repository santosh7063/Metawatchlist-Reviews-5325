import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ReviewContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

// Generate unique alien-type browser ID
const generateAlienId = () => {
  const alienPrefixes = ['ZRX', 'QXY', 'VTK', 'NMZ', 'PLQ', 'KJH', 'WRT', 'BCV', 'XYZ', 'QWE'];
  const alienSuffixes = ['7X9', '3K2', '8V5', '1Q4', '9Z7', '2A6', '5C8', '4B3', '6D1', '7E9'];
  
  const prefix = alienPrefixes[Math.floor(Math.random() * alienPrefixes.length)];
  const suffix = alienSuffixes[Math.floor(Math.random() * alienSuffixes.length)];
  const middle = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  return `${prefix}-${middle}-${suffix}`;
};

// Get or create unique browser ID
const getBrowserId = () => {
  let browserId = localStorage.getItem('alien_browser_id');
  if (!browserId) {
    browserId = generateAlienId();
    localStorage.setItem('alien_browser_id', browserId);
  }
  return browserId;
};

export const ReviewProvider = ({ children }) => {
  const { hasCodeAccess } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews_mw2024')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process reviews to include avatar and user vote status
      const processedReviews = data.map(review => ({
        ...review,
        votes: (review.likes || 0) - (review.dislikes || 0),
        userVote: null,
        author: review.author_id === 'anonymous' ? 'Anonymous' : review.author_id,
        authorAvatar: `https://ui-avatars.com/api/?name=${review.author_id === 'anonymous' ? 'Anonymous' : review.author_id}&background=00ff41&color=000`
      }));

      setReviews(processedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadImage = async (file) => {
    try {
      if (!file) return null;
      
      // Convert image to base64 and store in review data instead of Supabase storage
      // This avoids the storage permission issues
      const base64 = await convertToBase64(file);
      return base64;
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image. Please try again.');
      return null;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      if (!hasCodeAccess) {
        toast.error('Please enter access code to submit reviews');
        return;
      }

      setLoading(true);
      
      let imageUrl = null;
      if (reviewData.image) {
        imageUrl = await uploadImage(reviewData.image);
      }

      // Get unique browser ID
      const browserId = getBrowserId();

      // FIXED: Simple insert without columns parameter
      const { data, error } = await supabase
        .from('reviews_mw2024')
        .insert({
          title: reviewData.title,
          review: reviewData.review,
          category: reviewData.category,
          rating: reviewData.rating || 0,
          image_url: imageUrl,
          author_id: browserId,
          status: 'approved',
          likes: 0,
          dislikes: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast.success('Review submitted successfully!');
      await fetchReviews();
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, updates) => {
    try {
      if (!hasCodeAccess) {
        toast.error('Access code required to edit reviews');
        return;
      }

      let imageUrl = updates.image_url;
      if (updates.image && typeof updates.image !== 'string') {
        imageUrl = await uploadImage(updates.image);
      }

      const { error } = await supabase
        .from('reviews_mw2024')
        .update({
          title: updates.title,
          review: updates.review,
          category: updates.category,
          rating: updates.rating || 0,
          image_url: imageUrl
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Review updated!');
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Error updating review');
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      if (!hasCodeAccess) {
        toast.error('Access code required to delete reviews');
        return;
      }

      const { error } = await supabase
        .from('reviews_mw2024')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Review deleted!');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error deleting review');
    }
  };

  const voteOnReview = async (reviewId, voteType) => {
    try {
      // Use the same alien browser ID for voting
      const browserId = getBrowserId();

      // Check if user has already voted
      const { data: existingVote, error: voteError } = await supabase
        .from('review_votes_mw2024')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_ip', browserId)
        .maybeSingle();

      if (voteError && voteError.code !== 'PGRST116') {
        throw voteError;
      }

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          toast.info('You have already voted on this review');
          return;
        } else {
          // Update existing vote
          const { error } = await supabase
            .from('review_votes_mw2024')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);

          if (error) throw error;

          // Update review counts
          const review = reviews.find(r => r.id === reviewId);
          if (review) {
            const oldVote = existingVote.vote_type;
            const newLikes = (review.likes || 0) + (voteType === 'like' ? 1 : 0) - (oldVote === 'like' ? 1 : 0);
            const newDislikes = (review.dislikes || 0) + (voteType === 'dislike' ? 1 : 0) - (oldVote === 'dislike' ? 1 : 0);
            
            await supabase
              .from('reviews_mw2024')
              .update({
                likes: Math.max(0, newLikes),
                dislikes: Math.max(0, newDislikes)
              })
              .eq('id', reviewId);
          }
        }
      } else {
        // Insert new vote
        const { error } = await supabase
          .from('review_votes_mw2024')
          .insert({
            review_id: reviewId,
            user_ip: browserId,
            vote_type: voteType
          });

        if (error) throw error;

        // Update review counts
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
          const likesChange = voteType === 'like' ? 1 : 0;
          const dislikesChange = voteType === 'dislike' ? 1 : 0;
          
          await supabase
            .from('reviews_mw2024')
            .update({
              likes: (review.likes || 0) + likesChange,
              dislikes: (review.dislikes || 0) + dislikesChange
            })
            .eq('id', reviewId);
        }
      }

      toast.success(`Review ${voteType}d!`);
      await fetchReviews();
    } catch (error) {
      console.error('Error voting on review:', error);
      toast.error('Error voting on review');
    }
  };

  const searchReviews = (query, category = 'all') => {
    return reviews.filter(review => {
      const matchesQuery = !query || 
        review.title.toLowerCase().includes(query.toLowerCase()) ||
        review.review.toLowerCase().includes(query.toLowerCase()) ||
        review.author.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === 'all' || review.category === category;

      return matchesQuery && matchesCategory;
    });
  };

  const getTopReviews = () => {
    return [...reviews].sort((a, b) => {
      const aScore = (a.likes || 0) - (a.dislikes || 0);
      const bScore = (b.likes || 0) - (b.dislikes || 0);
      return bScore - aScore;
    });
  };

  const getReviewsByUser = (userId) => {
    return reviews.filter(review => review.author_id === userId);
  };

  const value = {
    reviews,
    loading,
    submitReview,
    updateReview,
    deleteReview,
    voteOnReview,
    searchReviews,
    getTopReviews,
    getReviewsByUser,
    fetchReviews,
    uploadImage,
    getBrowserId
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};