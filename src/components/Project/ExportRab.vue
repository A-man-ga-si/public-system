<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Export RAB">
      <div class="export-form mb-3">
        <p>
          Mohon melengkapi syarat - syarat dibawah untuk dapat mengekspor RAB
          menjadi bentuk .xlsx
        </p>
        <div class="company-ok mb-3" v-if="getCompany">
          <ph-check-circle :size="32" weight="light" class="text-success" />
          <span>
            <b class="text-success">Company Status</b>
          </span>
        </div>
        <div class="company-not-exist d-flex mb-3" v-else>
          <div class="left">
            <ph-x-circle :size="32" weight="light" class="text-danger" />
          </div>
          <div class="right">
            <span class="ml-2">
              <b class="text-danger">Company Status</b>
              <router-link
                v-if="!getCompany"
                :to="{ name: 'CompanyProfile' }"
                class="d-block ml-2 text-danger"
              >
                <u>Klik disini untuk mengisi company</u>
              </router-link>
            </span>
          </div>
        </div>
        <div class="payment-loading" v-if="!fetchQuotaStatus">
          <div class="d-flex">
            <div class="left">
              <b-spinner
                class="ml-2"
                label="Memuat..."
                variant="primary"
                small
              ></b-spinner>
            </div>
            <div class="right">
              <span class="d-inline-block ml-3">
                Memuat Status Pembayaran ...
              </span>
            </div>
          </div>
        </div>
        <div class="payment" v-else>
          <div class="payment-ok" v-if="quotasLeft > 0">
            <ph-check-circle :size="32" weight="light" class="text-success" />
            <span>
              <b class="text-success">Payment Status : Terbayar</b>
            </span>
          </div>
          <div class="company-not-exist d-flex" v-else>
            <div class="left">
              <ph-x-circle :size="32" weight="light" class="text-danger" />
            </div>
            <div class="right">
              <span class="ml-2">
                <b class="text-danger">Payment Status</b>
                <span v-if="quotasLeft <= 0">
                  <a
                    href="#"
                    @click.prevent="submit"
                    v-if="!paymentLoading"
                    class="d-block ml-2 text-danger"
                  >
                    <u>Klik disini untuk melengkapi payment status</u>
                  </a>
                  <div class="pl-2 text-danger" v-else>
                    <span class="d-block">Pembayaran sedang di proses... </span>
                    <a
                      href="#"
                      @click.prevent="refreshPayment"
                    >
                      <u>klik untuk re-fresh</u>
                    </a>
                    /
                    <router-link
                      :to="{name: 'Orders'}"
                    >
                      <u>Status Order</u>
                    </router-link>
                  </div>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <template slot="modal-footer">
        <b-button
          @click.prevent="submit"
          variant="primary"
          class="mr-1"
          :disabled="!getCompany || quotasLeft <= 0"
        >
          Export
        </b-button>
        <b-button variant="secondary" @click="hideModal(modalId)">
          {{ $t('modal.cancel-bt') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixins from '@/mixins/validation-mixins';
  import paymentMixins from '@/mixins/payment-mixins';
  import { mapActions, mapGetters } from 'vuex';
  import { PhCheckCircle, PhXCircle } from 'phosphor-vue';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins, paymentMixins],
    data() {
      return {
        modalId: 'export-rab',
        fetchQuotaStatus: false,
        refreshing: false,
        // FIXME: Change to 0 to enable payment system
        quotasLeft: 1,
        form: {
          name: '',
        },
      };
    },
    created() {
      this.checkQuotas();
    },
    methods: {
      ...mapActions([
        'storeRab',
        'fetchSnapToken',
        'exportProject',
        'checkOrder',
      ]),
      async submit() {
        try {
          if (this.fetchQuotaStatus && this.quotasLeft > 0) {
            const xlsxBlob = await this.exportProject({
              projectId: this.$route.params.id,
            });
            const fileLink = document.createElement('a');
            fileLink.href = window.URL.createObjectURL(xlsxBlob);
            fileLink.download = this.getCurrentActiveProject.name + '.xlsx';
            fileLink.click();
            this.checkQuotas();
          } else {
            const that = this;
            this.pay({
              project_id: this.$route.params.id,
            }, function() {
              that.checkQuotas();
            });
          }
        } catch (err) {
          Notify.failure('Terjadi kesalahan saat melakukan export RAB !');
          console.error(err);
        }
      },
      refreshPayment() {
        this.checkQuotas();
      },
      async checkQuotas() {
        const data = await this.checkOrder({
          projectId: this.$route.params.id,
        });
        this.fetchQuotaStatus = true;
        // FIXME: Uncomment to enable the payment system
        // this.quotasLeft = data.data.data.quotasLeft;
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.name = '';
      },
    },
    computed: {
      ...mapGetters(['getCompany', 'getCurrentActiveProject']),
    },
    components: {
      ValidationInput,
      PhCheckCircle,
      PhXCircle,
    },
  };
</script>
