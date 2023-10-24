<template>
  <v-card>
    <v-card-title>ペレット実績-編集</v-card-title>
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
              <label for="id">生産ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="id"
                v-model="ProductionEditForm.id"
                outlined
                dense
                placeholder="生産ID"
                disabled
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
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
              <label for="gender">ルーターID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="ProductionEditForm.route_id"
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
              <label for="productID">ペレットID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="$v.ProductionEditForm.product_id.$model"
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
              <label for="employeeID">生産量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <WeightInput
                v-model="$v.ProductionEditForm.produced_weight.$model"
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
              <label for="arrival_note">備考</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="ProductionEditForm.note"
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
                @click="submit(ProductionEditForm)"
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
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    dateMenu: false,
    submitStatus: false,
    routers: ['1', '2', '3'],
    ProductionEditForm: {
      route_id: '',
      product_id: '',
      produced_weight: '',
      produced_dt: '',
      note: '',
    },
    OriginalForm: {},
    actual_hour: '',
    actual_minute: '',
    actual_date: '',
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
    ProductionEditForm: {
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
    ...mapState('productionStore', ['selectedProduction']),
    product_name() {
      if (this.productMaster) {
        const productKey = this.ProductionEditForm.product_id

        return this.productMaster[productKey]
      }

      return ''
    },
    routeIdErrors() {
      const errors = []
      if (!this.$v.ProductionEditForm.route_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionEditForm.route_id.required && errors.push('必須項目')

      return errors
    },
    productIdErrors() {
      const errors = []
      if (!this.$v.ProductionEditForm.product_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionEditForm.product_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.ProductionEditForm.produced_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionEditForm.produced_weight.decimal && errors.push('必須数字')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ProductionEditForm.produced_weight.required && errors.push('必須項目')

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
    actual_minute(val) {
      if (val && this.actual_hour && this.actual_date) {
        this.ProductionEditForm.produced_dt = `${this.actual_date} ${this.actual_hour}:${val}`
      }
    },
    actual_hour(val) {
      if (val && this.actual_minute && this.actual_date) {
        this.ProductionEditForm.produced_dt = `${this.actual_date} ${val}:${this.actual_minute}`
      }
    },
    actual_date(val) {
      if (val && this.actual_minute && this.actual_hour) {
        this.ProductionEditForm.produced_dt = `${val} ${this.actual_hour}:${this.actual_minute}`
      }
    },
  },
  created() {
    this.loadProductIds()
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['loadProduction', 'editProduction']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadProduction(this.$route.params.id)
        .then(() => {
          this.ProductionEditForm = { ...this.selectedProduction }
          this.actual_date = this.ProductionEditForm.produced_dt.substring(0, 10)
          this.actual_hour = this.ProductionEditForm.produced_dt.substring(11, 13)
          this.actual_minute = this.ProductionEditForm.produced_dt.substring(14, 16)
          this.ProductionEditForm.produced_dt = this.ProductionEditForm.produced_dt.substring(0, 16)
          this.ProductionEditForm.route_id = this.ProductionEditForm.route_id.toString()
          this.ProductionEditForm.produced_weight = `${this.ProductionEditForm.produced_weight}`
          this.OriginalForm = JSON.stringify(this.ProductionEditForm)
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
        })
    },
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.ProductionEditForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    jumpToListPage() {
      this.$router.push({ path: '/productionactual-list', query: this.$route.params.query ?? {} })
    },
    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },
    submit(ProductionEditForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (this.ProductionEditForm.produced_weight === '0') {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('生産量は 0 です！よろしいでしょうか？')) {
            this.submitStatus = true

            const production = { ...ProductionEditForm }
            this.editProduction(production)
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
          this.ProductionEditForm.produced_dt = `${this.actual_date} ${this.actual_hour}:${this.actual_minute}:00`

          const production = { ...ProductionEditForm }
          this.editProduction(production)
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
        console.log('valid error: not submit!!')
      }
    },
  },
}
</script>
