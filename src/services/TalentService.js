import axios from 'axios';
import { apiUrlTalentPool } from '@/constants/config';
import { hargaJasa, locations, skills } from '@/constants/filterData';

/**
 * Get talents from the API based on filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} - API response
 */
const getTalents = (filters = {}) => {
  // Convert array values in filters to comma-separated strings
  const formattedFilters = Object.keys(filters).reduce((acc, key) => {
    const value = filters[key];
    acc[key] = Array.isArray(value) ? value.join(',') : value;
    return acc;
  }, {});

  // The backend endpoint is /users/contractor
  return axios.get(`${apiUrlTalentPool}/users/contractor`, {
    params: formattedFilters,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

/**
 * Get filter options for the talent pool
 * @returns {Promise} - API response
 */
const getFilterOptions = () => {
  // Get filter options from the API
  return axios.get(`${apiUrlTalentPool}/talents/filter-options`);
};

/**
 * Toggle bookmark status for a talent
 * @param {String|Number} talentId - The ID of the talent
 * @returns {Promise} - API response
 */
/**
 * Mock talent data for development purposes
 * @returns {Promise} - Resolved promise with mock data
 */
const getMockTalents = () => {
  return Promise.resolve({
    data: {
      data: [
        {
          id: 1,
          name: 'Ruby Hadjoko',
          image: require('@/assets/img/profiles/2.jpg'),
          experience: '3',
          skill: 'Manajemen Pelaksanaan',
          location: 'Surabaya, Jawa Timur',
          price: 750000,
          bookmarked: true,
          lastContracted: '2024-12-24'
        },
        {
          id: 2,
          name: 'Muhammad Ilham',
          image: require('@/assets/img/profiles/2.jpg'),
          experience: '5',
          skill: 'Sains & Rekayasa Teknik',
          location: 'Surabaya, Jawa Timur',
          price: 950000,
          bookmarked: false,
          lastContracted: '2024-12-21'
        },
        {
          id: 3,
          name: 'Bimo Prayoga',
          image: require('@/assets/img/profiles/2.jpg'),
          experience: '2',
          skill: 'Perencanaan Wilayah & Kota',
          location: 'Surabaya, Jawa Timur',
          price: 750000,
          bookmarked: true,
          lastContracted: '2024-12-23'
        },
        {
          id: 4,
          name: 'Ahmad Rudi Gunawan',
          image: require('@/assets/img/profiles/2.jpg'),
          experience: '4',
          skill: 'Perencanaan Wilayah & Kota',
          location: 'Surabaya, Jawa Timur',
          price: 550000,
          bookmarked: false,
          lastContracted: '2024-12-22'
        }
      ]
    }
  });
};

/**
 * Get mock filter options for development
 * @returns {Promise} - Resolved promise with mock filter options
 */
const getMockFilterOptions = () => {
  // Generate price ranges from hargaJasa
  const priceRanges = [];
  Object.keys(hargaJasa).forEach(type => {
    Object.keys(hargaJasa[type]).forEach(exp => {
      const { min, max } = hargaJasa[type][exp];
      // Check if this range already exists
      const exists = priceRanges.some(range => 
        range.min === min && range.max === max
      );
      
      if (!exists) {
        priceRanges.push({ min, max });
      }
    });
  });
  
  // Sort price ranges by min value
  priceRanges.sort((a, b) => a.min - b.min);
  
  return Promise.resolve({
    data: {
      data: {
        skills: skills.map(skill => skill.label),
        locations: locations.map(location => location.label),
        priceRanges
      }
    }
  });
};

export default {
  getTalents,
  getFilterOptions,
  getMockTalents,
  getMockFilterOptions,
};