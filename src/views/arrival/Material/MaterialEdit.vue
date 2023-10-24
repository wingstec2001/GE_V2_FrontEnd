<template>
  <v-card>
    <v-card-title>材料入荷 編集</v-card-title>
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
              <label for="arrival_id">No<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                id="arrival_id"
                v-model="editForm.aad_id"
                outlined
                dense
                disabled
                placeholder="入荷ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- <v-row align="center">
            <v-col cols="12" md="2">
              <label for="customer_id">仕入先ID<span style="color: red">*</span></label>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                id="customer_id"
                v-model="$v.editForm.customer_id.$model"
                :items="supplierIds"
                outlined
                clearable
                dense
                :error-messages="customeridErrors"
                placeholder="仕入先ID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                id="customer_name"
                v-model="customer_name"
                dense
                disabled
                placeholder="仕入先名"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row> -->
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
                    v-model="actual_dt"
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
                  v-model="actual_dt"
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
              <v-select
                v-model="actual_hour"
                :error-messages="hourErrors"
                :items="hours"
                outlined
                placeholder="時"
                hide-details="auto"
                dense
              ></v-select>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-select
                v-model="actual_minute"
                :error-messages="minuteErrors"
                :items="minutes"
                outlined
                placeholder="分"
                hide-details="auto"
                dense
              ></v-select>
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
                v-model="$v.editForm.material_id.$model"
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
                v-model="$v.editForm.arrival_weight.$model"
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
                v-model="editForm.crushing_status"
                :items="crushingStatus"
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
                v-model="editForm.customer_id"
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
                v-model="$v.editForm.note.$model"
                :error-messages="noteErrors"
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

          <v-row align="center">
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit(editForm)"
              >
                Submit
              </v-btn>
              <!-- <v-btn
                color="primary"
                class="mx-2"
                @click="detailItem()"
              >
                Detail
              </v-btn> -->
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
import { required, decimal, maxLength } from 'vuelidate/lib/validators'
import { mdiPlus, mdiMinusCircle } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    submitStatus: false,
    icons: {
      mdiPlus,
      mdiMinusCircle,
    },
    menu: false,
    actual_hour: '',
    actual_minute: '',
    actual_dt: '',
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

    material_id: '',

    crushingStatus: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],
    editForm: {
      aad_id: '',
      material_id: '',
      arrival_weight: 0,
      arrival_date: '',
      crushing_status: '',
      note: '',
    },
    OriginalForm: {},
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
    actual_dt: {
      required,
    },
    editForm: {
      material_id: {
        required,
      },
      crushing_status: {
        required,
      },
      arrival_weight: {
        decimal,
        required,
      },
      note: {
        maxLength: maxLength(100),
      },
    },
  },

  computed: {
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('arrivalactualStore', ['selectedArrivalDetail']),
    ...mapState('customerStore', ['supplierMaster', 'supplierIds']),

    material_name() {
      if (this.materialMaster) {
        const materialKey = this.editForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },

    materialIdErrors() {
      const errors = []
      if (!this.$v.editForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.editForm.material_id.required && errors.push('必須項目')

      return errors
    },

    noteErrors() {
      const errors = []
      if (!this.$v.editForm.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.editForm.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
    dateErrors() {
      const errors = []
      if (!this.$v.actual_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_dt.required && errors.push('必須項目')

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
    weightErrors() {
      const errors = []
      if (!this.$v.editForm.arrival_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.editForm.arrival_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.editForm.arrival_weight.decimal && errors.push('必須数字')

      return errors
    },

    customer_name() {
      if (this.supplierMaster) {
        const customerKey = this.editForm.customer_id

        return this.supplierMaster[customerKey]
      }

      return ''
    },
  },
  watch: {
    actual_minute(val) {
      if (val && this.actual_hour && this.actual_dt) {
        this.editForm.arrival_date = `${this.actual_dt} ${this.actual_hour}:${val}`
      }
    },
    actual_hour(val) {
      if (val && this.actual_minute && this.actual_dt) {
        this.editForm.arrival_date = `${this.actual_dt} ${val}:${this.actual_minute}`
      }
    },
    actual_dt(val) {
      if (val && this.actual_minute && this.actual_hour) {
        this.editForm.arrival_date = `${val} ${this.actual_hour}:${this.actual_minute}`
      }
    },
  },
  created() {
    this.loadMaterialIds()
    this.loadSupplierIds()
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('customerStore', ['loadSupplierIds']),

    loadData() {
      this.setOverlayStatus(true)
      this.loadArrivalActualDetail(this.$route.params.id)
        .then(() => {
          this.editForm = this.selectedArrivalDetail

          this.actual_dt = this.editForm.arrival_date.substring(0, 10)
          this.actual_hour = this.editForm.arrival_date.substring(11, 13)
          this.actual_minute = this.editForm.arrival_date.substring(14, 16)
          this.OriginalForm = JSON.stringify(this.editForm)
          console.log('hour:', this.actual_hour, this.actual_minute)
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
      if (this.OriginalForm !== JSON.stringify(this.editForm)) {
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
    jumpToListPage() {
      this.$router.push({ path: '/arrivalmaterial-list', query: this.$route.params.query ?? {} })
    },
    submit(editForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editForm.arrival_date = `${this.actual_dt} ${this.actual_hour}:${this.actual_minute}:00`

        this.editArrivalDetail(editForm)
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

    // ...mapActions('customerStore', ['loadSupplierIds']),
    ...mapActions('arrivalactualStore', ['editArrivalDetail', 'loadArrivalActualDetail']),
    ...mapActions('materialStore', ['loadMaterialIds']),
  },
}
</script>
