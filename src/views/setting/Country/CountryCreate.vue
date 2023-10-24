<template>
  <v-card>
    <v-card-title>国・地域-新規</v-card-title>
    <template>
      <v-spacer></v-spacer>
      <template v-if="apierror.status == 'error'">
        <div
          v-for="msg of apierror.messages"
          :key="msg"
        >
          <v-row class="ml-6 mb-3 ma-3">
            <span style="color: red">* {{ msg }} </span>
          </v-row>
        </div>
      </template>
      <template>
        <v-spacer></v-spacer>
        <v-form class="ma-6">
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="countryID">国・地域ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                id="country_id"
                v-model="$v.CountryForm.country_id.$model"
                outlined
                hide-details="auto"
                dense
                placeholder="JPN"
                :error-messages="idErrors"
                :counter="3"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="Name">国・地域名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="country_name"
                v-model="$v.CountryForm.country_name.$model"
                :error-messages="nameErrors"
                :counter="40"
                hide-details="auto"
                outlined
                dense
                placeholder="日本"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label>国・地域名(ENG)<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="country_name"
                v-model="$v.CountryForm.country_name_eng.$model"
                :error-messages="nameengErrors"
                :counter="40"
                hide-details="auto"
                outlined
                dense
                placeholder="JAPAN"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="Name">国・地域番号<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="country_code"
                v-model="$v.CountryForm.country_code.$model"
                :error-messages="codeErrors"
                :counter="40"
                hide-details="auto"
                outlined
                dense
                placeholder="81"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit(CountryForm)"
              >
                Submit
              </v-btn>
              <v-btn
                class="mx-2"
                outlined
                @click="cancelClick"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    changeFlag: false,
    CountryForm: {
      country_id: '',
      country_name: '',
      country_name_eng: '',
      country_code: '',
    },

    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    CountryForm: {
      country_id: {
        required,
        maxLength: maxLength(3),
      },
      country_name: {
        required,
        maxLength: maxLength(40),
      },
      country_name_eng: {
        required,
        maxLength: maxLength(40),
      },
      country_code: {
        required,
        maxLength: maxLength(40),
      },
    },
  },
  computed: {
    idErrors() {
      const errors = []
      if (!this.$v.CountryForm.country_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.CountryForm.country_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_name.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_name.required && errors.push('必須項目')

      return errors
    },
    nameengErrors() {
      const errors = []
      if (!this.$v.CountryForm.country_name_eng.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_name_eng.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_name_eng.required && errors.push('必須項目')

      return errors
    },
    codeErrors() {
      const errors = []
      if (!this.$v.CountryForm.country_code.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_code.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CountryForm.country_code.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    CountryForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  methods: {
    jumpToListPage() {
      this.$router.push({ path: '/country-list', query: this.$route.params.query ?? {} })
    },
    cancelClick() {
      if (this.changeFlag) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },
    submit(CountryForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.createCountry(CountryForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false
            console.log(error.response.data)
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)
          })
      } else {
        console.log('error submit!!')
      }
    },
    ...mapActions('countryStore', ['createCountry']),
  },
}
</script>

<style scoped>
</style>
