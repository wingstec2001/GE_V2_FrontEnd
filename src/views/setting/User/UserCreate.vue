<template>
  <v-card>
    <v-card-title>ユーザー-新規</v-card-title>
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
                v-model="$v.UserForm.name.$model"
                outlined
                hide-details="auto"
                dense
                placeholder="ユーザー名"
                :error-messages="nameErrors"
                :counter="50"
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
              <label for="password">パスワード<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="password"
                v-model="$v.UserForm.password.$model"
                :append-icon="value ? icons.mdiEyeOutline : icons.mdiEyeOffOutline"
                :type="value ? 'password' : 'text'"
                :error-messages="passwordErrors"
                hide-details="auto"
                outlined
                dense
                placeholder="パスワード"
                @click:append="() => (value = !value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="confirm-password">パスワード(確認用)<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="confirm-password"
                v-model="$v.UserForm.confirm_password.$model"
                :append-icon="value1 ? icons.mdiEyeOutline : icons.mdiEyeOffOutline"
                :type="value1 ? 'password' : 'text'"
                :error-messages="confirmpasswordErrors"
                hide-details="auto"
                outlined
                dense
                placeholder="パスワード(確認用)"
                @click:append="() => (value1 = !value1)"
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
                :items="role"
                :error-messages="rolesErrors"
                hide-details="auto"
                outlined
                dense
                placeholder="権限"
              ></v-select>
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
import { mapActions, mapState } from 'vuex'
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

import {
  required,
  maxLength,
  minLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    changeFlag: false,
    value: String,
    value1: String,
    icons: { mdiEyeOutline, mdiEyeOffOutline },
    role: ['Stuff', 'Admin', 'Super-Admin'],
    UserForm: {
      name: '',
      email: '',
      password: '',
      roles: '',
      confirm_password: '',
      invalid: 0,
    },

    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  created() {
    this.loadCreateUserInfo().then(() => {
      this.role = this.createUserInfo
    })
  },

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
      password: {
        required,
        minLength: minLength(6),
      },

      confirm_password: {
        required,
        sameAs: sameAs('password'),
      },
      roles: {
        required,
      },
    },
  },
  computed: {
    ...mapState('userStore', ['createUserInfo']),

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
    passwordErrors() {
      const errors = []
      if (!this.$v.UserForm.password.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.password.minLength && errors.push('パスワードは6文字以上でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.password.required && errors.push('必須項目')

      return errors
    },

    confirmpasswordErrors() {
      const errors = []
      if (!this.$v.UserForm.confirm_password.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.confirm_password.sameAs && errors.push('パスワードが一致しません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.UserForm.confirm_password.required && errors.push('必須項目')

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
  watch: {
    UserForm: {
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
      this.$router.push({ path: '/user-list', query: this.$route.params.query ?? {} })
    },
    submit(UserForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.createUser(UserForm)
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
        console.log('error submit!!', this.$v)
      }
    },
    ...mapActions('userStore', ['createUser', 'loadCreateUserInfo']),
  },
}
</script>

<style scoped>
</style>
