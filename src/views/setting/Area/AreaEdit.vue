<template>
  <v-card>
    <v-card-title>都市-編集</v-card-title>
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
              v-model="$v.AreaEditForm.area_id.$model"
              outlined
              hide-details="auto"
              dense
              disabled
              placeholder="都市ID(上海：SH)"
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
            <label for="areaName">都市名<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              id="area_name"
              v-model="$v.AreaEditForm.area_name.$model"
              :error-messages="nameErrors"
              :counter="40"
              hide-details="auto"
              outlined
              dense
              placeholder="都市名"
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
              @click="submit(AreaEditForm)"
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
  </v-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    AreaEditForm: {
      area_id: '',
      area_name: '',
    },
    OriginalForm: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  validations: {
    AreaEditForm: {
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
      if (!this.$v.AreaEditForm.area_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaEditForm.area_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaEditForm.area_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.AreaEditForm.area_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaEditForm.area_name.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.AreaEditForm.area_name.required && errors.push('必須項目')

      return errors
    },
    ...mapState('areaStore', ['selectedArea']),
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('areaStore', ['loadArea', 'editArea']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadArea(this.$route.params.id)
        .then(() => {
          this.AreaEditForm = this.selectedArea
          this.OriginalForm = JSON.stringify(this.AreaEditForm)
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
        })
    },
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.AreaEditForm)) {
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

    submit(AreaEditForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editArea(AreaEditForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)
            console.log('apierror', this.apierror)
          })
      } else {
        console.log('error submit!!')
      }
    },
  },
}
</script>
