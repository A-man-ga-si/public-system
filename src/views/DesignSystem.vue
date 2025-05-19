<template>
  <div class="design-system-container">
    <h1 class="main-title">Design System</h1>
    
    <!-- Search Components Section -->
    <section class="component-section">
      <h2 class="section-title">Search Components</h2>
      
      <div class="component-demo">
        <h3 class="component-title">SearchBar</h3>
        <div class="component-description">
          <p>A reusable search input component with customizable placeholder.</p>
        </div>
        <div class="component-example">
          <SearchBar 
            v-model="searchQuery" 
            placeholder="Search for something..." 
            @search="performSearch"
          />
          <div class="component-result" v-if="hasSearched">
            <p>Search query: "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>

      <div class="component-demo">
        <h3 class="component-title">DropdownSelect</h3>
        <div class="component-description">
          <p>A customizable dropdown select component with focus styling and custom icon.</p>
        </div>
        <div class="component-example">
          <DropdownSelect
            v-model="selectedOption"
            :options="dropdownOptions"
            placeholder="Select an option..."
          />
        </div>
      </div>
    </section>

    <!-- Recommendation Component Demo -->
    <section class="component-section">
      <div class="component-demo">
        <h3 class="component-title">Recommendation Component</h3>
        <div class="component-description">
          <p>A component for displaying recommendations in a view-only mode.</p>
        </div>
        <div class="component-example">
          <Recommendation :recommendations="sampleRecommendations" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from '@/components/Common/SearchBar.vue'
import DropdownSelect from '@/components/Common/DropdownSelect.vue'
import Recommendation from '@/components/Common/Recommendation.vue'

// Import available icons
import IconLup from '@/assets/icons/IconLup.vue'
import IconRightChevron from '@/assets/icons/IconRightChevron.vue'
import IconLeftChevron from '@/assets/icons/IconLeftChevron.vue'
import IconDownChevron from '@/assets/icons/IconDownChevron.vue'

export default {
  name: 'DesignSystem',
  components: {
    SearchBar,
    DropdownSelect,
    Recommendation
  },
  data() {
    return {
      searchQuery: '',
      hasSearched: false,
      selectedOption: '',
      dropdownOptions: ['Option 1', 'Option 2', 'Option 3'],
      IconLup,
      IconRightChevron,
      IconLeftChevron,
      IconDownChevron,
      sampleRecommendations: [
        {
          id: '1',
          talentId: 'talent-001',
          contractorId: 101,
          contractorName: 'PT Maju Bersama',
          message: 'Sangat terampil dalam komunikasi dan memiliki kemampuan teknis yang baik. Berhasil menyelesaikan proyek tepat waktu dengan hasil yang memuaskan. Memiliki inisiatif tinggi dalam menyelesaikan masalah dan mampu bekerja secara mandiri maupun dalam tim. Pemahaman teknisnya dalam bidang pengembangan perangkat lunak sangat mumpuni dan selalu mengikuti best practices dalam pengembangan. Kami sangat puas dengan hasil kerja dan profesionalisme yang ditunjukkan selama masa kontrak.',
          status: 'ACCEPTED'
        },
        {
          id: '2',
          talentId: 'talent-001',
          contractorId: 102,
          contractorName: 'CV Teknologi Inovasi',
          message: 'Memiliki etika kerja yang sangat baik dan selalu profesional dalam setiap penugasan. Kami sangat merekomendasikan untuk posisi pengembang aplikasi senior. Keahliannya dalam mendesain arsitektur sistem dan mengimplementasikan solusi yang kompleks patut diapresiasi. Selama bekerja dengan kami, telah menunjukkan dedikasi tinggi dan kemampuan adaptasi yang cepat terhadap teknologi baru. Selain itu, kemampuan komunikasi dan dokumentasinya sangat baik sehingga memudahkan proses transfer knowledge kepada anggota tim lainnya.',
          status: 'PENDING'
        },
        {
          id: '3',
          talentId: 'talent-001',
          contractorId: 103,
          contractorName: 'UD Sistem Digital',
          message: 'Pekerja yang sangat detail dan tekun. Sayangnya kurang dalam hal manajemen waktu, namun secara keseluruhan masih memberikan hasil yang baik. Memiliki pengetahuan teknis yang mendalam dan kemampuan analitis yang kuat dalam menghadapi permasalahan kompleks. Dalam proyek terakhir bersama kami, menunjukkan kreativitas dalam memberikan solusi alternatif yang efisien. Meskipun terkadang estimasi waktu tidak sesuai dengan realisasi pengerjaan, kualitas hasil akhir selalu memenuhi dan bahkan melebihi ekspektasi. Perlu pengembangan dalam aspek komunikasi dan pelaporan progres secara rutin.',
          status: 'DECLINED'
        }
      ]
    }
  },
  methods: {
    performSearch() {
      this.hasSearched = true
      console.log('Searching for:', this.searchQuery)
    },
    incrementCounter() {
      this.clickCounter++
      console.log('Button clicked, counter:', this.clickCounter)
    }
  }
}
</script>

<style scoped>
.design-system-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
}

.main-title {
  font-size: 32px;
  margin-bottom: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.component-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.component-demo {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.component-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.component-description {
  margin-bottom: 20px;
  color: #777;
}

.component-example {
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
}

.component-result {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
}

/* Utility classes */
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-column {
  flex-direction: column;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
