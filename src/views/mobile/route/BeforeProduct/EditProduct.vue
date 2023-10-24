<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
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
          <span class="text-h5">編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <label
                  for="p_date"
                  class="text-h6"
                >生産時間</label>
              </v-col>
              <v-col cols="6">
                <label
                  for="produced_date"
                  class="text-h6"
                >{{ item.plan_date }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label
                  for="p_date"
                  class="text-h6"
                >ルーターID</label>
              </v-col>
              <v-col cols="6">
                <label
                  for="route_id"
                  class="text-h6"
                >{{ item.route_id }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-select
                  ref="country"
                  v-model="$v.ProductionForm.product_id.$model"
                  :items="productIds"
                  :error-messages="idErrors"
                  label="ペレットID*"
                  placeholder="Select..."
                  required
                ></v-select>
              </v-col>
              <!-- <v-col cols="12">
                <v-text-field
                  v-model="product_name"
                  label="ペレット名*"
                  disabled
                  required
                ></v-text-field>
              </v-col> -->
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
            @click="closeForm()"
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
import { required, numeric } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import { format } from 'date-fns'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  props: ['icon', 'item'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    submitStatus: false,
    dialog: false,
    ProductionForm: {
      product_id: '',
      plan_weight: '',
    },
  }),
  validations: {
    ProductionForm: {
      product_id: {
        required,
      },
      plan_weight: {
        required,
        numeric,
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('productionplanStore', ['selectedProductionPlan']),
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
  created() {
    this.loadProductIds()
    this.loadProductionPlan(this.item.id).then(() => {
      this.ProductionForm = this.selectedProductionPlan
    })
  },

  methods: {
    focus(event) {
      event.currentTarget.select()
    },
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionplanStore', ['loadProductionPlans', 'loadProductionPlan', 'editProductionPlan']),
    submit(ProductionForm) {
      this.submitStatus = true

      this.editProductionPlan(ProductionForm).then(() => {
        this.submitStatus = false
        this.dialog = false
        this.loadProductionPlans({ route_id: this.ProductionForm.route_id, date: format(new Date(), 'yyyy-MM-dd') })
      })
    },
    closeForm() {
      this.dialog = false

      this.loadProductionPlan(this.item.id).then(() => {
        this.ProductionForm = this.selectedProductionPlan
      })

      this.$v.ProductionForm.$reset()
    },
  },
}
</script>
