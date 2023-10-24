<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link
            to="/"
            class="d-flex align-center"
          >
            <v-img
              :src="require('@/assets/images/logos/earth.png')"
              max-height="30px"
              max-width="30px"
              alt="logo"
              contain
              class="me-3 "
            ></v-img>

            <h2 class="text-2xl font-weight-semibold">
              GreenEarth
            </h2>
          </router-link>
        </v-card-title>

        <v-card-text class="my-7">
          <v-alert
            v-show="errorMessages"
            color="red"
            dense
            type="error"
          >
            {{ errorMessages }}
          </v-alert>
          <v-form
            ref="loginForm"
            @submit.prevent="handleFormSubmit"
          >
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              placeholder="Email"
              :error-messages="errorMessages.email"
              :rules="[validators.required, validators.emailValidator]"
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="password"
              autocomplete="current-password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Password"
              :error-messages="errorMessages.password"
              placeholder="Password"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              :rules="[validators.required]"
              hide-details="auto"
              class="mb-2"
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <v-checkbox
                label="Remember Me"
                hide-details
                class="me-3 mt-1"
              >
              </v-checkbox>
            </div>

            <v-btn
              block
              type="submit"
              color="primary"
              class="mt-6"
              :loading="loading"
            >
              ログイン
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref, getCurrentInstance } from '@vue/composition-api'
import { required, emailValidator } from '@/core/utils/validation'

import { useRouter } from '@/core/utils/index'
import agent from '../../api/agent'

export default {
  created() {
  },
  setup() {
    const loginForm = ref(null)
    const vm = getCurrentInstance().proxy
    const isPasswordVisible = ref(false)
    const email = ref('')
    const password = ref('')
    const errorMessages = ref('')
    const loading = ref(false)

    const { router } = useRouter()
    const handleFormSubmit = () => {
      errorMessages.value = ''

      const isFormValid = loginForm.value.validate()

      if (!isFormValid) return

      /*
        1. Make HTTP request to get accessToken
        2. Store received token in localStorage for future use
        3. Make another HTTP request for getting user information
        4. On successful response of user information redirect to home page

        ? We have use promise chaining to get user data from access token
        ? Promise Chaining: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining
      */
      loading.value = true
      agent.Auth
        .login({ email: email.value, password: password.value })
        .then(response => {
          const { accessToken } = response.data.data

          // ? Set access token in localStorage so axios interceptor can use it
          // Axios Interceptors: https://github.com/axios/axios#interceptors
          localStorage.setItem('accessToken', accessToken)

          return response
        })

        .then(() => {
          agent.Auth.authInfo().then(response => {
            const user = response.data.data
            const userAbility = []
            const { permissions: abilities } = user
            if (user.roles[0] === 'Super-Admin') {
              userAbility.push({
                subject: 'all', action: 'manage',
              })
            } else {
              abilities.forEach(ability => {
                const [subject, action] = ability.split('-')
                userAbility.push({
                  subject, action,
                })
              })
            }

            // Set user ability
            // ? https://casl.js.org/v5/en/guide/intro#update-rules
            vm.$ability.update(userAbility)

            // Set user's ability in localStorage for Access Control
            localStorage.setItem('userAbility', JSON.stringify(userAbility))

            // We will store `userAbility` in localStorage separate from userData
            // Hence, we are just removing it from user object
            delete user.permissions

            // Set user's data in localStorage for UI/Other purpose
            localStorage.setItem('userData', JSON.stringify(user))

            // On success redirect to home
            router.push('/')
          })
        })
        .catch(error => {
        // TODO: Next Update - Show notification
          console.error('Oops, Unable to login!')
          console.log('error :>> ', error.response)
          const { code, message } = error.response.data

          if (code === 400) {
            const msg = message[0]
            errorMessages.value = msg
          }
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      isPasswordVisible,
      handleFormSubmit,
      loading,
      email,
      password,
      errorMessages,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      validators: {
        required,
        emailValidator,
      },

      // Template Refs
      loginForm,
    }
  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
