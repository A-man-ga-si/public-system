<template>
  <div class="talent-profile-container">
    <!-- Page Header -->
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

    <!-- Loading State -->
    <div v-if="loading" class="loading-container text-center py-5">
      <div class="loading"></div>
      <p class="mt-2">Memuat data talent...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container text-center py-5">
      <i class="simple-icon-exclamation error-icon"></i>
      <p class="mt-2">{{ error }}</p>
      <b-button variant="primary" @click="retryFetch" class="mt-3">
        Coba Lagi
      </b-button>
    </div>    
    
    <!-- Main Content -->
    <div v-else>
      <div class="profile-main-card">
        
        <!-- Back Button -->
        <div class="d-flex justify-content-between mb-4">
          <b-button variant="outline-primary" @click="goBack" size="lg" class="d-flex align-items-center back-button">
            <IconLeftChevron class="mr-2" />
            <span>Kembali</span>
          </b-button>
        </div>

        <div class="row main-content">

          <!-- Left Column - Profile Image -->
          <div class="col-md-3 mb-4">
            <img 
              :src="talent.image || require('@/assets/img/profiles/l-2.jpg')" 
              alt="Talent Image" 
              class="img-fluid profile-image" 
            />
          </div>

          <!-- Right Column - All Sections -->
          <div class="col-md-9">

            <!-- Profile Information Section -->
            <div class="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h2>{{ talent.name }}</h2>
                <div class="talent-contact-info mb-3">                
                  <span><IconLocation class="mr-1" />{{ talent.location }}</span>
                  <span class="ml-3"><IconWhatsapp class="mr-1" />{{ talent.phone }}</span>
                </div>
                <div class="talent-badges mb-4">
                  <span class="badge badge-info mr-2">{{ talent.level }}</span>
                  <span class="badge badge-info mr-2">{{ talent.experienceYears }} Tahun Pengalaman</span>
                  <span class="badge badge-secondary">{{ talent.mainSkill }}</span>
                </div>
              </div>
            </div>

            <!-- Price Estimate Section -->
            <div class="price-estimate-card mb-4">
              <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div class="mb-3 mb-md-0">
                  <p class="mb-2">Perkiraan Harga</p>
                  <h3 class="price-value">Rp {{ formatCurrency(talent.price) }}</h3>
                </div>
                <b-button variant="primary" size="lg" class="d-flex align-items-center" @click="openWhatsApp">
                   Hubungi {{ talent.name ? talent.name.split(' ')[0] : '' }}
                </b-button>
              </div>
            </div>

            <!-- About Section -->
            <div class="section-card mb-4">
              <h4 class="section-title">Tentang Saya</h4>
              <p>{{ talent.about || 'Informasi tentang talent belum tersedia.' }}</p>
            </div>

            <!-- Experience Section -->
            <div class="section-card mb-4">
              <h4 class="section-title">Pengalaman</h4>
              
              <!-- Loading Experience -->
              <div v-if="experiencesLoading" class="text-center py-3">
                <div class="loading"></div>
                <p class="mt-2">Memuat pengalaman...</p>
              </div>
              
              <!-- Error Experience -->
              <div v-else-if="experiencesError" class="alert alert-danger">
                {{ experiencesError }}
                <button class="btn btn-sm btn-outline-primary ml-2" @click="fetchTalentExperiences">
                  Coba Lagi
                </button>
              </div>
              
              <!-- Empty Experience -->
              <div v-else-if="experiences.length === 0" class="text-center py-3">
                <p class="text-muted">Belum ada pengalaman yang ditambahkan.</p>
              </div>
              
              <!-- Experience List -->
              <div v-else>
                <div v-for="(exp, index) in experiences" :key="exp.id" class="experience-item">
                  <div class="row align-items-center">
                    <!-- Logo Column -->
                    <div class="col-md-1 col-3 text-center mb-2 mb-md-0">
                      <div class="company-logo-container">
                        <div class="company-logo" v-if="exp.companyImage">
                          <img :src="exp.companyImage" :alt="exp.company" />
                        </div>
                        <div v-else class="company-logo">
                          <img :src="require('@/assets/img/cards/thumb-1.jpg')" alt="Company Logo" />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Text Column -->
                    <div class="col-md-11 col-9">
                      <h5 class="mb-1">{{ exp.title }}</h5>
                      <p class="mb-1 company-details-employment-type">
                        {{ exp.company }} · {{ formatEmploymentType(exp.employmentType) }}
                      </p>
                      <p class="mb-1 lighter-text small date-duration">
                        {{ formatDateRange(exp.startDate, exp.endDate) }} · {{ calculateDuration(exp.startDate, exp.endDate) }}
                      </p>
                      <p class="mb-1 lighter-text small location-workmode">
                        {{ exp.location }} · {{ formatLocationType(exp.locationType) }}
                      </p>
                      <p v-if="exp.description" class="mb-0 lighter-text small">{{ exp.description }}</p>
                    </div>
                  </div>
                  <hr v-if="index !== experiences.length - 1" class="experience-divider">
                </div>
              </div>
            </div>

            <!-- Preferred Locations Section -->
            <div class="section-card mb-4">
              <h4 class="section-title">Bersedia Ditempatkan di Kota</h4>
              <div v-if="talent.preferredLocations && talent.preferredLocations.length > 0" class="talent-badges">
                <span v-for="loc in talent.preferredLocations" :key="loc" class="badge location-badge mr-2 mb-2">{{ loc }}</span>
              </div>
              <div v-else class="text-muted">
                Belum ada preferensi lokasi yang ditambahkan.
              </div>
            </div>

            <!-- Certifications Section -->
            <div class="section-card">
              <h4 class="section-title">Sertifikasi</h4>
              
              <!-- Loading Certifications -->
              <div v-if="certificationsLoading" class="text-center py-3">
                <div class="loading"></div>
                <p class="mt-2">Memuat sertifikasi...</p>
              </div>
              
              <!-- Error Certifications -->
              <div v-else-if="certificationsError" class="alert alert-danger">
                {{ certificationsError }}
                <button class="btn btn-sm btn-outline-primary ml-2" @click="fetchTalentCertifications">
                  Coba Lagi
                </button>
              </div>
              
              <!-- Empty Certifications -->
              <div v-else-if="certifications.length === 0" class="text-center py-3">
                <p class="text-muted">Belum ada sertifikasi yang ditambahkan.</p>
              </div>
              
              <!-- Certifications List -->
              <div v-else>
                <div v-for="cert in certifications" :key="cert.id" class="certification-item mb-3">
                  <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                    <div class="d-flex align-items-center mb-3 mb-sm-0">
                      <IconPdf class="mr-3" />
                      <div>
                        <span class="certification-title"><b>{{ cert.title }}</b></span>
                        <small class="text-muted d-block certification-details">
                          File: {{ cert.file }}
                        </small>
                      </div>
                    </div>
                    <div class="certificate-actions">
                      <b-button 
                        variant="primary" 
                        @click="dummyDownloadCertificate(cert)" 
                        size="sm" 
                        class="d-flex align-items-center"
                        :disabled="downloadingCert === cert.id"
                      >
                        <div v-if="downloadingCert === cert.id" class="loading-small mr-1"></div>
                        <i v-else class="simple-icon-cloud-download mr-1"></i>
                        <span>{{ downloadingCert === cert.id ? 'Downloading...' : 'Download' }}</span>
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Add Recommendation Form -->
            <div class="section-card mb-4">
              <h4 class="section-title">Tambah Rekomendasi</h4>
              
              <form @submit.prevent="submitRecommendation" class="recommendation-form">
                <div class="form-group">
                  <label for="contractorId">ID Kontraktor <span class="text-danger">*</span></label>
                  <input
                    type="number"
                    class="form-control"
                    id="contractorId"
                    v-model="newRecommendation.contractorId"
                    placeholder="Masukkan ID kontraktor"
                    required
                  >
                  <small class="form-text text-muted">ID kontraktor diperlukan untuk mengidentifikasi pengirim rekomendasi.</small>
                </div>

                <div class="form-group">
                  <label for="contractorName">Nama Perusahaan / Kontraktor <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control"
                    id="contractorName"
                    v-model="newRecommendation.contractorName"
                    placeholder="Masukkan nama perusahaan/kontraktor"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="message">Pesan Rekomendasi <span class="text-danger">*</span></label>
                  <textarea
                    class="form-control"
                    id="message"
                    v-model="newRecommendation.message"
                    placeholder="Tulis pesan rekomendasi untuk talent ini"
                    rows="4"
                    maxlength="4000"
                    required
                  ></textarea>
                  <small class="form-text text-muted">{{ newRecommendation.message.length }}/4000 karakter</small>
                </div>

                <div class="text-right">
                  <b-button
                    type="submit"
                    variant="primary"
                    size="lg"
                    :disabled="isSubmitting || !isFormValid"
                  >
                    <div v-if="isSubmitting" class="loading-small mr-1"></div>
                    <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Rekomendasi' }}</span>
                  </b-button>
                </div>
              </form>

              <!-- Success Message -->
              <b-alert
                variant="success"
                :show="showSuccessAlert"
                dismissible
                @dismissed="showSuccessAlert = false"
                class="mt-3"
              >
                Rekomendasi berhasil dikirim dan menunggu persetujuan dari talent.
              </b-alert>
            </div>

            <!-- Recommendations Section -->
            <div class="section-card mb-4">
              <h4 class="section-title">Rekomendasi</h4>
              
              <!-- Loading Recommendations -->
              <div v-if="recommendationsLoading" class="text-center py-3">
                <div class="loading"></div>
                <p class="mt-2">Memuat rekomendasi...</p>
              </div>
              
              <!-- Error Recommendations -->
              <div v-else-if="recommendationsError" class="alert alert-danger">
                {{ recommendationsError }}
                <button class="btn btn-sm btn-outline-primary ml-2" @click="fetchTalentRecommendations">
                  Coba Lagi
                </button>
              </div>
              
              <!-- Empty Recommendations -->
              <div v-else-if="!hasAnyRecommendations" class="text-center py-3">
                <p class="text-muted">Belum ada rekomendasi untuk talent ini.</p>
              </div>
              
              <!-- Recommendations List -->
              <div v-else>
                <!-- Accepted Recommendations -->
                <div v-if="groupedRecommendations.accepted.length > 0">
                  <Recommendation :recommendations="acceptedRecommendations" />
                </div>
                
                <!-- Pending Recommendations -->
                <div v-if="groupedRecommendations.pending.length > 0" class="mt-4">
                  <h5 class="recommendation-subtitle">Menunggu Persetujuan Talent</h5>
                  <div class="pending-recommendations">
                    <div v-for="rec in groupedRecommendations.pending" :key="rec.id" class="pending-recommendation-item">
                      <div class="recommendation-header">
                        <div class="d-flex align-items-center">
                          <div class="recommendation-source">
                            <h6 class="mb-1">{{ rec.contractorName }}</h6>
                          </div>
                        </div>
                      </div>
                      <div class="recommendation-content mt-2 text-muted">
                        <p>{{ rec.message }}</p>
                      </div>
                    </div>
                  </div>
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
import IconLeftChevron from '@/assets/icons/IconLeftChevron.vue';
import IconPdf from '@/assets/icons/IconPdf.vue';
import IconWhatsapp from '@/assets/icons/IconWhatsapp.vue';
import IconLocation from '@/assets/icons/IconLocation.vue';
import TalentProfileService from '@/services/TalentProfileService';
import Recommendation from '@/components/Common/Recommendation.vue';

export default {
  name: 'TalentProfile',
  components: {
    IconLeftChevron,
    IconPdf,
    IconWhatsapp,
    IconLocation,
    Recommendation,
  },
  data() {
    return {
      talentId: this.$route.params.talentId,
      talent: {},
      experiences: [],
      certifications: [],
      recommendations: [],
      loading: true,
      experiencesLoading: true,
      certificationsLoading: true,
      recommendationsLoading: true,
      error: null,
      experiencesError: null,
      certificationsError: null,
      recommendationsError: null,
      downloadingCert: null,
      newRecommendation: {
        contractorId: null,
        contractorName: '',
        message: '',
        status: 'PENDING'
      },
      issubmitting: false,
      showSuccessAlert: false
    };
  },
  computed: {
    acceptedRecommendations() {
      return this.recommendations.filter(rec => rec.status === 'ACCEPTED');
    },
    
    // Tambahkan computed property untuk mengelompokkan rekomendasi berdasarkan status
    groupedRecommendations() {
      const accepted = this.recommendations.filter(rec => rec.status === 'ACCEPTED');
      const pending = this.recommendations.filter(rec => rec.status === 'PENDING');
      
      return {
        accepted,
        pending
      };
    },
    
    // Periksa apakah ada rekomendasi (baik accepted atau pending)
    hasAnyRecommendations() {
      return this.recommendations.length > 0;
    },
    // New computed property for form validation
    isFormValid() {
      return this.newRecommendation.contractorId && 
            this.newRecommendation.contractorName.trim() !== '' &&
            this.newRecommendation.message.trim() !== '';
    }
  },
  methods: {
    /**
     * Fetch talent profile data from API
     */
    async fetchTalentProfile() {
      try {
        this.loading = true;
        this.error = null;
        
        // Try API first, fallback to mock in development
        let response;
        try {
          response = await TalentProfileService.getTalentProfile(this.talentId);
        } catch (apiError) {
          console.warn('API call failed, using mock data:', apiError);
          if (process.env.NODE_ENV === 'development') {
            response = await TalentProfileService.getMockTalentProfile(this.talentId);
          } else {
            throw apiError;
          }
        }
        
        this.talent = this.mapApiDataToComponent(response.data.data);
      } catch (error) {
        console.error('Error fetching talent profile:', error);
        
        if (error.response?.status === 404) {
          this.error = 'Talent tidak ditemukan.';
        } else {
          this.error = 'Gagal memuat data talent. Silakan coba lagi.';
        }
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch talent experiences from API
     */
    async fetchTalentExperiences() {
      try {
        this.experiencesLoading = true;
        this.experiencesError = null;
        
        // Try API first, fallback to mock in development
        let response;
        try {
          response = await TalentProfileService.getTalentExperiences(this.talentId);
        } catch (apiError) {
          console.warn('Experience API call failed, using mock data:', apiError);
          if (process.env.NODE_ENV === 'development') {
            response = await TalentProfileService.getMockTalentExperiences(this.talentId);
          } else if (apiError.response?.status === 404) {
            // 404 is normal, means no experiences
            this.experiences = [];
            return;
          } else {
            throw apiError;
          }
        }
        
        this.experiences = response.data.data || [];
      } catch (error) {
        console.error('Error fetching talent experiences:', error);
        this.experiencesError = 'Gagal memuat data pengalaman.';
      } finally {
        this.experiencesLoading = false;
      }
    },

    /**
     * Fetch talent certifications from API
     */
    async fetchTalentCertifications() {
      try {
        this.certificationsLoading = true;
        this.certificationsError = null;
        
        // Try API first, fallback to mock in development
        let response;
        try {
          response = await TalentProfileService.getTalentCertifications(this.talentId);
        } catch (apiError) {
          console.warn('Certificate API call failed, using mock data:', apiError);
          if (process.env.NODE_ENV === 'development') {
            response = await TalentProfileService.getMockTalentCertifications(this.talentId);
          } else if (apiError.response?.status === 404) {
            // 404 is normal, means no certifications
            this.certifications = [];
            return;
          } else {
            throw apiError;
          }
        }
        
        this.certifications = response.data.data || [];
      } catch (error) {
        console.error('Error fetching talent certifications:', error);
        this.certificationsError = 'Gagal memuat data sertifikasi.';
      } finally {
        this.certificationsLoading = false;
      }
    },

    /**
     * Fetch talent recommendations from API
     */
    async fetchTalentRecommendations() {
      try {
        this.recommendationsLoading = true;
        this.recommendationsError = null;
        
        // Try API first, fallback to mock in development
        let response;
        try {
          response = await TalentProfileService.getTalentRecommendations(this.talentId);
          console.log("ini apa jir",response);
        } catch (apiError) {
          console.warn('Recommendations API call failed, using mock data:', apiError);
          if (apiError.response?.status === 404) {
            this.recommendations = [];
            return;
          } else if (process.env.NODE_ENV === 'development') {  
            // console.log(process.env.NODE_ENV);
            response = await TalentProfileService.getMockTalentRecommendations(this.talentId);
          } 
          else {
            throw apiError;
          }
        }
        
        this.recommendations = response.data.data || [];
        console.log("ini apa jir",this.recommendations);
      } catch (error) {
        console.error('Error fetching talent recommendations:', error);
        this.recommendationsError = 'Gagal memuat data rekomendasi.';
      } finally {
        this.recommendationsLoading = false;
      }
    },
    // Perbarui metode submitRecommendation

    /**
     * Submit new recommendation
     */
    async submitRecommendation() {
      try {
        this.isSubmitting = true;
        
        // Validasi form sebelum submit
        if (!this.isFormValid) {
          this.$bvToast.toast('Mohon lengkapi semua field yang wajib diisi', {
            title: 'Validasi Gagal',
            variant: 'warning',
            solid: true
          });
          return;
        }
        
        // Prepare the request data sesuai dengan DTO
        const recommendationData = {
          contractorId: parseInt(this.newRecommendation.contractorId),
          contractorName: this.newRecommendation.contractorName,
          message: this.newRecommendation.message,
          status: 'PENDING' // Default status untuk rekomendasi baru
        };
        
        // Call the API
        const response = await TalentProfileService.createRecommendation(this.talentId, recommendationData);
        
        // Tambahkan rekomendasi yang baru ke daftar rekomendasi (optimistic update)
        // Jika response berhasil, gunakan data dari response
        if (response && response.data && response.data.data) {
          this.recommendations.push(response.data.data);
        } 
        // Jika tidak, buat objek baru berdasarkan input pengguna
        else {
          const tempId = 'temp-' + Date.now();
          this.recommendations.push({
            id: tempId,
            ...recommendationData,
            createdDate: new Date().toISOString()
          });
        }
        
        // Reset form after successful submission
        this.newRecommendation = {
          contractorId: null,
          contractorName: '',
          message: '',
          status: 'PENDING'
        };
        
        // Show success message
        this.showSuccessAlert = true;
        
      } catch (error) {
        console.error('Error creating recommendation:', error);
        
        // Show detailed error message
        let errorMessage = 'Gagal mengirim rekomendasi.';
        
        if (error.response) {
          console.log('Status:', error.response.status);
          console.log('Headers:', error.response.headers);
          console.log('Data:', error.response.data);
          
          if (error.response.status === 403) {
            errorMessage = 'Anda tidak memiliki izin untuk mengirim rekomendasi (Error 403)';
          } else if (error.response.status === 400) {
            errorMessage = 'Data rekomendasi tidak valid. Mohon periksa kembali.';
            if (error.response?.data?.errors) {
              errorMessage = error.response.data.errors;
            }
          } else if (error.response?.data?.errors) {
            errorMessage = error.response.data.errors;
          }
        }
        
        this.$bvToast.toast(errorMessage, {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * Map API data to component format
     * Sesuai dengan response backend yang diberikan
     */
    mapApiDataToComponent(apiData) {
      return {
        id: apiData.id,
        name: `${apiData.firstName} ${apiData.lastName}`,
        image: apiData.photo || require('@/assets/img/profiles/l-2.jpg'),
        location: apiData.currentLocation,
        phone: apiData.phoneNumber,
        level: apiData.skkLevel,
        experienceYears: apiData.experienceYears?.toString() || '0',
        mainSkill: apiData.skill,
        price: apiData.price,
        about: apiData.aboutMe,
        preferredLocations: apiData.preferredLocations || []
      };
    },

    /**
     * Format employment type dari backend enum ke display text
     */
    formatEmploymentType(type) {
      const typeMap = {
        'FULL_TIME': 'Full Time',
        'CONTRACT': 'Contract',
        'FREELANCE': 'Freelance',
        'INTERNSHIP': 'Internship',
        'TEMPORARY': 'Temporary'
      };
      return typeMap[type] || type;
    },

    /**
     * Format location type dari backend enum ke display text
     */
    formatLocationType(type) {
      const typeMap = {
        'ON_SITE': 'On-site',
        'REMOTE': 'Remote',
        'HYBRID': 'Hybrid'
      };
      return typeMap[type] || type;
    },

    /**
     * Dummy download certificate function
     * Karena backend tidak ada endpoint download, kita buat simulasi di frontend
     */
    async dummyDownloadCertificate(cert) {
      try {
        this.downloadingCert = cert.id;
        
        // Call dummy download service
        const response = await TalentProfileService.dummyDownloadCertificate(cert);
        
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = cert.file || `certificate-${cert.id}.txt`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.$bvToast.toast('Sertifikat berhasil didownload (dummy)', {
          title: 'Success',
          variant: 'success',
          solid: true
        });
      } catch (error) {
        console.error('Error downloading certificate:', error);
        this.$bvToast.toast('Gagal mendownload sertifikat', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.downloadingCert = null;
      }
    },

    /**
     * Opens WhatsApp with the talent's phone number
     */
    openWhatsApp() {
      if (!this.talent.phone) {
        this.$bvToast.toast('Nomor telepon tidak tersedia', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
        return;
      }
    
      // Format phone number (remove spaces, ensure it starts with country code)
      let phoneNumber = this.talent.phone.replace(/\s+/g, '');
      if (!phoneNumber.startsWith('+')) {
        // If doesn't start with +, ensure it starts with country code for Indonesia
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '+62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62')) {
          phoneNumber = '+62' + phoneNumber;
        } else {
          phoneNumber = '+' + phoneNumber;
        }
      }
    
      // Create WhatsApp URL with predefined message
      const message = encodeURIComponent(`Halo ${this.talent.name}, saya melihat profil Anda di Rencanakan.id dan tertarik dengan keahlian Anda.`);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      
      // Open in new tab
      window.open(whatsappUrl, '_blank');
    },

    /**
     * Navigation and utility methods
     */
    goBack() {
      this.$router.go(-1);
    },

    retryFetch() {
      this.fetchTalentProfile();
      this.fetchTalentExperiences();
      this.fetchTalentCertifications();
      this.fetchTalentRecommendations();
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
      const end = endDate ? this.formatDate(endDate) : 'Present';
      return `${start} - ${end}`;
    },

    /**
     * Calculate duration between two dates
     */
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
      
      if (months > 0 || years === 0) { 
        duration += `${months} bln`;
      }
      
      if (duration.trim() === '0 bln' && years === 0 && months === 0 && start.getTime() <= end.getTime()) {
          return 'Kurang dari sebulan';
      }
      
      return duration.trim() || 'Kurang dari sebulan';
    }
  },

  /**
   * Component lifecycle - fetch all data when component is created
   */
  async created() {
    await Promise.all([
      this.fetchTalentProfile(),
      this.fetchTalentExperiences(),
      this.fetchTalentCertifications(),
      this.fetchTalentRecommendations()
    ]);
  }
};
</script>

<style scoped>
/* Global Styles */
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

/* Price Estimate Section */
.price-estimate-card {
  background: var(--Colors-Colors-Base-Lightest-Gray, #F8F8F8);
  border-radius: 8px;
  padding: 20px;
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

.certification-details {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 2px;
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

/* Mengatur container experience item untuk vertical alignment */
.experience-item {
  padding: 16px 0;
}

/* Mengatur container logo dan teks dalam satu baris */
.experience-item .row {
  display: flex;
  align-items: center; /* Align items vertically center */
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

/* Mengatur container logo */
.company-logo-container {
  display: flex;
  align-items: center; /* Center align logo vertically */
  height: 100%;
  justify-content: flex-end; /* Push logo to right side */
}

/* Mengatur ukuran dan style logo */
.company-logo {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  background-color: #F0F0F0;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-details-employment-type {
  font-size: var(--Font-Size-Paragraph-P5, 13px);
  font-weight: 400;
}

.date-duration, .location-workmode {
  font-size: 0.75rem;
  color: #6c757d;
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

.loading-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 40px;
  color: #dc3545;
}

/* Certificate actions */
.certificate-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.certificate-actions .btn {
  border-radius: 4px;
  padding: 6px 12px;
}

.lighter-text {
  font-weight: 400;
}
/* Mengatur posisi kolom teks */
.experience-item .col-md-10,
.experience-item .col-8 {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  padding-left: 12px; /* Berikan sedikit jarak dari logo */
}

/* Mengatur judul dan deskripsi utama */
.experience-item h5 {
  margin-top: 0; /* Hilangkan margin atas pada judul */
  margin-bottom: 5px; /* Kurangi margin bawah */
}

/* Mengatur spacing untuk teks info */
.company-details-employment-type,
.date-duration,
.location-workmode {
  margin-bottom: 4px !important; /* Kurangi margin antar baris */
}

/* Form styles */
.form-control {
  border: 1px solid var(--Colors-Colors-Base-Light-Gray, #ECEDEE);
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: var(--Colors-Colors-Brand-Sea-Blue-Sea-Blue---300, #00365A);
  box-shadow: 0 0 0 0.1rem rgba(0, 54, 90, 0.25);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
  color: var(--Colors-Colors-Brand-Brand-Typography-Main-Black, #3A3A3A);
}

/* Alert styles */
.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
}

/* Tambahkan ke bagian <style> */

/* Form validation styles */
.recommendation-form .form-text {
  font-size: 0.75rem;
}

.recommendation-form .form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.recommendation-form .invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc3545;
}

/* Tambahkan ke bagian <style> */

/* Recommendation Styling */
.recommendation-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #3A3A3A;
  margin-bottom: 1rem;
}

.pending-recommendation-item {
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
  opacity: 0.75;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.recommendation-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
}

.recommendation-source h6 {
  font-size: 0.938rem;
  margin-bottom: 2px;
  color: #6c757d;
}

.pending-badge {
  font-size: 0.75rem;
  background-color: #e9ecef;
  color: #6c757d;
  padding: 2px 8px;
  border-radius: 10px;
}

.recommendation-content {
  margin-top: 10px;
}

.recommendation-content p {
  margin-bottom: 0;
  font-size: 0.875rem;
  white-space: pre-line;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .experience-item .col-md-2 {
    max-width: 80px;
    padding-right: 0;
  }
  
  .experience-item .col-md-10 {
    padding-left: 10px;
  }
}

@media (max-width: 767.98px) {
  .experience-item .col-4 {
    max-width: 80px;
    padding-right: 0;
  }
  
  .experience-item .col-8 {
    padding-left: 10px;
  }
  
  .company-logo-container {
    justify-content: flex-start; /* Untuk tampilan mobile */
  }
}

/* Responsive Design */
@media (max-width: 576px) {
  .certificate-actions {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }
}

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
  
  .talent-contact_info span.ml-3 {
    margin-left: 0 !important;
    margin-top: 8px;
  }
  
  .talent-badges {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
  }

  .price-estimate-card .d-flex {
    text-align: center;
  }
}
/* Adjust column widths for better spacing */
@media (min-width: 768px) {
  .experience-item .col-md-2 {
    max-width: 60px; /* Set a smaller fixed width for logo column */
    padding-right: 0; /* Remove right padding */
  }
  
  .experience-item .col-md-10 {
    padding-left: 10px; /* Add a little space between logo and text */
  }
}

/* Fix spacing for mobile view */
@media (max-width: 767.98px) {
  .company-logo-container {
    justify-content: flex-start; /* Align to left on mobile */
  }
  
  .experience-item .col-4 {
    max-width: 60px; /* Set a smaller fixed width for logo column on mobile */
    padding-right: 0; /* Remove right padding */
  }
  
  .experience-item .col-8 {
    padding-left: 10px; /* Add a little space between logo and text on mobile */
  }
}
</style>