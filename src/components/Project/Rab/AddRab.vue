<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      title="Tambah Kategori"
      @show="resetForm"
    >
      <b-nav class="mb-5 justify-content-center" pills>
        <b-nav-item @click.prevent="switchRABMode('new')" :active="formOptions.currentState === 'new'"> Kategori RAB Baru </b-nav-item>
        <b-nav-item @click.prevent="switchRABMode('existing')" :active="formOptions.currentState === 'existing'"> Ambil Referensi RAB </b-nav-item>
      </b-nav>
      <div v-if="formOptions.currentState == 'existing'" class="labeled-select position-relative d-inline-block mb-4" style="width: 100%">
        <span class="px-1"> Referensi RAB</span>
        <v-select label="name" :reduce="(masterRabCategory) => masterRabCategory.id" :options="getRabCategories" v-model="form.selectedMasterRabCategoryId">
        </v-select>
      </div>
      <ValidationInput v-if="formOptions.currentState == 'new'" label="Nama" field-name="name" @keydown.enter="submit" v-model="form.name" />
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1">
          {{ $t('modal.save-bt') }}
        </b-button>
        <b-button variant="secondary" @click="hideModal">
          {{ $t('modal.cancel-bt') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixins from '@/mixins/validation-mixins';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from '@/utils';

  export default {
    mixins: [validationMixins],
    data() {
      return {
        modalId: 'add-rab',
        form: {
          name: '',
          selectedMasterRabCategoryId: '-',
        },
        formOptions: {
          currentState: 'new',
        },
        provinceId: '',
      };
    },
    created() {
      this.loadMasterRabCategories();
    },
    methods: {
      ...mapActions(['storeRab', 'fetchMasterRab', 'showProject', 'showMasterRab', 'getMasterRabCategory']),
      async loadMasterRabCategories() {
        const project = await this.showProject(this.$route.params.id);
        this.provinceId = project.data.data.project.hashed_province_id;
        this.getMasterRabCategory();
      },
      switchRABMode(mode) {
        this.formOptions.currentState = mode;
      },
      async submit() {
        try {
          if (this.form.selectedMasterRabCategoryId && this.form.selectedMasterRabCategoryId != '-') {
            const userAgreementToReplaceAhs = await showConfirmAlert({
              title: 'Buat RAB berdasarkan referensi RAB ?',
              text: 'Jika anda mempunyai AHS dengan kode yang sama dengan data dari AHS referensi RAB, maka harga akan di timpa dengan AHS yang baru. Tetap lanjutkan?',
            });
            if (!userAgreementToReplaceAhs.isConfirmed) return;
          }
          await this.storeRab({
            projectId: this.$route.params.id,
            form: this.form,
          });
          Notify.success('Berhasil Menambah RAB baru');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('rab-added');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan RAB');
        }
      },
      hideModal() {
        this.$refs[this.modalId].hide();
      },
      resetForm() {
        this.formOptions.currentState = 'new';
        this.form.name = '';
        this.form.selectedMasterRabCategoryId = '-';
      }
    },
    computed: {
      ...mapGetters(['getRabCategories']),
    },
    components: {
      ValidationInput,
    },
  };
</script>
