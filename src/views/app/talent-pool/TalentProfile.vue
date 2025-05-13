<template>
  <div class="talent-profile-container">
    <div class="page-header">
      <h1>Talent Pool</h1>
      <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
        <ol class="breadcrumb pt-0">
          <li class="breadcrumb-item">
            <router-link to="/app/dashboard">{{ $t('menu.home') }}</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/app/talent-pool">{{ $t('menu.talent-pool') }}</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ talent.name || 'Talent Profile' }}</li>
        </ol>
      </nav>
    </div>

    <div v-if="loading" class="loading-container text-center py-5">
      <div class="loading"></div>
      <p class="mt-2">Memuat data talent...</p>
    </div>

    <div v-else-if="error" class="error-container text-center py-5">
      <i class="simple-icon-exclamation error-icon"></i>
      <p class="mt-2">{{ error }}</p>
    </div>    
    <div v-else>
      <div class="profile-main-card">
        
        <div class="d-flex justify-content-between mb-4">
            <b-button variant="outline-primary" @click="goBack" size="lg" class="d-flex align-items-center back-button">
              <IconLeftChevron class="mr-2" />
              <span>Kembali</span>
            </b-button>
            <b-button variant="primary" size="lg" class="d-flex align-items-center">
              <IconStar class="mr-2" />
              <span>Masukkan ke Favorit</span>
            </b-button>
        </div>

        <div class="row main-content">

        <!-- Left Column - Profile Image -->
        <div class="col-md-3 mb-4">
          <img :src="talent.image" alt="Talent Image" class="img-fluid profile-image" />
        </div>

        <!-- Right Column - All Sections -->
        <div class="col-md-9">
          
          <!-- Tentang Saya Section -->
          <div class="section-card mb-4">
            <h4 class="section-title">Tentang Saya</h4>
            <p>{{ talent.about }}</p>
          </div>

          <!-- Pengalaman Section -->
          <div class="section-card mb-4">
            <h4 class="section-title">Pengalaman</h4>
            <div v-for="(exp, index) in experiences" :key="exp.id" class="experience-item">
              <div class="row align-items-center">
                <div class="col-md-1 col-3 text-center mb-2 mb-md-0">
                  <div class="company-logo"></div>
                </div>
                <div class="col-md-11 col-9">
                  <h5 class="mb-1">{{ exp.jobTitle }}</h5>
                  <p class="mb-1 company-details-employment-type">{{ exp.companyName }} · {{ exp.employmentType }}</p>
                  <p class="mb-1 lighter-text small date-duration">{{ formatDateRange(exp.startDate, exp.endDate) }} · {{ calculateDuration(exp.startDate, exp.endDate) }}</p>
                  <p class="mb-0 lighter-text small location-workmode">{{ exp.location }} · {{ exp.workMode }}</p>
                </div>
              </div>
              <hr v-if="index !== experiences.length - 1" class="experience-divider">
            </div>
          </div>
          
          <!-- Bersedia Ditempatkan di Kota Section -->
          <div class="section-card mb-4">
            <h4 class="section-title">Bersedia Ditempatkan di Kota</h4>
            <div class="talent-badges">
              <span v-for="loc in talent.preferredLocations" :key="loc" class="badge location-badge mr-2 mb-2">{{ loc }}</span>
            </div>
          </div>

          <!-- Sertifikasi Section -->
          <div class="section-card">
            <h4 class="section-title">Sertifikasi</h4>
            <div v-for="cert in certifications" :key="cert.id" class="certification-item mb-3">
              <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                <div class="d-flex align-items-center mb-3 mb-sm-0">
                  <IconPdf class="mr-3" />
                  <div>
                    <span class="certification-title"><b>{{ cert.title }}</b></span>
                    <small class="text-muted d-block certification-size">{{ formatFileSize(cert.fileSize) }}</small>
                  </div>
                </div>
                <b-button variant="primary" @click="downloadCertificate(cert)" size="lg" class="d-flex align-items-center download-button">
                  <span class="mr-2">Download File</span>
                  <IconDownloadButton />
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TalentService from '@/services/TalentService';
import IconLeftChevron from '@/assets/icons/IconLeftChevron.vue';
import IconStar from '@/assets/icons/IconStar.vue';
import IconPdf from '@/assets/icons/IconPdf.vue';
import IconDownloadButton from '@/assets/icons/IconDownloadButton.vue';
import IconLocation from '@/assets/icons/IconLocation.vue';
import IconWhatsapp from '@/assets/icons/IconWhatsapp.vue';

export default {
  name: 'TalentProfile',
  components: {
    IconLeftChevron,
    IconStar,
    IconPdf,
    IconDownloadButton,
    IconLocation,
    IconWhatsapp
  },data() {
    return {
      talentId: this.$route.params.talentId,
      talent: { 
        name: 'Rudy Handoko',
        image: require('@/assets/img/profiles/l-2.jpg'), 
        location: 'Surabaya, Jawa Timur',
        phone: '+62 8123456789',
        level: 'Intermediate',
        experienceYears: '2',
        mainSkill: 'Ahli Bangunan Gedung',
        price: 7550000,
        about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat.',
        preferredLocations: ['Jakarta', 'Bandung', 'Semarang', 'Yogyakarta', 'Samarinda']
      },
      experiences: [
        {
          id: 1,
          jobTitle: 'Lead Construction Project Manager',
          companyName: 'PT WIJAYA KARYA (Persero) Tbk',
          employmentType: 'Full Time',
          startDate: '2016-01-01',
          endDate: '2019-06-30',
          location: 'Central Jakarta',
          workMode: 'On-site'
        },
        {
          id: 2,
          jobTitle: 'Lead Construction Project Manager',
          companyName: 'PT WIJAYA KARYA (Persero) Tbk',
          employmentType: 'Full Time',
          startDate: '2019-01-01',
          endDate: '2023-12-31',
          location: 'Central Jakarta',
          workMode: 'On-site'
        },
        {
          id: 3,
          jobTitle: 'Lead Construction Project Manager',
          companyName: 'PT WIJAYA KARYA (Persero) Tbk',
          employmentType: 'Full Time',
          startDate: '2016-01-01',
          endDate: '2019-06-30',
          location: 'Central Jakarta',
          workMode: 'On-site'
        }
      ],
      certifications: [
        {
          id: 1,
          title: 'Sertifikasi 1.pdf',
          fileSize: 5562368, // 5.3MB
          fileUrl: '#'
        },
        {
          id: 2,
          title: 'Sertifikasi 2.pdf',
          fileSize: 4928307, // 4.7MB
          fileUrl: '#'
        }
      ],
      loading: false,
      experiencesLoading: false,
      certificationsLoading: false,
      error: null,
      experiencesError: null,
      certificationsError: null
    };
  },  methods: {    goBack() {
      this.$router.go(-1);
    },
    downloadCertificate(cert) {
      // Implement certificate download
      console.log('Downloading certificate:', cert.title);
      
      // Show a toast notification
      this.$bvToast.toast(`Mengunduh ${cert.title}`, {
        title: 'Download',
        variant: 'info',
        solid: true
      });
      
      window.open(cert.fileUrl, '_blank');
    },
    formatCurrency(value) {
      if (value === null || value === undefined) return 'N/A';
      return new Intl.NumberFormat('id-ID').format(value);
    },
    formatDate(dateString) {
      if (!dateString) return 'Present';
      const options = { year: 'numeric', month: 'short' };
      try {
        return new Date(dateString).toLocaleDateString('id-ID', options);
      } catch (e) {
        return 'Invalid Date';
      }
    },
    formatDateRange(startDate, endDate) {
      const start = this.formatDate(startDate);
      const end = endDate ? this.formatDate(endDate) : this.formatDate(new Date());
      return `${start} - ${end}`;
    },
    calculateDuration(startDateStr, endDateStr) {
      const start = new Date(startDateStr);
      const end = endDateStr ? new Date(endDateStr) : new Date();

      if (isNaN(start.getTime())) return 'Invalid start date';
      if (isNaN(end.getTime())) return 'Invalid end date';

      if (start > new Date()) {
          return 'Belum dimulai';
      }

      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      let duration = '';
      if (years > 0) {
        duration += `${years} thn `;
      }
      
      // Always show months if years is 0, or if there are remaining months
      if (months > 0 || years === 0) { 
        duration += `${months} bln`;
      }
      
      if (duration.trim() === '0 bln' && years === 0 && months === 0 && start.getTime() <= end.getTime()) {
          return 'Kurang dari sebulan';
      }
      
      return duration.trim() || 'Kurang dari sebulan';
    },
    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return null;
        const mbSize = bytes / (1024 * 1024);
        return mbSize.toFixed(1) + ' MB';
    },
  },  created() {
    // No need to fetch data for now
    this.loading = false;
    this.experiencesLoading = false;
    this.certificationsLoading = false;
  }
};
</script>

<style scoped>
h1, h2, h3, h4, h5, h6 {
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
}

.talent-profile-container {
  padding: 20px;
  background-color: #f8f9fa; 
}

.page-header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.breadcrumb-container {
  margin-bottom: 1.5rem;
}

.profile-main-card {
  border-radius: 12px;
  background: var(--Colors-Colors-Base-Pure-White, #FFF);
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
}

.main-content {
  margin: 0;
}

.profile-image {
  max-width: 100%;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

/* Section Styles */
.section-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid var(--Colors-Colors-Base-Light-Gray, #ECEDEE);
  padding: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  margin-bottom: 0.5rem;
}

.talent-contact-info {
  font-size: 0.875rem;
  color: #6c757d;
}

.talent-contact-info i {
  margin-right: 4px;
  color: #6c757d;
}

.talent-contact-info span {
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
}

.talent-badges .badge {
  border-radius: 4px;
  padding: 4px 8px;
  display: inline-block;
  font-family: var(--Font-Family-Paragraphs, Roboto);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
}

.badge-info {
  background: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---100, #FFF1E2);
  color: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---400, #A45200);
  border: none;
}

.badge-secondary {
  background: var(--Colors-Colors-Base-Light-Gray, #ECEDEE) !important;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  border: none;
}

/* Button Styles */
.btn {
  border-radius: 50px;
  padding: 13px 24px;
}

.btn svg {
  width: 16px;
  height: 16px;
}

/* Bootstrap Button Overrides */
.btn-lg {
  padding: 13px 24px;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
  border-color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
}

.btn-primary:hover, 
.btn-primary:focus, 
.btn-primary:active {
  background-color: #002541 !important;
  border-color: #002541 !important;
}

.btn-outline-primary {
  color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
  border-color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
}

.btn-outline-primary:hover {
  background-color: rgba(0, 54, 90, 0.05);
  color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
  border-color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
}

.back-button {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.download-button {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-secondary {
  background-color: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---300, #ff9933);
  border-color: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---300, #ff9933);
}

.btn-secondary:hover,
.btn-secondary:focus,
.btn-secondary:active {
  background-color: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---400, #a45200) !important;
  border-color: var(--Colors-Colors-Brand-Premium-Gold-Premium-Gold---400, #a45200) !important;
}

/* Price Estimate Section */
.price-estimate-card {
  background: var(--Colors-Colors-Base-Lightest-Gray, #F8F8F8);
  border-radius: 8px;
  padding: 20px;
  color: #fff;
}

.price-estimate-card p {
  color: var(--Colors-Colors-Base-Dark-Gray, #70787F);
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.price-value {
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
}

/* Button styles moved to the Bootstrap overrides section above */

/* Section headers */
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  margin-bottom: 1rem;
}

/* Certification Styles */
.certification-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.certification-title {
  display: block;
}

.certification-size {
  font-size: 0.75rem;
}

.location-badge {
  display: inline-block;
  padding: 6px 12px;
  background-color: #F8F9FA;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  border: 1px solid #E9ECEF;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 400;
}

/* Experience items */
.experience-item {
  padding: 16px 0;
}

.experience-divider {
  margin: 16px 0;
  border-top: 1px solid var(--Colors-Colors-Base-Light-Gray, #ECEDEE);
}

.experience-item h5 {
  font-weight: 600;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
  font-size: 1rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #F0F0F0;
}

.company-details-employment-type {
  font-size: var(--Font-Size-Paragraph-P5, 13px);
  font-weight: 400;
}

.date-duration, .location-workmode {
  font-size: 0.75rem;
  color: #6c757d;
}

/* Certification items */
.certification-item {
  border-radius: var(--radi-lg, 12px);
  border: 1px solid var(--Colors-Colors-Base-Light-Gray, #ECEDEE);
  background: var(--Colors-Colors-Base-Lightest-Gray, #F8F8F8);
  padding: 16px;
  margin-bottom: 12px;
}

.certification-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
}

.certification-size {
  font-size: 0.75rem;
  color: #6c757d;
}

.btn-download {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50px;
}

.btn-download:hover {
  background-color: #002541;
}

/* Loading and error states */
.loading-container, .error-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 40px;
  color: #dc3545;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .profile-image {
    max-width: 298px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .talent-contact-info {
    text-align: center;
  }
  
  .talent-contact-info span.ml-3 {
    margin-left: 0 !important;
    margin-top: 8px;
  }
  
  .talent-badges {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .company-logo {
    margin-bottom: 12px;
  }
  .btn {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }

  .price-estimate-card .d-flex {
    text-align: center;
  }
  
  .download-button {
    width: 100%;
    justify-content: center;
  }
}

.lighter-text {
    font-weight: 400;
}
</style>
