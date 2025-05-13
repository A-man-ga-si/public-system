<template>
  <div class="talent-card-wrapper" @click="navigateToProfile">
    <div class="talent-card">
      <div class="talent-image-container">
        <img class="talent-image" :src="user.image || require('@/assets/img/profiles/2.jpg')" :alt="user.firstName" />
        <div class="bookmark-icon" @click="toggleBookmark(user)">
          <i class="simple-icon-star" :class="{ 'filled': user.bookmarked }"></i>
        </div>
        <div class="talent-badge experience-badge" v-if="user.experienceYears">
          {{ user.experienceYears }} Tahun Pengalaman
        </div>
        <div class="talent-badge specialty-badge" v-if="user.skill">
          {{ getSkillLabel(user.skill) }}
        </div>
      </div>
      <div class="talent-info">
        <h3 class="talent-name">{{ user.firstName }} {{ user.lastName }}</h3>
        <p class="talent-location" v-if="user.currentLocation">
          <i class="simple-icon-location-pin"></i> {{ user.currentLocation }}
        </p>
        <div class="talent-footer">
          <div class="talent-price" v-if="user.price">Rp {{ formattedPrice }}</div>
          <div class="talent-date" v-if="user.lastContracted">Terakhir dikontrak: {{ formattedDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { skills } from '@/constants/filterData'

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedPrice() {
      if (!this.user.price) return '';
      return new Intl.NumberFormat('id-ID').format(this.user.price);
    },
    formattedDate() {
      if (!this.user.lastContracted) return '-';
      
      const date = new Date(this.user.lastContracted);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  },
  methods: {
    getSkillLabel(skillValue) {
      const skill = skills.find(s => s.value === skillValue);
      return skill ? skill.label : skillValue;
    },
    navigateToProfile() {
      if (this.user && this.user.id) {
        this.$router.push({ name: 'TalentProfile', params: { talentId: this.user.id } });
      } else {
        console.error('User ID is missing, cannot navigate to profile.');
      }
    }
  }
}
</script>

<style scoped>
.talent-card-wrapper {
  width: 100%;
  cursor: pointer; /* Add cursor pointer to indicate it's clickable */
}

.talent-card {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 100%;
}

.talent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.talent-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.talent-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.talent-info {
  padding: 15px;
}

.talent-name {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
}

.talent-location {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 10px;
}

.talent-footer {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.talent-price {
  font-weight: 600;
  font-size: 16px;
}

.talent-date {
  font-size: 12px;
  color: #6c757d;
}

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 3px;
  cursor: pointer;
  z-index: 5;
}

.bookmark-icon i {
  color: #adb5bd;
}

.bookmark-icon i.filled {
  color: #ffc107;
}

.talent-badge {
  position: absolute;
  left: 10px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 3px;
  z-index: 5;
}

.experience-badge {
  bottom: 40px;
  background-color: #ffc107;
  color: white;
}

.specialty-badge {
  bottom: 10px;
  background-color: white;
  color: #003473;
}
</style>