<template>
  <v-card>
    <v-card-title>入荷実績-詳細</v-card-title>
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
              <label for="arrival_id">入荷ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="arrival_id"
                v-model="$v.ArrivalActualForm.arrival_id.$model"
                :error-messages="idErrors"
                outlined
                dense
                readonly
                placeholder="入荷ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="customer_id">仕入先ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="customer_id"
                v-model="$v.ArrivalActualForm.customer_id.$model"
                :items="supplierIds"
                outlined
                dense
                readonly
                :error-messages="customeridErrors"
                placeholder="仕入先ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="customer_name"
                v-model="customer_name"
                dense
                readonly
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
              md="4"
            >
              <v-text-field
                v-model="arrival_dt"
                placeholder="入荷日"
                :error-messages="dateErrors"
                dense
                hide-details="auto"
                outlined
                readonly
              ></v-text-field>
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
              >入荷時<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
                v-model="arrival_hour"
                :error-messages="hourErrors"
                :items="hours"
                outlined
                readonly
                placeholder="時"
                hide-details="auto"
                dense
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
                v-model="arrival_minute"
                :error-messages="minuteErrors"
                :items="minutes"
                outlined
                readonly
                placeholder="分"
                hide-details="auto"
                dense
              ></v-text-field>
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
                v-model="$v.ArrivalActualForm.arrival_note.$model"
                :error-messages="noteErrors"
                name="arrival_note"
                hide-details="auto"
                outlined
                :counter="100"
                dense
                readonly
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
                  v-if="buttonDisabled"
                  color="secondary"
                  outlined
                  @click="addArrivalActual"
                >
                  <v-icon class="me-1">
                    {{ icons.mdiPlus }}
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  color="secondary"
                  outlined
                  disabled
                  @click="addArrivalActual"
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
                  class="class-on-data-table elevation-1"
                  :headers="headers"
                  :items="view_details"
                  fixed-header
                  :items-per-page="-1"
                  item-key="aad_id"
                >
                  <template v-slot:[`item.detail_id`]="{ index }">
                    <label>{{ index + 1 }}</label>
                  </template>
                  <template v-slot:[`item.product_id`]="{ item }">
                    <v-autocomplete
                      v-model="item.product_id"
                      placeholder="ペレットID"
                      :items="productIds"
                      hide-details="auto"
                      outlined
                      dense
                      :error-messages="productIdErrors(item)"
                      :readonly="item.state === 0"
                      @update:search-input="setProductMaster($event, item)"
                    >
                    </v-autocomplete>
                  </template>
                  <template v-slot:[`item.arrival_goods_name`]="{ item }">
                    <v-text-field
                      v-model="item.arrival_goods_name"
                      placeholder="ペレット名"
                      hide-details="auto"
                      dense
                      readonly
                      :error-messages="nameErrors(item)"
                    ></v-text-field>
                  </template>
                  <template v-slot:[`item.arrival_weight`]="{ item }">
                    <weight-input
                      v-model="item.arrival_weight"
                      :outlined="true"
                      :readonly="item.state === 0"
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
                      :readonly="item.state === 0"
                    ></v-select>
                  </template>
                  <template v-slot:[`item.actions`]="{ item, index }">
                    <v-row v-if="item.state === 0">
                      <v-col
                        style="padding-right: 10px"
                        cols="3"
                      >
                        <v-btn
                          :disabled="changeDisable"
                          small
                          icon
                          @click="changeState(item)"
                        >
                          <v-icon small>
                            {{ icons.mdiPencil }}
                          </v-icon>
                        </v-btn>
                      </v-col>
                      <v-col
                        style="padding-left: 10px"
                        cols="4"
                      >
                        <v-btn
                          icon
                          small
                          :disabled="changeDisable"
                        >
                          <detail-delete
                            :icon="icons.mdiDelete"
                            :item="item"
                            @refresh="refresh"
                          ></detail-delete>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <div>
                      <v-row v-if="item.state === 1">
                        <v-col
                          style="padding-right: 10px"
                          cols="3"
                        >
                          <v-btn
                            icon
                            small
                            @click.once="editSubmit(item, index)"
                          >
                            <v-icon small>
                              {{ icons.mdiCheckBold }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col
                          style="padding-left: 10px"
                          cols="4"
                        >
                          <v-btn
                            icon
                            small
                            @click.once="editCancel(item)"
                          >
                            <v-icon small>
                              {{ icons.mdiCloseThick }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <v-row v-if="item.state === 2">
                        <v-col
                          style="padding-right: 0px"
                          cols="3"
                        >
                          <v-btn
                            icon
                            small
                            class="mr-2"
                            :loading="submitStatus"
                            @click.once="addSubmit(item, index)"
                          >
                            <v-icon small>
                              {{ icons.mdiPlusThick }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col
                          style="padding-left: 10px"
                          cols="4"
                        >
                          <v-btn
                            small
                            icon
                            class="mr-2"
                            @click="addCancel(item)"
                          >
                            <v-icon small>
                              {{ icons.mdiMinusThick }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
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
                  v-if="buttonDisabled"
                  color="secondary"
                  outlined
                  @click="addArrivalActual"
                >
                  <v-icon class="me-1">
                    {{ icons.mdiPlus }}
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  disabled
                  color="secondary"
                  outlined
                  @click="addArrivalActual"
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
                class="mx-2"
                outlined
                @click="cancelClick"
              >
                OK
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </template>
  </v-card>
</template>
<script>
import { required, maxLength, decimal } from 'vuelidate/lib/validators'
import {
  mdiPlus, mdiDelete, mdiPencil, mdiCloseThick, mdiCheckBold, mdiPlusThick, mdiMinusThick,
} from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'
import DetailDelete from './DetailDelete.vue'

export default {
  components: {
    DetailDelete,
    WeightInput,
  },
  data: () => ({
    submitStatus: false,
    changeDisable: false,
    icons: {
      mdiPlus,
      mdiDelete,
      mdiPencil,
      mdiCloseThick,
      mdiCheckBold,
      mdiPlusThick,
      mdiMinusThick,
    },
    OriginalForm: {},
    hours: ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
    minutes: ['00', '15', '30', '45'],
    arrival_hour: '',
    arrival_minute: '',
    arrival_dt: '',
    crushing_status: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],
    view_details: [],
    ArrivalActualForm: {
      arrival_id: '',
      customer_id: '',
      arrival_note: '',
      actual_date: '',
    },
    buttonDisabled: true,
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
        width: '10%',
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
    arrival_dt: {
      required,
    },
    ArrivalActualForm: {
      customer_id: {
        required,
      },
      arrival_id: {
        required,
      },
      arrival_note: {
        maxLength: maxLength(100),
      },
    },
    view_details: {
      required,
      $each: {
        product_id: {
          required,
        },
        arrival_goods_name: {
          required,
        },
        arrival_weight: {
          required,
          decimal,
        },
      },
    },
  },

  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('customerStore', ['supplierMaster', 'supplierIds']),
    ...mapState('arrivalactualStore', ['selectedArrivalActual']),

    customer_name() {
      if (this.supplierMaster) {
        const customerKey = this.ArrivalActualForm.customer_id

        return this.supplierMaster[customerKey]
      }

      return ''
    },

    idErrors() {
      const errors = []
      if (!this.$v.ArrivalActualForm.arrival_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ArrivalActualForm.arrival_id.required && errors.push('必須項目')

      return errors
    },
    customeridErrors() {
      const errors = []
      if (!this.$v.ArrivalActualForm.customer_id.$dirty) return errors

      // eslint-disable-next-line no-unused-expressions
      !this.$v.ArrivalActualForm.customer_id.required && errors.push('必須項目')

      return errors
    },
    noteErrors() {
      const errors = []
      if (!this.$v.ArrivalActualForm.arrival_note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ArrivalActualForm.arrival_note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },

    productIdErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.view_details.$each[index].product_id.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.view_details.$each[index].product_id.required && errors.push('必須項目')
        }

        return errors
      }
    },

    nameErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.view_details.$each[index].arrival_goods_name.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.view_details.$each[index].arrival_goods_name.required && errors.push('必須項目')
        }

        return errors
      }
    },
    weightErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.view_details.$each[index].arrival_weight.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.view_details.$each[index].arrival_weight.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.view_details.$each[index].arrival_weight.decimal && errors.push('必須数字')
        }

        return errors
      }
    },
    dateErrors() {
      const errors = []
      if (!this.$v.arrival_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.arrival_dt.required && errors.push('必須項目')

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
  },
  created() {
    this.loadSupplierIds()
    this.loadProductIds()
    this.loadData()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadArrivalActual(this.$route.params.id)
        .then(() => {
          this.ArrivalActualForm = { ...this.selectedArrivalActual }
          this.OriginalForm = JSON.stringify(this.ArrivalActualForm.details)
          this.view_details = this.ArrivalActualForm.details.map(vd => {
            const obj = { ...vd, state: 0 }

            return obj
          })
          this.arrival_dt = this.ArrivalActualForm.actual_date.substring(0, 10)
          this.arrival_hour = this.ArrivalActualForm.actual_date.substring(11, 13)
          this.arrival_minute = this.ArrivalActualForm.actual_date.substring(14, 16)
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
      if (this.OriginalForm !== JSON.stringify(this.view_details)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    jumpToListPage() {
      this.$router.push({ path: '/arrivalactual-list', query: this.$route.params.query ?? {} })
    },
    refresh() {
      this.loadArrivalActual(this.$route.params.id)
        .then(() => {
          this.ArrivalActualForm = { ...this.selectedArrivalActual }
          this.view_details = this.ArrivalActualForm.details.map(vd => {
            const obj = { ...vd, state: 0 }

            return obj
          })
          this.buttonDisabled = true
          this.arrival_dt = this.ArrivalActualForm.actual_date.substring(0, 10)
          this.arrival_hour = this.ArrivalActualForm.actual_date.substring(11, 13)
          this.arrival_minute = this.ArrivalActualForm.actual_date.substring(14, 16)
          this.OriginalForm = JSON.stringify(this.ArrivalActualForm.details)
        })
        .catch(error => {
          this.submitStatus = false

          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
        })
    },

    changeState(item) {
      // eslint-disable-next-line no-param-reassign
      item.state = 1
      this.buttonDisabled = false
      this.changeDisable = true
    },
    addArrivalActual(item) {
      const Obj = { ...item }
      Obj.id = this.view_details.length
      Obj.detail_id = this.view_details.length + 1
      Obj.arrival_id = this.ArrivalActualForm.arrival_id
      Obj.product_id = ''
      Obj.arrival_goods_name = ''
      Obj.arrival_weight = ''
      Obj.state = 2
      Obj.crushing_status = 0
      Obj.arrival_date = this.ArrivalActualForm.actual_date
      this.view_details.push(Obj)
      this.buttonDisabled = false
      this.changeDisable = true
    },

    editSubmit(item, index) {
      this.$v.view_details.$each[index].$touch()
      if (!this.$v.$invalid) {
        this.editTodayArrivalDetail(item)
          .then(() => {
            // eslint-disable-next-line no-param-reassign
            item.state = 0
            this.buttonDisabled = true
            this.changeDisable = false

            this.loadArrivalActual(this.$route.params.id).then(() => {
              this.ArrivalActualForm = { ...this.selectedArrivalActual }
              this.view_details = this.ArrivalActualForm.details.map(vd => {
                const obj = { ...vd, state: 0 }

                return obj
              })
              this.arrival_dt = this.ArrivalActualForm.actual_date.substring(0, 10)
              this.arrival_hour = this.ArrivalActualForm.actual_date.substring(11, 13)
              this.arrival_minute = this.ArrivalActualForm.actual_date.substring(14, 16)
              this.OriginalForm = JSON.stringify(this.ArrivalActualForm.details)
            })
          })
          .catch(error => {
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)

            console.log('apierror', this.apierror)
          })
      } else {
        console.log('error submit!!')
      }
    },
    editCancel(item) {
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < this.ArrivalActualForm.details.length; index++) {
        if (this.ArrivalActualForm.details[index].aad_id === item.aad_id) {
          // eslint-disable-next-line no-param-reassign
          item.product_id = this.ArrivalActualForm.details[index].product_id
          // eslint-disable-next-line no-param-reassign
          item.arrival_goods_name = this.ArrivalActualForm.details[index].arrival_goods_name
          // eslint-disable-next-line no-param-reassign
          item.arrival_weight = this.ArrivalActualForm.details[index].arrival_weight
          // eslint-disable-next-line no-param-reassign
          item.crushing_status = this.ArrivalActualForm.details[index].crushing_status
        }
      }

      // eslint-disable-next-line no-param-reassign
      item.state = 0
      this.buttonDisabled = true
      this.changeDisable = false
    },
    addSubmit(item, index) {
      this.$v.view_details.$each[index].$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.createTodayArrivalDetail(item)
          .then(() => {
            this.submitStatus = false
            // eslint-disable-next-line no-param-reassign
            item.state = 0
            this.buttonDisabled = true
            this.changeDisable = false

            this.loadArrivalActual(this.$route.params.id).then(() => {
              this.ArrivalActualForm = { ...this.selectedArrivalActual }
              this.view_details = this.ArrivalActualForm.details.map(vd => {
                const obj = { ...vd, state: 0 }

                return obj
              })
              this.arrival_dt = this.ArrivalActualForm.actual_date.substring(0, 10)
              this.arrival_hour = this.ArrivalActualForm.actual_date.substring(11, 13)
              this.arrival_minute = this.ArrivalActualForm.actual_date.substring(14, 16)
              this.OriginalForm = JSON.stringify(this.ArrivalActualForm.details)
            })
          })
          .catch(error => {
            this.submitStatus = false

            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages = error.response.data.message
          })
      } else {
        console.log('error submit!!')
      }
    },
    addCancel(item) {
      this.view_details.splice(this.view_details.indexOf(item), 1)
      const id = []
      this.view_details.forEach((v, i) => {
        id[i] = v
        id[i].detail_id = i + 1
      })
      this.buttonDisabled = true
      this.changeDisable = false
    },

    setProductMaster(e, item) {
      if (this.view_details.indexOf(item) !== -1) {
        this.view_details[this.view_details.indexOf(item)].arrival_goods_name = this.productMaster[e]
      } else {
        console.log('setId-----> item does not exist')
      }
    },

    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('customerStore', ['loadSupplierIds']),
    ...mapActions('arrivalactualStore', ['editTodayArrivalDetail', 'loadArrivalActual', 'createTodayArrivalDetail']),
  },
}
</script>
