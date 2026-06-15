// src/composables/useReviews.js
import { ref } from 'vue'
import { reviewsAPI } from '../services/api'

export function useReviews() {
  const reviews = ref([])
  const currentReview = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })
  const stats = ref({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    }
  })

  const fetchReviews = async (roomId = null, page = 1) => {
    loading.value = true
    error.value = null
    try {
      const params = { page }
      if (roomId) params.room_id = roomId
      
      console.log('Fetching reviews from API with params:', params)
      const response = await reviewsAPI.getReviews(params)
      console.log('Reviews response:', response.data)
      
      let reviewsData = []
      if (response.data && response.data.data) {
        reviewsData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        reviewsData = response.data
      }
      
      // Transform data to match frontend expected structure
      reviews.value = reviewsData.map(item => {
        // Extract user name from various possible locations
        let userName = 'Anonymous User'
        let userAvatar = 'https://ui-avatars.com/api/?background=0d9488&color=fff&name=User'
        
        // Check different possible structures for user name
        if (item.user) {
          userName = item.user.name || item.user.username || item.user.email || 'User'
          userAvatar = item.user.avatar || item.user.profile_image || userAvatar
        } else if (item.user_name) {
          userName = item.user_name
        } else if (item.name) {
          userName = item.name
        } else if (item.reviewer_name) {
          userName = item.reviewer_name
        }
        
        // Create avatar URL with user's name initial
        const nameInitial = userName.charAt(0).toUpperCase()
        const avatarUrl = userAvatar !== 'https://ui-avatars.com/api/?background=0d9488&color=fff&name=User' 
          ? userAvatar 
          : `https://ui-avatars.com/api/?background=0d9488&color=fff&name=${encodeURIComponent(userName)}`
        
        return {
          id: item.id,
          rating: item.rating || 5,
          title: item.title || '',
          comment: item.comment || item.message || item.content || '',
          pros: item.pros || [],
          cons: item.cons || [],
          tags: item.tags || [],
          user: {
            id: item.user_id || item.user?.id,
            name: userName,
            avatar: avatarUrl,
            email: item.user_email || item.user?.email
          },
          stay_duration: item.stay_duration || '',
          stay_period: item.stay_period || '',
          helpful_count: item.helpful_count || 0,
          verified: item.is_verified || item.verified || false,
          response: item.management_response || item.response ? {
            from: 'Management',
            message: item.management_response || item.response
          } : null,
          created_at: item.created_at
        }
      })
      
      // Calculate stats if this is for a specific room
      if (roomId && reviewsData.length > 0) {
        calculateStats(reviews.value)
      }
      
      console.log('Processed reviews:', reviews.value)
      return reviewsData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch reviews'
      console.error('Error fetching reviews:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const calculateStats = (reviewsList) => {
    if (!reviewsList.length) return
    
    const total = reviewsList.length
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0)
    const average = (sum / total).toFixed(1)
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviewsList.forEach(r => {
      if (distribution[r.rating]) distribution[r.rating]++
    })
    
    stats.value = {
      average_rating: parseFloat(average),
      total_reviews: total,
      rating_distribution: distribution
    }
  }

  const getRatingPercentage = (rating) => {
    if (stats.value.total_reviews === 0) return 0
    return (stats.value.rating_distribution[rating] / stats.value.total_reviews) * 100
  }

  const getRatingCount = (rating) => {
    return stats.value.rating_distribution[rating] || 0
  }

  const createReview = async (reviewData) => {
    loading.value = true
    error.value = null
    try {
      const response = await reviewsAPI.createReview(reviewData)
      
      let newReview = null
      if (response.data && response.data.data) {
        newReview = response.data.data
      } else if (response.data) {
        newReview = response.data
      }
      
      // Add to list if successful
      if (newReview) {
        reviews.value.unshift(newReview)
        calculateStats(reviews.value)
      }
      
      return newReview
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create review'
      console.error('Error creating review:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReview = async (id, reviewData) => {
    loading.value = true
    error.value = null
    try {
      const response = await reviewsAPI.updateReview(id, reviewData)
      
      let updatedReview = null
      if (response.data && response.data.data) {
        updatedReview = response.data.data
      } else if (response.data) {
        updatedReview = response.data
      }
      
      // Update in list
      if (updatedReview) {
        const index = reviews.value.findIndex(r => r.id === id)
        if (index !== -1) {
          reviews.value[index] = updatedReview
          calculateStats(reviews.value)
        }
      }
      
      return updatedReview
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update review'
      console.error('Error updating review:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReview = async (id) => {
    loading.value = true
    error.value = null
    try {
      await reviewsAPI.deleteReview(id)
      
      // Remove from list
      reviews.value = reviews.value.filter(r => r.id !== id)
      calculateStats(reviews.value)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete review'
      console.error('Error deleting review:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearReviews = () => {
    reviews.value = []
    stats.value = {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }

  return {
    reviews,
    currentReview,
    loading,
    error,
    pagination,
    stats,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    clearReviews,
    getRatingPercentage,
    getRatingCount,
    calculateStats
  }
}