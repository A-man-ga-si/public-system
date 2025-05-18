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
    
    const toastMock = jest.fn();
    
    wrapper = shallowMount(TalentProfile, {
      localVue,
      router,
      mocks: {
        $route: { params: { talentId: '123' } },
        $t: key => key,
        $bvToast: {
          toast: toastMock
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

  describe('WhatsApp Functionality', () => {
    let originalWindowOpen;
    
    beforeEach(() => {
      // Save original window.open
      originalWindowOpen = window.open;
      // Mock window.open function
      window.open = jest.fn();
    });
    
    afterEach(() => {
      // Restore original window.open
      window.open = originalWindowOpen;
    });
    
    it('displays toast if phone number is not available', async () => {
      const toastSpy = jest.spyOn(wrapper.vm.$bvToast, 'toast');
      
      // Set phone number to null/empty
      await wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if toast was called
      expect(toastSpy).toHaveBeenCalled();
      
      // Verify window.open wasn't called
      expect(window.open).not.toHaveBeenCalled();
      
      toastSpy.mockRestore();
    });
    
    it('formats a number starting with 0 correctly for WhatsApp', () => {
      // Set phone with leading 0
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '081234567890', name: 'John Doe' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if window.open was called with correctly formatted number (+62...)
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/+6281234567890'),
        '_blank'
      );
    });
    
    it('formats a number without prefix correctly for WhatsApp', () => {
      // Set phone without any prefix
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '81234567890', name: 'John Doe' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if window.open was called with correctly formatted number (+62...)
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/+6281234567890'),
        '_blank'
      );
    });
    
    it('formats a number starting with 62 correctly for WhatsApp', () => {
      // Set phone starting with 62
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '6281234567890', name: 'John Doe' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if window.open was called with correctly formatted number (+62...)
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/+6281234567890'),
        '_blank'
      );
    });
    
    it('keeps a number already formatted with + unchanged', () => {
      // Set phone already with +
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '+6281234567890', name: 'John Doe' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if window.open was called with correctly formatted number (unchanged)
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/+6281234567890'),
        '_blank'
      );
    });
    
    it('includes the talent name in the WhatsApp message', () => {
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '081234567890', name: 'Jane Smith' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if message contains the talent name
      const expectedMessagePart = encodeURIComponent('Halo Jane Smith');
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessagePart),
        '_blank'
      );
    });
    
    it('removes spaces from phone numbers', () => {
      // Set phone with spaces
      wrapper.setData({
        talent: { ...wrapper.vm.talent, phone: '0812 3456 7890', name: 'John Doe' }
      });
      
      // Call the method
      wrapper.vm.openWhatsApp();
      
      // Check if window.open was called with correctly formatted number (+62...)
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/+6281234567890'),
        '_blank'
      );
    });
  });
});