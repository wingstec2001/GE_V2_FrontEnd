<template>
  <v-card>
    <v-card-title>材料-新規</v-card-title>
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
              <label for="materialID">材料ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-text-field
                id="material_id"
                v-model="$v.MaterialForm.material_id.$model"
                outlined
                hide-details="auto"
                dense
                placeholder="材料ID"
                :error-messages="idErrors"
                :counter="20"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="materialName">材料名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="material_name"
                v-model="$v.MaterialForm.material_name.$model"
                :error-messages="nameErrors"
                :counter="100"
                hide-details="auto"
                outlined
                dense
                placeholder="材料名"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="note">説明</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="$v.MaterialForm.material_note.$model"
                :error-messages="noteErrors"
                name="note"
                hide-details="auto"
                outlined
                :counter="100"
                dense
                placeholder="説明"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="img">イメージ</label>
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-file-input
                v-model="material_img"
                filled
                :prepend-icon="icons.mdiCameraOutline"
                hide-details
                @change="Preview_image"
              ></v-file-input>
            </v-col>
            <v-col
              cols="12"
              md="5"
            >
              <v-img
                :src="url"
                width="120px"
                height="90px"
                contain
              ></v-img>
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
                @click="submit(MaterialForm)"
              >
                Submit
              </v-btn>
              <v-btn
                class="mx-2"
                outlined
                :to="{ name: 'material-list' }"
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
import { mdiCameraOutline } from '@mdi/js'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    url: null,
    submitStatus: false,
    icons: {
      mdiCameraOutline,
    },
    material_img: null,
    MaterialForm: {
      material_id: '',
      material_name: '',
      material_note: '',
      material_img: '',
    },
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    MaterialForm: {
      material_id: {
        required,
        maxLength: maxLength(20),
      },
      material_name: {
        required,
        maxLength: maxLength(100),
      },
      material_note: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    idErrors() {
      const errors = []
      if (!this.$v.MaterialForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.MaterialForm.material_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.MaterialForm.material_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.MaterialForm.material_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.MaterialForm.material_name.maxLength && errors.push('Name must be at most 100 characters long')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.MaterialForm.material_name.required && errors.push('必須項目')

      return errors
    },
    noteErrors() {
      const errors = []
      if (!this.$v.MaterialForm.material_note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.MaterialForm.material_note.maxLength && errors.push('100文字以内にして下さい。')

      return errors
    },
  },
  methods: {
    Preview_image() {
      if (this.material_img) {
        this.url = URL.createObjectURL(this.material_img)
        this.MaterialForm.material_img = this.material_img
      } else {
        this.url = ''

        this.MaterialForm.material_img = ''
      }
    },
    submit(MaterialForm) {
      if (this.material_img == null) {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('イメージが空です。続行しますか')) {
          return
        }
      }
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.createMaterial(MaterialForm)
          .then(() => {
            this.submitStatus = false
            this.$router.push({ path: '/material-list' })
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
    ...mapActions('materialStore', ['createMaterial']),
  },
}
</script>

<style scoped>
</style>
