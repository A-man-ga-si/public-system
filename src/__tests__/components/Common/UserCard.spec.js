import { mount } from '@vue/test-utils';
import UserCard from '@/components/Common/UserCard.vue';

// Mock the skills import
jest.mock('@/constants/filterData', () => ({
  skills: [
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' }
  ]
}));

describe('UserCard.vue', () => {
  // Mock the require method in the component
  const originalRequire = window.require;
  beforeEach(() => {
    window.require = jest.fn(() => '/mocked-image-path.jpg');
  });
  
  afterEach(() => {
    window.require = originalRequire;
  });

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    experienceYears: 5,
    skill: 'frontend',
    currentLocation: 'Jakarta, Indonesia',
    price: 5000000,
    lastContracted: '2023-07-15',
    bookmarked: false
  };

  it('renders correctly with all user properties', () => {
    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    // Check basic elements
    expect(wrapper.find('.talent-name').text()).toBe('John Doe');
    expect(wrapper.find('.talent-location').text()).toContain('Jakarta, Indonesia');
    expect(wrapper.find('.talent-price').text()).toContain('Rp 5.000.000');
    expect(wrapper.find('.talent-date').text()).toContain('Terakhir dikontrak:');
    expect(wrapper.find('.experience-badge').text()).toContain('5 Tahun Pengalaman');
    expect(wrapper.find('.specialty-badge').text()).toBe('Frontend Developer');
    
    // Check image existence only
    expect(wrapper.find('.talent-image').exists()).toBe(true);
    expect(wrapper.find('.talent-image').attributes('alt')).toBe('John');
  });

  it('handles missing user properties gracefully', () => {
    const minimalUser = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith'
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: minimalUser
      }
    });

    // Only these elements should exist
    expect(wrapper.find('.talent-name').text()).toBe('Jane Smith');
    expect(wrapper.find('.talent-image').exists()).toBe(true);
    
    // These elements should not exist or be conditional
    expect(wrapper.find('.talent-location').exists()).toBe(false);
    expect(wrapper.find('.talent-price').exists()).toBe(false);
    expect(wrapper.find('.talent-date').exists()).toBe(false);
    expect(wrapper.find('.experience-badge').exists()).toBe(false);
    expect(wrapper.find('.specialty-badge').exists()).toBe(false);
  });

  it('calls toggleBookmark method when bookmark icon is clicked', async () => {
    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });
    
    // Create a mock for the toggleBookmark method
    wrapper.vm.toggleBookmark = jest.fn();
    
    // Trigger the click event
    await wrapper.find('.bookmark-icon').trigger('click');
    
    // Verify the method was called with the correct user
    expect(wrapper.vm.toggleBookmark).toHaveBeenCalledWith(mockUser);
  });

  it('displays bookmark icon with filled class when bookmarked is true', () => {
    const bookmarkedUser = {
      ...mockUser,
      bookmarked: true
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: bookmarkedUser
      }
    });

    expect(wrapper.find('.bookmark-icon i').classes()).toContain('filled');
  });

  it('formats price correctly', () => {
    const userWithLargePrice = {
      ...mockUser,
      price: 1234567890
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: userWithLargePrice
      }
    });

    expect(wrapper.find('.talent-price').text()).toContain('Rp 1.234.567.890');
  });

  it('formats date correctly', () => {
    // Create a fixed date for testing
    const formattedDateString = '15 Juli 2023';
    
    // Mock the Intl.DateTimeFormat to return a fixed format
    const mockFormat = jest.fn().mockReturnValue(formattedDateString);
    const mockDateTimeFormat = jest.fn().mockImplementation(() => ({
      format: mockFormat
    }));
    
    // Save original and replace with mock
    const originalDateTimeFormat = global.Intl.DateTimeFormat;
    global.Intl.DateTimeFormat = mockDateTimeFormat;

    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    expect(wrapper.find('.talent-date').text()).toContain(`Terakhir dikontrak: ${formattedDateString}`);
    
    // Check that the formatter was called with correct locale and options
    expect(mockDateTimeFormat).toHaveBeenCalledWith('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Restore original
    global.Intl.DateTimeFormat = originalDateTimeFormat;
  });

  it('returns correct skill label', () => {
    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    // Test the getSkillLabel method directly
    expect(wrapper.vm.getSkillLabel('frontend')).toBe('Frontend Developer');
    expect(wrapper.vm.getSkillLabel('backend')).toBe('Backend Developer');
    expect(wrapper.vm.getSkillLabel('unknown')).toBe('unknown');
  });
});