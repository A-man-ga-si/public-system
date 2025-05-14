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
    location: 'Surabaya, Jawa Timur',
    phone: '+62 8123456789',
    level: 'Intermediate',
    experienceYears: '2',
    mainSkill: 'Ahli Bangunan Gedung',
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
      await wrapper.setData({ error: 'Test error' });
      expect(wrapper.find('.error-container').exists()).toBe(true);
      expect(wrapper.find('.error-container').text()).toContain('Test error');
    });

    it('handles back button click', () => {
      const goBackSpy = jest.spyOn(router, 'go');
      wrapper.find('.back-button').trigger('click');
      expect(goBackSpy).toHaveBeenCalledWith(-1);
    });
  });

  // ========== BAGIAN BARU: Profile Section Tests ==========
  describe('Profile Section', () => {
    describe('Basic Profile Info', () => {
      it('displays talent name correctly', () => {
        const nameElement = wrapper.find('h2');
        expect(nameElement.text()).toBe(mockTalent.name);
      });

      it('displays location with icon', () => {
        const contactInfo = wrapper.find('.talent-contact-info');
        expect(contactInfo.text()).toContain(mockTalent.location);
      });

      it('displays phone number with icon', () => {
        const contactInfo = wrapper.find('.talent-contact-info');
        expect(contactInfo.text()).toContain(mockTalent.phone);
      });

      it('displays level badge', () => {
        const badges = wrapper.findAll('.badge-info');
        expect(badges.at(0).text()).toBe(mockTalent.level);
      });

      it('displays experience years badge', () => {
        const badges = wrapper.findAll('.badge-info');
        expect(badges.at(1).text()).toBe(`${mockTalent.experienceYears} Tahun Pengalaman`);
      });

      it('displays main skill badge', () => {
        const skillBadge = wrapper.find('.badge-secondary');
        expect(skillBadge.text()).toBe(mockTalent.mainSkill);
      });
    });

    describe('Price Estimate Section', () => {
      it('displays price estimate label', () => {
        const priceSection = wrapper.find('.price-estimate-card');
        expect(priceSection.find('p').text()).toBe('Perkiraan Harga');
      });

      it('formats price correctly', () => {
        const priceValue = wrapper.find('.price-value');
        expect(priceValue.text()).toBe('Rp 7.550.000');
      });

      it('displays contact button with first name', () => {
        const contactButton = wrapper.find('.price-estimate-card b-button-stub');
        expect(contactButton.text()).toBe(`Hubungi ${mockTalent.name.split(' ')[0]}`);
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('handles empty talent name', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, name: '' } 
        });
        const nameElement = wrapper.find('h2');
        expect(nameElement.text()).toBe('');
      });

      it('handles missing location', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, location: null } 
        });
        const contactInfo = wrapper.find('.talent-contact-info');
        expect(contactInfo.text()).toContain('');
      });

      it('handles missing phone', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, phone: null } 
        });
        const contactInfo = wrapper.find('.talent-contact-info');
        expect(contactInfo.text()).toContain('');
      });

      it('handles null price value', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, price: null } 
        });
        const priceValue = wrapper.find('.price-value');
        expect(priceValue.text()).toBe('Rp N/A');
      });

      it('handles undefined price value', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, price: undefined } 
        });
        const priceValue = wrapper.find('.price-value');
        expect(priceValue.text()).toBe('Rp N/A');
      });

      it('handles zero price value', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, price: 0 } 
        });
        const priceValue = wrapper.find('.price-value');
        expect(priceValue.text()).toBe('Rp 0');
      });

      it('handles single name for contact button', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, name: 'SingleName' } 
        });
        const contactButton = wrapper.find('.price-estimate-card b-button-stub');
        expect(contactButton.text()).toBe('Hubungi SingleName');
      });

      it('handles empty name for contact button', async () => {
        await wrapper.setData({ 
          talent: { ...mockTalent, name: '' } 
        });
        const contactButton = wrapper.find('.price-estimate-card b-button-stub');
        expect(contactButton.text()).toBe('Hubungi');
      });

    });

    describe('formatCurrency method', () => {
      it('formats regular number correctly', () => {
        expect(wrapper.vm.formatCurrency(7550000)).toBe('7.550.000');
      });

      it('handles null value', () => {
        expect(wrapper.vm.formatCurrency(null)).toBe('N/A');
      });

      it('handles undefined value', () => {
        expect(wrapper.vm.formatCurrency(undefined)).toBe('N/A');
      });

      it('handles zero value', () => {
        expect(wrapper.vm.formatCurrency(0)).toBe('0');
      });

      it('handles large numbers', () => {
        expect(wrapper.vm.formatCurrency(1234567890)).toBe('1.234.567.890');
      });

      it('handles formating number', () => {
        expect(wrapper.vm.formatCurrency(12345)).toBe('12.345');
      });
    });
  });
  // ========== AKHIR BAGIAN BARU ==========

  describe('Tentang Saya Section', () => {
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
  });

  describe('Pengalaman Section', () => {
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

  describe('Bersedia Ditempatkan di Kota Section', () => {
    it('displays all preferred locations', () => {
      const locationBadges = wrapper.findAll('.location-badge');
      expect(locationBadges.length).toBe(mockTalent.preferredLocations.length);
      expect(locationBadges.at(0).text()).toBe(mockTalent.preferredLocations[0]);
    });

    it('handles empty preferred locations array', async () => {
      await wrapper.setData({ talent: { ...mockTalent, preferredLocations: [] } });
      const locationBadges = wrapper.findAll('.location-badge');
      expect(locationBadges.length).toBe(0);
    });
  });

  describe('Sertifikasi Section', () => {
    it('renders certification items correctly', () => {
      const certItems = wrapper.findAll('.certification-item');
      expect(certItems.length).toBe(mockCertifications.length);
    });

    it('formats file size correctly', () => {
      expect(wrapper.vm.formatFileSize(5242880)).toBe('5.0 MB');
    });

    it('handles download certificate click', () => {
      const windowSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
      const toastSpy = jest.spyOn(wrapper.vm.$bvToast, 'toast');
      
      wrapper.vm.downloadCertificate(mockCertifications[0]);
      
      expect(windowSpy).toHaveBeenCalledWith(mockCertifications[0].fileUrl, '_blank');
      expect(toastSpy).toHaveBeenCalled();
      
      windowSpy.mockRestore();
    });

    it('handles invalid file size', () => {
      expect(wrapper.vm.formatFileSize(0)).toBeNull();
      expect(wrapper.vm.formatFileSize(null)).toBeNull();
      expect(wrapper.vm.formatFileSize(undefined)).toBeNull();
    });
  });
});