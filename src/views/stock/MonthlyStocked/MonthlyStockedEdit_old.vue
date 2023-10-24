<template>
  <v-card>
    <v-card-title>月末繰越-編集V2</v-card-title>
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
          cols="12"
          md="2"
        >
          <label
            class="text-h6"
            for="actual_date"
          >対象年月</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <label
            class="text-h6"
            for="actual_date"
          >{{ $route.params.month.substring(0, 4) }}年{{ $route.params.month.substring(4, 6) }}月</label>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="product_id">ペレットID<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <label for="product_id">{{ getsujiInfo.product_id }}</label>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="material_weight">未粉砕重量<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <WeightInput
            v-model="getsujiInfo.material_weight"
            :outlined="true"
            :error-messages="materialWeightErrors"
          ></WeightInput>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="crushed_weight">粉砕済重量<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <WeightInput
            v-model="getsujiInfo.crushed_weight"
            :outlined="true"
            :error-messages="crushedWeightErrors"
          ></WeightInput>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="product_weight">ペレット重量<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <WeightInput
            v-model="getsujiInfo.product_weight"
            :outlined="true"
            :error-messages="productWeightErrors"
          ></WeightInput>
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
            @click="submit(getsujiInfo)"
          >
            Submit
          </v-btn>
          <v-btn
            type="reset"
            class="mx-2"
            outlined
            @click="comeBack"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mdiPlus, mdiPencil, mdiMinusCircle } from '@mdi/js'
import { required, decimal } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    id: '',
    icons: {
      mdiPlus,
      mdiPencil,
      mdiMinusCircle,
    },
    getsujiInfo: {
      product_id: '',
      material_weight: '',
      crushed_weight: '',
      product_weight: '',
    },
    submitStatus: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  validations: {
    getsujiInfo: {
      product_id: {
        required,
      },
      material_weight: {
        decimal,
        required,
      },
      crushed_weight: {
        decimal,
        required,
      },
      product_weight: {
        decimal,
        required,
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productIds']),
    ...mapState('getsujiInfoStore', ['selProMonthlyInfo']),
    materialWeightErrors() {
      const errors = []
      if (!this.$v.getsujiInfo.material_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.material_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.material_weight.decimal && errors.push('必須数字')

      return errors
    },
    crushedWeightErrors() {
      const errors = []
      if (!this.$v.getsujiInfo.crushed_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.crushed_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.crushed_weight.decimal && errors.push('必須数字')

      return errors
    },
    productWeightErrors() {
      const errors = []
      if (!this.$v.getsujiInfo.product_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.product_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.getsujiInfo.product_weight.decimal && errors.push('必須数字')

      return errors
    },
  },
  created() {
    this.loadProductIds()
    this.loadProdMonthlyInfo(this.$route.params.id).then(() => {
      this.getsujiInfo = { ...this.selProMonthlyInfo }
    })
  },
  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('getsujiInfoStore', ['loadProdMonthlyInfo', 'editProdMonthlyInfo']),
    submit(getsujiInfo) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editProdMonthlyInfo(getsujiInfo)
          .then(() => {
            this.submitStatus = false
            this.comeBack()
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
    comeBack() {
      if (this.$route.query.originalPage === 'monthlystocked-list') {
        this.$router.push({ name: 'monthlystocked-list', params: { month: this.$route.params.month } })
      }
      if (this.$route.query.originalPage === 'perettogetsujiinfo') {
        this.$router.push({
          name: 'perettogetsujiinfo',
          params: { id: this.getsujiInfo.product_id },
          query: { month: this.$route.query.month },
        })
      }
    },
  },
}
</script>
<style scoped>
.v-card {
  border: 1px solid #ccc;
}
</style>
