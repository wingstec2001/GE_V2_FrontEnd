<template>
  <v-card>
    <v-card-title>入荷実績-新規V2</v-card-title>
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
              <label for="actual_date">入荷日<span style="color: red">*</span></label>
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
                    v-model="arrival_date"
                    placeholder="入荷日"
                    :error-messages="dateErrors"
                    dense
                    hide-details="auto"
                    outlined
                    readonly
                    v-bind="attrs"
                    clearable
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="arrival_date"
                  :allowed-dates="allowedDates"
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
                for="actual_time"
              >入荷時間<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="arrival_hour"
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
                v-model="arrival_minute"
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
              <label for="material_id">材料ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                id="material_id"
                v-model="$v.arrivalDetailForm.material_id.$model"
                :items="materialIds"
                outlined
                clearable
                dense
                :error-messages="materialIdErrors"
                placeholder="材料ID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="material_name"
                v-model="material_name"
                dense
                disabled
                placeholder="材料名"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="arrvial_weight">入荷重量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <WeightInput
                v-model="$v.arrivalDetailForm.arrival_weight.$model"
                placeholder="入荷重量"
                :outlined="true"
                :error-messages="weightErrors"
              ></WeightInput>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="crushing_status">粉砕状態<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="arrivalDetailForm.crushing_status"
                :items="crushingstatus"
                outlined
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
              <label for="customer_id">仕入先ID</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                id="customer_id"
                v-model="arrivalDetailForm.customer_id"
                :items="supplierIds"
                outlined
                clearable
                dense
                placeholder="仕入先ID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="customer_name"
                v-model="customer_name"
                dense
                disabled
                placeholder="仕入先名"
                hide-details="auto"
              ></v-text-field>
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
                @click="submit(arrivalDetailForm)"
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
import { mdiPlus, mdiMinusCircle } from '@mdi/js'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    submitStatus: false,
    changeFlag: false,
    icons: {
      mdiPlus,
      mdiMinusCircle,
    },
    menu: false,
    hours: ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
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
    arrival_hour: '10',
    arrival_minute: '30',
    arrival_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    crushingstatus: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],
    crusing_status: 0,
    customer_id: '',

    // customer_name: '',
    arrivalDetailForm: {
      arrival_date: '',
      material_id: '',
      arrival_weight: 0,
      crushing_status: 0,
      customer_id: '',
    },

    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    headers: [
      {
        text: 'No.',
        align: 'left',
        sortable: false,
        value: 'detail_id',
        width: '5%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        align: 'left',
        sortable: false,
        value: 'product_id',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ペレット名',
        align: 'left',
        sortable: false,
        value: 'arrival_goods_name',
        width: '25%',
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'arrival_weight',
        sortable: false,
        align: 'right',
        width: '15%',
        fixed: true,
      },
      {
        text: '粉砕状態',
        value: 'crushing_status',
        sortable: false,
        align: 'center',
        width: '15%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
      },
    ],
  }),

  validations: {
    arrival_hour: {
      required,
    },
    arrival_minute: {
      required,
    },
    arrival_date: {
      required,
    },

    arrivalDetailForm: {
      material_id: {
        required,
      },

      arrival_weight: {
        decimal,
        required,
      },
    },
  },
  computed: {
    ...mapState('customerStore', ['supplierMaster', 'supplierIds']),
    ...mapState('materialStore', ['materialMaster', 'materialIds']),

    material_name() {
      if (this.materialMaster) {
        const materialKey = this.arrivalDetailForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },

    materialIdErrors() {
      const errors = []
      if (!this.$v.arrivalDetailForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrivalDetailForm.material_id.required && errors.push('必須項目')

      return errors
    },

    customer_name() {
      if (this.supplierMaster) {
        const customerKey = this.arrivalDetailForm.customer_id

        return this.supplierMaster[customerKey]
      }

      return ''
    },

    nameErrors(item) {
      const errors = []
      if (item && item.detail_id) {
        const index = item.detail_id - 1
        if (!this.$v.ArrivalDetailForm.details.$each[index].arrival_goods_name.$dirty) return errors
        // eslint-disable-next-line no-unused-expressions
        !this.$v.ArrivalDetailForm.details.$each[index].arrival_goods_name.required && errors.push('必須項目')
      }

      return errors
    },

    dateErrors() {
      const errors = []
      if (!this.$v.arrival_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrival_date.required && errors.push('必須項目')

      return errors
    },
    hourErrors() {
      const errors = []
      if (!this.$v.arrival_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrival_hour.required && errors.push('必須項目')

      return errors
    },
    minuteErrors() {
      const errors = []
      if (!this.$v.arrival_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrival_minute.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []

      if (!this.$v.arrivalDetailForm.arrival_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrivalDetailForm.arrival_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrivalDetailForm.arrival_weight.decimal && errors.push('必須数字')

      return errors
    },
  },
  watch: {
    ArrivalDetailForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    arrival_date: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    arrival_hour: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    arrival_minute: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  created() {
    this.loadSupplierIds()
    this.loadMaterialIds()
    this.arrivalDetailForm.material_id = this.$route.params.material_id
    this.arrivalDetailForm.customer_id = this.$route.params.customer_id
    this.arrivalDetailForm.crushing_status = Number.parseInt(this.$route.params.crushing_status, 10)
  },
  mounted() {},
  methods: {
    cancelClick() {
      if (this.changeFlag) {
        // eslint-disable-next-line no-restricted-globals
        if (window.confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },
    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },

    // addArrivalActual(item) {
    //   const Obj = { ...item }
    //   Obj.id = this.ArrivalDetailForm.details.length
    //   Obj.detail_id = this.ArrivalDetailForm.details.length + 1
    //   Obj.product_id = ''
    //   Obj.arrival_goods_name = ''
    //   Obj.arrival_weight = 0
    //   Obj.crushing_status = 0
    //   this.ArrivalDetailForm.details.push(Obj)
    // },

    jumpToListPage() {
      this.$router.push({ path: '/arrivalactual-list', query: this.$route.params.query ?? {} })
    },
    submit(ArrivalDetailForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.arrivalDetailForm.arrival_date = `${this.arrival_date} ${this.arrival_hour}:${this.arrival_minute}:00`
        this.createTodayArrivalDetail(ArrivalDetailForm)
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
    deleteArrival(item) {
      this.ArrivalDetailForm.details.splice(this.ArrivalDetailForm.details.indexOf(item), 1)
      const id = []
      this.ArrivalDetailForm.details.forEach((v, i) => {
        id[i] = v
        id[i].detail_id = i + 1
      })
    },
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadSupplierIds']),
    ...mapActions('arrivalactualStore', ['createTodayArrivalDetail']),
  },
}
</script>
<style scoped>
/* .right-input input {
        text-align: right;
      } */
</style>
