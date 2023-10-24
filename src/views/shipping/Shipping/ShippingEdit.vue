<template>
  <v-card>
    <v-card-title>出荷-編集</v-card-title>
    <template>
      <v-spacer></v-spacer>
      <template v-if="apierror.status=='error'">
        <div
          v-for="msg of apierror.messages"
          :key="msg"
        >
          <v-row class="ml-6 mb-3 ma-3">
            <span style="color: red">* {{ msg }} </span>
          </v-row>
        </div>
      </template>
    </template>
    <v-spacer></v-spacer>
    <v-form class="ma-6">
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label
            class="text-right"
            for="vanning_date"
          >出荷日<span style="color:red">*</span></label>
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
                v-model="$v.VanningForm.vanning_date.$model"
                :error-messages="vanningDateErrors"
                placeholder="出荷日"
                hide-details="auto"
                v-bind="attrs"
                clearable
                outlined
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="VanningForm.vanning_date"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label
            class="text-right"
            for="vanning_time"
          >出荷時<span style="color:red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="vanning_hour"
            :error-messages="vanningHourErrors"
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
            v-model="vanning_minute"
            :error-messages="vanningMinuteErrors"
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
          md="3"
        >
          <label
            class="text-right"
            for="container_no"
          >CONTAINER NO.</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            id="container_no"
            v-model="VanningForm.container_no"
            outlined
            dense
            placeholder="CONTAINER NO."
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label
            class="text-right"
            for="seal_no"
          >SEAL NO.</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            id="seal_no"
            v-model="VanningForm.seal_no"
            outlined
            dense
            placeholder="SEAL NO."
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <label for="vanning_memo">説明</label>
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-textarea
            v-model="$v.VanningForm.vanning_memo.$model"
            name="vanning_memo"
            outlined
            dense
            placeholder="説明"
            :error-messages="vanningMemoErrors"
            hide-details="auto"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label for="contract_status">契約状態<span style="color:red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="$v.VanningForm.vanning_status.$model"
            :items="VanningStatuses"
            outlined
            dense
            :error-messages="vanningStatusErrors"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label for="contract_id">取引先ID<span style="color:red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="$v.VanningForm.customer_id.$model"
            :error-messages="customerIdErrors"
            :items="customerIds"
            clearable
            outlined
            dense
            placeholder="取引先ID"
            hide-details="auto"
            @update:search-input="filterContractId"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label for="contract_id">契約ID<span style="color:red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="$v.VanningForm.contract_id.$model"
            :error-messages="contractIdErrors"
            :items="contractIds"
            clearable
            outlined
            dense
            placeholder="契約ID"
            hide-details="auto"
            @focus="setEditStatus"
            @update:search-input="refreshDetails"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label for="country">国名</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="VanningForm.country"
            :items="countryNames"
            clearable
            outlined
            dense
            placeholder="国名"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="3"
        >
          <label for="area">地域</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="VanningForm.area"
            :items="areaNames"
            clearable
            outlined
            dense
            placeholder="地域"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12">
          <v-card>
            <v-card-title>出荷予定</v-card-title>
            <v-data-table
              ref="Vannings"
              :loading="loading"
              :headers="shippingHeaders"
              :items="VanningForm.vanning_details"
              item-key="vd_id"
              fixed-header
            >
              <template v-slot:[`item.vanning_weight`]="{ item }">
                <label>{{ item.vanning_weight ? item.vanning_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
              </template>
              <template v-slot:[`item.mark`]="{ item }">
                <v-menu
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon
                        v-text="item.mark === '' ? '' : icons[marks[item.mark].icon]"
                      ></v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(mark, index) in marks"
                      :key="index"
                      @click="setMark(item, mark)"
                    >
                      <v-list-item-icon>
                        <v-icon>{{ icons[mark.icon] }}</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:[`item.label`]="{ item }">
                <v-menu
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="labels[item.label]"
                      placeholder="ラベル"
                      hide-details="auto"
                      v-bind="attrs"
                      outlined
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(lable, index) in labels"
                      :key="index"
                      @click="setLabel(item, lable)"
                    >
                      <v-list-item-title>{{ lable }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <!-- <template v-slot:[`item.country`]="{ item }">
                <v-menu
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.country"
                      hide-details="auto"
                      v-bind="attrs"
                      clearable
                      outlined
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(country, index) in countryNames"
                      :key="index"
                    >
                      <v-list-item-title @click="setCountry(item, country)">
                        {{ country }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <template v-slot:[`item.area`]="{ item }">
                <v-menu
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.area"
                      v-bind="attrs"
                      hide-details="auto"
                      clearable
                      outlined
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(area, index) in areaNames"
                      :key="index"
                    >
                      <v-list-item-title @click="setArea(item, area)">
                        {{ area }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template> -->
            </v-data-table>
          </v-card>
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
            @click="submit(VanningForm)"
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
  </v-card>
</template>

<script>
import {
  mdiPlus,
  mdiMagnify,
  mdiPlusCircle,
  mdiMinusCircle,
  mdiCircleOutline,
  mdiCircleDouble,
  mdiTriangleOutline,
  mdiStarOutline,
  mdiClose,
} from '@mdi/js'
import {
  maxLength,
  required,
} from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import Sortable from 'sortablejs'

export default {
  data: () => ({
    marks: [
      { text: '0', icon: '' },
      { text: '1', icon: 'mdiCircleOutline' },
      { text: '2', icon: 'mdiCircleDouble' },
      { text: '3', icon: 'mdiTriangleOutline' },
      { text: '4', icon: 'mdiStarOutline' },
    ],
    OriginalForm: {},
    labels: ['', '有'],
    loading: false,
    dateMenu: '',
    timeMenu: '',
    hours: ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17'],
    vanning_hour: '',
    minutes: ['00', '15', '30', '45'],
    vanning_minute: '',
    VanningForm: {
      vanning_id: '',
      vanning_date: '',
      vanning_time: '',
      vanning_memo: '',
      customer_id: '',
      contract_id: '',
      vanning_status: '',
      vanning_details: [],
      container_no: '',
      seal_no: '',
      country: '',
      area: '',
    },
    originalDetail: [],
    vannings: [],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    customerIds: [],
    contractIds: [],
    VanningStatuses: [
      '準備中', '準備完',
    ],
    vanning_status: {
      0: '準備中',
      1: '準備完',
      2: '出荷済',
    },
    icons: {
      mdiPlus,
      mdiMagnify,
      mdiPlusCircle,
      mdiMinusCircle,
      mdiCircleOutline,
      mdiCircleDouble,
      mdiTriangleOutline,
      mdiStarOutline,
      mdiClose,
    },
    editStatus: false,
    shippingHeaders: [
      {
        text: 'No.',
        align: 'left',
        sortable: false,
        value: 'detail_id',
        width: '5%',
        fixed: true,
      },
      {
        text: '契約ID',
        align: 'left',
        sortable: false,
        value: 'contract_id',
        width: '19%',
        fixed: true,
      },
      {
        text: '契約商品名',
        value: 'vanning_goods_name',
        sortable: false,
        align: 'center',
        width: '24%',
        fixed: true,
      },
      {
        text: '契約重量',
        value: 'vanning_weight',
        sortable: false,
        align: 'right',
        width: '24%',
        fixed: true,
      },
      {
        text: 'マーク',
        value: 'mark',
        sortable: false,
        align: 'center',
        width: '15%',
      },
      {
        text: 'ラベル',
        value: 'label',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
      },

      // {
      //   text: '国名',
      //   value: 'country',
      //   sortable: false,
      //   align: 'center',
      //   width: '15%',
      //   fixed: true,
      // },
      // {
      //   text: '地域',
      //   value: 'area',
      //   sortable: false,
      //   align: 'center',
      //   width: '15%',
      //   fixed: true,
      // },
    ],
    contractList: [],
    f_contracts: [],
    selectContracts: [],
    selectShippings: [],
    addBtnStatus: true,
    submitStatus: false,
  }),
  validations: {
    vanning_hour: {
      required,
    },
    vanning_minute: {
      required,
    },
    VanningForm: {
      vanning_date: {
        required,
      },
      vanning_time: {
        required,
      },
      customer_id: {
        required,
      },
      contract_id: {
        required,
      },
      vanning_memo: {
        maxLength: maxLength(200),
      },
      vanning_status: {
        required,
      },
    },
  },
  computed: {
    ...mapState('contractStore', ['contracts', 'contracteds', 'contractings', 'selectedContract']),
    ...mapState('customerStore', ['ccaList']),
    ...mapState('countryStore', ['countryNames']),
    ...mapState('areaStore', ['areaNames']),
    ...mapState('vanningStore', ['selectedVanning']),
    vanningIdErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_id.required && errors.push('必須項目')

      return errors
    },
    vanningDateErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_date.required && errors.push('必須項目')

      return errors
    },
    vanningHourErrors() {
      const errors = []
      if (!this.$v.vanning_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.vanning_hour.required && errors.push('必須項目')

      return errors
    },
    vanningMinuteErrors() {
      const errors = []
      if (!this.$v.vanning_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.vanning_minute.required && errors.push('必須項目')

      return errors
    },
    customerIdErrors() {
      const errors = []
      if (!this.$v.VanningForm.customer_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.customer_id.required && errors.push('必須項目')

      return errors
    },
    contractIdErrors() {
      const errors = []
      if (!this.$v.VanningForm.contract_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.contract_id.required && errors.push('必須項目')

      return errors
    },
    vanningStatusErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_status.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_status.required && errors.push('必須項目')

      return errors
    },
    vanningMemoErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_memo.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_memo.maxLength && errors.push('Description must be at most 45 characters long')

      return errors
    },
  },
  watch: {
    vanning_minute(val) {
      if (val && this.vanning_hour) {
        this.VanningForm.vanning_time = `${this.vanning_hour}:${val}:00`
      }
    },
    vanning_hour(val) {
      if (val && this.vanning_minute) {
        this.VanningForm.vanning_time = `${val}:${this.vanning_minute}:00`
      }
    },
  },
  created() {
    this.loadCustomers()
    this.loadCountryNames()
    this.loadAreaNames()
    this.loadContractIds()
    this.loadContracts().then(() => {
      this.loadVanning(this.$route.params.id).then(() => {
        this.contractings.forEach(c => {
          this.customerIds.push(c.customer_id)
          this.contractIds.push(c.contract_id)
        })

        this.VanningForm = { ...this.selectedVanning }
        this.VanningForm.vanning_status = this.vanning_status[this.selectedVanning.vanning_status]
        this.customerIds.push(this.selectedVanning.customer_id)
        this.vanning_hour = this.VanningForm.vanning_time.substring(0, 2)
        this.vanning_minute = this.VanningForm.vanning_time.substring(3, 5)

        this.originalDetail = [...this.VanningForm.vanning_details]
        this.VanningForm.vanning_details.forEach((v, i) => {
          this.originalDetail[i].contract_id = this.selectedVanning.contract_id
        })

        this.OriginalForm = JSON.stringify(this.VanningForm)
      })
    }).catch(error => {
      this.apierror.status = error.response.data.status
      this.apierror.code = error.response.data.code
      this.apierror.messages.push(error.response.data.message)
    })
  },

  mounted() {
    this.sortVannings()
  },
  methods: {
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.VanningForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    ...mapActions('contractStore', ['loadContract', 'loadContracts', 'loadContractIds']),
    ...mapActions('vanningStore', ['editVanning', 'loadVanning']),
    ...mapActions('customerStore', ['loadCustomers']),
    ...mapActions('countryStore', ['loadCountryNames']),
    ...mapActions('areaStore', ['loadAreaNames']),
    setEditStatus() {
      this.editStatus = true
      console.log('---------->setName', this.editStatus)
    },
    filterContractId(val) {
      console.log(val, this.contracts)
      if (val) {
        if (this.VanningForm.contract_id && this.contracts.find(c => c.contract_id === this.VanningForm.contract_id).customer_id !== val) {
          this.VanningForm.contract_id = ''
        }
        if (!this.VanningForm.country) {
          this.VanningForm.country = this.ccaList[this.VanningForm.customer_id].country_name
        }
        if (!this.VanningForm.area) {
          this.VanningForm.area = this.ccaList[this.VanningForm.customer_id].area_name
        }
        const filterObj = this.contractings.filter(c => c.customer_id === val)
        this.contractIds = filterObj.map(f => f.contract_id)
      } else {
        this.VanningForm.contract_id = ''
        this.contractIds = this.contractings.map(c => c.contract_id)
      }
      if (this.selectedVanning && this.selectedVanning.customer_id === val) {
        this.contractIds.push(this.selectedVanning.contract_id)
      } else {
        console.log('this.selectedVanning is null')
      }
      console.log('change ctt', this.contractIds)
    },
    refreshDetails(val) {
      if (this.editStatus && val) {
        if (this.contractings.find(c => c.contract_id === val)) {
          this.loading = true
          this.loadContract(val).then(() => {
            const filterContracts = { ...this.selectedContract }
            console.log('000', filterContracts)
            if (!this.VanningForm.customer_id) {
              this.VanningForm.customer_id = filterContracts.customer_id
            }
            this.VanningForm.vanning_details = filterContracts.contract_details.map(cd => (
              {
                cd_id: cd.cd_id,
                detail_id: cd.detail_id,
                contract_id: cd.contract_id,
                vanning_goods_name: cd.contract_goods_name,
                vanning_weight: cd.contract_weight,
                mark: 0,
                label: 0,
              }
            ))
            this.loading = false
          })
        } else {
          this.customerIds.push(this.selectedVanning.customer_id)
          this.VanningForm.customer_id = this.selectedVanning.customer_id
          this.VanningForm.vanning_details = this.originalDetail
        }
      } else if (this.editStatus) {
        this.VanningForm.vanning_details = []
      }
    },
    setMark(item, mark) {
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].mark = mark.text
      console.log(this.vannings)
    },
    setLabel(item, lb) {
      console.log(lb)
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].label = this.labels.indexOf(lb)
      console.log(this.vannings)
    },
    setCountry(item, country) {
      console.log(country)
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].country = country
      console.log(this.vannings)
    },
    setArea(item, area) {
      console.log(area)
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].area = area
      console.log(this.vannings)
    },
    sortVannings() {
      const el = this.$refs.Vannings.$el.querySelectorAll('.v-data-table__wrapper > table> tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        sort: true,
        animation: 150,
        group: {
          name: 'Vanning',
          pull: true,
          put: true,
        },
        setData(dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent)
        },
        onEnd: evt => {
          console.log(evt.oldIndex, evt.newIndex)
          const item = this.VanningForm.vanning_details[evt.oldIndex]
          this.VanningForm.vanning_details.splice(evt.oldIndex, 1)
          this.VanningForm.vanning_details.splice(evt.newIndex, 0, item)

          const orderVannings = []
          this.VanningForm.vanning_details.forEach((v, i) => {
            orderVannings[i] = v
            orderVannings[i].detail_id = i + 1
            console.log(i, orderVannings[i])
          })
          console.log(this.VanningForm.vanning_details)
        },
      })
    },
    jumpToListPage() {
      this.$router.push({ path: '/shipping-list', query: this.$route.params.query ?? {} })
    },
    submit(VanningForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...VanningForm }
        submitForm.vanning_status = Object.keys(this.vanning_status).find(k => this.vanning_status[k] === VanningForm.vanning_status)

        this.editVanning(submitForm).then(() => {
          this.submitStatus = false
          this.jumpToListPage()
          console.log('addContract', submitForm)
        }).catch(error => {
          this.submitStatus = false
          console.log(error.response.data)
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)

          console.log('apierror', this.apierror)
        })
      } else {
        console.log('error submit!!')
      }
    },
  },
}
</script>
