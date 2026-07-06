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

  // NEW: Fetch only hero section with its items (fastest)
  const fetchHeroSection = async (pageId = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🚀 Fetching hero section for page ${pageId}...`)
      
      // Step 1: Get all sections
      const response = await pageSectionsAPI.getSections()
      
      let allSections = []
      if (response.data && response.data.data) {
        allSections = response.data.data
      } else if (Array.isArray(response.data)) {
        allSections = response.data
      }
      
      // Step 2: Find hero section for the page
      const heroSection = allSections.find(
        section => section.page_id === parseInt(pageId) && section.section_key === 'hero-slider'
      )
      
      if (!heroSection) {
        console.warn('No hero section found')
        return null
      }
      
      // Step 3: Fetch items only for hero section
      const items = await fetchSectionItems(heroSection.id)
      
      const result = {
        ...heroSection,
        items: items
      }
      
      // Store in pageSections
      pageSections.value = [result]
      
      console.log(`✅ Hero section loaded with ${items.length} slides`)
      return result
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Page sections API not available (404), using fallback content')
        return null
      }
      console.error('Error fetching hero section:', err)
      error.value = err.response?.data?.message || 'Failed to fetch hero section'
      throw err
    } finally {
      loading.value = false
    }
  }

  // NEW: Fetch about section separately (for when user scrolls)
  const fetchAboutSection = async (pageId = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log(`📄 Fetching about section for page ${pageId}...`)
      
      const response = await pageSectionsAPI.getSections()
      
      let allSections = []
      if (response.data && response.data.data) {
        allSections = response.data.data
      } else if (Array.isArray(response.data)) {
        allSections = response.data
      }
      
      const aboutSection = allSections.find(
        section => section.page_id === parseInt(pageId) && section.section_key === 'about'
      )
      
      if (!aboutSection) {
        return null
      }
      
      const items = await fetchSectionItems(aboutSection.id)
      
      const result = {
        ...aboutSection,
        items: items
      }
      
      // Add to existing pageSections
      const existing = pageSections.value.filter(s => s.section_key !== 'about')
      pageSections.value = [...existing, result]
      
      console.log(`✅ About section loaded`)
      return result
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('About section API not available (404), using fallback content')
        return null
      }
      console.error('Error fetching about section:', err)
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
      
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      
      if (pageId) {
        data = data.filter(section => section.page_id === parseInt(pageId))
      }
      
      pageSections.value = data
      return data
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Page sections API not available (404)')
        return []
      }
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
      if (!sectionId) {
        sectionItems.value = []
        return []
      }
      
      const response = await sectionItemsAPI.getItems()
      
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      
      // Filter by page_section_id
      data = data.filter(item => item.page_section_id === parseInt(sectionId))
      
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

  // NEW: Fetch footer section (site-footer) with its items
  const fetchFooterSection = async (pageId = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await pageSectionsAPI.getSections()

      let allSections = []
      if (response.data && response.data.data) {
        allSections = response.data.data
      } else if (Array.isArray(response.data)) {
        allSections = response.data
      }

      const footerSection = allSections.find(
        section => section.page_id === parseInt(pageId) && section.section_key === 'site-footer'
      )

      if (!footerSection) {
        return null
      }

      const items = await fetchSectionItems(footerSection.id)

      const result = {
        ...footerSection,
        items: items
      }

      return result
    } catch (err) {
      if (err.response?.status === 404) {
        return null
      }
      console.error('Error fetching footer section:', err)
      error.value = err.response?.data?.message || 'Failed to fetch footer section'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch header logo section (site-header) with its items
  const fetchHeaderLogo = async (pageId = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await pageSectionsAPI.getSections()

      let allSections = []
      if (response.data && response.data.data) {
        allSections = response.data.data
      } else if (Array.isArray(response.data)) {
        allSections = response.data
      }

      const headerSection = allSections.find(
        section => section.page_id === parseInt(pageId) && section.section_key === 'site-header'
      )

      if (!headerSection) {
        return null
      }

      const items = await fetchSectionItems(headerSection.id)

      const result = {
        ...headerSection,
        items: items
      }

      return result
    } catch (err) {
      if (err.response?.status === 404) {
        return null
      }
      console.error('Error fetching header logo:', err)
      error.value = err.response?.data?.message || 'Failed to fetch header logo'
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
      
      const sections = await fetchPageSections(pageId)
      
      const sectionsWithItems = await Promise.all(
        sections.map(async (section) => {
          const items = await fetchSectionItems(section.id)
          return {
            ...section,
            items: items
          }
        })
      )
      
      pageSections.value = sectionsWithItems
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
    fetchPageData,
    fetchHeroSection,
    fetchAboutSection,
    fetchHeaderLogo,
    fetchFooterSection
  }
}