// src/composables/useLocations.js
import { ref } from 'vue'
import { locationAPI } from '../services/api'

export function useLocations() {
  const divisions = ref([])
  const districts = ref([])
  const upazilas = ref([])
  const unions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchDivisions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await locationAPI.getDivisions()
      console.log('Divisions API response:', response.data)
      
      // Handle different response structures
      let divisionsData = []
      if (response.data && response.data.data) {
        divisionsData = response.data.data
      } else if (Array.isArray(response.data)) {
        divisionsData = response.data
      } else if (response.data && typeof response.data === 'object') {
        divisionsData = Object.values(response.data)
      }
      
      divisions.value = divisionsData
      console.log('Processed divisions:', divisions.value)
      return divisionsData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch divisions'
      console.error('Error fetching divisions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDistricts = async (divisionId) => {
    if (!divisionId) {
      console.warn('Division ID is required for fetching districts')
      districts.value = []
      return []
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching districts for division ID: ${divisionId}`)
      const response = await locationAPI.getDistricts(divisionId)
      console.log('Districts API response:', response.data)
      
      // Handle different response structures
      let districtsData = []
      if (response.data && response.data.data) {
        districtsData = response.data.data
      } else if (Array.isArray(response.data)) {
        districtsData = response.data
      } else if (response.data && typeof response.data === 'object') {
        districtsData = Object.values(response.data)
      }
      
      districts.value = districtsData
      console.log('Processed districts:', districts.value)
      return districtsData
    } catch (err) {
      console.error('Error fetching districts:', err)
      error.value = err.response?.data?.message || 'Failed to fetch districts'
      districts.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUpazilas = async (districtId) => {
    if (!districtId) {
      console.warn('District ID is required for fetching upazilas')
      upazilas.value = []
      return []
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching upazilas for district ID: ${districtId}`)
      const response = await locationAPI.getUpazilas(districtId)
      console.log('Upazilas API response:', response.data)
      
      // Handle different response structures
      let upazilasData = []
      if (response.data && response.data.data) {
        upazilasData = response.data.data
      } else if (Array.isArray(response.data)) {
        upazilasData = response.data
      } else if (response.data && typeof response.data === 'object') {
        upazilasData = Object.values(response.data)
      }
      
      upazilas.value = upazilasData
      console.log('Processed upazilas:', upazilas.value)
      return upazilasData
    } catch (err) {
      console.error('Error fetching upazilas:', err)
      error.value = err.response?.data?.message || 'Failed to fetch upazilas'
      upazilas.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUnions = async (upazilaId) => {
    if (!upazilaId) {
      console.warn('Upazila ID is required for fetching unions')
      unions.value = []
      return []
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching unions for upazila ID: ${upazilaId}`)
      const response = await locationAPI.getUnions(upazilaId)
      console.log('Unions API response:', response.data)
      
      // Handle different response structures
      let unionsData = []
      if (response.data && response.data.data) {
        unionsData = response.data.data
      } else if (Array.isArray(response.data)) {
        unionsData = response.data
      } else if (response.data && typeof response.data === 'object') {
        unionsData = Object.values(response.data)
      }
      
      unions.value = unionsData
      console.log('Processed unions:', unions.value)
      return unionsData
    } catch (err) {
      console.error('Error fetching unions:', err)
      error.value = err.response?.data?.message || 'Failed to fetch unions'
      unions.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearLocations = () => {
    divisions.value = []
    districts.value = []
    upazilas.value = []
    unions.value = []
  }

  const resetLocationSelections = () => {
    districts.value = []
    upazilas.value = []
    unions.value = []
  }

  return {
    divisions,
    districts,
    upazilas,
    unions,
    loading,
    error,
    fetchDivisions,
    fetchDistricts,
    fetchUpazilas,
    fetchUnions,
    clearLocations,
    resetLocationSelections
  }
}