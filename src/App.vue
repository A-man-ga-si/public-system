<template>
  <div class="h-100">
    <tutorial-overlay v-if="isInTutorial" />
    <router-view />
    <synchronizing-progress />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { rounded } from './constants/config';
  import TutorialOverlay from '@/components/Common/TutorialOverlay.vue';
  import SynchronizingProgress from '@/components/Common/SynchronizingProgress.vue';

  export default {
    created() {
      this.getTutorialLists();
    },
    beforeMount() {
      if (rounded) document.body.classList.add('rounded');
    },
    computed: {
      ...mapGetters(['isInTutorial']),
    },
    methods: {
      ...mapActions(['getTutorialLists']),
    },
    components: {
      TutorialOverlay,
      SynchronizingProgress
    }
  };
</script>

<style>
  .pace .pace-progress {
    height: 3px !important;
    background-color: #165079 !important;
  }

  .custom-nice-border {
    border: 2px solid rgba(240, 240, 240, 1);
    border-radius: 10px;
  }
</style>
