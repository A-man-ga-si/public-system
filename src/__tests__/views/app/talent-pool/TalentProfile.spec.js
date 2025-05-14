import { shallowMount, createLocalVue } from '@vue/test-utils';
import TalentProfile from '@/views/app/talent-pool/TalentProfile.vue';
import VueRouter from 'vue-router';
import { BootstrapVue } from 'bootstrap-vue';

// Mock dependencies
jest.mock('@/services/TalentProfileService', () => ({
  getTalentProfile: jest.fn(),
  getTalentExperiences: jest.fn(),
  getTalentCertifications: jest.fn(),
  getMockTalentProfile: jest.fn(),
  getMockTalentExperiences: jest.fn(),
  getMockTalentCertifications: jest.fn(),
  dummyDownloadCertificate: jest.fn()
}));

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(BootstrapVue);
const router = new VueRouter();

describe('TalentProfile.vue', () => {
  let wrapper;
  let mockTalentProfileService;
  
  const mockTalent = {
    id: '123',
    name: 'Rudy Handoko',
    image: 'path/to/image.jpg',
    location: 'Jakarta',
    phone: '08123456789',
    level: 'Expert',
    experienceYears: '5',
    mainSkill: 'Java, Spring',
    price: 7550000,
    about: 'Test about text',
    preferredLocations: ['Jakarta', 'Bandung']
  };

  const mockExperiences = [
    {
      id: 1,
      title: 'Lead Construction Project Manager',
      company: 'PT WIJAYA KARYA',
      employmentType: 'FULL_TIME',
      startDate: '2016-01-01',
      endDate: '2019-06-30',
      location: 'Jakarta',
      locationType: 'ON_SITE',
      description: 'Lead construction projects'
    }
  ];

  const mockCertifications = [
    {
      id: 1,
      title: 'Test Cert',
      file: 'Test Cert.pdf'
    }
  ];
  
  beforeEach(() => {
    mockTalentProfileService = require('@/services/TalentProfileService');
    
    // Set up default mock responses
    mockTalentProfileService.getMockTalentProfile.mockResolvedValue({
      data: {
        data: {
          id: '123',
          firstName: 'Rudy',
          lastName: 'Handoko',
          phoneNumber: '08123456789',
          currentLocation: 'Jakarta',
          skkLevel: 'Expert',
          experienceYears: 5,
          skill: 'Java, Spring',
          price: 7550000,
          aboutMe: 'Test about text',
          preferredLocations: ['Jakarta', 'Bandung'],
          photo: 'path/to/image.jpg'
        }
      }
    });
    
    mockTalentProfileService.getMockTalentExperiences.mockResolvedValue({
      data: {
        data: mockExperiences
      }
    });
    
    mockTalentProfileService.getMockTalentCertifications.mockResolvedValue({
      data: {
        data: mockCertifications
      }
    });
    
    wrapper = shallowMount(TalentProfile, {
      localVue,
      router,
      mocks: {
        $route: { params: { talentId: '123' } },
        $t: key => key,
        $bvToast: {
          toast: jest.fn()
        }
      },
      stubs: ['router-link', 'b-button', 'IconLeftChevron', 'IconWhatsapp', 'IconLocation', 'IconPdf']
    });
    
    // Manually set data to bypass API calls
    wrapper.setData({
      talent: mockTalent,
      experiences: mockExperiences,
      certifications: mockCertifications,
      loading: false,
      experiencesLoading: false,
      certificationsLoading: false
    });
  });
  
  afterEach(() => {
    if (wrapper) wrapper.destroy();
    jest.clearAllMocks();
  });

  describe('General Component Behavior', () => {
    it('renders correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.talent-profile-container').exists()).toBe(true);
    });

    it('shows loading state', async () => {
      await wrapper.setData({ loading: true });
      expect(wrapper.find('.loading-container').exists()).toBe(true);
    });

    it('shows error state', async () => {
      await wrapper.setData({ loading: false, error: 'Test error' });
      expect(wrapper.find('.error-container').exists()).toBe(true);
      expect(wrapper.find('.error-container').text()).toContain('Test error');
    });
  });

  describe('Pengalaman Section', () => {
    it('formats date range correctly', () => {
      const exp = mockExperiences[0];
      expect(wrapper.vm.formatDateRange(exp.startDate, exp.endDate))
        .toBe('Jan 2016 - Jun 2019');
    });

    it('calculates duration correctly', () => {
      expect(wrapper.vm.calculateDuration('2016-01-01', '2019-06-30'))
        .toBe('3 thn 5 bln');
    });

    it('handles invalid dates', () => {
      expect(wrapper.vm.calculateDuration('invalid', '2019-06-30'))
        .toBe('Invalid start date');
      expect(wrapper.vm.calculateDuration('2019-06-30', 'invalid'))
        .toBe('Invalid end date');
    });

    it('handles experience with no end date', () => {
      // Mock current date for consistent testing
      const realDate = Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new realDate('2023-05-15');
          }
          return new realDate(...args);
        }
      };
      
      const duration = wrapper.vm.calculateDuration('2023-01-01', null);
      expect(duration).toBe('4 bln');
      
      // Restore original Date
      global.Date = realDate;
    });

    it('handles future start date', () => {
      // Mock current date for consistent testing
      const realDate = Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new realDate('2023-05-15');
          }
          return new realDate(...args);
        }
      };
      
      expect(wrapper.vm.calculateDuration('2026-01-01', '2026-06-30'))
        .toBe('Belum dimulai');
        
      // Restore original Date
      global.Date = realDate;
    });
  });
  
  describe('Format Utility Methods', () => {
    it('formats currency correctly', () => {
      expect(wrapper.vm.formatCurrency(7550000)).toBe('7.550.000');
    });
    
    it('handles null or undefined currency values', () => {
      expect(wrapper.vm.formatCurrency(null)).toBe('N/A');
      expect(wrapper.vm.formatCurrency(undefined)).toBe('N/A');
    });
    
    it('formats employment type correctly', () => {
      expect(wrapper.vm.formatEmploymentType('FULL_TIME')).toBe('Full Time');
      expect(wrapper.vm.formatEmploymentType('FREELANCE')).toBe('Freelance');
      expect(wrapper.vm.formatEmploymentType('UNKNOWN')).toBe('UNKNOWN');
    });
    
    it('formats location type correctly', () => {
      expect(wrapper.vm.formatLocationType('ON_SITE')).toBe('On-site');
      expect(wrapper.vm.formatLocationType('REMOTE')).toBe('Remote');
      expect(wrapper.vm.formatLocationType('HYBRID')).toBe('Hybrid');
    });
  });
});