<template>
  <v-card>
    <v-card-title>ユーザーのパスワード-編集</v-card-title>
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
              <label for="password">パスワード<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="7"
            >
              <v-text-field
                id="password"
                v-model="$v.password.$model"
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
                v-model="$v.confirm_password.$model"
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

          <v-row align="center">
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit()"
              >
                Submit
              </v-btn>
              <v-btn
                class="mx-2"
                outlined
                :to="{ name: 'user-list' }"
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

import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    value: String,
    value1: String,
    icons: { mdiEyeOutline, mdiEyeOffOutline },
    UserForm: {
      id: '',
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      roles: '',
    },

    password: '',
    confirm_password: '',
    oriUser: {
      id: '',
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      roles: '',
    },
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    password: {
      required,
      minLength: minLength(6),
    },

    confirm_password: {
      required,
      sameAs: sameAs('password'),
    },
  },

  computed: {
    ...mapState('userStore', ['selectedUser']),
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.password.minLength && errors.push('パスワードは6文字以上でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.password.required && errors.push('必須項目')

      return errors
    },

    confirmpasswordErrors() {
      const errors = []
      if (!this.$v.confirm_password.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.confirm_password.sameAs && errors.push('パスワードが一致しません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.confirm_password.required && errors.push('必須項目')

      return errors
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadUser(this.$route.params.id)
        .then(() => {
          this.oriUser = this.selectedUser
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
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.UserForm.id = this.oriUser.id
        this.UserForm.name = this.oriUser.name
        this.UserForm.email = this.oriUser.email
        this.UserForm.password = this.password
        this.UserForm.confirm_password = this.confirm_password
        this.UserForm.roles = this.oriUser.roles
        this.editUser(this.UserForm)
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
    ...mapActions('userStore', ['editUser', 'loadUser']),
  },
}
</script>

<style scoped>
</style>
