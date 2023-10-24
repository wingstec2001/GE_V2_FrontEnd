<template>
  <v-card>
    <v-card-title>社員-新規</v-card-title>
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
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="employee_id">社員ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="employee_id"
                v-model="$v.EmployeeForm.employee_id.$model"
                :error-messages="idErrors"
                outlined
                dense
                placeholder="社員ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="employee_sei">社員姓名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="employee_sei"
                v-model="$v.EmployeeForm.employee_sei.$model"
                :error-messages="seiErrors"
                outlined
                dense
                placeholder="社員姓（佐藤）"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="employee_mei"
                v-model="$v.EmployeeForm.employee_mei.$model"
                :error-messages="meiErrors"
                outlined
                dense
                placeholder="社員名（一郎）"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="employee_sei">社員姓名(カナ)<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="employee_sei"
                v-model="$v.EmployeeForm.employee_seikn.$model"
                :error-messages="seiknErrors"
                outlined
                dense
                placeholder="社員姓（サトウ）"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="employee_mei"
                v-model="$v.EmployeeForm.employee_meikn.$model"
                :error-messages="meiknErrors"
                outlined
                dense
                placeholder="社員名（イチロウ）"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="employee_birth">生年月日</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="EmployeeForm.employee_birth"
                    placeholder="生年月日"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    clearable
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="EmployeeForm.employee_birth"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="gender">性別<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="$v.EmployeeForm.gender.$model"
                :items="gender"
                :error-messages="genderErrors"
                outlined
                clearable
                dense
                placeholder="性別"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="mobile">電話番号</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="mobile"
                v-model="$v.EmployeeForm.mobile.$model"
                :error-messages="mobileErrors"
                outlined
                dense
                placeholder="電話番号"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="address">住所</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="address"
                v-model="EmployeeForm.address"
                outlined
                dense
                placeholder="住所"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="jobtitle">役職<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="jobtitle"
                v-model="$v.EmployeeForm.jobtitle.$model"
                :error-messages="jobtitleErrors"
                outlined
                dense
                placeholder="役職"
                hide-details="auto"
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
                @click="submit(EmployeeForm)"
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
import { required, numeric } from 'vuelidate/lib/validators'

import { mapActions } from 'vuex'

export default {
  data: () => ({
    submitStatus: false,
    changeFlag: false,
    menu: false,
    gender: [
      { text: '男', value: 0 },
      { text: '女', value: 1 },
    ],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    EmployeeForm: {
      employee_id: '',
      employee_sei: '',
      employee_mei: '',
      employee_seikn: '',
      employee_meikn: '',
      employee_birth: '',
      gender: '',
      mobile: '',
      address: '',
      jobtitle: '',
    },
  }),
  validations: {
    EmployeeForm: {
      employee_id: {
        required,
      },
      employee_sei: {
        required,
      },
      employee_mei: {
        required,
      },
      mobile: {
        numeric,
      },
      jobtitle: {
        required,
      },
      gender: {
        required,
      },
      employee_seikn: {
        required,
      },
      employee_meikn: {
        required,
      },
    },
  },

  computed: {
    idErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.employee_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.employee_id.required && errors.push('必須項目')

      return errors
    },
    seiErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.employee_sei.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.employee_sei.required && errors.push('必須項目')

      return errors
    },
    meiErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.employee_mei.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.employee_mei.required && errors.push('必須項目')

      return errors
    },
    seiknErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.employee_seikn.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.employee_seikn.required && errors.push('必須項目')

      return errors
    },
    meiknErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.employee_meikn.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.employee_meikn.required && errors.push('必須項目')

      return errors
    },
    mobileErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.mobile.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.mobile.numeric && errors.push('必須数字')

      return errors
    },
    jobtitleErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.jobtitle.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.jobtitle.required && errors.push('必須項目')

      return errors
    },
    genderErrors() {
      const errors = []
      if (!this.$v.EmployeeForm.gender.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.EmployeeForm.gender.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    EmployeeForm: {
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
      this.$router.push({ path: '/employee-list', query: this.$route.params.query ?? {} })
    },
    submit(EmployeeForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.createEmployee(EmployeeForm)
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
    ...mapActions('employeeStore', ['createEmployee']),
  },
}
</script>
