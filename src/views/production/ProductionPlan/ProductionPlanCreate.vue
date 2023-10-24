<template>
  <v-card>
    <v-card-title>生産計画-新規</v-card-title>
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
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="plan_dt">計画日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="plan_dt"
                    placeholder="計画日"
                    :error-messages="dateErrors"
                    dense
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    clearable
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="plan_dt"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label
                class="text-right"
                for="plan_time"
              >計画時<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="plan_hour"
                :error-messages="hourErrors"
                :items="hours"
                outlined
                placeholder="時"
                hide-details="auto"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="plan_minute"
                :error-messages="minuteErrors"
                :items="minutes"
                outlined
                placeholder="分"
                hide-details="auto"
                dense
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="route_id">ルーターID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="$v.ProductionPlanForm.route_id.$model"
                :items="router"
                outlined
                dense
                placeholder="ルーターID"
                hide-details="auto"
                :error-messages="routeIdErrors"
              ></v-autocomplete>
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
              <v-autocomplete
                id="product_id"
                v-model="$v.ProductionPlanForm.product_id.$model"
                :items="productIds"
                outlined
                clearable
                dense
                :error-messages="productIdErrors"
                placeholder="ペレットID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="product_name"
                v-model="product_name"
                dense
                disabled
                placeholder="ペレット名"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="plan_weight">予定生産重量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <!-- <v-text-field
                id="plan_weight"
                v-model="bind_weight"
                :error-messages="weightErrors"
                outlined
                dense
                placeholder="予定生産重量"
                hide-details="auto"
                suffix="kg"
                @click="focus($event)"
                @input="handleWeightInput"
              ></v-text-field> -->
              <WeightInput
                v-model="$v.ProductionPlanForm.plan_weight.$model"
                placeholder="予定生産重量"
                :outlined="true"
                :error-messages="weightErrors"
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
                @click="submit(ProductionPlanForm)"
              >
                Submit
              </v-btn>
              <v-btn
                type="reset"
                class="mx-2"
                outlined
                :to="{ name: 'productionplan-list' }"
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
import { required, numeric } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    menu: false,
    submitStatus: false,
    router: ['1', '2'],
    ProductionPlanForm: {
      product_id: '',
      route_id: '',
      plan_weight: '0',
      plan_date: '',
    },
    plan_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    plan_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
    plan_dt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
    hours: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '00',
    ],
    minutes: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
    ],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    bind_weight: '0',
  }),
  validations: {
    plan_hour: {
      required,
    },
    plan_minute: {
      required,
    },
    plan_dt: {
      required,
    },
    ProductionPlanForm: {
      product_id: {
        required,
      },
      route_id: {
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

    product_name() {
      if (this.productMaster) {
        const productKey = this.ProductionPlanForm.product_id

        return this.productMaster[productKey]
      }

      return ''
    },

    productIdErrors() {
      const errors = []
      if (!this.$v.ProductionPlanForm.product_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionPlanForm.product_id.required && errors.push('必須項目')

      return errors
    },
    routeIdErrors() {
      const errors = []
      if (!this.$v.ProductionPlanForm.route_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionPlanForm.route_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.ProductionPlanForm.plan_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionPlanForm.plan_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionPlanForm.plan_weight.numeric && errors.push('必須数字')

      return errors
    },
    dateErrors() {
      const errors = []
      if (!this.$v.plan_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.plan_dt.required && errors.push('必須項目')

      return errors
    },
    hourErrors() {
      const errors = []
      if (!this.$v.plan_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.plan_hour.required && errors.push('必須項目')

      return errors
    },
    minuteErrors() {
      const errors = []
      if (!this.$v.plan_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.plan_minute.required && errors.push('必須項目')

      return errors
    },
  },
  created() {
    this.loadProductIds()
  },
  methods: {
    focus(event) {
      event.currentTarget.select()
    },
    handleWeightInput(value) {
      const formatValue = value.replace(/,/g, '')
      this.$v.ProductionPlanForm.plan_weight.$model = formatValue
      this.bind_weight = formatValue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    submit(ProductionPlanForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.ProductionPlanForm.plan_date = `${this.plan_dt} ${this.plan_hour}:${this.plan_minute}:00`

        this.createProductionPlan(ProductionPlanForm)
          .then(() => {
            this.submitStatus = false
            this.$router.push({ path: '/productionplan-list' })
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
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionplanStore', ['createProductionPlan']),
  },
}
</script>
