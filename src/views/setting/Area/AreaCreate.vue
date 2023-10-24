<template>
  <v-card>
    <v-card-title>都市-新規</v-card-title>
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
              <label for="areaID">都市ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                id="area_id"
                v-model="$v.AreaForm.area_id.$model"
                outlined
                hide-details="auto"
                dense
                placeholder="都市ID(SH)"
                :error-messages="idErrors"
                :counter="10"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="Name">都市名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                id="county_name"
                v-model="$v.AreaForm.area_name.$model"
                :error-messages="nameErrors"
                :counter="40"
                hide-details="auto"
                outlined
                dense
                placeholder="都市名(上海)"
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
                @click="submit(AreaForm)"
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
    AreaForm: {
      area_id: '',
      area_name: '',
    },

    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    AreaForm: {
      area_id: {
        required,
        maxLength: maxLength(10),
      },
      area_name: {
        required,
        maxLength: maxLength(40),
      },
    },
  },
  computed: {
    idErrors() {
      const errors = []
      if (!this.$v.AreaForm.area_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaForm.area_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaForm.area_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.AreaForm.area_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaForm.area_name.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaForm.area_name.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    AreaForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  methods: {
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
    jumpToListPage() {
      this.$router.push({ path: '/area-list', query: this.$route.params.query ?? {} })
    },
    submit(AreaForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.createArea(AreaForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()

            console.log('addArea', AreaForm)
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
    ...mapActions('areaStore', ['createArea']),
  },
}
</script>

<style scoped>
</style>
