<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1>{{ $t('menu.talent-pool') }}</h1>
        <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
          <ol class="breadcrumb pt-0">
            <li class="breadcrumb-item">
              <router-link to="/app/dashboard">{{ $t('menu.home') }}</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ $t('menu.talent-pool') }}</li>
          </ol>
        </nav>
        <div class="separator mb-5"></div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <!-- Tabs -->
        <div class="talent-tabs mb-4">
          <button 
            class="talent-tab-button"
            :class="{ 'active': activeTab === 'semua' }"
            @click="setActiveTab('semua')"
          >
            {{ $t('talent.semua-talent') }}
          </button>
          <button 
            class="talent-tab-button"
            :class="{ 'active': activeTab === 'terakhir' }"
            @click="setActiveTab('terakhir')"
          >
            {{ $t('talent.terakhir-dikontrak') }}
          </button>
          <button 
            class="talent-tab-button"
            :class="{ 'active': activeTab === 'favorit' }"
            @click="setActiveTab('favorit')"
          >
            {{ $t('talent.favorit') }}
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="search-filter-container mb-4">
          <div class="search-wrapper">
            <SearchBar
              v-model="searchQuery"
              :placeholder="$t('talent.search-placeholder')"
              @search="fetchTalents"
            />
          </div>
          <div class="filter-dropdowns">
            <DropdownSelect
              v-model="filterCriteria.skills"
              :options="skillOptions"
              :placeholder="$t('filter.keahlian')"
              custom-class="filter-item"
            />
            <DropdownSelect
              v-model="filterCriteria.preferredLocations"
              :options="locationOptions"
              :placeholder="$t('filter.lokasi')"
              custom-class="filter-item"
            />
            <DropdownSelect
              v-model="filterCriteria.priceRange"
              :options="priceOptions"
              :placeholder="$t('filter.harga')"
              custom-class="filter-item"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container text-center py-5">
          <div class="loading"></div>
          <p class="mt-2">Memuat data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="talents.length === 0" class="empty-container text-center py-5">
          <i class="simple-icon-magnifier-remove empty-icon"></i>
          <p class="mt-2">Tidak ada talent yang ditemukan</p>
        </div>

        <!-- Talent Cards -->
        <div v-else class="talent-grid">
          <UserCard 
            v-for="(talent, index) in talents" 
            :key="talent.id || index"
            :user="talent"
            @toggle-bookmark="toggleBookmark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TalentService from '@/services/TalentService';
import SearchBar from '@/components/Common/SearchBar.vue';
import DropdownSelect from '@/components/Common/DropdownSelect.vue';
import UserCard from '@/components/Common/UserCard.vue';
import { hargaJasa, locations, skills } from '@/constants/filterData';

export default {
  name: 'TalentPool',
  components: {
    SearchBar,
    DropdownSelect,
    UserCard
  },
  data() {
    return {
      activeTab: 'semua',
      searchQuery: '',
      filterCriteria: {
        skills: '',
        preferredLocations: '',
        priceRange: ''
      },
      loading: false,
      talents: [],
      skillOptions: [],
      locationOptions: [],
      priceOptions: [],
      priceRangeMapping: {}, // To map price range strings to actual values
      searchTimeout: null,
      filterTimeout: null,
      filterOptionsLoaded: false
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      this.fetchTalents();
    },
    async toggleBookmark(talent) {
      try {
        if (process.env.NODE_ENV === 'production') {
          await TalentService.toggleBookmark(talent.id);
        }
        
        talent.bookmarked = !talent.bookmarked;
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        this.$toast.error('Gagal mengubah status favorit. Silakan coba lagi.');
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    },
    formatPrice(value) {
      return new Intl.NumberFormat('id-ID').format(value);
    },
    async fetchFilterOptions() {
      if (this.filterOptionsLoaded) return;

      try {
        this.loading = true;

        // Fetch filter options from the backend
        const response = await TalentService.getMockFilterOptions();
        const filterOptions = response.data.data;

        // Extract just the labels for the dropdown components
        this.skillOptions = filterOptions.skills || [];
        this.locationOptions = filterOptions.locations || [];

        // Create a non-overlapping sequential price range
        this.generateSequentialPriceRanges(filterOptions.priceRanges);

        this.filterOptionsLoaded = true;
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        this.loading = false;
      }
    },
    generateSequentialPriceRanges(priceData) {
      // Extract all unique price points
      const pricePoints = new Set();
      
      if (Array.isArray(priceData) && priceData.length > 0) {
        // If we have an array of objects with min/max
        if (typeof priceData[0] === 'object' && priceData[0].min !== undefined) {
          priceData.forEach(range => {
            pricePoints.add(range.min);
            pricePoints.add(range.max);
          });
        } else {
          // If we have a plain array of numbers
          priceData.forEach(point => pricePoints.add(point));
        }
      }
      
      // Convert to array and sort
      const sortedPricePoints = Array.from(pricePoints).sort((a, b) => a - b);
      
      // Create non-overlapping ranges
      this.priceOptions = [];
      this.priceRangeMapping = {};
      
      // Create ranges between consecutive price points
      for (let i = 0; i < sortedPricePoints.length - 1; i++) {
        const min = sortedPricePoints[i];
        const max = sortedPricePoints[i + 1];
        
        const formattedMin = this.formatCurrency(min);
        const formattedMax = this.formatCurrency(max);
        const label = `${formattedMin} - ${formattedMax}`;
        
        this.priceOptions.push(label);
        this.priceRangeMapping[label] = [min, max];
      }
      
      // If we want broader ranges for better UX, add some additional combined ranges
      // For example, creating 500k-2M range alongside 500k-1M and 1M-2M
      const maxPoint = sortedPricePoints[sortedPricePoints.length - 1];
      
      // Add a "Less than" range for the minimum value
      const minPoint = sortedPricePoints[0];
      const lessThanLabel = `< ${this.formatCurrency(minPoint)}`;
      this.priceOptions.unshift(lessThanLabel);
      this.priceRangeMapping[lessThanLabel] = [0, minPoint];
      
      // Add a "More than" range for the maximum value
      const moreThanLabel = `> ${this.formatCurrency(maxPoint)}`;
      this.priceOptions.push(moreThanLabel);
      this.priceRangeMapping[moreThanLabel] = [maxPoint, Number.MAX_SAFE_INTEGER];
    },
    async fetchTalents() {
      try {
        this.loading = true;
        
        // Prepare API parameters based on the active tab and filters
        const params = this.prepareApiParams();
        
        // Fetch talents from the backend
        const response = await TalentService.getTalents(params);
        this.talents = response.data.data || [];
        console.log('Fetched talents:', response.data.data);
      } catch (error) {
        console.error('Error fetching talents:', error);
        this.talents = [];
        this.$toast.error('Gagal memuat data. Silakan coba lagi.');
      } finally {
        this.loading = false;
      }
    },
    prepareApiParams() {
      const params = {};
      
      // Add search query if not empty
      if (this.searchQuery) {
        params.name = this.searchQuery;
      }
      
      // Add filter criteria if selected
      if (this.filterCriteria.skills) {
        // Convert from skill label to skill value
        const skillObj = skills.find(s => s.label === this.filterCriteria.skills);
        if (skillObj) {
          params.skills = [skillObj.value];
        }
      }
      
      if (this.filterCriteria.preferredLocations) {
        // Convert from location label to location value
        const locationObj = locations.find(l => l.label === this.filterCriteria.preferredLocations);
        if (locationObj) {
          params.preferred_locations = [locationObj.value];
        }
      }
      
      if (this.filterCriteria.priceRange) {
        // Get the actual values from the mapping
        const priceValues = this.priceRangeMapping[this.filterCriteria.priceRange];
        if (priceValues) {
          params.price_range = priceValues;
        }
      }
      
      // Add tab-specific parameters
      if (this.activeTab === 'favorit') {
        params.bookmarked = true;
      } else if (this.activeTab === 'terakhir') {
        params.recently_contracted = true;
      }
      
      return params;
    },
    handleFilterChange() {
      // Debounce for filter changes
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.fetchTalents();
      }, 300);
    }
  },
  watch: {
    searchQuery() {
      // Debounce for search query
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchTalents();
      }, 500);
    },
    'filterCriteria.skills'() {
      this.handleFilterChange();
    },
    'filterCriteria.preferredLocations'() {
      this.handleFilterChange();
    },
    'filterCriteria.priceRange'() {
      this.handleFilterChange();
    }
  },
  created() {
    // Fetch filter options first
    this.fetchFilterOptions();
    // Then fetch talents
    this.fetchTalents();
  }
};
</script>

<style scoped>
/* Tab styling */
.talent-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.talent-tab-button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.talent-tab-button.active {
  color: #003473;
  font-weight: 500;
}

.talent-tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #003473;
}

/* Search and filter container */
.search-filter-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.search-wrapper {
  flex: 0 0 350px; /* Wider search bar */
  max-width: 350px;
}

.filter-dropdowns {
  flex: 1;
  display: flex;
  gap: 15px;
}

.filter-item {
  flex: 1;
  max-width: calc((100% - 30px) / 3); /* Equal width for all three dropdowns */
}

/* Talent grid */
.talent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.talent-card-wrapper {
  width: 100%;
}

.talent-card {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 100%;
}

.talent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.talent-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.talent-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.talent-info {
  padding: 15px;
}

.talent-name {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.talent-location {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 10px;
}

.talent-footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.talent-price {
  font-weight: 600;
  font-size: 16px;
}

.talent-date {
  font-size: 12px;
  color: #6c757d;
}

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 3px;
  cursor: pointer;
  z-index: 5;
}

.bookmark-icon i {
  color: #adb5bd;
}

.bookmark-icon i.filled {
  color: #ffc107;
}

.talent-badge {
  position: absolute;
  left: 10px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 3px;
  z-index: 5;
}

.experience-badge {
  bottom: 40px;
  background-color: #ffc107;
  color: white;
}

.specialty-badge {
  bottom: 10px;
  background-color: white;
  color: #003473;
}

/* Loading and empty states */
.loading-container, .empty-container {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 52, 115, 0.2);
  border-radius: 50%;
  border-top-color: #003473;
  animation: spin 1s ease-in-out infinite;
}

@keyframes hideLoader {
  0% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; display: none; }
}

.loading-container {
  animation: hideLoader 5s forwards;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 40px;
  color: #adb5bd;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-wrapper {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 10px;
  }
  
  .filter-dropdowns {
    flex-wrap: nowrap;
  }
  
  .filter-item {
    flex: 1 1 calc(33.333% - 10px);
    max-width: none;
  }
}

@media (max-width: 768px) {
  .filter-dropdowns {
    flex-wrap: wrap;
  }

  .filter-item {
    flex: 1 1 100%;
    margin-bottom: 10px;
  }
  
  .talent-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>