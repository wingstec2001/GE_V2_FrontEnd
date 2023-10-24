<template>
  <v-card>
    <v-card-title>材料入荷 新規</v-card-title>
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
      <!-- <template v-if="alertInfo.status == true ">
        <v-alert
          v-for="msg of alertInfo.messages"
          :key="msg"
          color="warning"
          dark
        >
          {{ msg }}
        </v-alert>
      </template> -->
      <template>
        <v-spacer></v-spacer>
        <v-form class="ma-6">
          <!-- <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="arrival_id">入荷ID<span style="color:red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                id="arrival_id"
                v-model="$v.ArrivalMaterial.arrival_id.$model"
                :error-messages="idErrors"
                outlined
                dense
                placeholder="入荷ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row> -->

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="customer_id">仕入先ID</label>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                id="customer_id"
                v-model="ArrivalMaterial.customer_id"
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
              md="5"
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
              cols="12"
              md="2"
            >
              <label for="actual_date">入荷日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="3"
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
                v-model="$v.ArrivalMaterial.arrival_note.$model"
                :error-messages="arrivalNoteErrors"
                name="arrival_note"
                hide-details="auto"
                outlined
                :counter="100"
                dense
                rows="3"
                placeholder="備考"
              ></v-textarea>
            </v-col>
          </v-row>
          <div style="padding: 12px; margin: 12px 0px; border: 1px solid #ccc">
            <v-row>
              <v-col
                cols="12"
                style="text-align: right"
              >
                <v-btn
                  color="secondary"
                  outlined
                  @click.stop="addArrivalActual(item)"
                >
                  <v-icon class="me-1">
                    {{ icons.mdiPlus }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  ref="ArrivalActuals"
                  class="class-on-data-table elevation-1"
                  :headers="headers"
                  :items="ArrivalMaterial.details"
                  fixed-header
                  :items-per-page="-1"
                >
                  <template v-slot:[`item.material_id`]="{ item }">
                    <v-autocomplete
                      v-model="item.material_id"
                      placeholder="材料ID"
                      :items="materialIds"
                      :error-messages="materialIdErrors(item)"
                      hide-details="auto"
                      clearable
                      outlined
                      dense
                      @update:search-input="setmaterialMaster($event, item)"
                    ></v-autocomplete>
                  </template>
                  <template v-slot:[`item.arrival_goods_name`]="{ item }">
                    <v-text-field
                      v-model="item.arrival_goods_name"
                      :error-messages="nameErrors(item)"
                      placeholder="材料名"
                      hide-details="auto"
                      dense
                      readonly
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.arrival_weight`]="{ item }">
                    <weight-input
                      v-model="item.arrival_weight"
                      :outlined="true"
                      :error-messages="weightErrors(item)"
                    ></weight-input>
                  </template>
                  <template v-slot:[`item.crushing_status`]="{ item }">
                    <v-select
                      v-model="item.crushing_status"
                      :items="crushing_status"
                      outlined
                      dense
                      placeholder="粉砕状態"
                      hide-details
                    ></v-select>
                  </template>
                  <template v-slot:[`item.note`]="{ item }">
                    <v-text-field
                      v-model="item.note"
                      placeholder="備考"
                      hide-details="auto"
                      :counter="100"
                      :error-messages="noteErrors(item)"
                      dense
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                      class="mr-2"
                      color="red"
                      @click="deleteArrival(item)"
                    >
                      {{ icons.mdiMinusCircle }}
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                style="text-align: right"
              >
                <v-btn
                  color="secondary"
                  outlined
                  @click="addArrivalActual(item)"
                >
                  <v-icon class="me-1">
                    {{ icons.mdiPlus }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-row align="center">
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit(ArrivalMaterial)"
              >
                Submit
              </v-btn>
              <v-btn
                type="reset"
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
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { mdiPlus, mdiMinusCircle } from '@mdi/js'
import { mapActions, mapState } from 'vuex'
import Sortable from 'sortablejs'
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
    arrival_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    arrival_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
    arrival_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
    actual_ampm: [
      { text: '午前', value: 0 },
      { text: '午後', value: 1 },
    ],
    crushing_status: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],

    ArrivalMaterial: {
      customer_id: '',
      arrival_note: '',
      actual_date: '',
      details: [],
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
        text: '材料ID',
        align: 'left',
        sortable: false,
        value: 'material_id',
        width: '20%',
        fixed: true,
      },
      {
        text: '材料名',
        align: 'left',
        sortable: false,
        value: 'arrival_goods_name',
        width: '20%',
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
        text: '備考',
        value: 'note',
        sortable: false,
        align: 'center',
        width: '20%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '5%',
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
    ArrivalMaterial: {
      // customer_id: {
      //   required,
      // },

      // actual_date: {
      //   required,
      // },
      arrival_note: {
        maxLength: maxLength(100),
      },
      details: {
        required,
        $each: {
          material_id: {
            required,
          },
          arrival_goods_name: {
            required,
          },
          arrival_weight: {
            required,
            numeric,
          },
          note: {
            maxLength: maxLength(100),
          },
        },
      },
    },
  },

  computed: {
    // ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('customerStore', ['supplierMaster', 'supplierIds']),

    customer_name() {
      if (this.supplierMaster) {
        const customerKey = this.ArrivalMaterial.customer_id

        return this.supplierMaster[customerKey]
      }

      return ''
    },

    arrivalNoteErrors() {
      const errors = []
      if (!this.$v.ArrivalMaterial.arrival_note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ArrivalMaterial.arrival_note.maxLength && errors.push('100文字以下にしてください。')

      return errors
    },
    materialIdErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ArrivalMaterial.details.$each[index].material_id.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ArrivalMaterial.details.$each[index].material_id.required && errors.push('必須項目')
        }

        return errors
      }
    },
    nameErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ArrivalMaterial.details.$each[index].arrival_goods_name.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ArrivalMaterial.details.$each[index].arrival_goods_name.required && errors.push('必須項目')
        }

        return errors
      }
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
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ArrivalMaterial.details.$each[index].arrival_weight.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ArrivalMaterial.details.$each[index].arrival_weight.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ArrivalMaterial.details.$each[index].arrival_weight.numeric && errors.push('必須数字')
        }

        return errors
      }
    },

    noteErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ArrivalMaterial.details.$each[index].note.$dirty) return errors

          // eslint-disable-next-line no-unused-expressions
          !this.$v.ArrivalMaterial.details.$each[index].note.maxLength && errors.push('100文字以内にして下さい。')
        }

        return errors
      }
    },
  },
  watch: {
    ArrivalMaterial: {
      handler(after) {
        if ((after.arrival_note !== '')
            || (after.customer_id !== '')
            || (after.details.length !== 0)) {
          this.changeFlag = true
        }
      },
      deep: true,
    },

    details(next, prev) {
      console.log('changed', next, prev)
    },
  },
  created() {
    this.loadSupplierIds()
    this.loadMaterialIds()
  },
  mounted() {
    this.sortArrivalActuals()
  },
  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadSupplierIds']),
    ...mapActions('arrivalactualStore', ['createArrivalActual']),

    jumpToListPage() {
      this.$router.push({ path: '/arrivalmaterial-list' })
    },

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

    addArrivalActual(item) {
      const Obj = { ...item }
      Obj.id = this.ArrivalMaterial.details.length
      Obj.detail_id = this.ArrivalMaterial.details.length + 1

      if (this.ArrivalMaterial.details.length >= 1) {
        const lastRow = this.ArrivalMaterial.details.length - 1
        Obj.material_id = this.ArrivalMaterial.details[lastRow].material_id
      } else {
        Obj.material_id = ''
      }

      Obj.arrival_goods_name = ''
      Obj.arrival_weight = 0
      Obj.crushing_status = 0
      this.ArrivalMaterial.details.push(Obj)
    },

    handleWeightInput(e, item) {
      const formatValue = e.replace(/,/g, '')
      if (this.ArrivalMaterial.details.indexOf(item) !== -1) {
        this.ArrivalMaterial.details[this.ArrivalMaterial.details.indexOf(item)].arrival_weight = formatValue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        console.log('handleWeightInput-----> item does not exist')
      }
    },

    setmaterialMaster(e, item) {
      if (this.ArrivalMaterial.details.indexOf(item) !== -1) {
        this.ArrivalMaterial.details[this.ArrivalMaterial.details.indexOf(item)].arrival_goods_name = this.materialMaster[e]
      } else {
        console.log('setId-----> item does not exist')
      }
    },
    sortArrivalActuals() {
      const el = this.$refs.ArrivalActuals.$el.querySelectorAll('.v-data-table__wrapper > table> tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        sort: true,
        animation: 150,
        group: {
          name: 'ArrivalActual',
          pull: false,
          put: false,
        },
        setData(dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent)
        },
        onEnd: evt => {
          const item = this.ArrivalMaterial.details[evt.oldIndex]

          this.ArrivalMaterial.details.splice(evt.oldIndex, 1)
          this.ArrivalMaterial.details.splice(evt.newIndex, 0, item)

          const orderArrivalActuals = []
          this.ArrivalMaterial.details.forEach((v, i) => {
            orderArrivalActuals[i] = v
            orderArrivalActuals[i].detail_id = i + 1
          })
        },
      })
    },

    // データをSubmit
    submit(ArrivalMaterial) {
      this.$v.$touch()

      if (this.ArrivalMaterial.details.length <= 0) {
        this.apierror.status = 'error'
        this.apierror.messages.push('明細行を追加してください。')

        return
      }

      console.log('invalid:', this.$v.$invalid)
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.ArrivalMaterial.actual_date = `${this.arrival_date} ${this.arrival_hour}:${this.arrival_minute}:00`
        this.createArrivalActual(ArrivalMaterial)
          .then(() => {
            this.submitStatus = false
            this.$router.push({ path: '/arrivalmaterial-list' })
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

    deleteArrival(item) {
      this.ArrivalMaterial.details.splice(this.ArrivalMaterial.details.indexOf(item), 1)

      // const id = []
      this.ArrivalMaterial.details.forEach((v, i) => {
        this.ArrivalMaterial.details[i].id = i
        this.ArrivalMaterial.details[i].detail_id = i + 1
      })
    },

  },
}
</script>
<style scoped>
/* .right-input input {
        text-align: right;
      } */
</style>
