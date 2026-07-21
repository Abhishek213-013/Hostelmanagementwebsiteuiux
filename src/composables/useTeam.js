// src/composables/useTeam.js
import { ref } from 'vue'
import { teamAPI } from '../services/api'

// Base URL for storage
const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'

export function useTeam() {
  const teams = ref([])
  const teamMembers = ref([])
  const currentTeam = ref(null)
  const currentMember = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return ''
    
    // If it's already a full URL or data URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath
    }
    
    // Otherwise, construct the full URL
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `${API_BASE_URL}/storage/${cleanPath}`
  }

  const fetchTeams = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching teams from API...')
      const response = await teamAPI.getTeams(all)
      console.log('Teams response:', response.data)
      
      let teamsData = []
      if (response.data && response.data.data) {
        teamsData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        teamsData = response.data
      }
      
      teams.value = teamsData
      console.log('Processed teams:', teams.value.length, 'teams found')
      return teamsData
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Teams API not available (404), using fallback')
        teams.value = []
        return []
      }
      error.value = err.response?.data?.message || 'Failed to fetch teams'
      console.error('Error fetching teams:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get team details which should include members
  const fetchTeamDetails = async (teamId) => {
    if (!teamId) {
      error.value = 'Team ID is required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching team details for ID: ${teamId}`)
      const response = await teamAPI.getTeamDetails(teamId)
      console.log('Team details response:', response.data)
      
      let teamData = null
      if (response.data && response.data.data) {
        teamData = response.data.data
      } else if (response.data) {
        teamData = response.data
      }
      
      currentTeam.value = teamData
      
      // Extract members from team data if available
      let membersData = []
      if (teamData && teamData.members) {
        membersData = teamData.members
      } else if (teamData && teamData.data && teamData.data.members) {
        membersData = teamData.data.members
      }
      
      // Transform members data to match frontend structure
      teamMembers.value = membersData.map(member => {
        // Get the raw image path
        const rawImage = member.image_url || member.image_path || member.image || member.avatar
        
        return {
          id: member.id,
          name: member.name,
          role: member.designation || member.role,
          short_bio: member.bio?.substring(0, 100),
          bio: member.bio,
          avatar: getFullImageUrl(rawImage) || `https://ui-avatars.com/api/?background=0d9488&color=fff&name=${encodeURIComponent(member.name || 'User')}`,
          email: member.email,
          phone: member.phone,
          social_links: {
            facebook: member.facebook_url,
            linkedin: member.linkedin_url,
            twitter: member.twitter_url
          },
          skills: member.skills || [],
          joining_date: member.created_at,
          is_active: member.status == 1,
          sort_order: member.sort_order
        }
      })
      
      console.log('Processed team members:', teamMembers.value.length, 'members found')
      if (teamMembers.value.length > 0) {
        console.log('First member avatar URL:', teamMembers.value[0].avatar)
      }
      return teamData
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn(`Team details not found (404) for ID: ${teamId}`)
        currentTeam.value = null
        teamMembers.value = []
        return null
      }
      error.value = err.response?.data?.message || 'Failed to fetch team details'
      console.error('Error fetching team details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get team members directly from API (if endpoint exists)
  const fetchTeamMembersDirect = async (teamId) => {
    if (!teamId) {
      error.value = 'Team ID is required'
      return []
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching members for team ID: ${teamId}`)
      // Try to get members from team details first
      const teamData = await fetchTeamDetails(teamId)
      if (teamMembers.value.length > 0) {
        return teamMembers.value
      }
      
      // If no members found, return empty array
      console.warn('No members found for team')
      teamMembers.value = []
      return []
    } catch (err) {
      console.error('Error fetching team members:', err)
      teamMembers.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchMemberDetails = async (teamId, memberId) => {
    if (!teamId || !memberId) {
      error.value = 'Team ID and Member ID are required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      const response = await teamAPI.getMemberDetails(teamId, memberId)
      
      let memberData = null
      if (response.data && response.data.data) {
        memberData = response.data.data
      } else if (response.data) {
        memberData = response.data
      }
      
      currentMember.value = memberData
      return memberData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch member details'
      console.error('Error fetching member details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get first team and its members
  const fetchFirstTeamMembers = async () => {
    loading.value = true
    error.value = null
    try {
      // First fetch all teams
      const teamsData = await fetchTeams()
      
      if (teamsData && teamsData.length > 0) {
        // Get the first team's details (which should include members)
        const firstTeamId = teamsData[0].id
        await fetchTeamDetails(firstTeamId)
      } else {
        console.warn('No teams found')
        teamMembers.value = []
      }
      
      return teamMembers.value
    } catch (err) {
      console.error('Error fetching first team members:', err)
      teamMembers.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch all teams with their members
  const fetchAllTeamsWithMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const teamsData = await fetchTeams()
      
      if (!teamsData || teamsData.length === 0) {
        console.warn('No teams found')
        teams.value = []
        teamMembers.value = []
        return []
      }

      const allMembers = []
      const teamsWithMembers = []

      for (const team of teamsData) {
        try {
          const teamDetail = await fetchTeamDetails(team.id)
          const members = [...teamMembers.value]
          teamsWithMembers.push({
            id: team.id,
            name: team.name || team.title,
            description: team.description,
            status: team.status,
            members
          })
          allMembers.push(...members)
        } catch (err) {
          console.warn(`Failed to fetch members for team ${team.id}:`, err)
          teamsWithMembers.push({
            id: team.id,
            name: team.name || team.title,
            description: team.description,
            status: team.status,
            members: []
          })
        }
      }

      teams.value = teamsWithMembers
      teamMembers.value = allMembers

      return teamsWithMembers
    } catch (err) {
      console.error('Error fetching all teams with members:', err)
      teams.value = []
      teamMembers.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    teamMembers,
    currentTeam,
    currentMember,
    loading,
    error,
    pagination,
    fetchTeams,
    fetchTeamDetails,
    fetchMemberDetails,
    fetchTeamMembersDirect,
    fetchFirstTeamMembers,
    fetchAllTeamsWithMembers
  }
}