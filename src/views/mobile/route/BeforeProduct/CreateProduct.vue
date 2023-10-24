<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
      @click="open()"
    >
      <v-icon size="22">
        {{ icon }}
      </v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">新規-ルーターID </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <label
                  for="p_date"
                  class="text-h7"
                >生産時間</label>
              </v-col>
              <v-col cols="4">
                <label
                  for="produced_date"
                  class="text-h7"
                >{{ time }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <label
                  for="p_date"
                  class="text-h7"
                >ルーターID</label>
              </v-col>
              <v-col cols="4">
                <label
                  for="route_id"
                  class="text-h7"
                >{{ routeNo }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                  ref="country"
                  v-model="$v.ProductionForm.product_id.$model"
                  :items="productIds"
                  label="ペレットID*"
                  :error-messages="idErrors"
                  placeholder="Select..."
                  required
                ></v-select>
              </v-col>

              <v-col cols="12">
                <WeightInput
                  v-model="ProductionForm.plan_weight"
                  label="生産量*"
                  :outlined="false"
                  :error-messages="weightErrors"
                ></WeightInput>
              </v-col>
            </v-row>
          </v-container>
          <!-- <small>*indicates required field</small> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="submitStatus"
            @click="submit(ProductionForm)"
          >
            YES
          </v-btn>
          <v-btn
            color="error"
            @click="close()"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiCalendar } from '@mdi/js'
import { mapActions, mapState } from 'vuex'
import { required, numeric } from 'vuelidate/lib/validators'
import { format } from 'date-fns'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  props: ['icon', 'routeNo'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    submitStatus: false,
    dialog: false,
    time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 16),
    ProductionForm: {
      plan_weight: 0,
      product_id: '',
      route_id: '',
    },
  }),
  validations: {
    ProductionForm: {
      product_id: {
        required,
      },
      plan_weight: {
        numeric,
        required,
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('productionStore', ['selectedProduction']),
    product_name() {
      if (this.productMaster) {
        const productKey = this.ProductionForm.product_id

        return this.productMaster[productKey]
      }

      return ''
    },
    idErrors() {
      const errors = []
      if (!this.$v.ProductionForm.product_id.$dirty) return errors

      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.product_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.ProductionForm.plan_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.plan_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.plan_weight.numeric && errors.push('必須数字')

      return errors
    },
  },
  watch: {
    routeNo(val) {
      this.ProductionForm.route_id = val
    },
  },
  created() {
    this.loadProductIds()
  },
  mounted() {
    this.ProductionForm.route_id = this.routeNo
  },
  methods: {
    focus(event) {
      event.currentTarget.select()
    },
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionplanStore', ['loadProductionPlans', 'createProductionPlan']),

    submit(ProductionForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        // const now = new Date()
        this.ProductionForm.plan_date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString()
        this.createProductionPlan(ProductionForm)
          .then(() => {
            this.submitStatus = false

            // this.loadProductionPlans({ route_id: this.ProductionForm.route_id })
            this.loadProductionPlans({ route_id: this.ProductionForm.route_id, date: format(new Date(), 'yyyy-MM-dd') })
            this.close()
          })
          .catch(error => {
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)
          })
      } else {
        console.log('error submit!!')
      }
    },
    clearForm() {
      this.ProductionForm = {
        plan_date: '',
        plan_weight: '',
        product_id: '',
        route_id: '',
      }
    },
    open() {
      this.time = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 16)
    },
    close() {
      this.dialog = false

      // this.clearForm()
      this.$v.ProductionForm.$reset()
    },
  },
}
</script>
