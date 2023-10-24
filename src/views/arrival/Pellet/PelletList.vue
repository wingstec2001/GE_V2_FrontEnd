<template>
  <div id="aad-list">
    <v-card>
      <v-card-title>ペレット入荷 一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="customer_id"
            :items="supplierIds"
            placeholder="仕入先ID"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="product_id"
            :items="productIds"
            placeholder="ペレットID"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            v-model="dateStartMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                placeholder="From"
                dense
                hide-details
                readonly
                outlined
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="dateStartMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            v-model="dateEndMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                placeholder="To"
                dense
                outlined
                hide-details
                readonly
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @input="dateEndMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
      <v-card-text class="d-flex align-center flex-wrap pb-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          outlined
          hide-details
          dense
          class="user-search me-3 mb-4"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <div class="d-flex align-center flex-wrap">
          <v-btn
            color="primary"
            class="mb-4 me-3"
            @click="newItem()"
          >
            <span>NEW</span>
          </v-btn>
          <v-btn
            color="secondary"
            outlined
            class="mb-4"
            @click="downloadCSV"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>EXPORT</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        ref="filteredTable"
        :headers="headers"
        :items="arrivalPellets"
        :search="searchQuery"
        sort-by
        class="elevation-1"
      >
        <template
          v-slot:[`item.aad_id`]="{ item }"
        >
          {{ item.aad_id }}
        </template>
        <template
          v-slot:[`item.arrival_weight`]="{ item }"
        >
          <label>{{ item.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
        </template>

        <template v-slot:[`item.crushing_status`]="{ item }">
          <!-- <td style="text-align: center"> -->
          <label>{{
            crushingStatuses[item.crushing_status] ? crushingStatuses[item.crushing_status].text : null
          }}</label>
          <!-- </td> -->
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row v-if="!item.blended">
            <v-col
              style="padding-right: 10px"
              cols="2"
            >
              <v-icon
                class="mr-2"
                small
                @click="editItem(item)"
              >
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>

            <v-col
              style="padding-left: 10px"
              cols="2"
            >
              <delete-form
                :icon="icons.mdiDelete"
                :aad-id="item.aad_id"
                @deleted="loadData"
                @cancel="loadData"
              ></delete-form>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`body.append`]>
          <tr v-if="product_id">
            <td
              class="font-weight-bold"
              style="background: #fafafa"
              :colspan="2"
            >
              <label>{{ product_id }}の合計</label>
            </td>
            <td
              style="background: #fafafa"
              :colspan="2"
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
  </div>
</template>
<script>
/*eslint-disable*/
import { mdiPencil, mdiDelete, mdiExportVariant, mdiCalendar, mdiPageNextOutline, mdiMinus, mdiPlus } from '@mdi/js'
/*eslint-disable*/
import { mapActions, mapMutations, mapState } from 'vuex'
import DeleteForm from './PelletDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icons: {
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
      mdiCalendar,
      mdiPageNextOutline,
      mdiMinus,
      mdiPlus,
    },
    startDate: '',
    endDate: '',
    dateEndMenu: false,
    dateStartMenu: false,
    product_id: '',
    customer_id: '',
    crushing_status: '',
    crushingStatuses: [
      { text: '未粉砕', value: '0' },
      { text: '粉砕済', value: '1' },
    ],
    // arrivalDetailsList: [],
    view_details: [],
    searchQuery: '',
    isExpand: false,
    headers: [
      {
        text: 'No.',
        value: 'aad_id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '入荷日時',
        align: 'left',
        sortable: true,
        value: 'arrival_date',
        width: '15%',
        fixed: true,
      },
      {
        text: '仕入先ID',
        value: 'customer_id',
        align: 'left',
        width: '20%',
        sortable: true,
        fixed: false,
      },
      
      {
        text: 'ペレットID',
        value: 'product_id',
        align: 'left',
        width: '15%',
        sortable: true,
        fixed: true,
      },
      
      {
        text: '重量(kg)',
        value: 'arrival_weight',
        align: 'right',
        width: '15%',
        fixed: true,
      },
      
      
      
      {
        text: '備考',
        value: 'note',
        align: 'left',
        width: '15%',
        sortable: false,
        fixed: false,
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

  computed: {
    ...mapState('arrivalactualStore', ['arrivalPellets']),
    ...mapState('customerStore', ['supplierIds']),
    ...mapState('productStore', ['productIds']),
    arrDateTime() {
      return function (group) {
        const result = this.arrivalactualList.find(a => a.arrival_id === group)

        return result.actual_date.substring(0, 16)
      }
    },
    cusIdTitle() {
      return function (group) {
        const result = this.arrivalactualList.find(a => a.arrival_id === group)

        return result.customer_id
      }
    },
    cusNameTitle() {
      return function (group) {
        const result = this.arrivalactualList.find(a => a.arrival_id === group)

        return result.customer_name
      }
    },
    sumWeight() {
      let sum = 0
      this.arrivalPellets.forEach(a => {
        if (a.product_id === this.product_id) {
          sum += a.arrival_weight
        }
      })

      return sum
    },
  },

  watch: {
    customer_id(newValue) {
      this.changeRouteQuery('customer_id', newValue)
      if (this.product_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    product_id(newValue) {
      this.changeRouteQuery('product_id', newValue)
      if (newValue) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    crushing_status(newValue) {
      this.changeRouteQuery('crushing_status', newValue)
      if (this.product_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    startDate(newValue) {
      this.changeRouteQuery('startDate', newValue)
      if (this.product_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    endDate(newValue) {
      this.changeRouteQuery('endDate', newValue)
      if (this.product_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },

    // arrivalPellets(value) {
    //   this.arrivalDetailsList = value
    // },
  },
  mounted() {
    this.loadQuery()
    this.changeRouteQuery()
    this.loadData(false)
    this.loadSupplierIds()
    this.loadProductIds()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('customerStore', ['loadSupplierIds']),
    ...mapActions('arrivalactualStore', ['loadArrivalPellets', 'loadArrivalPellet']),
    ...mapMutations('app', ['setOverlayStatus']),

    expandOrCollapse(status) {
      this.$refs.arrivalActual.openCache = {}
      this.$nextTick(() => {
        this.isExpand = status
        Object.keys(this.$refs.arrivalActual.openCache).forEach(k => {
          this.$refs.arrivalActual.openCache[k] = status
        })

      })
    },
    loadData() {
      this.setOverlayStatus(true)
      this.loadArrivalPellets(this.$route.query).then(() => {
 
        this.setOverlayStatus(false)

      })
    },

    newItem() {
        this.$router.push({
        name: 'arrivalpellet-create',
        params: {
          product_id: this.$route.query.product_id,
          customer_id: this.$route.query.customer_id,
          crushing_status: this.$route.query.crushing_status,
          query: this.$route.query,
        },
      })
    },

    editItem(item) {
      
      this.$router.push({ name: 'arrivalpellet-edit', params: { id: item.aad_id, query: this.$route.query } })
    },
    detailItem(arrivalId) {
      this.$router.push({ name: 'arrivalpellet-detail', params: { id: arrivalId, query: this.$route.query } })
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
    loadQuery() {
      this.product_id = this.$route.query.product_id ?? ''

      this.customer_id = this.$route.query.customer_id ?? ''
      this.startDate = this.$route.query.startDate ?? ''
      this.endDate = this.$route.query.endDate ?? ''
    },

    // 画面で表示されている情報をcsvにダウンロードする
    downloadCSV(arrivalId) {
      const items = this.$refs.filteredTable.$children[0].filteredItems
      const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No.,入荷ID,入荷日時, 材料ID,粉砕状態,重量(kg),仕入先ID,備考\n'
      let no = 0
      sorted.forEach(el => {
        no += 1

        const status = el.crushing_status ? '粉砕済' : '未粉砕'
        const customer_id = el.customer_id ?? ''
        const weight = el.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        const note = el.note ?? ''
        const line = `${no},"${el.aad_id}","${el.arrival_date}","${el.product_id}","${status}","${weight}","${customer_id}","${note}"\n`
        csv += line
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)

      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')

      link.download = '入荷実績'.concat('-', newstr, '.csv')
      link.click()
    },

    getArrivalId(item){
    
      let strAID =  item.arrival_id? item.arrival_id.toString():''
  
      strAID=strAID.padStart(6,0)+ '-' + item.rowno.toString().padStart(2,0) 
     
      return  item.aad_id.toString() + "(" + strAID +  ")"
    }
   
  },
}
</script>
<style scoped>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
.v-data-table { 
  overflow-x: auto !important;
}
</style>
