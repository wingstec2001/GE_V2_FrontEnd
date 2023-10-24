<template>
  <v-card>
    <v-card-title>権限-編集</v-card-title>
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
              <label for="name">権限名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="$v.RoleForm.name.$model"
                outlined
                hide-details="auto"
                dense
                placeholder="権限名"
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
              <label for="roles">権限<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="10"
            >
              <p>{{ selectedPermissions }}</p>
            </v-col>

            <v-col
              cols="12"
              md="10"
            >
              <v-row>
                <v-col
                  v-for="permission in permissions"
                  :key="permission"
                  cols="12"
                  md="3"
                >
                  <v-checkbox
                    v-model="selectedPermissions"
                    :label="permission"
                    :value="permission"
                  ></v-checkbox>
                </v-col>
              </v-row>
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
                @click="submit(RoleForm)"
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
import { mapActions, mapState, mapMutations } from 'vuex'
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    submitStatus: false,
    value: String,
    value1: String,
    icons: { mdiEyeOutline, mdiEyeOffOutline },
    role: ['Stuff', 'Admin', 'Super-Admin'],
    permissions: ['area-create', 'area-delete', 'area-read', 'area-update'],
    selectedPermissions: [],
    originalPermissions: [],
    RoleForm: {
      name: '',
      permissions: '',
    },
    OriginalForm: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    RoleForm: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50),
      },
    },
  },
  computed: {
    ...mapState('roleStore', ['updateRoleInfo']),
    nameErrors() {
      const errors = []
      if (!this.$v.RoleForm.name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.RoleForm.name.minLength && errors.push('ユーザー名は2文字以上でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.RoleForm.name.maxLength && errors.push('ユーザー名は50文字以下でなければなりません。')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.RoleForm.name.required && errors.push('必須項目')

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
      this.loadUpdateRoleInfo(this.$route.params.id)
        .then(() => {
          this.permissions = this.updateRoleInfo.permissions
          this.selectedPermissions = this.updateRoleInfo.rolePermissions
          this.RoleForm.name = this.updateRoleInfo.name
          this.RoleForm.id = this.updateRoleInfo.id
          this.OriginalForm = JSON.stringify(this.RoleForm)
          this.originalPermissions = JSON.stringify(this.updateRoleInfo.rolePermissions)
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
      this.$router.push({ path: '/role-list', query: this.$route.params.query ?? {} })
    },
    cancelClick() {
      if (
        this.OriginalForm !== JSON.stringify(this.RoleForm)
        || this.originalPermissions !== JSON.stringify(this.selectedPermissions)
      ) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },

    submit(RoleForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.RoleForm.permissions = this.selectedPermissions

        this.editRole(RoleForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)
          })
      } else {
        console.log('error submit!!', this.$v)
      }
    },
    ...mapActions('roleStore', ['editRole', 'loadUpdateRoleInfo']),
  },
}
</script>

<style scoped>
</style>
