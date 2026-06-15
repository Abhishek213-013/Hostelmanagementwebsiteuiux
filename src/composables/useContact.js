// src/composables/useContact.js
import { ref } from 'vue'
import { contactAPI } from '../services/api'

export function useContact() {
  const sending = ref(false)
  const error = ref(null)
  const success = ref(false)
  const responseData = ref(null)

  const sendEnquiry = async (enquiryData) => {
    sending.value = true
    error.value = null
    success.value = false
    
    try {
      console.log('Sending contact enquiry:', enquiryData)
      const response = await contactAPI.sendEnquiry(enquiryData)
      console.log('Contact API response:', response.data)
      
      success.value = true
      responseData.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.errors || 'Failed to send message'
      console.error('Error sending enquiry:', err)
      throw err
    } finally {
      sending.value = false
    }
  }

  const reset = () => {
    sending.value = false
    error.value = null
    success.value = false
    responseData.value = null
  }

  return {
    sending,
    error,
    success,
    responseData,
    sendEnquiry,
    reset
  }
}