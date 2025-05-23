<template>
  <div class="recommendation-container">

    <div v-if="recommendations && recommendations.length > 0" class="recommendation-list">
      <div 
        v-for="recommendation in recommendations" 
        :key="recommendation.id"
        class="recommendation-item"
      >
        <div class="recommendation-header">
          <h5 class="recommendation-company">
            {{ recommendation.contractorName }}
          </h5>
          
          <button 
            v-if="isOwnRecommendation(recommendation)"
            @click="$emit('delete-recommendation', recommendation.id)"
            class="btn-delete-recommendation"
            title="Hapus rekomendasi ini"
          >
            <i class="simple-icon-trash"></i>
          </button>
        </div>

        <div class="recommendation-content">
          <p class="recommendation-message">
            <template v-if="isExpanded[recommendation.id]">
              {{ recommendation.message }}
              <button 
                v-if="isMessageLong(recommendation.message)" 
                @click="toggleExpand(recommendation.id, false)"
                class="message-toggle-button"
              >
                Lihat Lebih Sedikit
              </button>
            </template>
            <template v-else>
              <template v-if="isMessageLong(recommendation.message)">
                {{ truncateMessage(recommendation.message) }}
                ... <button
                  @click="toggleExpand(recommendation.id, true)"
                  class="message-toggle-button"
                >Lihat Lebih Banyak
                </button>
              </template>
              <template v-else>
                {{ recommendation.message }}
              </template>
            </template>
          </p>
        </div>
      </div>
    </div>
    <p v-else class="recommendation-empty">
      Tidak ada Rekomendasi.
    </p>
  </div>
</template>

<script>
export const StatusType = {
  PENDING: 'PENDING',
  APPROVED: 'ACCEPTED',
  DECLINED: 'DECLINED'
};

export default {
  name: 'Recommendation',
  props: {
    recommendations: {
      type: Array,
      default: () => []
    },
    currentUserId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      CHARACTER_LIMIT: 250,
      isExpanded: {}
    };
  },
  methods: {
    isMessageLong(message) {
      return message.length > this.CHARACTER_LIMIT;
    },
    truncateMessage(message) {
      return message.substring(0, this.CHARACTER_LIMIT);
    },
    getStatusText(status) {
      if (status === 'PENDING') return 'Menunggu';
      if (status === 'ACCEPTED') return 'Diterima';
      return 'Ditolak';
    },
    toggleExpand(id, expanded) {
      this.$set(this.isExpanded, id, expanded);
    },
    isOwnRecommendation(recommendation) {
      if (!this.currentUserId) return false;
      return parseInt(recommendation.contractorId) === parseInt(this.currentUserId);
    }
  }
};
</script>

<style scoped>
.recommendation-container {
  min-height: 200px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.recommendation-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.recommendation-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recommendation-item {
  width: 100%;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem; /* Added margin */
}

.recommendation-item:first-child {
  border-top: none; /* Remove top border for first item */
  margin-top: 0; /* Remove top margin for first item */
  padding-top: 0; /* Remove top padding for first item */
}

.recommendation-content {
  width: 100%;
}

.recommendation-company {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 0.25rem;
}

.recommendation-message {
  font-size: 0.875rem;
  line-height: 1.5;
}

.recommendation-empty {
  font-size: 0.875rem;
  color: #64748b;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.btn-delete-recommendation {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-delete-recommendation:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.message-toggle-button {
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
</style>
