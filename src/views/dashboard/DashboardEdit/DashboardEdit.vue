<template>
  <div>
    <v-card>
      <v-card-title>Dashboard-編集</v-card-title>
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
      </template>
      <v-spacer></v-spacer>
      <v-form class="ma-6">
        <v-row align="center">
          <v-col
            cols="4"
            md="2"
            sm="2"
          >
            <label for="location">タイトル<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="8"
            md="4"
            sm="4"
          >
            <v-text-field
              v-model="$v.DashboardForm.dashboard_title.$model"
              :error-messages="dbdTitleErrors"
              hide-details
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            cols="4"
            md="2"
            sm="2"
          >
            <label for="fontsize">フォントサイズ<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="8"
            md="4"
            sm="4"
          >
            <v-select
              v-model="$v.DashboardForm.fontsize.$model"
              :error-messages="fontsizeErrors"
              :items="fontsizes"
              hide-details
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            cols="4"
            md="2"
            sm="2"
          >
            <label for="fontcolor">フォント色<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="8"
            md="4"
            sm="4"
          >
            <v-select
              v-model="$v.DashboardForm.fontcolor.$model"
              :error-messages="fontcolorErrors"
              :items="fontcolors"
              hide-details
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            cols="4"
            md="2"
            sm="2"
          >
            <label for="dashboard_image">イメージ</label>
          </v-col>
          <v-col
            cols="8"
            md="4"
            sm="4"
          >
            <v-file-input
              v-model="dashboard_image"
              filled
              :prepend-icon="icons.mdiCameraOutline"
              hide-details
              @change="Preview_image"
            ></v-file-input>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="6"
          >
            <v-img
              :src="url"
              width="120px"
              height="90px"
              contain
            ></v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <label for="dashboard_text">内容<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-textarea
              v-model="$v.DashboardForm.text.$model"
              name="dashboard_text"
              outlined
              dense
              placeholder="内容"
              :error-messages="dashboardTextErrors"
              hide-details="auto"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            offset-md="5"
            cols="12"
          >
            <v-btn
              color="primary"
              :loading="submitStatus"
              @click="submit(DashboardForm)"
            >
              Submit
            </v-btn>
            <v-btn
              type="reset"
              class="mx-2"
              outlined
              @click="cancelClick"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mdiPlus, mdiCameraOutline, mdiMinusCircle } from '@mdi/js'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  data: () => ({
    submitStatus: false,
    url: null,
    icons: {
      mdiPlus,
      mdiCameraOutline,
      mdiMinusCircle,
    },
    fontsizes: [
      { text: '小', value: 0 },
      { text: '中', value: 1 },
      { text: '大', value: 2 },
    ],
    obj_fontsizes: { 0: '小', 1: '中', 2: '大' },
    fontcolors: [
      { text: '黒', value: 0 },
      { text: '赤', value: 1 },
      { text: '藍', value: 2 },
      { text: '緑', value: 3 },
      { text: '黄', value: 4 },
      { text: '青', value: 5 },
    ],
    obj_fontcolors: {
      0: '黒',
      1: '赤',
      2: '藍',
      3: '緑',
      4: '黄',
      5: '青',
    },
    dashboard_image: '',
    OriginalForm: {},
    DashboardForm: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  validations: {
    DashboardForm: {
      dashboard_title: {
        required,
      },
      fontsize: {
        required,
      },
      fontcolor: {
        required,
      },
      text: {
        required,
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    ...mapState('dashboardStore', ['selectedDashboard']),
    dbdTitleErrors() {
      const errors = []
      if (!this.$v.DashboardForm.dashboard_title.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.DashboardForm.dashboard_title.required && errors.push('必須項目')

      return errors
    },
    dashboardTextErrors() {
      const errors = []
      if (!this.$v.DashboardForm.text.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.DashboardForm.text.maxLength && errors.push('Name must be at most 100 characters long')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.DashboardForm.text.required && errors.push('必須項目')

      return errors
    },
    fontsizeErrors() {
      const errors = []
      if (!this.$v.DashboardForm.fontsize.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.DashboardForm.fontsize.required && errors.push('必須項目')

      return errors
    },
    fontcolorErrors() {
      const errors = []
      if (!this.$v.DashboardForm.fontcolor.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.DashboardForm.fontcolor.required && errors.push('必須項目')

      return errors
    },
  },
  methods: {
    ...mapActions('dashboardStore', ['loadDashboard', 'editDashborad']),
    ...mapMutations('app', ['setOverlayStatus']),
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.DashboardForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.$router.push({ path: '/dashboard-list' })
        }

        return
      }

      this.$router.push({ path: '/dashboard-list' })
    },
    Preview_image() {
      if (this.dashboard_image) {
        this.url = URL.createObjectURL(this.dashboard_image)
      } else {
        this.url = ''
      }
    },
    loadData() {
      this.setOverlayStatus(true)
      this.loadDashboard(this.$route.params.id)
        .then(() => {
          this.DashboardForm = { ...this.selectedDashboard }
          this.OriginalForm = JSON.stringify(this.DashboardForm)
          this.url = this.selectedDashboard.dashboard_image
          this.dashboard_image = this.selectedDashboard.dashboard_image
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.submitStatus = false

          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages = error.response.data.message
          this.setOverlayStatus(false)
        })
    },
    submit(DashboardForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...DashboardForm }
        if (this.dashboard_image === this.selectedDashboard.dashboard_image) {
          submitForm.dashboard_image = null
        } else {
          submitForm.dashboard_image = this.dashboard_image
        }

        this.editDashborad(submitForm)
          .then(() => {
            this.submitStatus = false
            this.$router.push({ path: '/dashboard-list' })
          })
          .catch(error => {
            this.submitStatus = false

            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)
          })
      } else {
        console.log('error submit!!')
      }
    },
  },
  created() {
    this.loadData()
  },
}
</script>
<style scoped>
.v-card {
  border: 1px solid #ccc;
}
</style>
