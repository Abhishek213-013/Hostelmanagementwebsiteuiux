// src/composables/useFacilities.js
import { ref } from 'vue'
import { facilitiesAPI } from '../services/api'

export function useFacilities() {
  const facilities = ref([])
  const currentFacility = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const fetchFacilities = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching facilities from API with all=', all)
      const response = await facilitiesAPI.getFacilities(all)
      console.log('Facilities response:', response.data)
      
      // Handle different response structures
      let facilitiesData = []
      if (response.data && response.data.data) {
        facilitiesData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        facilitiesData = response.data
      } else {
        facilitiesData = []
      }
      
      facilities.value = facilitiesData
      console.log('Processed facilities:', facilities.value.length, 'facilities found')
      return facilitiesData
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Facilities API not available (404), using empty state')
        facilities.value = []
        return []
      }
      error.value = err.response?.data?.message || 'Failed to fetch facilities'
      console.error('Error fetching facilities:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFacilityDetails = async (id) => {
    if (!id) {
      error.value = 'Facility ID is required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching facility details for ID: ${id}`)
      const response = await facilitiesAPI.getFacilityDetails(id)
      console.log('Facility details response:', response.data)
      
      let facilityData = null
      if (response.data && response.data.data) {
        facilityData = response.data.data
      } else if (response.data) {
        facilityData = response.data
      }
      
      currentFacility.value = facilityData
      return facilityData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch facility details'
      console.error('Error fetching facility details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFacility = async (facilityData) => {
    loading.value = true
    error.value = null
    try {
      console.log('Creating facility with data:', facilityData)
      const response = await facilitiesAPI.createFacility(facilityData)
      console.log('Create facility response:', response.data)
      
      let newFacility = null
      if (response.data && response.data.data) {
        newFacility = response.data.data
      } else if (response.data) {
        newFacility = response.data
      }
      
      // Add to facilities list if successful
      if (newFacility) {
        facilities.value.unshift(newFacility)
      }
      
      return newFacility
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create facility'
      console.error('Error creating facility:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    facilities,
    currentFacility,
    loading,
    error,
    pagination,
    fetchFacilities,
    fetchFacilityDetails,
    createFacility
  }
}