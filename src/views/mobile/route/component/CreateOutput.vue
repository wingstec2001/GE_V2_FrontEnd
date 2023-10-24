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
          <span class="text-h6">新規 ルーター{{ routeNo }}</span>
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
              <v-col cols="6">
                <label
                  for="produced_date"
                  class="text-h7"
                >{{ time }}</label>
              </v-col>
            </v-row>
            <!-- <v-row>
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
                >{{ routeNo }}</label>
              </v-col>
            </v-row> -->
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
                  label="備考"
                  :error-messages="noteErrors"
                  :counter="100"
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
import { mdiCalendar } from '@mdi/js'
import { required, numeric, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },

  // props: ['icon'],
  props: {
    icon: {
      type: String,
      required: true,
    },
    routeNo: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    submitStatus: false,
    icons: {
      mdiCalendar,
    },
    time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 16),
    dialog: false,
    ProductionForm: {
      route_id: '',
      product_id: '',
      produced_weight: 0,
      produced_dt: '',
      note: '',
    },
  }),
  validations: {
    ProductionForm: {
      product_id: {
        required,
      },
      produced_weight: {
        numeric,
        required,
      },
      note: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
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
    routeNo(val) {
      this.ProductionForm.route_id = val
    },
  },
  created() {
    this.loadProductIds()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['createProduction']),
    ...mapActions('dashboardStore', ['loadProductiondetails', 'loadProductionsum']),
    submit(ProductionForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.createProduction(ProductionForm).then(() => {
          this.$emit('success')
          this.submitStatus = false
          this.loadProductionsum(this.routeNo)
          this.closeForm()
        })
      } else {
        console.log('error submit!!')
      }
    },
    open() {
      this.time = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 16)
    },
    closeForm() {
      this.dialog = false

      // this.ProductionForm = {}
      // this.ProductionForm.route_id = this.routeNo
    },
  },
}
</script>
