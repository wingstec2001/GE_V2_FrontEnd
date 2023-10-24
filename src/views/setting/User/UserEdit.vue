<template>
  <v-card>
    <v-card-title>ユーザー-編集</v-card-title>
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
              <label for="name">ユーザー名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="name"
                v-model="$v.UserForm.name.$model"
                outlined
                hide-details="auto"
                dense
                disabled
                placeholder="ユーザー名"
                :error-messages="nameErrors"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="email">メールアドレス<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="email"
                v-model="$v.UserForm.email.$model"
                :error-messages="emailErrors"
                hide-details="auto"
                outlined
                dense
                placeholder="メールアドレス"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="roles">権限<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                id="roles"
                v-model="$v.UserForm.roles.$model"
                :items="selectdRoles"
                :error-messages="rolesErrors"
                hide-details="auto"
                outlined
                dense
                placeholder="権限"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="invalid">無効</label>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-checkbox
                id="invalid"
                v-model="UserForm.invalid"
                hide-details
                outlined
                dense
              ></v-checkbox>
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
                @click="submit(UserForm)"
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
import { mapState, mapActions, mapMutations } from 'vuex'
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

import {
  required,
  maxLength,
  minLength,
  email,
} from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    icons: { mdiEyeOutline, mdiEyeOffOutline },
    selectdRoles: ['Stuff', 'Admin', 'Super-Admin'],
    UserForm: {
      name: '',
      email: '',
      password: '',
      roles: '',
      confirm_password: '',
      invalid: '',
    },
    OriginalForm: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    UserForm: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50),
      },
      email: {
        required,
        email,
      },
      roles: {
        required,
      },
    },
  },

  computed: {
    ...mapState('userStore', ['selectedUser', 'updatedRoleInfo']),
    nameErrors() {
      const errors = []
      if (!this.$v.UserForm.name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.name.minLength && errors.push('ユーザー名は2文字以上でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.name.maxLength && errors.push('ユーザー名は50文字以下でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.name.required && errors.push('必須項目')

      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.UserForm.email.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.email.email && errors.push('正しくメールアドレスを入力してください。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.email.required && errors.push('必須項目')

      return errors
    },

    rolesErrors() {
      const errors = []
      if (!this.$v.UserForm.roles.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.roles.required && errors.push('必須項目')

      return errors
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('userStore', ['editUser', 'loadUser', 'loadUpdateUserInfo']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadUpdateUserInfo(this.$route.params.id)
        .then(() => {
          this.UserForm = this.updatedRoleInfo
          this.selectdRoles = this.updatedRoleInfo.roles
          const [role] = this.updatedRoleInfo.userRoles
          this.UserForm.roles = role
          this.OriginalForm = JSON.stringify(this.UserForm)
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
        })
    },
    jumpToListPage() {
      this.$router.push({ path: '/user-list', query: this.$route.params.query ?? {} })
    },
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.UserForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    submit(UserForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editUser(UserForm)
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
  },
}
</script>

<style scoped>
</style>
