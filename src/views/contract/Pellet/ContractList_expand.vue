<template>
  <div id="contrated-list">
    <v-card>
      <v-card-title> 契約一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="contract_id"
            placeholder="契約ID"
            :items="contractIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="product_id"
            placeholder="ペレットID"
            :items="productIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="customer_id"
            placeholder="取引先ID"
            :items="customerIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="contract_status"
            :items="contractStatuses"
            placeholder="契約状態"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="2"
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
                outlined
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
                readonly
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
          md="2"
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
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
                readonly
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
            :to="{ name: 'contract-create', params: { query: this.$route.query } }"
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
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        ref="contracts"
        class="class-on-data-table elevation-1"
        :headers="headers"
        :items="contractList"
        :group-by="['id']"
        :group-desc="['fasle']"
        :search="searchQuery"
        fixed-header
        :items-per-page="10"
        @update:page="expandOrCollapse(isExpand)"
      >
        <template v-slot:[`header.product_id`]="{ header }">
          <v-btn
            icon
            @click="expandOrCollapse(!isExpand)"
          >
            <v-icon>{{ isExpand ? icons.mdiMinus : icons.mdiPlus }}</v-icon>
          </v-btn>
          <label style="padding-left: 50%">{{ header.text }}</label>
        </template>
        <template v-slot:[`group.header`]="{ group, isOpen, toggle }">
          <td style="background: #fafafa">
            <v-btn
              icon
              @click="toggle"
            >
              <v-icon>{{ isOpen ? icons.mdiMinus : icons.mdiPlus }}</v-icon>
            </v-btn>
            <label>No：</label><label>{{ cttId(group) }}</label> <label>契約ID：</label><label>{{ cttIdTitle(group) }}</label>
          </td>
          <td style="background: #fafafa">
            <label></label><label>{{ contrDateTitle(group) }}</label>
          </td>
          <td style="background: #fafafa">
            <label>{{ cusIdTitle(group) }}, {{ cusNameTitle(group) }}</label>
          </td>
          <td style="text-align: right; background: #fafafa">
            <label>{{ sumContractWgt(group) }}</label>
          </td>
          <td style="background: #fafafa">
            <label>{{ contractStatus(group) }}</label>
          </td>
          <td style="background: #fafafa">
            <v-row v-if="contractStatus(group) !== '出荷可'">
              <v-col
                style="padding-right: 0px"
                cols="6"
              >
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(cttId(group))"
                >
                  {{ icons.mdiPencil }}
                </v-icon>
              </v-col>
              <v-col
                style="padding-left: 0px"
                cols="6"
              >
                <contract-delete
                  :icon="icons.mdiDelete"
                  :contract-id="cttIdTitle(group)"
                  @deleted="loadData(false)"
                  @cancel="loadData(false)"
                ></contract-delete>
              </v-col>
            </v-row>
          </td>
        </template>
        <template v-slot:[`item.product_id`]="{ item }">
          <label style="padding-left: 59%">{{ item.product_id }}</label>
        </template>
        <template v-slot:[`item.contract_weight`]="{ item }">
          <label>{{
            item.contract_weight ? item.contract_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
          }}</label>
        </template>
        <template v-slot:[`body.append`]>
          <tr v-if="product_id">
            <td
              class="font-weight-bold"
              :colspan="3"
              style="background: #fafafa"
            >
              <label>{{ product_id }}の合計</label>
            </td>
            <td
              class="font-weight-bold"
              style="text-align: right; background: #fafafa"
            >
              <label>{{ sumWgt }}</label>
            </td>
            <td
              style="background: #fafafa"
              :colspan="2"
            ></td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import { mdiPencil, mdiDelete, mdiExportVariant, mdiCalendar, mdiMinus, mdiPlus } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import ContractDelete from './ContractDelete.vue'
/* eslint-disable */
export default {
  components: {
    ContractDelete,
  },
  data: () => ({
    icons: {
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
      mdiCalendar,
      mdiMinus,
      mdiPlus,
    },
    dateEndMenu: '',
    dateStartMenu: '',
    contractList: [],
    contract_status: '',
    contractStatuses: [
      { text: '仮契約', value: '1' },
      { text: '契約済', value: '2' },
      { text: '出荷可', value: '3' },
      { text: '出荷済', value: '4' },
      { text: '取消', value: '9' },
    ],
    searchBar: {},
    searchQuery: '',
    product_id: '',
    contract_id: '',
    customer_id: '',
    startDate: '',
    endDate: '',
    isExpand: false,
    headers: [
      // {
      //   text: '契約ID',
      //   align: 'left',
      //   value: 'contract_id',
      //   width: '13%',
      //   fixed: true,
      // },
      // {
      //   text: '契約名',
      //   value: 'contract_name',
      //   align: 'left',
      //   width: '15%',
      //   fixed: true,
      // },
      {
        text: 'ペレットID',
        value: 'product_id',
        align: 'left',
        width: '35%',
        sortable: false,
        fixed: true,
      },
      {
        text: '',
        value: '',
        align: 'left',
        width: '15%',
        sortable: false,
        fixed: true,
      },
      {
        text: '',
        value: '',
        align: 'left',
        width: '20%',
        sortable: false,
        fixed: true,
      },

      // {
      //   text: '取引先ID',
      //   value: 'customer_id',
      //   align: 'left',
      //   width: '30%',
      //   fixed: true,
      // },
      {
        text: '契約重量',
        value: 'contract_weight',
        align: 'right',
        width: '10%',
        sortable: true,
        fixed: true,
      },
      {
        text: '',
        value: '',
        align: 'left',
        width: '12%',
        sortable: false,
        fixed: true,
      },

      // {
      //   text: '総金額',
      //   value: 'totalAmount',
      //   sortable: false,
      //   align: 'right',
      //   width: '12%',
      //   fixed: true,
      // },
      // {
      //   text: 'Status',
      //   value: 'contract_status',
      //   sortable: false,
      //   align: 'center',
      //   width: '30%',
      //   fixed: true,
      // },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('productStore', ['productIds']),
    ...mapState('customerStore', ['customerIds']),
    ...mapState('contractStore', ['contracts', 'f_contracts', 'contractIds']),
    cttId() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)

        return result.id
      }
    },
    cttIdTitle() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)

        return result.contract_id
      }
    },
    cusIdTitle() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)

        return result.customer_id
      }
    },
    cusNameTitle() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)

        return result.customer_name
      }
    },
    contrDateTitle() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)

        return result.contract_date
      }
    },
    sumContractWgt() {
      return function (group) {
        let sum = 0
        this.contractList.forEach(c => {
          if (c.id === group) {
            sum += c.contract_weight
          }
        })

        return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
      }
    },
    sumWgt() {
      let sum = 0
      this.contractList.forEach(a => {
        if (a.product_id === this.product_id) {
          sum += a.contract_weight
        }
      })

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    contractStatus() {
      return function (group) {
        const result = this.contractList.find(c => c.id === group)
        const status = this.contractStatuses.find(cs => cs.value === result.contract_status.toString())

        return status.text ? status.text : null
      }
    },
  },
  watch: {
    contract_id(newValue) {
      this.changeRouteQuery('contract_id', newValue)
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
    customer_id(newValue) {
      this.changeRouteQuery('customer_id', newValue)
      if (this.product_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    contract_status(newValue) {
      this.changeRouteQuery('contract_status', newValue)
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
  },
  created() {
    this.loadQuery()
    this.changeRouteQuery()
    this.loadContractIds()
    this.loadProductIds()
    this.loadCustomerIds()
    this.loadData(false)
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapActions('contractStore', ['loadContracts', 'deleteContract', 'loadContractIds']),
    ...mapMutations('app', ['setOverlayStatus']),
   
   expandOrCollapse(status) {
      this.$refs.contracts.openCache = {}
      this.$nextTick(() => {
        this.isExpand = status
        Object.keys(this.$refs.contracts.openCache).forEach(k => {
          this.$refs.contracts.openCache[k] = status
        })
      
      })
    },
    loadData(status) {
      this.setOverlayStatus(true)
      this.loadContracts(this.$route.query).then(() => {
        this.contractList = [...this.contracts]

        this.expandOrCollapse(status)
        this.setOverlayStatus(false)
      })
    },
    editItem(contractId) {
      console.log('contractId', contractId)
      this.$router.push({ name: 'contract-edit', params: { id: contractId, query: this.$route.query } })
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
      this.contract_id = this.$route.query.contract_id ?? ''
      this.product_id = this.$route.query.product_id ?? ''
      this.customer_id = this.$route.query.customer_id ?? ''
      this.contract_status = this.$route.query.contract_status ?? ''
      this.startDate = this.$route.query.startDate ?? ''
      this.endDate = this.$route.query.endDate ?? ''
    },
    downloadCSV() {
      console.log(this.contractList)
      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No.,契約ID,ペレットID,契約日,取引先ID,取引先名,契約重量,Status\n'
      let no = 0
      this.contractList.forEach(el => {
        no += 1
        const contract_id = el.contract_id ?? ""
        const product_id = el.product_id ?? ""
        const contract_date = el.contract_date ?? ""
        const customer_id = el.customer_id ?? ""
        const customer_name = el.customer_name ?? ""
        const contract_weight = el.contract_weight ? el.contract_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : ""
        const status = this.contractStatuses.find(cs => cs.value === el.contract_status.toString()).text
        const line = `"${no}","${contract_id}","${product_id}","${contract_date}","${customer_id}","${customer_name}","${contract_weight}","${status}"\n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')
      link.download = `契約一覧-${newstr}.csv`
      link.click()
    },
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
tr {
  height: 50px;
  font-size: 14px;
}
td {
  border-bottom: thin solid rgba(94, 86, 105, 0.14);
  padding: 0px 16px;
}
</style>
