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
          <span class="text-h6">ペレット実績-編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <label class="text-h7">No.</label>
              </v-col>
              <v-col cols="6">
                <label class="text-h7">{{ item.id }}</label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <label
                  for="p_date"
                  class="text-h7"
                >ルーターID</label>
              </v-col>
              <v-col cols="6">
                <label
                  for="route_id"
                  class="text-h7"
                >{{ ProductionForm.route_id }}</label>
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
              <v-col cols="12">
                <WeightInput
                  v-model="ProductionForm.produced_weight"
                  label="生産量*"
                  :outlined="false"
                  :error-messages="weightErrors"
                ></WeightInput>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="ProductionForm.note"
                  :error-messages="noteErrors"
                  :counter="100"
                  label="備考"
                  outlined
                ></v-textarea>
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

// import { ref } from 'vue'
import { required, numeric, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

// const componentKey = ref(0)
// const forceRerender = () => {
//   componentKey.value += 1
// }

export default {

  components: {
    WeightInput,
  },
  props: ['icon', 'item'],
  data: () => ({
    isVisible: false,
    submitStatus: false,
    dialog: false,
    ProductionForm: {
      product_id: '',
      produced_weight: '',
      note: '',
    },
  }),
  validations: {
    ProductionForm: {
      product_id: {
        required,
      },
      produced_weight: {
        required,
        numeric,
      },
      note: {
        maxLength: maxLength(100),
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
      if (!this.$v.ProductionForm.produced_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.produced_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.produced_weight.numeric && errors.push('必須数字')

      return errors
    },

    noteErrors() {
      const errors = []
      if (!this.$v.ProductionForm.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
  },
  watch: {
    dialog(visible) {
      if (visible) {
        this.loadProduction(this.item.id).then(() => {
          this.ProductionForm = { ...this.selectedProduction }
        })
      }
    },
  },
  created() {
    this.loadProductIds()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['loadProduction', 'editProduction']),
    ...mapActions('dashboardStore', ['loadProductiondetails', 'loadProductionsum']),

    forceRerender() {
      this.componentKey += 1
    },

    submit(ProductionForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.editProduction(ProductionForm).then(() => {
          this.submitStatus = false
          this.dialog = false
          this.$emit('success')
        })
      }
    },
    closeForm() {
      this.dialog = false

      this.$v.ProductionForm.$reset()

      this.$forceUpdate()

      this.ProductionForm.produced_weight = 0
      this.ProductionForm.note = ''
      this.ProductionForm.product_id = null
    },
  },
}
</script>
