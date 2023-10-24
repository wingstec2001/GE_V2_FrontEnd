<template>
  <v-card>
    <v-card-title>ペレット-編集</v-card-title>
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
            <label for="product_id">ペレットID<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="12"
            md="5"
          >
            <v-text-field
              id="product_id"
              v-model="$v.ProductEditForm.product_id.$model"
              outlined
              hide-details="auto"
              dense
              disabled
              placeholder="ペレットID"
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
            <label for="product_name">ペレット名<span style="color: red">*</span></label>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              id="product_name"
              v-model="$v.ProductEditForm.product_name.$model"
              outlined
              hide-details="auto"
              dense
              placeholder="ペレット名"
              :error-messages="nameErrors"
              :counter="100"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <label for="description">説明</label>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-textarea
              v-model="$v.ProductEditForm.product_description.$model"
              name="note"
              hide-details="auto"
              outlined
              dense
              placeholder="説明"
              :error-messages="descriptionErrors"
              :counter="100"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            cols="12"
            md="2"
          >
            <label for="note">元イメージ</label>
          </v-col>
          <v-col
            cols="12"
            md="1"
          >
          </v-col>
          <v-col
            cols="12"
            md="5"
          >
            <v-img
              :src="ProductEditForm.product_img ? ProductEditForm.product_img : require('@/assets/images/noimage.jpg')"
              width="120px"
              height="90px"
              contain
            ></v-img>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            cols="12"
            md="2"
          >
            <label for="note">イメージ</label>
          </v-col>
          <v-col
            cols="12"
            md="5"
          >
            <v-file-input
              v-model="product_img"
              filled
              :prepend-icon="icon.mdiCameraOutline"
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
        <v-row>
          <v-col
            offset-md="5"
            cols="12"
          >
            <v-btn
              color="primary"
              :loading="submitStatus"
              @click="submit(ProductEditForm)"
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
import { mdiCameraOutline } from '@mdi/js'
import { mapState, mapActions, mapMutations } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    url: null,
    submitStatus: false,
    icon: {
      mdiCameraOutline,
    },
    OriginalForm: {},
    product_img: null,
    ProductEditForm: {
      product_id: '',
      product_name: '',
      product_description: '',
      product_img: '',
    },
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    ProductEditForm: {
      product_id: {
        required,
        maxLength: maxLength(20),
      },
      product_name: {
        required,
        maxLength: maxLength(100),
      },
      product_description: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    ...mapState('productStore', ['selectedProduct']),
    idErrors() {
      const errors = []
      if (!this.$v.ProductEditForm.product_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductEditForm.product_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductEditForm.product_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.ProductEditForm.product_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductEditForm.product_name.maxLength && errors.push('Name must be at most 100 characters long')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductEditForm.product_name.required && errors.push('必須項目')

      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.ProductEditForm.product_description.$dirty) return errors
      /* eslint-disable */
      !this.$v.ProductEditForm.product_description.maxLength &&
        errors.push('100文字以内にして下さい。')
      /* eslint-disable */
      return errors
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('productStore', ['loadProduct', 'editProduct']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadProduct(this.$route.params.id)
        .then(() => {
          this.ProductEditForm = this.selectedProduct
          this.OriginalForm = JSON.stringify(this.ProductEditForm)
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
     
      if (this.OriginalForm !== JSON.stringify(this.ProductEditForm) || this.product_img !== null) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    jumpToListPage() {
      this.$router.push({ path: '/productmaster-list', query: this.$route.params.query ?? {} })
    },
    Preview_image() {
      console.log(this.product_img)
      console.log('ProductEditForm null')
      if (this.product_img) {
        this.url = URL.createObjectURL(this.product_img)
      } else {
        this.url = ''
      }
    },
    submit(ProductEditForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
     
        const product = { ...ProductEditForm }
   
        product.product_img = this.product_img
        this.editProduct(product)
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
        console.log('error submit!!')
      }
    },
  },
}
</script>
