<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="12" xl="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side">
          <div class="dark-overlay"></div>
          <div class="trans-overlay position-relative" style="z-index: 1;">
            <p class="text-white h2">
              {{ $t('dashboards.login-string-title') }}
            </p>
            <p class="white mb-0">
              Rencanakan.Id adalah aplikasi yang memudahkan kontraktor kecil dalam
              membuat RAB dengan harga yang sangat terjangkau.
              <br>
              Fitur :
              <ul>
                <li>RAB Generated Excel</li>
                <li>Management project (coming soon)</li>
                <li>Group project (coming soon) </li>
              </ul>
            </p>
          </div>
        </div>
        <div class="form-side">
          <router-link to="/">
            <b-img src="./../../assets/logos/rencanakan-logo-min.png" style="max-width: 250px" class="mb-5" fluid>
            </b-img>
            <!-- <span class="logo-single" /> -->
          </router-link>
          <h6 class="mb-4">{{ $t('user.login-title') }}</h6>

          <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
            <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
              <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" autocomplete="off" />
              <b-form-invalid-feedback v-if="!$v.form.email.required">
                Masukkan email anda
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!$v.form.email.email">
                Masukkan email anda yang valid
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="!$v.form.email.minLength">Email anda minimum harus 4 karakter
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
              <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error" />
              <b-form-invalid-feedback v-if="!$v.form.password.required">Masukkan password anda
              </b-form-invalid-feedback>
              <b-form-invalid-feedback v-else-if="
                  !$v.form.password.minLength || !$v.form.password.maxLength
                ">Password minimal 4 karakter</b-form-invalid-feedback>
            </b-form-group>
            <div class="row">
              <div class="col-md-4">
                <router-link :to="{name: 'ForgotPassword'}">{{
                  $t('user.forgot-password-question')
                }}</router-link>
              </div>
              <div class="col-md-8 text-center text-sm-right mt-4 mt-sm-0">
                <router-link :to="{ name: 'Register' }" class="mr-3 register-bt text-primary">
                  {{ $t('user.register-button') }}
                </router-link>
                <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{
                    'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError === false,
                    'show-fail': !processing && loginError,
                  }">
                  <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                  </span>
                  <span class="icon success">
                    <i class="simple-icon-check"></i>
                  </span>
                  <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                  </span>
                  <span class="label">{{ $t('user.login-button') }}</span>
                </b-button>
              </div>
            </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
    <a
      class="whatsapp-button"
      href="https://wa.me/081936000388"
      target="_blank"
    >
      <WhatsappIcon class="whatsapp-icon"/>
    </a>
  </b-row>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  import {
    validationMixin
  } from 'vuelidate';
  const {
    required,
    maxLength,
    minLength,
    email,
  } = require('vuelidate/lib/validators');
  import { WhatsappIcon } from '@/components/Svg'

  export default {
    components: {
      WhatsappIcon
    },
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
      };
    },
    mixins: [validationMixin],
    validations: {
      form: {
        password: {
          required,
          maxLength: maxLength(16),
          minLength: minLength(4),
        },
        email: {
          required,
          email,
          minLength: minLength(4),
        },
      },
    },
    computed: {
      ...mapGetters(['currentUser', 'processing', 'loginError']),
    },
    methods: {
      ...mapActions(['login', 'getTutorialLists']),
      async formSubmit() {
        try {
          this.$v.$touch();
          this.$v.form.$touch();
          if (this.form.email && this.form.password) {
            const data = await this.login({
              email: this.form.email,
              password: this.form.password,
            });
            await this.getTutorialLists()
            this.$router.replace({
              name: 'Project',
            });
          }
        } catch (err) {
          console.error(err.response);
          this.$notify(
            'error',
            'Login Failed',
            err.response.data.message, {
              duration: 3000,
              permanent: false,
            }
          );
        }
      },
    },
    watch: {
      currentUser(val) {
        if (val && val.uid && val.uid.length > 0) {
          this.$router.push({
            name: 'Project',
          });
        }
      },
      loginError(val) {
        if (val != null) {
          this.$notify('error', 'Login Error', val, {
            duration: 3000,
            permanent: false,
          });
        }
      },
    },
  };
</script>

<style scoped>
  .register-bt {
    font-size: 14px !important;
  }

  .whatsapp-button {
    display: flex;
    position: fixed;
    bottom: 48px;
    right: 48px;
    z-index: 999;
    width: 64px;
    height: 64px;
    background-color: #3ec04f;
    border: 0;
    border-radius: 74px;
  }

  .whatsapp-icon {
    margin: auto;
    width: 42px;
    height: 42px
  }

  @media only screen and (max-width: 600px) {
    .whatsapp-button {
      right: 24px;
      bottom: 24px;
    }
  }
</style>