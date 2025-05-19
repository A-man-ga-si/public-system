import axios from 'axios';
import { apiUrlTalentPool } from '@/constants/config';

/**
 * Service untuk menghandle API calls yang berkaitan dengan talent profile
 * Menggunakan contractor endpoints sesuai dengan backend yang ada
 */

/**
 * Get talent profile by ID from the API
 * Endpoint: GET /users/contractor/{id}
 * @param {String} talentId - The ID of the talent
 * @returns {Promise} - API response
 */
const getTalentProfile = (talentId) => {
  return axios.get(`${apiUrlTalentPool}/users/contractor/${talentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * Get talent experiences by ID from the API
 * Endpoint: GET /experiences/user/contractor/{talent_id}
 * @param {String} talentId - The ID of the talent
 * @returns {Promise} - API response
 */
const getTalentExperiences = (talentId) => {
  return axios.get(`${apiUrlTalentPool}/experiences/user/contractor/${talentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * Get talent certifications by ID from the API
 * Endpoint: GET /certificates/user/contractor/{userId}
 * @param {String} talentId - The ID of the talent (userId)
 * @returns {Promise} - API response
 */
const getTalentCertifications = (talentId) => {
  return axios.get(`${apiUrlTalentPool}/certificates/user/contractor/${talentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * DUMMY DOWNLOAD FUNCTION - Tidak ada endpoint download di backend
 * Membuat simulasi download file untuk sertifikat
 * @param {Object} certificate - Certificate object with id, title, file
 * @returns {Promise} - Always resolves with dummy blob
 */
const dummyDownloadCertificate = (certificate) => {
  return new Promise((resolve) => {
    // Simulasi delay API call
    setTimeout(() => {
      // Create dummy PDF content
      const dummyContent = `
        SERTIFIKAT
        
        ${certificate.title}
        
        File: ${certificate.file}
        ID: ${certificate.id}
        
        [Ini adalah file dummy untuk simulasi download]
      `;
      
      // Convert to blob
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      resolve({ data: blob });
    }, 500); // 500ms delay untuk simulasi
  });
};

/**
 * Get talent recommendations from API
 * @param {string} talentId - The ID of the talent
 * @returns {Promise} - API response
 */
const getTalentRecommendations = (talentId) => {
  return axios.get(`${apiUrlTalentPool}/recommendations/user/contractor/${talentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * Mock talent profile data untuk development - Sesuai format backend response
 */
const getMockTalentProfile = (talentId) => {
  return Promise.resolve({
    data: {
      data: {
        id: talentId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe123@example.com',
        phoneNumber: '08123456799',
        photo: null,
        aboutMe: 'I am a passionate software engineer with 5 years of experience.',
        nik: '1234567890123469',
        npwp: '187654321098765',
        photoKtp: null,
        photoNpwp: null,
        photoIjazah: null,
        experienceYears: 5,
        skkLevel: 'Expert',
        currentLocation: 'Jakarta',
        preferredLocations: ['Jakarta', 'Bandung'],
        skill: 'Java, Spring Boot',
        price: 8500000
      },
      page: 0,
      size: 0,
      totalPages: 0,
      errors: null
    }
  });
};

/**
 * Mock talent experiences data untuk development - Sesuai format backend response
 */
const getMockTalentExperiences = (talentId) => {
  return Promise.resolve({
    data: {
      data: [
        {
          id: 1,
          title: 'Senior Software Engineer',
          company: 'PT Technology Solutions',
          companyImage: null,
          employmentType: 'FULL_TIME',
          startDate: '2020-01-15',
          endDate: '2023-12-31',
          location: 'Jakarta, DKI Jakarta',
          locationType: 'HYBRID'
        },
        {
          id: 2,
          title: 'Backend Developer',
          company: 'PT Digital Innovation',
          companyImage: null,
          employmentType: 'CONTRACT',
          startDate: '2018-06-01',
          endDate: '2019-12-31',
          location: 'Bandung, West Java',
          locationType: 'ON_SITE'
        }
      ],
      page: 0,
      size: 0,
      totalPages: 0,
      errors: null
    }
  });
};

/**
 * Mock talent certifications data untuk development - Sesuai format backend response
 */
const getMockTalentCertifications = (talentId) => {
  return Promise.resolve({
    data: {
      data: [
        {
          id: 1,
          title: 'Java Professional Certification',
          file: 'java-cert.pdf',
          talentId: talentId
        },
        {
          id: 2,
          title: 'Spring Boot Specialist',
          file: 'spring-boot-cert.pdf',
          talentId: talentId
        }
      ],
      page: 0,
      size: 0,
      totalPages: 0,
      errors: null
    }
  });
};

/**
 * Mock talent recommendations data untuk development - Sesuai format backend response
 */
const getMockTalentRecommendations = (talentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          data: [
            {
              id: '1',
              talentId: talentId,
              contractorId: 101,
              contractorName: 'PT Teknologi Indonesia',
              message: 'Sangat terampil dalam komunikasi dan memiliki kemampuan teknis yang baik. Berhasil menyelesaikan proyek tepat waktu dengan hasil yang memuaskan.',
              status: 'ACCEPTED'
            },
            {
              id: '2',
              talentId: talentId,
              contractorId: 102,
              contractorName: 'CV Maju Mundur',
              message: 'Memiliki etika kerja yang sangat baik dan selalu profesional dalam setiap penugasan. Kami sangat merekomendasikan untuk posisi pengembang aplikasi senior.',
              status: 'ACCEPTED'
            },
            {
              id: '3',
              talentId: talentId,
              contractorId: 103,
              contractorName: 'PT Belum Disetujui',
              message: 'Rekomendasi yang belum disetujui oleh talent.',
              status: 'PENDING'
            },
            {
              id: '4',
              talentId: talentId,
              contractorId: 104,
              contractorName: 'CV Ditolak Saja',
              message: 'Rekomendasi yang ditolak oleh talent.',
              status: 'DECLINED'
            }
          ]
        }
      });
    }, 800);
  });
};

export default {
  getTalentProfile,
  getTalentExperiences,
  getTalentCertifications,
  dummyDownloadCertificate,
  getMockTalentProfile,
  getMockTalentExperiences,
  getMockTalentCertifications,
  getTalentRecommendations,
  getMockTalentRecommendations
};