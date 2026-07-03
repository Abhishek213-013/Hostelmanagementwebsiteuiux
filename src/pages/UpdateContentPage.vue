<template>
  <!-- 1. Removed background from here entirely. This is now just a transparent spacer -->
  <div class="min-h-screen flex flex-col">
    
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading content...</p>
      </div>
    </main>

    <!-- Not Admin -->
    <main v-else-if="!isAdmin" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 class="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p class="text-red-500 dark:text-red-300">You do not have permission to access this page.</p>
          <router-link to="/" class="inline-block mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Go Home
          </router-link>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else class="flex-1 flex flex-col">
      <!-- 2. Header gets its background -->
      <div class="bg-gray-50 dark:bg-gray-900">
        <Header />
      </div>
      
      <!-- 3. Main wrapper gets the background, fills all empty space up to the footer -->
      <div class="flex-1 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-16">
          
          <!-- Page Header -->
          <div class="mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <PenSquare class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Content Management</span>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black mb-3 text-teal-600">Update Content</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">Manage pages, sections, and section items for your website</p>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 class="w-5 h-5 flex-shrink-0" />
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle class="w-5 h-5 flex-shrink-0" />
            {{ errorMessage }}
          </div>

          <!-- Page Selector -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <FileText class="w-5 h-5 text-teal-600" />
                <h2 class="text-lg font-black text-teal-600">Select Page</h2>
              </div>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="pg in pages"
                  :key="pg.id"
                  @click="selectPage(pg)"
                  class="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                  :class="selectedPage?.id === pg.id ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                >
                  {{ pg.name || pg.title || `Page ${pg.id}` }}
                </button>
              </div>
            </div>
          </div>

          <!-- Sections & Items for Selected Page -->
          <div v-if="selectedPage">
            <!-- Add New Section Button -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-gray-800 dark:text-white">
                  Sections for <span class="text-teal-600">{{ selectedPage.name || selectedPage.title || `Page ${selectedPage.id}` }}</span>
                </h2>
                <span class="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">{{ sections.length }} total</span>
              </div>
              <button @click="openSectionModal(null)" class="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" />
                Add Section
              </button>
            </div>

            <!-- Sections List -->
            <div v-if="sections.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FileText class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 font-medium">No sections found for this page.</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Section" to create one.</p>
            </div>

            <div v-for="(section, sIdx) in sections" :key="section.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
              <!-- Section Header -->
              <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                    <span class="text-sm font-bold text-teal-700 dark:text-teal-300">{{ sIdx + 1 }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 dark:text-white">{{ section.section_key || section.title || `Section #${section.id}` }}</h3>
                    <p v-if="section.title" class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ section.section_key }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="section.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                    {{ section.status == 1 ? 'Active' : 'Inactive' }}
                  </span>
                  <button @click="openSectionDataModal(section)" class="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-blue-500 hover:text-blue-600" title="Edit Section Content">
                    <FileEdit class="w-4 h-4" />
                  </button>
                  <button @click="openSectionModal(section)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-teal-600" title="Edit Section Settings">
                    <Settings2 class="w-4 h-4" />
                  </button>
                  <button @click="deleteSection(section)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-500 hover:text-red-600">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <button @click="toggleSectionExpanded(section.id)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
                    <ChevronDown class="w-4 h-4 transition-transform" :class="expandedSections[section.id] ? 'rotate-180' : ''" />
                  </button>
                </div>
              </div>

              <!-- Section Content Preview -->
              <div v-if="expandedSections[section.id]" class="px-5 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-bold text-blue-700 dark:text-blue-300">Section Content</h4>
                  <button @click="openSectionDataModal(section)" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <Edit3 class="w-3 h-3" /> Edit
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div v-if="section.title" class="flex gap-2">
                    <span class="font-medium text-gray-600 dark:text-gray-400">Badge:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ section.title }}</span>
                  </div>
                  <div v-if="section.subtitle" class="flex gap-2">
                    <span class="font-medium text-gray-600 dark:text-gray-400">Subtitle:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ section.subtitle }}</span>
                  </div>
                  <div v-if="section.subtitle" class="flex gap-2">
                    <span class="font-medium text-gray-600 dark:text-gray-400">Headline 1:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ getHeadlineParts(section).part1 }}</span>
                  </div>
                  <div v-if="section.subtitle && getHeadlineParts(section).part2" class="flex gap-2">
                    <span class="font-medium text-gray-600 dark:text-gray-400">Headline 2:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ getHeadlineParts(section).part2 }}</span>
                  </div>
                  <div v-if="section.description" class="flex gap-2 col-span-full">
                    <span class="font-medium text-gray-600 dark:text-gray-400">Description:</span>
                    <span class="text-gray-800 dark:text-gray-200 truncate">{{ section.description }}</span>
                  </div>
                </div>
              </div>

              <!-- Section Items -->
              <div v-if="expandedSections[section.id]" class="p-5 bg-gray-50 dark:bg-gray-900/50">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-sm text-gray-700 dark:text-gray-300">Section Items</h4>
                    <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">{{ getSectionItems(section.id).length }}</span>
                  </div>
                  <button @click="openItemModal(null, section.id)" class="px-3 py-1.5 bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-1.5">
                    <Plus class="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div v-if="getSectionItems(section.id).length === 0" class="text-center py-6">
                  <p class="text-sm text-gray-400 dark:text-gray-500">No items in this section.</p>
                </div>

                <div class="space-y-3">
                  <div v-for="(item, iIdx) in getSectionItems(section.id)" :key="item.id" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-xs font-bold text-gray-400 dark:text-gray-500">#{{ iIdx + 1 }}</span>
                          <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="item.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                            {{ item.status == 1 ? 'Active' : 'Inactive' }}
                          </span>
                        </div>
                        <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ item.title || item.badge || item.headline_part1 || `Item #${item.id}` }}</p>
                        <p v-if="item.subtitle || item.description" class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ item.subtitle || item.description }}</p>
                        <div v-if="item.headline_part2 || item.headline_part3 || item.description_part1" class="flex flex-wrap gap-1.5 mt-2">
                          <span v-if="item.headline_part2" class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">{{ item.headline_part2 }}</span>
                          <span v-if="item.headline_part3" class="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs">{{ item.headline_part3 }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1.5 flex-shrink-0">
                        <button @click="openItemModal(item, section.id)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-600">
                          <Edit3 class="w-3.5 h-3.5" />
                        </button>
                        <button @click="deleteItem(item)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-600">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 4. Footer sits outside all bg layers, becomes the absolute bottom -->
    <Footer />

    <!-- Section Data Modal -->
    <div v-if="showSectionDataModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeSectionDataModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">Edit Section Content</h3>
          <button @click="closeSectionDataModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div v-if="currentSectionData" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Section: {{ currentSectionData.section_key }} (ID: {{ currentSectionData.id }})</span>
        </div>

        <form @submit.prevent="saveSectionData" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Badge</label>
              <input v-model="sectionDataForm.badge" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., ABOUT US, OUR MISSION" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 1</label>
              <input v-model="sectionDataForm.headline_part1" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="First part of headline" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 2</label>
              <input v-model="sectionDataForm.headline_part2" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Second part of headline" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 3</label>
              <input v-model="sectionDataForm.headline_part3" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Third part of headline" />
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea v-model="sectionDataForm.description" rows="4" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Section description"></textarea>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subtitle</label>
            <input v-model="sectionDataForm.subtitle" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Section subtitle" />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Additional Data (JSON)</label>
            <textarea v-model="sectionDataForm.additional_data" rows="4" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 font-mono" placeholder='{"custom_field": "value"}'></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">JSON format for any additional section data</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeSectionDataModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save Section Content' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Section Modal (Settings) -->
    <div v-if="showSectionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeSectionModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingSection ? 'Edit Section Settings' : 'Add Section' }}</h3>
          <button @click="closeSectionModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveSection" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Section Key</label>
            <input v-model="sectionForm.section_key" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g. hero-slider, about, mission" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Title (optional)</label>
            <input v-model="sectionForm.title" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Section display name" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select v-model.number="sectionForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeSectionModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Item Modal -->
    <div v-if="showItemModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeItemModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingItem ? 'Edit Item' : 'Add Item' }}</h3>
          <button @click="closeItemModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveItem" class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Title / Badge</label>
            <input v-model="itemForm.title" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Title or badge text" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 1</label>
            <input v-model="itemForm.headline_part1" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="First part of headline" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 2</label>
            <input v-model="itemForm.headline_part2" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Second part of headline" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Headline Part 3</label>
            <input v-model="itemForm.headline_part3" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Third part of headline" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description Part 1</label>
            <input v-model="itemForm.description_part1" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="First part of description" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea v-model="itemForm.description" rows="2" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 resize-none" placeholder="Full description text"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subtitle</label>
            <input v-model="itemForm.subtitle" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Subtitle text" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Image</label>
            <div class="flex gap-2">
              <input v-model="itemForm.imageUrl" type="text" class="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Image URL or upload a file" />
              <button type="button" @click="triggerUpload" :disabled="uploading" class="px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0">
                <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                {{ uploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" class="hidden" />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2 h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" alt="Preview" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Sort Order</label>
            <input v-model.number="itemForm.sort_order" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select v-model.number="itemForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeItemModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { pagesAPI, pageSectionsAPI, sectionItemsAPI } from '../services/api'
import apiClient from '../services/api'
import {
  PenSquare, FileText, Plus, Edit3, Trash2, ChevronDown,
  CheckCircle2, AlertCircle, Loader2, X, Upload, FileEdit, Settings2
} from 'lucide-vue-next'

useHead({
  title: 'Update Content - SylhetStay Admin',
  meta: [
    { name: 'description', content: 'Admin content management for SylhetStay pages.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const loading = ref(true)
const saving = ref(false)
const isAdmin = ref(false)
const pages = ref([])
const allSections = ref([])
const allItems = ref([])
const selectedPage = ref(null)
const expandedSections = ref({})
const successMessage = ref('')
const errorMessage = ref('')

const showSectionModal = ref(false)
const showSectionDataModal = ref(false)
const showItemModal = ref(false)
const editingSection = ref(null)
const currentSectionData = ref(null)
const editingItem = ref(null)
const itemSectionId = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const selectedFile = ref(null)
const imagePreview = ref('')

const sectionForm = ref({ section_key: '', title: '', status: 1 })
const sectionDataForm = ref({
  badge: '',
  headline_part1: '',
  headline_part2: '',
  headline_part3: '',
  description: '',
  subtitle: '',
  additional_data: '{}'
})

const itemForm = ref({
  title: '', headline_part1: '', headline_part2: '', headline_part3: '',
  description_part1: '', description: '', subtitle: '', imageUrl: '',
  sort_order: 0, status: 1
})

const sections = computed(() => {
  if (!selectedPage.value) return []
  return allSections.value.filter(s => s.page_id === selectedPage.value.id)
})

const getSectionItems = (sectionId) => {
  return allItems.value.filter(item => item.page_section_id === sectionId)
}

const clearMessages = () => {
  setTimeout(() => { successMessage.value = ''; errorMessage.value = '' }, 5000)
}

const checkAdmin = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      isAdmin.value = user.email === 'admin@gmail.com'
    } catch {
      isAdmin.value = false
    }
  }
  if (!isAdmin.value) {
    loading.value = false
  }
}

const fetchAllData = async () => {
  try {
    const [pagesRes, sectionsRes, itemsRes] = await Promise.all([
      pagesAPI.getPages(),
      pageSectionsAPI.getSections(),
      sectionItemsAPI.getItems()
    ])

    const extractData = (res) => {
      if (res.data && res.data.data) return res.data.data
      if (Array.isArray(res.data)) return res.data
      return []
    }

    pages.value = extractData(pagesRes)
    allSections.value = extractData(sectionsRes)
    allItems.value = extractData(itemsRes)
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

const selectPage = (page) => {
  selectedPage.value = page
  expandedSections.value = {}
}

const toggleSectionExpanded = (id) => {
  expandedSections.value[id] = !expandedSections.value[id]
}

const getHeadlineParts = (section) => {
  const subtitle = section.subtitle || ''
  if (!subtitle) return { part1: '', part2: '' }
  const words = subtitle.split(' ')
  const midPoint = Math.ceil(words.length / 2)
  return {
    part1: words.slice(0, midPoint).join(' '),
    part2: words.slice(midPoint).join(' ')
  }
}

// Section Data Modal
const openSectionDataModal = (section) => {
  currentSectionData.value = section
  const headlineParts = getHeadlineParts(section)
  sectionDataForm.value = {
    badge: section.title || '',
    headline_part1: headlineParts.part1,
    headline_part2: headlineParts.part2,
    headline_part3: '',
    description: section.description || '',
    subtitle: section.subtitle || '',
    additional_data: '{}'
  }
  showSectionDataModal.value = true
}

const closeSectionDataModal = () => {
  showSectionDataModal.value = false
  currentSectionData.value = null
}

const saveSectionData = async () => {
  saving.value = true
  try {
    const headlineParts = [
      sectionDataForm.value.headline_part1,
      sectionDataForm.value.headline_part2,
      sectionDataForm.value.headline_part3
    ].filter(Boolean)
    const subtitle = headlineParts.join(' ')

    const data = {
      page_id: currentSectionData.value.page_id,
      section_key: currentSectionData.value.section_key,
      title: sectionDataForm.value.badge,
      subtitle: subtitle,
      description: sectionDataForm.value.description,
      status: currentSectionData.value.status ?? 1
    }

    await pageSectionsAPI.updateSection(currentSectionData.value.id, data)
    successMessage.value = 'Section content updated successfully!'
    clearMessages()
    closeSectionDataModal()
    await fetchAllData()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save section content'
    clearMessages()
  } finally {
    saving.value = false
  }
}

// Section Settings CRUD
const openSectionModal = (section) => {
  if (section) {
    editingSection.value = section
    sectionForm.value = {
      section_key: section.section_key || '',
      title: section.title || '',
      status: section.status ?? 1
    }
  } else {
    editingSection.value = null
    sectionForm.value = { section_key: '', title: '', status: 1 }
  }
  showSectionModal.value = true
}

const closeSectionModal = () => {
  showSectionModal.value = false
  editingSection.value = null
}

const saveSection = async () => {
  saving.value = true
  try {
    const data = {
      page_id: selectedPage.value.id,
      section_key: sectionForm.value.section_key,
      title: sectionForm.value.title,
      status: sectionForm.value.status
    }

    if (editingSection.value) {
      await pageSectionsAPI.updateSection(editingSection.value.id, data)
      successMessage.value = 'Section settings updated successfully!'
    } else {
      await pageSectionsAPI.createSection(data)
      successMessage.value = 'Section created successfully!'
    }
    clearMessages()
    closeSectionModal()
    await fetchAllData()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save section'
    clearMessages()
  } finally {
    saving.value = false
  }
}

const deleteSection = async (section) => {
  if (!confirm(`Delete section "${section.section_key || section.title || section.id}"?`)) return
  try {
    // Try DELETE first
    await apiClient.delete(`/page-sections/${section.id}`)
    successMessage.value = 'Section deleted successfully!'
    clearMessages()
    await fetchAllData()
  } catch (err) {
    // Fallback: update with status 0
    try {
      await pageSectionsAPI.updateSection(section.id, {
        page_id: section.page_id,
        section_key: section.section_key,
        title: section.title || '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        status: 0
      })
      successMessage.value = 'Section deactivated successfully!'
      clearMessages()
      await fetchAllData()
    } catch (err2) {
      errorMessage.value = err2.response?.data?.message || 'Failed to delete section'
      clearMessages()
    }
  }
}

// Item CRUD
const openItemModal = (item, sectionId) => {
  itemSectionId.value = sectionId
  selectedFile.value = null
  imagePreview.value = ''

  if (item) {
    editingItem.value = item
    itemForm.value = {
      title: item.title || '',
      headline_part1: item.headline_part1 || '',
      headline_part2: item.headline_part2 || '',
      headline_part3: item.headline_part3 || '',
      description_part1: item.description_part1 || '',
      description: item.description || '',
      subtitle: item.subtitle || '',
      imageUrl: item.image || '',
      sort_order: item.sort_order ?? 0,
      status: item.status ?? 1
    }
    if (item.image) imagePreview.value = item.image
  } else {
    editingItem.value = null
    itemForm.value = {
      title: '', headline_part1: '', headline_part2: '', headline_part3: '',
      description_part1: '', description: '', subtitle: '', imageUrl: '',
      sort_order: 0, status: 1
    }
  }
  showItemModal.value = true
}

const closeItemModal = () => {
  showItemModal.value = false
  editingItem.value = null
  itemSectionId.value = null
  selectedFile.value = null
  imagePreview.value = ''
}

const saveItem = async () => {
  saving.value = true
  try {
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('page_section_id', editingItem.value ? editingItem.value.page_section_id : itemSectionId.value)
      formData.append('title', itemForm.value.title || '')
      formData.append('headline_part1', itemForm.value.headline_part1 || '')
      formData.append('headline_part2', itemForm.value.headline_part2 || '')
      formData.append('headline_part3', itemForm.value.headline_part3 || '')
      formData.append('description_part1', itemForm.value.description_part1 || '')
      formData.append('description', itemForm.value.description || '')
      formData.append('subtitle', itemForm.value.subtitle || '')
      formData.append('sort_order', itemForm.value.sort_order || 0)
      formData.append('status', itemForm.value.status || 1)
      formData.append('image', selectedFile.value)

      if (editingItem.value) {
        formData.append('_method', 'PUT')
        await apiClient.post(`/page-section-items/${editingItem.value.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        successMessage.value = 'Item updated successfully!'
      } else {
        await apiClient.post('/page-section-items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        successMessage.value = 'Item created successfully!'
      }
    } else {
      const data = {
        page_section_id: editingItem.value ? editingItem.value.page_section_id : itemSectionId.value,
        title: itemForm.value.title || '',
        headline_part1: itemForm.value.headline_part1 || '',
        headline_part2: itemForm.value.headline_part2 || '',
        headline_part3: itemForm.value.headline_part3 || '',
        description_part1: itemForm.value.description_part1 || '',
        description: itemForm.value.description || '',
        subtitle: itemForm.value.subtitle || '',
        image: itemForm.value.imageUrl || '',
        sort_order: itemForm.value.sort_order || 0,
        status: itemForm.value.status || 1
      }

      if (editingItem.value && itemForm.value.imageUrl === editingItem.value.image) {
        delete data.image
      }

      if (editingItem.value) {
        await sectionItemsAPI.updateItem(editingItem.value.id, data)
        successMessage.value = 'Item updated successfully!'
      } else {
        await sectionItemsAPI.createItem(data)
        successMessage.value = 'Item created successfully!'
      }
    }

    clearMessages()
    closeItemModal()
    // ✅ REFRESH ALL DATA to show new items in the list
    await fetchAllData()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save item'
    clearMessages()
  } finally {
    saving.value = false
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploading.value = true
  selectedFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    uploading.value = false
  }
  reader.onerror = () => {
    uploading.value = false
    errorMessage.value = 'Failed to read image file'
    clearMessages()
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const deleteItem = async (item) => {
  if (!confirm(`Delete item "${item.title || item.headline_part1 || item.id}"?`)) return
  try {
    // Try DELETE method
    await apiClient.delete(`/page-section-items/${item.id}`)
    successMessage.value = 'Item deleted successfully!'
    clearMessages()
    await fetchAllData()
  } catch (err) {
    // Fallback: update status to 0
    try {
      await sectionItemsAPI.updateItem(item.id, {
        page_section_id: item.page_section_id,
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        image: item.image || '',
        sort_order: item.sort_order || 0,
        status: 0
      })
      successMessage.value = 'Item deactivated successfully!'
      clearMessages()
      await fetchAllData()
    } catch (err2) {
      errorMessage.value = err2.response?.data?.message || 'Failed to delete item'
      clearMessages()
    }
  }
}

onMounted(() => {
  checkAdmin()
  if (isAdmin.value) {
    loading.value = true
    fetchAllData().finally(() => { loading.value = false })
  }
})
</script>