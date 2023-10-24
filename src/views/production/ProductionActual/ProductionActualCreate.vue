<template>
  <v-card>
    <v-card-title>ペレット実績-新規</v-card-title>
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
              <label for="actual_date">生産日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="actual_date"
                    :error-messages="dateErrors"
                    placeholder="生産日"
                    hide-details
                    v-bind="attrs"
                    clearable
                    outlined
                    readonly
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="actual_date"
                  :allowed-dates="allowedDates"
                  @input="dateMenu = false"
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
                for="actual_time"
              >生産時間<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="actual_hour"
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
                v-model="actual_minute"
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
              <label for="router_id">ルーターID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="$v.ProductionForm.route_id.$model"
                :items="routers"
                outlined
                dense
                placeholder="ルーターID"
                hide-details="auto"
                :error-messages="routeIdErrors"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
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
                v-model="$v.ProductionForm.product_id.$model"
                :items="productIds"
                clearable
                outlined
                dense
                placeholder="ペレットID"
                hide-details="auto"
                :error-messages="productIdErrors"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="product_name"
                v-model="product_name"
                disabled
                dense
                placeholder="ペレット名"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="produced_weight">生産量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <WeightInput
                v-model="$v.ProductionForm.produced_weight.$model"
                placeholder="生産量"
                :outlined="true"
                :error-messages="weightErrors"
              ></WeightInput>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="note">備考</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="ProductionForm.note"
                name="note"
                hide-details="auto"
                outlined
                :counter="100"
                dense
                rows="3"
                placeholder="備考"
              ></v-textarea>
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
                @click="submit(ProductionForm)"
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
import { required, decimal } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    submitStatus: false,
    dateMenu: false,
    changeFlag: false,
    routers: ['1', '2', '3'],
    ProductionForm: {
      route_id: '',
      product_id: '',
      produced_weight: 0,
      produced_dt: '',
      note: '',
    },
    actual_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    actual_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
    actual_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
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
    actual_hour: {
      required,
    },
    actual_minute: {
      required,
    },
    actual_date: {
      required,
    },
    ProductionForm: {
      route_id: {
        required,
      },
      product_id: {
        required,
      },
      produced_weight: {
        required,
        decimal,
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    product_name() {
      // const product = this.products.find(pdf => pdf.product_id === this.ProductionForm.product_id)
      if (this.productMaster) {
        const productKey = this.ProductionForm.product_id

        return this.productMaster[productKey]
      }

      return ''
    },
    routeIdErrors() {
      const errors = []
      if (!this.$v.ProductionForm.route_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.route_id.required && errors.push('必須項目')

      return errors
    },
    productIdErrors() {
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
      !this.$v.ProductionForm.produced_weight.decimal && errors.push('必須数字')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionForm.produced_weight.required && errors.push('必須項目')

      return errors
    },
    dateErrors() {
      const errors = []
      if (!this.$v.actual_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_date.required && errors.push('必須項目')

      return errors
    },
    hourErrors() {
      const errors = []
      if (!this.$v.actual_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_hour.required && errors.push('必須項目')

      return errors
    },
    minuteErrors() {
      const errors = []
      if (!this.$v.actual_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_minute.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    ProductionForm: {
      handler(after) {
        if ((after.produced_weight !== '0')
            || (after.product_id !== undefined)
            || (after.route_id !== undefined)
            || (after.note !== '')) {
          this.changeFlag = true
        }
      },
      deep: true,
    },

  },
  created() {
    this.loadProductIds()

    this.ProductionForm.product_id = this.$route.params.product_id
    this.ProductionForm.route_id = this.$route.params.route_id
  },
  methods: {
    cancelClick() {
      if (this.changeFlag) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },
    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['createProduction']),
    handleWeightInput(value) {
      const formatValue = value.replace(/,/g, '')
      this.$v.ProductionForm.produced_weight.$model = formatValue
      this.bind_weight = formatValue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    jumpToListPage() {
      this.$router.push({ path: '/productionactual-list', query: this.$route.params.query ?? {} })
    },
    submit(ProductionForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (this.ProductionForm.produced_weight === '0') {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('生産量は 0 です！よろしいでしょうか？')) {
            this.submitStatus = true
            this.ProductionForm.produced_dt = `${this.actual_date} ${this.actual_hour}:${this.actual_minute}:00`

            this.createProduction(ProductionForm)
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
          }
        } else {
          this.submitStatus = true
          this.ProductionForm.produced_dt = `${this.actual_date} ${this.actual_hour}:${this.actual_minute}:00`

          this.createProduction(ProductionForm)
            .then(() => {
              this.submitStatus = false
              this.jumpToListPage()
            })
            .catch(error => {
              this.submitStatus = false

              this.apierror.status = error.response.data.status
              this.apierror.code = error.response.data.code
              this.apierror.messages = error.response.data.message
            })
        }
      } else {
        console.log('error submit!!')
      }
    },
  },

}
</script>
