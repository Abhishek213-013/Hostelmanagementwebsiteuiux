// src/composables/usePages.js
import { ref } from 'vue'
import { pagesAPI, pageSectionsAPI, sectionItemsAPI } from '../services/api'

export function usePages() {
  const pages = ref([])
  const pageSections = ref([])
  const sectionItems = ref([])
  const currentPage = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchPages = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await pagesAPI.getPages()
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      pages.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch pages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPageSections = async (pageId = null) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching page sections...')
      const response = await pageSectionsAPI.getSections()
      console.log('Sections API response:', response.data)
      
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      
      console.log('All sections:', data)
      
      // Filter by page_id if provided
      if (pageId) {
        data = data.filter(section => section.page_id === parseInt(pageId))
        console.log(`Filtered sections for page ${pageId}:`, data)
      }
      
      pageSections.value = data
      return data
    } catch (err) {
      console.error('Error fetching sections:', err)
      error.value = err.response?.data?.message || 'Failed to fetch page sections'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSectionItems = async (sectionId = null) => {
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching section items for section ID: ${sectionId}`)
      const response = await sectionItemsAPI.getItems()
      console.log('Section items API response:', response.data)
      
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      
      console.log('All section items:', data)
      
      // Filter by page_section_id if provided
      if (sectionId) {
        data = data.filter(item => item.page_section_id === parseInt(sectionId))
        console.log(`Filtered items for section ${sectionId}:`, data)
      }
      
      sectionItems.value = data
      return data
    } catch (err) {
      console.error('Error fetching section items:', err)
      error.value = err.response?.data?.message || 'Failed to fetch section items'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch complete page data (sections and items)
  const fetchPageData = async (pageId = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching complete page data for page ID: ${pageId}`)
      
      // Fetch sections for the page
      const sections = await fetchPageSections(pageId)
      console.log('Sections to process:', sections)
      
      // Fetch items for each section
      const sectionsWithItems = await Promise.all(
        sections.map(async (section) => {
          console.log(`Processing section ${section.id}: ${section.section_key}`)
          const items = await fetchSectionItems(section.id)
          return {
            ...section,
            items: items
          }
        })
      )
      
      pageSections.value = sectionsWithItems
      console.log('Final page sections with items:', sectionsWithItems)
      return sectionsWithItems
    } catch (err) {
      console.error('Error fetching page data:', err)
      error.value = err.response?.data?.message || 'Failed to fetch page data'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    pages,
    pageSections,
    sectionItems,
    currentPage,
    loading,
    error,
    fetchPages,
    fetchPageSections,
    fetchSectionItems,
    fetchPageData
  }
}