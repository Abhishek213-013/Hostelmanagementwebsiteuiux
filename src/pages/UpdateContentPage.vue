<template>
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
      <div class="bg-gray-50 dark:bg-gray-900">
        <Header />
      </div>
      
      <div class="flex-1 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-16">
          
          <!-- Page Header -->
          <div class="mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <PenSquare class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Content Management</span>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black mb-3 text-teal-600">Update Content</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">Manage pages, facilities, gallery, and team for your website</p>
          </div>

          <!-- Tab Navigation -->
          <div class="flex gap-2 mb-8 flex-wrap">
            <button @click="activeTab = 'pages'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'pages' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <FileText class="w-4 h-4" /> Pages
            </button>
            <button @click="activeTab = 'facilities'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'facilities' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <Building2 class="w-4 h-4" /> Facilities
            </button>
            <button @click="activeTab = 'gallery'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'gallery' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <Image class="w-4 h-4" /> Gallery
            </button>
            <button @click="activeTab = 'team'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'team' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <Users class="w-4 h-4" /> Team
            </button>
            <button @click="activeTab = 'testimonials'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'testimonials' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <MessageSquare class="w-4 h-4" /> Testimonials
            </button>
            <button @click="activeTab = 'logo'" class="px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2" :class="activeTab === 'logo' ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'">
              <Image class="w-4 h-4" /> Logo
            </button>
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

          <!-- ===== PAGES TAB ===== -->
          <div v-if="activeTab === 'pages'">
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

              <div v-if="sections.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">No sections found for this page.</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Section" to create one.</p>
              </div>

              <div v-for="(section, sIdx) in sections" :key="section.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
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

          <!-- ===== FACILITIES TAB ===== -->
          <div v-if="activeTab === 'facilities'">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <Building2 class="w-5 h-5 text-teal-600" />
                <h2 class="text-xl font-black text-gray-800 dark:text-white">Manage Facilities</h2>
                <span class="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">{{ facilities.length }} total</span>
              </div>
              <button @click="openFacilityModal(null)" class="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" />
                Add Facility
              </button>
            </div>

            <div v-if="facilities.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Building2 class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 font-medium">No facilities found.</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Facility" to create one.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="facility in facilities" :key="facility.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                      <span class="text-lg font-bold text-teal-600">{{ (facility.icon || 'X').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-800 dark:text-white">{{ facility.title || `Facility #${facility.id}` }}</h3>
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="facility.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                        {{ facility.status == 1 ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <button @click="openFacilityModal(facility)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-600">
                      <Edit3 class="w-4 h-4" />
                    </button>
                    <button @click="deleteFacility(facility)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-600">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p v-if="facility.short_description" class="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{{ facility.short_description }}</p>
                <p v-if="facility.description" class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{ facility.description }}</p>
                <div v-if="facility.sort_order !== undefined" class="mt-2 text-xs text-gray-400">Sort: {{ facility.sort_order }}</div>
              </div>
            </div>
          </div>

          <!-- ===== GALLERY TAB ===== -->
          <div v-if="activeTab === 'gallery'">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <Image class="w-5 h-5 text-teal-600" />
                <h2 class="text-xl font-black text-gray-800 dark:text-white">Manage Gallery</h2>
                <span class="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">{{ galleryItems.length }} total</span>
              </div>
              <button @click="openGalleryModal(null)" class="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" />
                Add Gallery Item
              </button>
            </div>

            <div v-if="galleryItems.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Image class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 font-medium">No gallery items found.</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Gallery Item" to create one.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="item in galleryItems" :key="item.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
                <!-- Updated image display section -->
                <div class="h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img 
                    v-if="getGalleryImageUrl(item)" 
                    :src="getGalleryImageUrl(item)" 
                    :alt="item.title" 
                    class="w-full h-full object-cover" 
                    @error="handleGalleryImageError($event)"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <Image class="w-8 h-8" />
                  </div>
                </div>
                <div class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-800 dark:text-white truncate">{{ item.title || `Item #${item.id}` }}</h3>
                      <p v-if="item.caption" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.caption }}</p>
                      <p v-if="item.category" class="text-xs text-teal-600 mt-1 font-medium">{{ item.category }}</p>
                      <p v-else class="text-xs text-amber-600 mt-1 font-medium">Category not set</p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                      <button @click="openGalleryModal(item)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-600">
                        <Edit3 class="w-3.5 h-3.5" />
                      </button>
                      <button @click="deleteGalleryItem(item)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="item.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                      {{ item.status == 1 ? 'Active' : 'Inactive' }}
                    </span>
                    <span v-if="item.sort_order !== undefined" class="text-xs text-gray-400">Sort: {{ item.sort_order }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== TEAM TAB ===== -->
          <div v-if="activeTab === 'team'">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <Users class="w-5 h-5 text-teal-600" />
                <h2 class="text-xl font-black text-gray-800 dark:text-white">Manage Teams</h2>
                <span class="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">{{ teams.length }} total</span>
              </div>
              <button @click="openTeamModal(null)" class="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                <Plus class="w-4 h-4" />
                Add Team
              </button>
            </div>

            <div v-if="teams.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Users class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 font-medium">No teams found.</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Click "Add Team" to create one.</p>
            </div>

            <div v-for="(team, tIdx) in teams" :key="team.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
              <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                    <span class="text-sm font-bold text-teal-700 dark:text-teal-300">{{ tIdx + 1 }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 dark:text-white">{{ team.name || `Team #${team.id}` }}</h3>
                    <p v-if="team.description" class="text-xs text-gray-500 dark:text-gray-400">{{ team.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="team.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                    {{ team.status == 1 ? 'Active' : 'Inactive' }}
                  </span>
                  <button @click="openTeamModal(team)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-teal-600">
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button @click="deleteTeamItem(team)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-500 hover:text-red-600">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <button @click="toggleTeamExpanded(team.id)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
                    <ChevronDown class="w-4 h-4 transition-transform" :class="expandedTeams[team.id] ? 'rotate-180' : ''" />
                  </button>
                </div>
              </div>

              <!-- Members for this team -->
              <div v-if="expandedTeams[team.id]" class="p-5 bg-gray-50 dark:bg-gray-900/50">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-sm text-gray-700 dark:text-gray-300">Team Members</h4>
                    <span class="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">{{ getTeamMembers(team.id).length }}</span>
                  </div>
                  <button @click="openMemberModal(null, team.id)" class="px-3 py-1.5 bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-1.5">
                    <Plus class="w-3.5 h-3.5" />
                    Add Member
                  </button>
                </div>

                <div v-if="getTeamMembers(team.id).length === 0" class="text-center py-6">
                  <p class="text-sm text-gray-400 dark:text-gray-500">No members in this team.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div v-for="member in getTeamMembers(team.id)" :key="member.id" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-3 min-w-0">
                        <!-- Updated member avatar section -->
                        <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img 
                            v-if="getMemberImageUrl(member)" 
                            :src="getMemberImageUrl(member)" 
                            :alt="member.name" 
                            class="w-full h-full object-cover" 
                            @error="handleMemberImageError($event)"
                          />
                          <span v-else class="text-sm font-bold text-teal-600">{{ (member.name || 'M').charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ member.name || `Member #${member.id}` }}</p>
                          <p v-if="member.designation" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ member.designation }}</p>
                          <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="member.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                            {{ member.status == 1 ? 'Active' : 'Inactive' }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1 flex-shrink-0">
                        <button @click="openMemberModal(member, team.id)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-600">
                          <Edit3 class="w-3.5 h-3.5" />
                        </button>
                        <button @click="deleteMember(member, team.id)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-600">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== TESTIMONIALS TAB ===== -->
          <div v-if="activeTab === 'testimonials'">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-2">
                <MessageSquare class="w-5 h-5 text-teal-600" />
                <h2 class="text-xl font-black text-gray-800 dark:text-white">Manage Testimonials</h2>
                <span class="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">{{ testimonialsList.length }} total</span>
              </div>
            </div>

            <div v-if="testimonialsList.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <MessageSquare class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 font-medium">No testimonials found.</p>
            </div>

            <div class="space-y-4">
              <div v-for="testimonial in testimonialsList" :key="testimonial.id" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2 flex-wrap">
                      <span class="font-bold text-gray-800 dark:text-white">{{ testimonial.name }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ testimonial.email }}</span>
                    </div>
                    <div class="flex gap-1 mb-2">
                      <Star v-for="n in 5" :key="n" :class="['w-4 h-4', n <= (testimonial.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600']" />
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words line-clamp-3">{{ testimonial.message || testimonial.content }}</p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span v-if="testimonial.stay_duration">Stay: {{ testimonial.stay_duration }}</span>
                      <span v-if="testimonial.department">{{ testimonial.department }}</span>
                      <span>Submitted: {{ formatDate(testimonial.created_at) }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2 flex-shrink-0">
                    <span class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap" :class="testimonial.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                      {{ testimonial.status == 1 ? 'Active' : 'Inactive' }}
                    </span>
                    <div class="flex items-center gap-1">
                      <button @click="toggleTestimonialStatus(testimonial)" class="px-3 py-1.5 rounded-lg font-bold text-xs transition-all" :class="testimonial.status == 1 ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-300'">
                        {{ testimonial.status == 1 ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button @click="deleteAdminTestimonial(testimonial)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== LOGO TAB ===== -->
          <div v-if="activeTab === 'logo'">
            <div class="flex items-center gap-2 mb-6">
              <Image class="w-5 h-5 text-teal-600" />
              <h2 class="text-xl font-black text-gray-800 dark:text-white">Update Site Logo</h2>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
              <div v-if="loadingLogo" class="flex items-center justify-center py-12">
                <Loader2 class="w-8 h-8 animate-spin text-teal-600" />
              </div>

              <template v-else>
                <!-- Current Logo Preview -->
                <div class="mb-6">
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Current Logo</label>
                  <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <img 
                      v-if="currentLogoUrl" 
                      :src="currentLogoUrl" 
                      alt="Current Logo" 
                      class="h-20 lg:h-28 w-auto object-contain rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800" 
                      @error="currentLogoUrl = ''"
                    />
                    <div v-else class="w-32 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                      <Image class="w-8 h-8" />
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      <p v-if="logoSectionId">Section: <span class="font-mono text-teal-600">site-header</span> (ID: {{ logoSectionId }})</p>
                      <p v-if="logoItemId">Item ID: {{ logoItemId }}</p>
                      <p v-if="!currentLogoUrl" class="text-amber-600 font-medium mt-1">No logo set yet</p>
                    </div>
                  </div>
                </div>

                <!-- Upload New Logo -->
                <div class="mb-6">
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Upload New Logo</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="logoForm.imageUrl" 
                      type="text" 
                      class="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" 
                      placeholder="Logo URL or upload a file" 
                    />
                    <button 
                      type="button" 
                      @click="triggerLogoUpload" 
                      :disabled="uploading" 
                      class="px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    >
                      <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
                      <Upload v-else class="w-4 h-4" />
                      {{ uploading ? 'Uploading...' : 'Upload' }}
                    </button>
                  </div>
                  <input type="file" ref="logoFileInput" @change="handleLogoImageUpload" accept="image/*" class="hidden" />
                  <div v-if="logoImagePreview" class="mt-3 relative inline-block">
                    <img :src="logoImagePreview" class="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-contain bg-white dark:bg-gray-800 p-2" alt="New Logo Preview" />
                    <button 
                      @click="logoImagePreview = ''; logoSelectedFile = null" 
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <!-- Create section info -->
                <div v-if="!logoSectionId" class="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p class="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    No site-header section found. The logo will be created as a new item in a new section.
                  </p>
                </div>

                <div class="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    @click="saveLogo" 
                    :disabled="saving || !logoForm.imageUrl && !logoSelectedFile" 
                    class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                    {{ saving ? 'Saving...' : 'Update Logo' }}
                  </button>
                </div>
              </template>
            </div>
          </div>

        </div>
      </div>
    </main>

    <Footer />

    <!-- ===== MODALS ===== -->

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

    <!-- Facility Modal -->
    <div v-if="showFacilityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeFacilityModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingFacility ? 'Edit Facility' : 'Add Facility' }}</h3>
          <button @click="closeFacilityModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveFacility" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
            <input v-model="facilityForm.title" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., High-Speed WiFi" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Icon (Remix icon class)</label>
            <input v-model="facilityForm.icon" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., ri-wifi-line" />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Remix icon class name (e.g., ri-wifi-line, ri-dumbbell-line)</p>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Short Description</label>
            <input v-model="facilityForm.short_description" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Brief description" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea v-model="facilityForm.description" rows="3" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Full description"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Sort Order</label>
            <input v-model.number="facilityForm.sort_order" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select v-model.number="facilityForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeFacilityModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Gallery Modal -->
    <div v-if="showGalleryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeGalleryModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingGalleryItem ? 'Edit Gallery Item' : 'Add Gallery Item' }}</h3>
          <button @click="closeGalleryModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveGalleryItem" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
            <input v-model="galleryForm.title" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., Common Room" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Caption / Description</label>
            <textarea v-model="galleryForm.caption" rows="2" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Image caption"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
            <select v-model="galleryForm.category" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option value="rooms">Rooms</option>
              <option value="common">Common Areas</option>
              <option value="dining">Dining</option>
              <option value="facilities">Facilities</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Image {{ !editingGalleryItem ? '*' : '' }}
            </label>
            <div class="flex gap-2">
              <input v-model="galleryForm.imageUrl" type="text" class="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Image URL or upload a file" />
              <button type="button" @click="triggerGalleryUpload" :disabled="uploading" class="px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0">
                <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                {{ uploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            <input type="file" ref="galleryFileInput" @change="handleGalleryImageUpload" accept="image/*" class="hidden" />
            
            <!-- Show preview of newly selected image -->
            <div v-if="galleryImagePreview" class="mt-2 relative inline-block">
              <img :src="galleryImagePreview" class="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" alt="Preview" />
              <button 
                @click="galleryImagePreview = ''; gallerySelectedFile = null" 
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
            
            <!-- Show existing image when editing -->
            <div v-if="editingGalleryItem && !galleryImagePreview && getGalleryImageUrl(editingGalleryItem)" class="mt-2">
              <p class="text-xs text-gray-500 mb-1">Current image:</p>
              <img 
                :src="getGalleryImageUrl(editingGalleryItem)" 
                class="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" 
                alt="Current image" 
                @error="handleGalleryImageError($event)"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Sort Order</label>
            <input v-model.number="galleryForm.sort_order" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="0" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select v-model.number="galleryForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeGalleryModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Team Modal -->
    <div v-if="showTeamModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeTeamModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingTeam ? 'Edit Team' : 'Add Team' }}</h3>
          <button @click="closeTeamModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveTeam" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Team Name *</label>
            <input v-model="teamForm.name" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., Management Team" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea v-model="teamForm.description" rows="3" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Team description"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select v-model.number="teamForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeTeamModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-2.5 px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Member Modal -->
    <div v-if="showMemberModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeMemberModal">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-teal-600">{{ editingMember ? 'Edit Member' : 'Add Member' }}</h3>
          <button @click="closeMemberModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveMember" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
              <input v-model="memberForm.name" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Full name" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Designation / Role</label>
              <input v-model="memberForm.designation" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="e.g., General Manager" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
            <textarea v-model="memberForm.bio" rows="3" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="Member biography"></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input v-model="memberForm.email" type="email" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="email@example.com" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
              <input v-model="memberForm.phone" type="text" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="+880 1711-123456" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Facebook URL</label>
              <input v-model="memberForm.facebook_url" type="url" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn URL</label>
              <input v-model="memberForm.linkedin_url" type="url" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="https://linkedin.com/..." />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Avatar</label>
            <div class="flex gap-2">
              <input 
                v-model="memberForm.avatarUrl" 
                type="text" 
                class="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" 
                placeholder="Avatar URL or upload" 
              />
              <button 
                type="button" 
                @click="triggerMemberUpload" 
                :disabled="uploading" 
                class="px-4 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
              >
                <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                {{ uploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            <input type="file" ref="memberFileInput" @change="handleMemberImageUpload" accept="image/*" class="hidden" />
            
            <!-- Show preview of newly selected image -->
            <div v-if="memberImagePreview" class="mt-2 relative inline-block">
              <img :src="memberImagePreview" class="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" alt="Preview" />
              <button 
                @click="memberImagePreview = ''; memberSelectedFile = null" 
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
            
            <!-- Show existing avatar when editing -->
            <div v-if="editingMember && !memberImagePreview && getMemberImageUrl(editingMember)" class="mt-2">
              <p class="text-xs text-gray-500 mb-1">Current avatar:</p>
              <img 
                :src="getMemberImageUrl(editingMember)" 
                class="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" 
                alt="Current avatar" 
                @error="handleMemberImageError($event)"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Sort Order</label>
              <input v-model.number="memberForm.sort_order" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-400" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select v-model.number="memberForm.status" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeMemberModal" class="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { pagesAPI, pageSectionsAPI, sectionItemsAPI, facilitiesAPI, galleryAPI, teamAPI, uploadAPI } from '../services/api'
import apiClient from '../services/api'
import { useTestimonials } from '../composables/useTestimonials'
import {
  PenSquare, FileText, Plus, Edit3, Trash2, ChevronDown,
  CheckCircle2, AlertCircle, Loader2, X, Upload, FileEdit, Settings2,
  Building2, Image, Users, MessageSquare, Star
} from 'lucide-vue-next'

useHead({
  title: 'Update Content - SylhetStay Admin',
  meta: [
    { name: 'description', content: 'Admin content management for SylhetStay pages.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Base URL for storage
const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'

const loading = ref(true)
const saving = ref(false)
const isAdmin = ref(false)
const activeTab = ref('pages')

// ── Pages State ──
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

// ── Facilities State ──
const facilities = ref([])
const showFacilityModal = ref(false)
const editingFacility = ref(null)
const facilityForm = ref({
  title: '', icon: '', short_description: '', description: '',
  sort_order: 0, status: 1
})

// ── Gallery State ──
const galleryItems = ref([])
const showGalleryModal = ref(false)
const editingGalleryItem = ref(null)
const galleryForm = ref({
  title: '',
  caption: '',
  category: 'common',
  imageUrl: '',
  sort_order: 0,
  status: 1
})
const validCategories = ['rooms', 'common', 'dining', 'facilities']
const galleryFileInput = ref(null)
const gallerySelectedFile = ref(null)
const galleryImagePreview = ref('')

// ── Team State ──
const teams = ref([])
const allMembers = ref([])
const expandedTeams = ref({})
const showTeamModal = ref(false)
const editingTeam = ref(null)
const teamForm = ref({
  name: '', description: '', status: 1
})
const showMemberModal = ref(false)
const editingMember = ref(null)
const memberTeamId = ref(null)
const memberForm = ref({
  name: '', designation: '', bio: '', email: '', phone: '',
  facebook_url: '', linkedin_url: '', avatarUrl: '',
  sort_order: 0, status: 1
})
const memberFileInput = ref(null)
const memberSelectedFile = ref(null)
const memberImagePreview = ref('')

// ── Helper Functions ──

// Get full image URL for gallery items
const getGalleryImageUrl = (item) => {
  if (!item) return ''
  
  const imagePath = item.image_url || item.image || item.image_path || item.src || item.url
  
  if (!imagePath) return ''
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${API_BASE_URL}/storage/${cleanPath}`
}

// Handle gallery image loading errors
const handleGalleryImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e2e8f0"%3E%3Crect width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E'
  event.target.onerror = null
}

// ── Computed ──
const sections = computed(() => {
  if (!selectedPage.value) return []
  return allSections.value.filter(s => s.page_id === selectedPage.value.id)
})

const getSectionItems = (sectionId) => {
  return allItems.value.filter(item => item.page_section_id === sectionId)
}

const getTeamMembers = (teamId) => {
  return allMembers.value.filter(m => m.team_id === teamId)
}

// ── Helpers ──
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

const fetchTabData = async (tab) => {
  try {
    if (tab === 'facilities') {
      const res = await facilitiesAPI.getFacilities()
      const extractData = (res) => {
        if (res.data && res.data.data) return res.data.data
        if (Array.isArray(res.data)) return res.data
        return []
      }
      facilities.value = extractData(res)
    } else if (tab === 'gallery') {
      const res = await galleryAPI.getGallery()
      const extractData = (res) => {
        if (res.data && res.data.data) return res.data.data
        if (Array.isArray(res.data)) return res.data
        return []
      }
      galleryItems.value = extractData(res)
    } else if (tab === 'team') {
      const [teamsRes] = await Promise.all([
        teamAPI.getTeams()
      ])
      const extractData = (res) => {
        if (res.data && res.data.data) return res.data.data
        if (Array.isArray(res.data)) return res.data
        return []
      }
      teams.value = extractData(teamsRes)
      const allMembersData = []
      for (const team of teams.value) {
        try {
          const detailRes = await teamAPI.getTeamDetails(team.id)
          const detail = detailRes.data?.data || detailRes.data
          if (detail && detail.members) {
            detail.members.forEach(m => {
              allMembersData.push({ ...m, team_id: team.id })
            })
          }
        } catch (e) {
          console.warn(`Could not fetch members for team ${team.id}`)
        }
      }
      allMembers.value = allMembersData
    }
  } catch (err) {
    console.error(`Error fetching ${tab} data:`, err)
  }
}

// ── Pages Functions ──
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
    await apiClient.delete(`/page-sections/${section.id}`)
    successMessage.value = 'Section deleted successfully!'
    clearMessages()
    await fetchAllData()
  } catch (err) {
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
    await apiClient.delete(`/page-section-items/${item.id}`)
    successMessage.value = 'Item deleted successfully!'
    clearMessages()
    await fetchAllData()
  } catch (err) {
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

// ── Facilities CRUD ──
const openFacilityModal = (facility) => {
  if (facility) {
    editingFacility.value = facility
    facilityForm.value = {
      title: facility.title || '',
      icon: facility.icon || '',
      short_description: facility.short_description || '',
      description: facility.description || '',
      sort_order: facility.sort_order ?? 0,
      status: facility.status ?? 1
    }
  } else {
    editingFacility.value = null
    facilityForm.value = {
      title: '', icon: '', short_description: '', description: '',
      sort_order: 0, status: 1
    }
  }
  showFacilityModal.value = true
}

const closeFacilityModal = () => {
  showFacilityModal.value = false
  editingFacility.value = null
}

const saveFacility = async () => {
  saving.value = true
  try {
    const data = {
      title: facilityForm.value.title,
      icon: facilityForm.value.icon || '',
      short_description: facilityForm.value.short_description || '',
      description: facilityForm.value.description || '',
      sort_order: facilityForm.value.sort_order || 0,
      status: facilityForm.value.status
    }

    if (editingFacility.value) {
      await facilitiesAPI.updateFacility(editingFacility.value.id, data)
      successMessage.value = 'Facility updated successfully!'
    } else {
      await facilitiesAPI.createFacility(data)
      successMessage.value = 'Facility created successfully!'
    }
    clearMessages()
    closeFacilityModal()
    await fetchTabData('facilities')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save facility'
    clearMessages()
  } finally {
    saving.value = false
  }
}

const deleteFacility = async (facility) => {
  if (!confirm(`Delete facility "${facility.title}"?`)) return
  try {
    await facilitiesAPI.deleteFacility(facility.id)
    successMessage.value = 'Facility deleted successfully!'
    clearMessages()
    await fetchTabData('facilities')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to delete facility'
    clearMessages()
  }
}

// ── Gallery CRUD ──
const openGalleryModal = (item) => {
  if (item) {
    editingGalleryItem.value = item
    galleryForm.value = {
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'common',
      imageUrl: item.image_url || item.image || '',
      sort_order: item.sort_order ?? 0,
      status: item.status ?? 1
    }
    galleryImagePreview.value = getGalleryImageUrl(item)
  } else {
    editingGalleryItem.value = null
    galleryForm.value = {
      title: '', caption: '', category: 'common', imageUrl: '',
      sort_order: 0, status: 1
    }
    galleryImagePreview.value = ''
  }
  gallerySelectedFile.value = null
  showGalleryModal.value = true
}

const closeGalleryModal = () => {
  showGalleryModal.value = false
  editingGalleryItem.value = null
  gallerySelectedFile.value = null
  galleryImagePreview.value = ''
}

const triggerGalleryUpload = () => {
  galleryFileInput.value?.click()
}

const handleGalleryImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  gallerySelectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    galleryImagePreview.value = e.target.result
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

const saveGalleryItem = async () => {
  saving.value = true
  try {
    if (!editingGalleryItem.value && !gallerySelectedFile.value) {
      errorMessage.value = 'Please select an image to upload'
      clearMessages()
      saving.value = false
      return
    }

    const category = galleryForm.value.category || 'common'
    
    const formData = new FormData()
    formData.append('title', galleryForm.value.title)
    formData.append('caption', galleryForm.value.caption || '')
    formData.append('category', category)
    formData.append('sort_order', galleryForm.value.sort_order || 0)
    formData.append('status', galleryForm.value.status)
    
    if (gallerySelectedFile.value) {
      formData.append('image', gallerySelectedFile.value)
    }
    
    if (editingGalleryItem.value) {
      formData.append('_method', 'PUT')
      if (!gallerySelectedFile.value) {
        formData.append('existing_image', editingGalleryItem.value.image || '')
      }
      await apiClient.post(`/gallery/${editingGalleryItem.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      successMessage.value = 'Gallery item updated successfully!'
    } else {
      await apiClient.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      successMessage.value = 'Gallery item created successfully!'
    }
    
    clearMessages()
    closeGalleryModal()
    await fetchTabData('gallery')
  } catch (err) {
    console.error('Save error:', err.response?.data || err)
    if (err.response?.data?.errors) {
      const errorMessages = Object.values(err.response.data.errors).flat().join(', ')
      errorMessage.value = errorMessages
    } else {
      errorMessage.value = err.response?.data?.message || 'Failed to save gallery item'
    }
    clearMessages()
  } finally {
    saving.value = false
  }
}

const deleteGalleryItem = async (item) => {
  if (!confirm(`Delete gallery item "${item.title}"?`)) return
  try {
    await galleryAPI.deleteGalleryItem(item.id)
    successMessage.value = 'Gallery item deleted successfully!'
    clearMessages()
    await fetchTabData('gallery')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to delete gallery item'
    clearMessages()
  }
}

// ── Team CRUD ──

// Get full image URL for team members
const getMemberImageUrl = (member) => {
  if (!member) return ''
  
  const imagePath = member.image_url || member.image || member.image_path || member.avatar || member.avatarUrl
  
  if (!imagePath) return ''
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${API_BASE_URL}/storage/${cleanPath}`
}

// Handle member image loading errors
const handleMemberImageError = (event) => {
  // Hide the broken image
  event.target.style.display = 'none'
  // Prevent infinite error loop
  event.target.onerror = null
}

const toggleTeamExpanded = async (teamId) => {
  expandedTeams.value[teamId] = !expandedTeams.value[teamId]
  if (expandedTeams.value[teamId]) {
    try {
      const res = await teamAPI.getTeamDetails(teamId)
      const detail = res.data?.data || res.data
      if (detail && detail.members) {
        allMembers.value = allMembers.value.filter(m => m.team_id !== teamId)
        detail.members.forEach(m => {
          allMembers.value.push({ ...m, team_id: teamId })
        })
      }
    } catch (e) {
      console.warn(`Could not fetch members for team ${teamId}`)
    }
  }
}

const openTeamModal = (team) => {
  if (team) {
    editingTeam.value = team
    teamForm.value = {
      name: team.name || '',
      description: team.description || '',
      status: team.status ?? 1
    }
  } else {
    editingTeam.value = null
    teamForm.value = { name: '', description: '', status: 1 }
  }
  showTeamModal.value = true
}

const closeTeamModal = () => {
  showTeamModal.value = false
  editingTeam.value = null
}

const saveTeam = async () => {
  saving.value = true
  try {
    const data = {
      name: teamForm.value.name,
      description: teamForm.value.description || '',
      status: teamForm.value.status
    }

    if (editingTeam.value) {
      await teamAPI.updateTeam(editingTeam.value.id, data)
      successMessage.value = 'Team updated successfully!'
    } else {
      await teamAPI.createTeam(data)
      successMessage.value = 'Team created successfully!'
    }
    clearMessages()
    closeTeamModal()
    await fetchTabData('team')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save team'
    clearMessages()
  } finally {
    saving.value = false
  }
}

const deleteTeamItem = async (team) => {
  if (!confirm(`Delete team "${team.name}"?`)) return
  try {
    await teamAPI.deleteTeam(team.id)
    successMessage.value = 'Team deleted successfully!'
    clearMessages()
    allMembers.value = allMembers.value.filter(m => m.team_id !== team.id)
    await fetchTabData('team')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to delete team'
    clearMessages()
  }
}

// ── Member CRUD ──
const openMemberModal = (member, teamId) => {
  memberTeamId.value = teamId
  memberSelectedFile.value = null
  memberImagePreview.value = ''

  if (member) {
    editingMember.value = member
    memberForm.value = {
      name: member.name || '',
      designation: member.designation || '',
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      facebook_url: member.facebook_url || '',
      linkedin_url: member.linkedin_url || '',
      avatarUrl: member.image_url || member.image || '',
      sort_order: member.sort_order ?? 0,
      status: member.status ?? 1
    }
    // Show existing avatar as preview
    memberImagePreview.value = getMemberImageUrl(member)
  } else {
    editingMember.value = null
    memberForm.value = {
      name: '', designation: '', bio: '', email: '', phone: '',
      facebook_url: '', linkedin_url: '', avatarUrl: '',
      sort_order: 0, status: 1
    }
    memberImagePreview.value = ''
  }
  showMemberModal.value = true
}

const closeMemberModal = () => {
  showMemberModal.value = false
  editingMember.value = null
  memberTeamId.value = null
  memberSelectedFile.value = null
  memberImagePreview.value = ''
}

const triggerMemberUpload = () => {
  memberFileInput.value?.click()
}

const handleMemberImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  memberSelectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    memberImagePreview.value = e.target.result
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

const saveMember = async () => {
  saving.value = true
  try {
    const teamId = memberTeamId.value
    const formData = new FormData()
    formData.append('name', memberForm.value.name)
    formData.append('designation', memberForm.value.designation || '')
    formData.append('bio', memberForm.value.bio || '')
    formData.append('email', memberForm.value.email || '')
    formData.append('phone', memberForm.value.phone || '')
    formData.append('facebook_url', memberForm.value.facebook_url || '')
    formData.append('linkedin_url', memberForm.value.linkedin_url || '')
    formData.append('sort_order', memberForm.value.sort_order || 0)
    formData.append('status', memberForm.value.status)

    if (memberSelectedFile.value) {
      formData.append('image', memberSelectedFile.value)
    }

    if (editingMember.value) {
      formData.append('_method', 'PUT')
      await teamAPI.updateMember(teamId, editingMember.value.id, formData)
      successMessage.value = 'Member updated successfully!'
    } else {
      await teamAPI.createMember(teamId, formData)
      successMessage.value = 'Member created successfully!'
    }

    clearMessages()
    closeMemberModal()
    await fetchTabData('team')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to save member'
    clearMessages()
  } finally {
    saving.value = false
  }
}

const deleteMember = async (member, teamId) => {
  if (!confirm(`Delete member "${member.name}"?`)) return
  try {
    await teamAPI.deleteMember(teamId, member.id)
    successMessage.value = 'Member deleted successfully!'
    clearMessages()
    allMembers.value = allMembers.value.filter(m => !(m.id === member.id && m.team_id === teamId))
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to delete member'
    clearMessages()
  }
}

// ── Logo State ──
const loadingLogo = ref(false)
const logoSectionId = ref(null)
const logoItemId = ref(null)
const currentLogoUrl = ref('')
const logoForm = ref({ imageUrl: '' })
const logoFileInput = ref(null)
const logoSelectedFile = ref(null)
const logoImagePreview = ref('')

// ── Testimonials ──
const testimonialsList = ref([])
const {
  testimonials,
  fetchTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
} = useTestimonials()

const fetchTestimonialsData = async () => {
  try {
    await fetchTestimonials()
    console.log('Raw testimonials for admin:', JSON.parse(JSON.stringify(testimonials.value)))
    
    // Show ALL testimonials - both active and inactive
    testimonialsList.value = testimonials.value.map(t => {
      return {
        id: t.id,
        name: t.name || t.user?.name || '',
        email: t.email || t.user?.email || '',
        message: t.message || t.content || '',
        rating: t.rating || 5,
        status: t.status !== undefined ? t.status : (t.is_featured ? 1 : 0),
        stay_duration: t.stay_duration || '',
        department: t.department || '',
        created_at: t.created_at
      }
    })
    
    console.log('Processed testimonials list (all):', testimonialsList.value.length, 'items')
    console.log('Statuses:', testimonialsList.value.map(t => ({ id: t.id, name: t.name, status: t.status })))
  } catch (err) {
    console.error('Error fetching testimonials:', err)
    errorMessage.value = 'Failed to load testimonials. Check console for details.'
    clearMessages()
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const toggleTestimonialStatus = async (testimonial) => {
  const newStatus = testimonial.status == 1 ? 0 : 1
  try {
    // Try sending as JSON
    await apiClient.put(`/testimonials/${testimonial.id}`, { status: newStatus })
    testimonial.status = newStatus
    successMessage.value = `Testimonial ${newStatus == 1 ? 'activated' : 'deactivated'} successfully!`
    clearMessages()
    await fetchTestimonialsData()
  } catch (err) {
    console.error('Status update error:', err.response?.data || err)
    errorMessage.value = err.response?.data?.message || 'Failed to update testimonial status'
    clearMessages()
  }
}

const deleteAdminTestimonial = async (testimonial) => {
  if (!confirm(`Delete testimonial from "${testimonial.name}"?`)) return
  try {
    await testimonialsAPI.deleteTestimonial(testimonial.id)
    testimonialsList.value = testimonialsList.value.filter(t => t.id !== testimonial.id)
    successMessage.value = 'Testimonial deleted successfully!'
    clearMessages()
  } catch (err) {
    console.error('Delete error:', err.response?.data || err)
    errorMessage.value = err.response?.data?.message || 'Failed to delete testimonial'
    clearMessages()
  }
}

// ── Logo Functions ──
const fetchLogoData = async () => {
  loadingLogo.value = true
  try {
    const res = await pageSectionsAPI.getSections()
    const extractData = (res) => {
      if (res.data && res.data.data) return res.data.data
      if (Array.isArray(res.data)) return res.data
      return []
    }
    const allSections = extractData(res)
    const headerSection = allSections.find(
      section => section.page_id === 1 && section.section_key === 'site-header'
    )

    if (!headerSection) {
      logoSectionId.value = null
      logoItemId.value = null
      currentLogoUrl.value = ''
      return
    }

    logoSectionId.value = headerSection.id

    const itemsRes = await sectionItemsAPI.getItems()
    const allItems = extractData(itemsRes)
    const headerItems = allItems.filter(item => item.page_section_id === headerSection.id)
    const activeItem = headerItems.find(item => item.status == 1) || headerItems[0]

    if (activeItem?.image) {
      logoItemId.value = activeItem.id
      const imgPath = activeItem.image
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
        currentLogoUrl.value = imgPath
      } else {
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
        currentLogoUrl.value = `${API_BASE_URL}/storage/${cleanPath}`
      }
      logoForm.value.imageUrl = activeItem.image || ''
    } else {
      logoItemId.value = activeItem?.id || null
      currentLogoUrl.value = ''
      logoForm.value.imageUrl = ''
    }
  } catch (err) {
    console.error('Error fetching logo data:', err)
  } finally {
    loadingLogo.value = false
  }
}

const triggerLogoUpload = () => {
  logoFileInput.value?.click()
}

const handleLogoImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  logoSelectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    logoImagePreview.value = e.target.result
    uploading.value = false
  }
  reader.onerror = () => {
    uploading.value = false
    errorMessage.value = 'Failed to read logo file'
    clearMessages()
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const saveLogo = async () => {
  saving.value = true
  try {
    let sectionId = logoSectionId.value

    // Create site-header section if it doesn't exist
    if (!sectionId) {
      const sectionRes = await pageSectionsAPI.createSection({
        page_id: 1,
        section_key: 'site-header',
        title: 'Site Header',
        status: 1
      })
      sectionId = sectionRes.data?.data?.id || sectionRes.data?.id
      if (!sectionId) throw new Error('Failed to create site-header section')
      logoSectionId.value = sectionId
    }

    if (!logoSelectedFile.value && !logoForm.value.imageUrl) {
      errorMessage.value = 'Please provide a logo image URL or upload a file'
      clearMessages()
      saving.value = false
      return
    }

    // Use FormData to send image directly (same as gallery/member upload)
    const formData = new FormData()
    formData.append('page_section_id', sectionId)
    formData.append('title', 'Site Logo')
    formData.append('sort_order', 0)
    formData.append('status', 1)

    if (logoSelectedFile.value) {
      formData.append('image', logoSelectedFile.value)
    } else if (logoForm.value.imageUrl) {
      formData.append('image', logoForm.value.imageUrl)
    }

    if (logoItemId.value) {
      // Update existing logo item
      formData.append('_method', 'PUT')
      await apiClient.post(`/page-section-items/${logoItemId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      successMessage.value = 'Logo updated successfully!'
    } else {
      // Create new logo item
      const createRes = await apiClient.post('/page-section-items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      logoItemId.value = createRes.data?.data?.id || createRes.data?.id
      successMessage.value = 'Logo created successfully!'
    }

    clearMessages()
    logoImagePreview.value = ''
    logoSelectedFile.value = null
    logoForm.value.imageUrl = ''
    window.dispatchEvent(new CustomEvent('logoUpdated'))
    await fetchLogoData()
  } catch (err) {
    console.error('Error saving logo:', err.response?.data || err)
    errorMessage.value = err.response?.data?.message || 'Failed to save logo'
    clearMessages()
  } finally {
    saving.value = false
  }
}

// ── Tab watcher ──
watch(activeTab, (newTab) => {
  if (newTab !== 'pages') {
    fetchTabData(newTab)
  }
  if (newTab === 'testimonials') {
    fetchTestimonialsData()
  }
  if (newTab === 'logo') {
    fetchLogoData()
  }
})

onMounted(() => {
  checkAdmin()
  if (isAdmin.value) {
    loading.value = true
    fetchAllData().finally(() => { loading.value = false })
  }
})
</script>