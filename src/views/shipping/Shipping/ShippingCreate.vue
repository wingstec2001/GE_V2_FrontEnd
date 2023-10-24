<template>
  <v-card>
    <v-card-title>出荷-新規</v-card-title>
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
      <!-- <v-row align="center">
        <v-col cols="12" md="3">
          <label class="text-right" for="vanning_id">出荷ID<span style="color:red">*</span></label>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            id="vanning_id"
            v-model="$v.VanningForm.vanning_id.$model"
            :error-messages="vanningIdErrors"
            outlined
            dense
            placeholder="出荷ID"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
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
          md="2"
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
          md="2"
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
          md="2"
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
          md="2"
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
          md="2"
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
          md="2"
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
            @update:search-input="refreshDetails"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
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
          md="2"
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
              item-key="cd_id"
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
      vanning_details: [],
      container_no: '',
      seal_no: '',
      country: '',
      area: '',
    },
    OriginalForm: {
      vanning_id: '',
      vanning_date: '',
      vanning_time: '',
      vanning_memo: '',
      customer_id: '',
      contract_id: '',
      vanning_details: [],
      container_no: '',
      seal_no: '',
      country: '',
      area: '',
    },
    changeFlag: false,
    vannings: [],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    customerIds: [],
    contractIds: [],
    f_contractIds: [],
    status: {
      1: '仮契約',
      2: '契約済',
      3: '出荷可',
      4: '出荷済',
      9: '取消',
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
        width: '19%',
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
        width: '15%',
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

      // vanning_id: {
      //   required,
      // },
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
    },
  },
  computed: {
    ...mapState('contractStore', ['contractings', 'selectedContract']),
    ...mapState('customerStore', ['ccaList']),
    ...mapState('countryStore', ['countryNames']),
    ...mapState('areaStore', ['areaNames']),
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
    vanningTimeErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_time.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_time.required && errors.push('必須項目')

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
    vanningMemoErrors() {
      const errors = []
      if (!this.$v.VanningForm.vanning_memo.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.VanningForm.vanning_memo.maxLength && errors.push('Description must be at most 45 characters long')

      return errors
    },
  },
  watch: {
    VanningForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    vanning_minute(val) {
      if (val && this.vanning_hour) {
        this.VanningForm.vanning_time = `${this.vanning_hour}:${val}:00`
      }
    },
    vanning_hour(val) {
      if (val && this.vanning_minute) {
        this.VanningForm.vanning_time = `${this.vanning_hour}:${val}:00`
      }
    },
  },
  created() {
    this.loadCustomers()
    this.loadCountryNames()
    this.loadAreaNames()
    this.loadContractIds()
    this.loadContracts().then(() => {
      this.contractings.forEach(c => {
        this.customerIds.push(c.customer_id)
        this.contractIds.push(c.contract_id)
      })
    })
  },

  mounted() {
    this.sortVannings()
  },
  methods: {
    ...mapActions('contractStore', ['loadContract', 'loadContracts', 'loadContractIds']),
    ...mapActions('vanningStore', ['createVanning']),
    ...mapActions('customerStore', ['loadCustomers']),
    ...mapActions('countryStore', ['loadCountryNames']),
    ...mapActions('areaStore', ['loadAreaNames']),

    cancelClick() {
      // if (this.changeFlag) {
      if (JSON.stringify(this.VanningForm) !== JSON.stringify(this.OriginalForm) || this.vanning_minute !== '' || this.vanning_hour !== '') {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },

    filterContractId(val) {
      if (val) {
        if (this.VanningForm.contract_id && this.contractings.find(c => c.contract_id === this.VanningForm.contract_id).customer_id !== val) {
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
    },
    refreshDetails(val) {
      if (val) {
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

        // const filterContracts = this.contractings.filter(c => c.contract_id === val)
        // console.log('000', filterContracts)
        // filterContracts.forEach(f => {
        //   this.VanningForm.vanning_details = f.contract_details.map(cd => cd)
        // })
        // this.VanningForm.customer_id = filterContracts[0].customer_id
        // console.log('111', this.VanningForm.vanning_details)
        // this.VanningForm.vanning_details = this.VanningForm.vanning_details.map(vd => (
        //   {
        //     cd_id: vd.cd_id,
        //     detail_id: vd.detail_id,
        //     contract_id: vd.contract_id,
        //     vanning_goods_name: vd.contract_goods_name,
        //     vanning_weight: vd.contract_weight,
        //     mark: 0,
        //     label: 0,
        //     country: this.ccaList[this.VanningForm.customer_id].country_name,
        //     area: this.ccaList[this.VanningForm.customer_id].area_name,
        //   }
        // ))
        // console.log('222', this.VanningForm.vanning_details)
      } else {
        this.VanningForm.vanning_details = []
        this.customerIds = this.contractings.map(c => c.customer_id)
      }
    },
    setMark(item, mark) {
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].mark = mark.text
    },
    setLabel(item, lb) {
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].label = this.labels.indexOf(lb)
    },
    setCountry(item, country) {
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].country = country
    },
    setArea(item, area) {
      this.vannings = [...this.VanningForm.vanning_details]
      this.vannings[this.vannings.indexOf(item)].area = area
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

        // submitForm.vanning_details = submitForm.vanning_details.map(vd => (
        //   {
        //     detail_id: vd.detail_id,
        //     contract_id: vd.contract_id,
        //     vanning_goods_name: vd.vanning_goods_name,
        //     vanning_weight: parseInt(vd.vanning_weight.replaceAll(',', ''), 10),
        //     mark: vd.mark,
        //     label: vd.label,
        //     country: vd.country,
        //     area: vd.area,
        //   }
        // ))
        console.log(submitForm)

        this.createVanning(submitForm).then(() => {
          this.submitStatus = false
          this.jumpToListPage()
        }).catch(error => {
          this.submitStatus = false
          console.log(error.response.data)
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages = error.response.data.message

          console.log('apierror', this.apierror)
        })
      } else {
        console.log('error submit!!')
        console.log('error', VanningForm)
      }
    },
  },
}
</script>
