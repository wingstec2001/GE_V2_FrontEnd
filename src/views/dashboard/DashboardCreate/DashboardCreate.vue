<template>
  <v-card>
    <v-card-title>Dashboard-新規</v-card-title>
    <template>
      <v-spacer></v-spacer>
      <template v-if="apierror.status=='error'">
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
          <label for="location">タイトル<span style="color:red">*</span></label>
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
          <label for="fontsize">フォントサイズ<span style="color:red">*</span></label>
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
          <label for="fontcolor">フォント色<span style="color:red">*</span></label>
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
            v-model="DashboardForm.dashboard_image"
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
          <label for="dashboard_text">内容<span style="color:red">*</span></label>
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
            @click="submit(DashboardForm)"
          >
            Submit
          </v-btn>
          <v-btn
            type="reset"
            class="mx-2"
            outlined
            :to="{ name: 'dashboard-list' }"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mdiPlus, mdiCameraOutline, mdiMinusCircle } from '@mdi/js'
import {
  required, maxLength,
} from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  data: () => ({
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
    fontcolors: [
      { text: '黒', value: 0 },
      { text: '赤', value: 1 },
      { text: '藍', value: 2 },
      { text: '緑', value: 3 },
      { text: '黄', value: 4 },
      { text: '青', value: 5 },
    ],
    DashboardForm: {
      dashboard_image: null,
      dashboard_title: '',
      text: '',
      fontsize: '',
      fontcolor: '',
    },
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
      !this.$v.DashboardForm.text.maxLength && errors.push('100文字以内にしてください。')
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
    ...mapActions('dashboardStore', ['createDashborad']),
    Preview_image() {
      if (this.DashboardForm.dashboard_image) {
        this.url = URL.createObjectURL(this.DashboardForm.dashboard_image)
      } else {
        this.url = ''
      }
    },
    submit(DashboardForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const submitForm = { ...DashboardForm }
        if (submitForm.dashboard_image === null) {
          submitForm.dashboard_image = ''
        }

        this.createDashborad(submitForm).then(() => {
          this.$router.push({ path: '/dashboard-list' })
        }).catch(error => {
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
  },
}
</script>
<style scoped>
.v-card {
  border: 1px solid #ccc;
}
</style>
