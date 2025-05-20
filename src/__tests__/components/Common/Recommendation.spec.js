import { mount, shallowMount } from '@vue/test-utils';
import Recommendation from '@/components/Common/Recommendation.vue';

describe('Recommendation.vue', () => {
  // Test data
  const sampleRecommendations = [
    {
      id: '1',
      talentId: 'talent-001',
      contractorId: 101,
      contractorName: 'PT Sample Company',
      message: 'This is a short recommendation message.',
      status: 'ACCEPTED'
    },
    {
      id: '2',
      talentId: 'talent-001',
      contractorId: 102,
      contractorName: 'CV Another Corp',
      message: 'This is a very long recommendation message that exceeds the character limit. '.repeat(10), // Creates a long message
      status: 'PENDING'
    }
  ];

  // Positive test cases
  describe('Positive Cases', () => {
    it('renders correctly with recommendations', () => {
      const wrapper = shallowMount(Recommendation, {
        propsData: {
          recommendations: sampleRecommendations
        }
      });
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.recommendation-container').exists()).toBe(true);
      
      // Should have two recommendation items
      const items = wrapper.findAll('.recommendation-item');
      expect(items.length).toBe(2);

      // First recommendation should show the contractor name and message
      const firstItem = items.at(0);
      expect(firstItem.find('.recommendation-company').text()).toBe('PT Sample Company');
      expect(firstItem.find('.recommendation-message').text()).toContain('This is a short recommendation message.');
    });

    it('shows "Lihat Lebih Banyak" button for long messages', () => {
      const wrapper = mount(Recommendation, {
        propsData: {
          recommendations: [sampleRecommendations[1]] // Use the long message recommendation
        }
      });
      
      // Should have the "show more" button
      expect(wrapper.find('.message-toggle-button').exists()).toBe(true);
      expect(wrapper.find('.message-toggle-button').text()).toBe('Lihat Lebih Banyak');
    });

    it('expands and collapses long messages when buttons are clicked', async () => {
      const wrapper = mount(Recommendation, {
        propsData: {
          recommendations: [sampleRecommendations[1]] // Use the long message recommendation
        }
      });
      
      // Initially should be collapsed
      const longMessage = sampleRecommendations[1].message;
      expect(wrapper.find('.recommendation-message').text()).not.toBe(longMessage);
      
      // Click "Lihat Lebih Banyak"
      await wrapper.find('.message-toggle-button').trigger('click');
      
      // Now should be expanded
      expect(wrapper.find('.recommendation-message').text()).toContain(longMessage);
      expect(wrapper.find('.message-toggle-button').text()).toBe('Lihat Lebih Sedikit');
      
      // Click "Lihat Lebih Sedikit"
      await wrapper.find('.message-toggle-button').trigger('click');
      
      // Should be collapsed again
      expect(wrapper.find('.recommendation-message').text()).not.toBe(longMessage);
      expect(wrapper.find('.message-toggle-button').text()).toBe('Lihat Lebih Banyak');
    });
  });

  // Negative test cases
  describe('Negative Cases', () => {
    it('displays "Tidak ada Rekomendasi" when recommendations array is empty', () => {
      const wrapper = shallowMount(Recommendation, {
        propsData: {
          recommendations: []
        }
      });
      
      expect(wrapper.find('.recommendation-empty').exists()).toBe(true);
      expect(wrapper.find('.recommendation-empty').text()).toBe('Tidak ada Rekomendasi.');
      expect(wrapper.findAll('.recommendation-item').length).toBe(0);
    });

    it('handles undefined recommendations prop gracefully', () => {
      const wrapper = shallowMount(Recommendation);
      
      expect(wrapper.find('.recommendation-empty').exists()).toBe(true);
      expect(wrapper.find('.recommendation-empty').text()).toBe('Tidak ada Rekomendasi.');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles empty messages', () => {
      const emptyMessageRecommendation = {
        id: '1',
        contractorName: 'Company with Empty Message',
        message: ''
      };
      
      const wrapper = mount(Recommendation, {
        propsData: {
          recommendations: [emptyMessageRecommendation]
        }
      });
      
      // Should render without "Lihat Lebih Banyak" button
      expect(wrapper.find('.recommendation-message').exists()).toBe(true);
      expect(wrapper.find('.message-toggle-button').exists()).toBe(false);
      expect(wrapper.find('.recommendation-message').text()).toBe('');
    });

    it('handles exactly-at-limit messages correctly', () => {
      // Create a message that is exactly at the character limit
      const CHARACTER_LIMIT = 250; // Same as in component
      const exactLengthMsg = 'A'.repeat(CHARACTER_LIMIT);
      
      const exactLengthRecommendation = {
        id: '1',
        contractorName: 'Exact Length Company',
        message: exactLengthMsg
      };
      
      const wrapper = mount(Recommendation, {
        propsData: {
          recommendations: [exactLengthRecommendation]
        }
      });
      
      // Should not show expand button as the message is exactly at limit, not over
      expect(wrapper.find('.message-toggle-button').exists()).toBe(false);
      expect(wrapper.find('.recommendation-message').text()).toBe(exactLengthMsg);
    });

    it('handles recommendations with duplicate IDs', () => {
      const duplicateIdRecommendations = [
        {
          id: 'duplicate',
          contractorName: 'First Company',
          message: 'First message'
        },
        {
          id: 'duplicate',
          contractorName: 'Second Company',
          message: 'Second message'
        }
      ];
      
      const wrapper = shallowMount(Recommendation, {
        propsData: {
          recommendations: duplicateIdRecommendations
        }
      });
      expect(wrapper.findAll('.recommendation-item').length).toBe(2);
    });
  });
});
