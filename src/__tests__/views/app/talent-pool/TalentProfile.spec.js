import { shallowMount, createLocalVue } from '@vue/test-utils';
import TalentProfile from '@/views/app/talent-pool/TalentProfile.vue';
import VueRouter from 'vue-router';
import { BootstrapVue } from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(BootstrapVue);
const router = new VueRouter();

describe('TalentProfile.vue', () => {
  let wrapper;
  const mockTalent = {
    name: 'Rudy Handoko',
    image: 'path/to/image.jpg',
    about: 'Test about text',
    price: 7550000,
    preferredLocations: ['Jakarta', 'Bandung']
  };

  const mockExperiences = [
    {
      id: 1,
      jobTitle: 'Lead Construction Project Manager',
      companyName: 'PT WIJAYA KARYA',
      employmentType: 'Full Time',
      startDate: '2016-01-01',
      endDate: '2019-06-30',
      location: 'Jakarta',
      workMode: 'On-site'
    }
  ];

  const mockCertifications = [
    {
      id: 1,
      title: 'Test Cert.pdf',
      fileSize: 5242880, // 5MB
      fileUrl: 'http://test.com/cert.pdf'
    }
  ];

  beforeEach(() => {
    wrapper = shallowMount(TalentProfile, {
      localVue,
      router,
      mocks: {
        $t: key => key,
        $bvToast: {
          toast: jest.fn()
        }
      }
    });
    wrapper.setData({
      talent: mockTalent,
      experiences: mockExperiences,
      certifications: mockCertifications
    });
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.talent-profile-container').exists()).toBe(true);
  });

  it('shows loading state', async () => {
    await wrapper.setData({ loading: true });
    expect(wrapper.find('.loading-container').exists()).toBe(true);
  });

  it('shows error state', async () => {
    await wrapper.setData({ error: 'Test error' });
    expect(wrapper.find('.error-container').exists()).toBe(true);
    expect(wrapper.find('.error-container').text()).toContain('Test error');
  });
  
  it('handles back button click', () => {
    const goBackSpy = jest.spyOn(router, 'go');
    wrapper.find('.back-button').trigger('click');
    expect(goBackSpy).toHaveBeenCalledWith(-1);
  });

  it('displays about section with correct content', () => {
    const aboutSection = wrapper.find('.section-card');
    expect(aboutSection.exists()).toBe(true);
    expect(aboutSection.find('h4').text()).toBe('Tentang Saya');
    expect(aboutSection.find('p').text()).toBe(mockTalent.about);
  });

  it('handles empty about text', async () => {
    await wrapper.setData({ talent: { ...mockTalent, about: '' } });
    const aboutText = wrapper.find('.section-card p').text();
    expect(aboutText).toBe('');
  });

  it('renders experience items correctly', () => {
    const experienceItems = wrapper.findAll('.experience-item');
    expect(experienceItems.length).toBe(mockExperiences.length);
  });

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
    const duration = wrapper.vm.calculateDuration('2023-01-01', null);
    expect(duration).toBe('2 thn 4 bln');
  });

  it('handles future start date', () => {
    expect(wrapper.vm.calculateDuration('2026-01-01', '2026-06-30'))
      .toBe('Belum dimulai');
  });
});
