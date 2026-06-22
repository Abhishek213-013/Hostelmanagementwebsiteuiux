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

  /**
   * Fetch reviews with optional filtering
   * @param {number|null} roomId - Filter by room ID
   * @param {number} page - Page number for pagination
   */
  const fetchReviews = async (roomId = null, page = 1) => {
    loading.value = true
    error.value = null
    
    try {
      const params = { page }
      if (roomId) params.room_id = roomId
      
      console.log('📝 Fetching reviews from API with params:', params)
      const response = await reviewsAPI.getReviews(params)
      console.log('📝 Reviews API response:', response.data)
      
      let reviewsData = []
      let paginationData = {}
      
      // Handle different API response structures
      if (response.data) {
        // Laravel paginated response
        if (response.data.data && Array.isArray(response.data.data)) {
          reviewsData = response.data.data
          paginationData = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 15,
            total: response.data.total || 0
          }
        }
        // Direct array response
        else if (Array.isArray(response.data)) {
          reviewsData = response.data
        }
        // Nested data property
        else if (response.data.data && !Array.isArray(response.data.data)) {
          reviewsData = [response.data.data]
        }
        // Single object response
        else if (typeof response.data === 'object') {
          reviewsData = [response.data]
        }
      }
      
      console.log('📝 Raw reviews data:', reviewsData)
      
      // Transform data to match frontend expected structure
      reviews.value = reviewsData.map(item => {
        // Extract user/border information
        let userName = 'Anonymous User'
        let userAvatar = null
        let userId = null
        
        // Check various possible user data structures
        if (item.border_user) {
          userName = item.border_user.name || item.border_user.first_name || 'Border User'
          userAvatar = item.border_user.avatar || item.border_user.profile_image
          userId = item.border_user.id || item.border_user_id
        } else if (item.user) {
          userName = item.user.name || item.user.username || item.user.email || 'User'
          userAvatar = item.user.avatar || item.user.profile_image
          userId = item.user.id || item.user_id
        } else if (item.border) {
          userName = item.border.name || item.border.first_name || 'Border'
          userAvatar = item.border.avatar || item.border.profile_image
          userId = item.border.id || item.border_id
        }
        
        // Fallback for direct properties
        if (!userName && item.user_name) userName = item.user_name
        if (!userName && item.name) userName = item.name
        if (!userId && item.user_id) userId = item.user_id
        if (!userId && item.border_user_id) userId = item.border_user_id
        if (!userId && item.border_id) userId = item.border_id
        
        // Generate avatar URL
        const avatarUrl = userAvatar 
          || `https://ui-avatars.com/api/?background=0d9488&color=fff&name=${encodeURIComponent(userName)}`
        
        // Parse pros/cons if they come as strings
        let pros = item.pros || []
        let cons = item.cons || []
        let tags = item.tags || []
        
        if (typeof pros === 'string') {
          pros = pros.split(',').map(s => s.trim()).filter(Boolean)
        }
        if (typeof cons === 'string') {
          cons = cons.split(',').map(s => s.trim()).filter(Boolean)
        }
        if (typeof tags === 'string') {
          tags = tags.split(',').map(s => s.trim()).filter(Boolean)
        }
        
        // Check if review is verified (status 1 or has verified flag)
        const isVerified = item.status === 1 || item.status === '1' || item.is_verified === true || item.verified === true
        
        return {
          id: item.id,
          rating: parseInt(item.rating) || 5,
          title: item.title || '',
          comment: item.comment || item.message || item.content || '',
          pros,
          cons,
          tags,
          user: {
            id: userId,
            name: userName,
            avatar: avatarUrl,
            email: item.user_email || item.user?.email || ''
          },
          user_id: userId,
          border_user_id: userId,
          room_id: item.room_id,
          stay_duration: item.stay_duration || '',
          stay_period: item.stay_period || '',
          helpful_count: parseInt(item.helpful_count) || 0,
          verified: isVerified,
          response: item.management_response || item.response ? {
            from: item.response_from || 'Management',
            message: item.management_response || item.response
          } : null,
          created_at: item.created_at,
          updated_at: item.updated_at
        }
      })
      
      console.log('📝 Processed reviews:', reviews.value.length)
      
      // Update pagination
      if (Object.keys(paginationData).length > 0) {
        pagination.value = paginationData
      }
      
      // Calculate stats
      if (reviews.value.length > 0) {
        calculateStats(reviews.value)
      }
      
      return reviews.value
      
    } catch (err) {
      console.error('❌ Error fetching reviews:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to fetch reviews'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Calculate review statistics
   */
  const calculateStats = (reviewsList) => {
    if (!reviewsList || !reviewsList.length) {
      stats.value = {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
      return
    }
    
    const total = reviewsList.length
    const sum = reviewsList.reduce((acc, r) => acc + (r.rating || 0), 0)
    const average = total > 0 ? (sum / total).toFixed(1) : 0
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviewsList.forEach(r => {
      const rating = parseInt(r.rating)
      if (distribution[rating] !== undefined) {
        distribution[rating]++
      }
    })
    
    stats.value = {
      average_rating: parseFloat(average),
      total_reviews: total,
      rating_distribution: distribution
    }
    
    console.log('📊 Review stats calculated:', stats.value)
  }

  /**
   * Get percentage for rating bar
   */
  const getRatingPercentage = (rating) => {
    if (!stats.value.total_reviews || stats.value.total_reviews === 0) return 0
    const count = stats.value.rating_distribution[rating] || 0
    return (count / stats.value.total_reviews) * 100
  }

  /**
   * Get count for specific rating
   */
  const getRatingCount = (rating) => {
    return stats.value.rating_distribution[rating] || 0
  }

  /**
   * Create a new review
   */
  const createReview = async (reviewData) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('📝 Creating review:', reviewData)
      const response = await reviewsAPI.createReview(reviewData)
      console.log('📝 Create review response:', response.data)
      
      let newReview = null
      
      // Handle different response structures
      if (response.data?.data) {
        newReview = response.data.data
      } else if (response.data) {
        newReview = response.data
      }
      
      if (newReview) {
        // Transform the new review to match our structure
        const transformedReview = transformSingleReview(newReview)
        reviews.value.unshift(transformedReview)
        calculateStats(reviews.value)
      }
      
      return newReview
      
    } catch (err) {
      console.error('❌ Error creating review:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to create review'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing review
   */
  const updateReview = async (id, reviewData) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('📝 Updating review:', id, reviewData)
      const response = await reviewsAPI.updateReview(id, reviewData)
      console.log('📝 Update review response:', response.data)
      
      let updatedReview = null
      
      // Handle different response structures
      if (response.data?.data) {
        updatedReview = response.data.data
      } else if (response.data) {
        updatedReview = response.data
      }
      
      if (updatedReview) {
        const transformedReview = transformSingleReview(updatedReview)
        const index = reviews.value.findIndex(r => r.id === id)
        if (index !== -1) {
          reviews.value[index] = transformedReview
        }
        calculateStats(reviews.value)
      }
      
      return updatedReview
      
    } catch (err) {
      console.error('❌ Error updating review:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to update review'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a review
   */
  const deleteReview = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('🗑️ Deleting review:', id)
      await reviewsAPI.deleteReview(id)
      
      // Remove from local state
      reviews.value = reviews.value.filter(r => r.id !== id)
      calculateStats(reviews.value)
      
      console.log('✅ Review deleted successfully')
      return true
      
    } catch (err) {
      console.error('❌ Error deleting review:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to delete review'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Transform a single review from API to frontend structure
   */
  const transformSingleReview = (item) => {
    let userName = 'Anonymous User'
    let userAvatar = null
    let userId = null
    
    if (item.border_user) {
      userName = item.border_user.name || item.border_user.first_name || 'Border User'
      userAvatar = item.border_user.avatar || item.border_user.profile_image
      userId = item.border_user.id
    } else if (item.user) {
      userName = item.user.name || item.user.username || 'User'
      userAvatar = item.user.avatar || item.user.profile_image
      userId = item.user.id
    }
    
    const avatarUrl = userAvatar 
      || `https://ui-avatars.com/api/?background=0d9488&color=fff&name=${encodeURIComponent(userName)}`
    
    return {
      id: item.id,
      rating: parseInt(item.rating) || 5,
      title: item.title || '',
      comment: item.comment || item.message || '',
      pros: Array.isArray(item.pros) ? item.pros : (item.pros ? item.pros.split(',').map(s => s.trim()).filter(Boolean) : []),
      cons: Array.isArray(item.cons) ? item.cons : (item.cons ? item.cons.split(',').map(s => s.trim()).filter(Boolean) : []),
      tags: Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
      user: {
        id: userId,
        name: userName,
        avatar: avatarUrl
      },
      user_id: userId,
      border_user_id: userId,
      room_id: item.room_id,
      stay_duration: item.stay_duration || '',
      stay_period: item.stay_period || '',
      helpful_count: parseInt(item.helpful_count) || 0,
      verified: item.status === 1 || item.is_verified === true,
      response: item.management_response || item.response ? {
        from: 'Management',
        message: item.management_response || item.response
      } : null,
      created_at: item.created_at,
      updated_at: item.updated_at
    }
  }

  /**
   * Clear all reviews and stats
   */
  const clearReviews = () => {
    reviews.value = []
    stats.value = {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
    error.value = null
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