<template>
  <v-card>
    <v-card-title>ブレンド実績-新規</v-card-title>
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
    </template>
    <v-spacer></v-spacer>
    <v-form class="ma-6">
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="text-right"
            for="blended_dt"
          >ブレンド日<span style="color: red">*</span></label>
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
                v-model="blender_date"
                :error-messages="blenderDateErrors"
                placeholder="ブレンド日"
                hide-details="auto"
                v-bind="attrs"
                clearable
                outlined
                readonly
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="blender_date"
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
          <label class="text-right">ブレンド時間<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="blender_hour"
            :error-messages="blenderHourErrors"
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
            v-model="blender_minute"
            :error-messages="blenderMinuteErrors"
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
          <label for="material_id">材料ID</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            id="material_id"
            v-model="material_id"
            :items="materialIds"
            outlined
            clearable
            dense
            placeholder="材料ID"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="origin">仕入先</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            id="origin"
            v-model="origin"
            :items="supplierIds"
            outlined
            clearable
            dense
            placeholder="仕入先ID"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="text-left"
            for="weight"
          >ブレンド重量<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <WeightInput
            v-model="blended_weight"

            :outlined="true"
            hide-details="auto"
          ></WeightInput>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-btn
            color="primary"
            outlined
            @click="addBlenderByWeight()"
          >
            <v-icon class="me-1">
              {{ icons.mdiPlus }}
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
        </v-col>
        <v-col
          cols="
          12"
          md="2"
        >
          <v-btn
            color="secondary"
            outlined
            class="me-1"
            a
            @click="downloadCSV"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12">
          <v-card>
            <v-card-title>ブレンド対象</v-card-title>
            <v-data-table
              ref="filteredTable"
              :headers="headers"
              :items="StockCrushedList"
              fixed-header
            >
              <template v-slot:[`item.crushed_weight`]="{ item }">
                <label>{{ item.crushed_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon
                  class="mr-2"
                  color="primary"
                  @click.once="addSubmit(item)"
                >
                  <v-icon small>
                    {{ icons.mdiPlusThick }}
                  </v-icon>
                </v-btn>
              </template>
              <template v-slot:[`body.append`]>
                <tr v-if="material_id">
                  <td
                    class="font-weight-bold"
                    style="background: #fafafa"
                    :colspan="2"
                  >
                    <label>{{ material_id }}の合計</label>
                  </td>
                  <td
                    style="background: #fafafa"
                    :colspan="1"
                  ></td>
                  <td
                    class="font-weight-bold"
                    style="text-align: right; background: #fafafa"
                  >
                    <label>{{ sumWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                  </td>
                  <td
                    style="background: #fafafa"
                    :colspan="1"
                  ></td>
                </tr>
              </template>
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
            class="mx-2"
            outlined
            @click="cancelClick"
          >
            OK
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import { mdiPlusThick, mdiPlus, mdiExportVariant } from '@mdi/js'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    icons: {
      mdiPlusThick, mdiPlus, mdiExportVariant,
    },
    blended_weight: 0,
    StockCrushedList: [],
    dateMenu: '',
    timeMenu: '',
    blender_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
    blender_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    blender_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
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
    BlenderForm: {
      blended_dt: '',
      material_id: '',
      blended_weight: '',
      stock_crushed_id: '',
    },
    material_id: '',
    origin: '',
    materialIds: [],
    supplierIds: [],
    changeFlag: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },

    submitStatus: false,
    headers: [
      {
        text: '在庫No.',
        align: 'left',
        sortable: true,
        value: 'id',
        width: '10%',
        fixed: true,
      },
      {
        text: '材料ID',
        align: 'left',
        sortable: true,
        value: 'material_id',
        width: '15%',
        fixed: true,
      },

      {
        text: '入庫日時',
        align: 'left',
        sortable: true,
        value: 'stocked_dt',
        width: '15%',
        fixed: true,
      },

      // {
      //   text: '入荷ID',
      //   align: 'right',
      //   sortable: true,
      //   value: 'aad_id',
      //   width: '10%',
      //   fixed: true,
      // },

      // {
      //   text: '粉砕ID',
      //   align: 'right',
      //   sortable: true,
      //   value: 'crushed_id',
      //   width: '10%',
      //   fixed: true,
      // },

      {
        text: '重量(kg)',
        value: 'crushed_weight',
        sortable: true,
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: 'From',
        align: 'left',
        sortable: true,
        value: 'origin',
        width: '15%',
        fixed: true,
      },
      {
        text: '備考',
        align: 'left',
        sortable: false,
        value: 'note',
        width: '15%',
        fixed: true,
      },

      // {
      //   text: '備考',
      //   value: 'note',
      //   sortable: true,
      //   align: 'left',
      //   width: '15%',
      //   fixed: true,
      // },
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
    blender_hour: {
      required,
    },
    blender_minute: {
      required,
    },
    blender_date: {
      required,
    },

  },
  computed: {
    // ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('stockCrushingStore', ['f_StockCrushed', 'StockCrushed']),

    material_name() {
      if (this.materialMaster) {
        const materialKey = this.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },
    blenderDateErrors() {
      const errors = []
      if (!this.$v.blender_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_date.required && errors.push('必須項目')

      return errors
    },
    blenderHourErrors() {
      const errors = []
      if (!this.$v.blender_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_hour.required && errors.push('必須項目')

      return errors
    },
    blenderMinuteErrors() {
      const errors = []
      if (!this.$v.blender_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_minute.required && errors.push('必須項目')

      return errors
    },

    sumWeight() {
      let sum = 0
      this.StockCrushedList.forEach(a => {
        if (a.material_id === this.material_id) {
          sum += a.crushed_weight
        }
      })

      return sum
    },
  },
  watch: {
    material_id(newValue) {
      this.filterStockCrushed({ material_id: this.material_id, origin: this.origin })
      this.StockCrushedList = this.f_StockCrushed
      this.supplierIds = this.f_StockCrushed.map(fs => fs.origin).sort()

      this.changeRouteQuery('material_id', newValue)
      this.refreshList(newValue)

      // console.log('material_id:', newValue, this.material_id)
      // this.filterStockCrushed({ material_id: this.material_id })
      // this.StockCrushedList = this.f_StockCrushed
    },

    origin() {
      this.filterStockCrushed({ material_id: this.material_id, origin: this.origin })
      this.StockCrushedList = this.f_StockCrushed
      this.materialIds = this.f_StockCrushed.map(fs => fs.material_id).sort()
    },

    blender_date: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    blender_hour: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    blender_minute: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },

  created() {
    this.material_id = this.$route.query.material_id ?? ''
    this.refreshList()
  },

  methods: {
    ...mapActions('stockCrushingStore', ['loadStockCrushed']),
    ...mapMutations('stockCrushingStore', ['filterStockCrushed']),
    ...mapActions('blenderStore', ['createBlender', 'addByWeight']),
    ...mapMutations('app', ['setOverlayStatus']),

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
    jumpToListPage() {
      this.$router.push({ path: '/blender-list', query: this.$route.params.query ?? {} })
    },

    addSubmit(item) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        const submitForm = {
          blended_dt: `${this.blender_date} ${this.blender_hour}:${this.blender_minute}:00`,
          material_id: '',
          blended_weight: '',
          stock_crushed_id: item.id,
        }
        this.setOverlayStatus(true)
        this.createBlender(submitForm)
          .then(() => {
            this.refreshList()
          })
          .catch(error => {
            this.submitStatus = false
            this.setOverlayStatus(true)
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages = error.response.data.message
          })
      } else {
        console.log('error submit!!')
      }
    },

    refreshList() {
      this.setOverlayStatus(true)
      this.loadStockCrushed({ material_id: this.material_id }).then(() => {
        this.filterStockCrushed({ material_id: this.material_id })

        this.StockCrushedList = this.StockCrushed

        this.materialIds = this.f_StockCrushed.map(fs => fs.material_id).sort()

        this.supplierIds = this.f_StockCrushed.map(fs => fs.origin).sort()

        if (this.f_StockCrushed.length === 0) {
          this.material_id = ''
          this.origin = ''
        }

        this.submitStatus = false
        this.setOverlayStatus(false)
      })
    },

    // 重量によるブレンド実績を作成
    addBlenderByWeight() {
      if (this.material_id === '' || this.material_id === null) {
        alert('材料IDを選択してください！')

        return
      }

      if (this.blended_weight <= 0) {
        alert('粉砕重量を１以上にしてください！')

        return
      }
      this.$v.$touch()

      if (!this.$v.$invalid) {
        let isBigger = true

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.f_StockCrushed.length; i++) {
          if (this.blended_weight <= this.f_StockCrushed[i].crushed_weight) {
            isBigger = false
            break
          }
        }

        if (isBigger) {
          /* eslint no-alert: */
          alert('ブレンド重量を分割して下さい!')

          return
        }

        const info = {
          material_id: this.material_id,
          blended_weight: this.blended_weight,
          blended_dt: `${this.blender_date} ${this.blender_hour}:${this.blender_minute}:00`,

        }
        this.submitStatus = true
        this.setOverlayStatus(true)
        this.addByWeight(info).then(() => {
          this.refreshList()
          this.blended_weight = 0
        })
      }
    },

    changeRouteQuery(key, val) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      if (val) {
        query[key] = val
      } else {
        delete query[key]
      }
      this.$router.push({ path: this.$route.path, query })
    },

    downloadCSV() {
      const items = this.$refs.filteredTable.$children[0].filteredItems
      const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

      console.log('download,csv:', sorted)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No.,在庫No,粉砕済入庫日時, 材料ID,重量(kg),仕入先ID,備考\n'
      let no = 0
      sorted.forEach(el => {
        no += 1

        const customerId = el.origin ?? ''
        const weight = el.crushed_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        const note = el.note ?? ''
        const line = `${no},"${el.id}","${el.stocked_dt}","${el.material_id}","${weight}","${customerId}","${note}"\n`
        csv += line
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)

      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')

      link.download = '粉砕済在庫一覧'.concat('-', newstr, '.csv')
      link.click()
    },
  },
}
</script>
