<template>
  <div id="contrated-list">
    <v-card>
      <v-card-title>契約(未粉砕) ― 一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <!-- <v-col
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
        </v-col> -->
        <v-col
          cols="12"
          md="3"
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
          md="3"
        >
          <v-autocomplete
            v-model="material_id"
            placeholder="材料ID"
            :items="materialIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>

        <!-- <v-col
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
        </v-col> -->
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
                outlined
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                readonly
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
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                readonly
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
            :to="{ name: 'contract-material-create', params: { query: this.$route.query } }"
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
        item-key="cd_id"
        :search="searchQuery"
        fixed-header
      >
        <template v-slot:[`item.contract_id`]="{ item }">
          CM-{{ item.contract_id }}-{{ item.detail_id }}
        </template>
        <template v-slot:[`item.contract_weight`]="{ item }">
          <label>{{
            item.contract_weight ? item.contract_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
          }}</label>
        </template>
        <template v-slot:[`item.contract_price`]="{ item }">
          <label>{{
            item.contract_price ? item.contract_price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
          }}</label>
        </template>
        <template v-slot:[`item.contract_status`]="{ item }">
          <label>{{
            contractStatus(item)
          }}</label>
        </template>
        <template v-slot:[`item.contract_note`]="{ item }">
          <p
            style="overflow: hidden; margin:0; text-overflow:ellipsis;  white-space: nowrap;width: 25rem !important"
            :title="item.contract_note"
          >
            {{ item.contract_note }}
          </p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-left: 10px"
              cols="1"
            >
              <delete
                :icon="icons.mdiDelete"
                :contract-id="item.contract_id"
                @deleted="loadData(false)"
                @cancel="loadData(false)"
              ></delete>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`body.append`]>
          <tr v-if="material_id">
            <td
              class="font-weight-bold"
              :colspan="4"
              style="background: #fafafa"
            >
              <label>{{ material_id }}の合計</label>
            </td>
            <td
              class="font-weight-bold"
              style="text-align: right; background: #fafafa"
            >
              <label>{{ sumWgt }}</label>
            </td>
            <td
              style="background: #fafafa"
              :colspan="3"
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
import Delete from './Delete.vue'
/* eslint-disable */
export default {
  components: {
    Delete,
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
    material_id: '',
    //contract_id: '',
    customer_id: '',
    startDate: '',
    endDate: '',
    isExpand: false,
    headers: [
      {
        text: '契約ID',
        value: 'contract_id',
        align: 'left',
        width: '10%',
        fixed: true,
      },

      {
        text: '契約日',
        value: 'contract_date',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '取引先ID',
        value: 'customer_id',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      // {
      //   text: '契約名',
      //   value: 'contract_name',
      //   align: 'left',
      //   width: '15%',
      //   fixed: true,
      // },
      {
        text: '材料ID',
        value: 'material_id',
        align: 'left',
        width: '15%',
        sortable: true,
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'contract_weight',
        align: 'right',
        width: '10%',
        sortable: true,
        fixed: true,
      },
      {
        text: '契約金額',
        value: 'contract_price',
        align: 'right',
        width: '10%',
        sortable: true,
        fixed: true,
      },
      {
        text: '備考',
        value: 'contract_note',
        sortable: false,
        align: 'left',
        width: '25%',
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
    ...mapState('materialStore', ['materialIds']),
    ...mapState('customerStore', ['customerIds']),
    ...mapState('contractStore', ['materialContracts', 'f_contracts', 'contractIds']),
    sumWgt() {
      let sum = 0
      this.contractList.forEach(a => {
        if (a.material_id === this.material_id) {
          sum += a.contract_weight
        }
      })

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    contractStatus() {
      return function (item) {
        const status = this.contractStatuses.find(cs => cs.value === item.contract_status.toString())

        return status.text ?? ""
      }
    },
  },
  watch: {
    // contract_id(newValue) {
    //   this.changeRouteQuery('contract_id', newValue)
    //   if (this.material_id) {
    //     this.loadData(true)
    //   } else {
    //     this.loadData(false)
    //   }
    // },
    material_id(newValue) {

      this.changeRouteQuery('material_id', newValue)
      if (newValue) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    customer_id(newValue) {
      this.changeRouteQuery('customer_id', newValue)
      if (this.material_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    contract_status(newValue) {
      this.changeRouteQuery('contract_status', newValue)
      if (this.material_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    startDate(newValue) {
      this.changeRouteQuery('startDate', newValue)
      if (this.material_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
    endDate(newValue) {
      this.changeRouteQuery('endDate', newValue)
      if (this.material_id) {
        this.loadData(true)
      } else {
        this.loadData(false)
      }
    },
  },
  created() {
    this.loadQuery()
    this.changeRouteQuery()
    this.loadMaterialIds()
    this.loadCustomerIds()
    this.loadData(false)
  },

  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapActions('contractStore', ['loadMaterialContracts', 'deleteContract', 'loadContractIds']),
    ...mapMutations('app', ['setOverlayStatus']),

    loadData(status) {
      this.setOverlayStatus(true)
      this.loadMaterialContracts(this.$route.query).then(() => {
        console.log("mate:",this.loadMaterialContracts)
        this.contractList = [...this.materialContracts]
        this.setOverlayStatus(false)
      })
    },

    editItem(item) {

      this.$router.push({ name: 'contract-crushed-edit', params: { id:item.contract_id , query: this.$route.query } })
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
      // this.contract_id = this.$route.query.contract_id ?? ''
      this.material_id = this.$route.query.material_id ?? ''
      this.customer_id = this.$route.query.customer_id ?? ''
      this.contract_status = this.$route.query.contract_status ?? ''
      this.startDate = this.$route.query.startDate ?? ''
      this.endDate = this.$route.query.endDate ?? ''
    },
    downloadCSV() {

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No.,契約ID,契約日,取引先ID,契約名,材料ID,重量(kg),契約金額,備考\n'
      let no = 0
      this.contractList.forEach(el => {

        no += 1
        const contract_id =  `CM-${el.contract_id }-${el.detail_id}(${el.did})`
        const contract_date = el.contract_date ?? ""
        const customer_id = el.customer_id ?? ""
        const contract_name = el.contract_name ?? ""
        const material_id = el.material_id ?? ""
        const contract_price = el.contract_price ? el.contract_price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : "0"
        const note = el.contract_note ?? ""
        const contract_weight = el.contract_weight ? el.contract_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : "0"

        const line = `"${no}","${contract_id}","${contract_date}","${customer_id}","${contract_name}","${material_id}","${contract_weight}","${contract_price}","${note}" \n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')
      link.download = `未粉砕契約一覧-${newstr}.csv`
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
