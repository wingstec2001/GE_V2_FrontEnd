<template>
  <div id="contrated-list">
    <v-card>
      <v-card-title> 出荷済一覧 </v-card-title>
      <v-row class="px-2 ma-0">
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
        class="class-on-data-table elevation-1"
        :headers="headers"
        :items="shippedList"
        item-key="vanning_id"
        :search="searchQuery"
        fixed-header
      >
        <template v-slot:[`item.vanning_id`]="{ item }">
          <vanning-detail-preview
            :vanningId="item.vanning_id"
            @cancel="loadData()"
          >
          </vanning-detail-preview>
        </template>
        <template v-slot:[`item.totalWeight`]="{ item }">
          <label>{{ item.totalWeight ? item.totalWeight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.vanning_status`]="{ item }">
          <label>{{ vanningStatuses[item.vanning_status] ? vanningStatuses[item.vanning_status].text : null }}</label>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mdiDotsVertical, mdiExportVariant, mdiCalendar } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import VanningDetailPreview from '../Shipping/VanningDetailPreview.vue'

export default {
  components: {
    VanningDetailPreview,
  },
  data: () => ({
    icons: { mdiDotsVertical, mdiExportVariant, mdiCalendar },
    vanningStatuses: [
      { text: '準備中', value: '0' },
      { text: '準備完', value: '1' },
      { text: '出荷済', value: '2' },
    ],
    contract_id: '',
    shippedList: [],
    searchBar: {},
    searchQuery: '',
    customer_id: '',
    product_id: '',
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    headers: [
      {
        text: '出荷ID',
        align: 'left',
        sortable: false,
        value: 'vanning_id',
        width: '10%',
        fixed: true,
      },
      {
        text: '契約ID',
        align: 'left',
        sortable: false,
        value: 'contract_id',
        width: '18%',
        fixed: true,
      },
      {
        text: '取引先ID',
        align: 'left',
        sortable: false,
        value: 'customer_id',
        width: '18%',
        fixed: true,
      },
      {
        text: '出荷日時',
        align: 'left',
        sortable: false,
        value: 'vanning_date',
        width: '18%',
        fixed: true,
      },
      {
        text: '総重量',
        value: 'totalWeight',
        sortable: false,
        align: 'right',
        width: '18%',
        fixed: true,
      },
      {
        text: 'Status',
        value: 'vanning_status',
        sortable: false,
        align: 'center',
        width: '18%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('customerStore', ['customerIds']),
    ...mapState('vanningStore', ['shippeds', 'f_contracteds']),

  },
  watch: {
    customer_id(newValue) {
      this.changeRouteQuery('customer_id', newValue)
      this.loadData()
    },
    startDate(newValue) {
      this.changeRouteQuery('startDate', newValue)
      this.loadData()
    },
    endDate(newValue) {
      this.changeRouteQuery('endDate', newValue)
      this.loadData()
    },
  },

  created() {
    this.loadQuery()
    this.changeRouteQuery()
    this.loadCustomerIds()
    this.loadData()
  },

  methods: {
    ...mapActions('vanningStore', ['loadVannings']),
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadVannings(
        this.$route.query,
      ).then(() => {
        this.shippedList = [...this.shippeds]
        this.setOverlayStatus(false)
      })
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
      this.customer_id = this.$route.query.customer_id ?? ''
      this.startDate = this.$route.query.startDate ?? ''
      this.endDate = this.$route.query.endDate ?? ''
    },
    downloadCSV() {
      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + '出荷ID,契約ID,取引先ID,出荷日時,総重量,Status\n'
      this.shippedList.forEach(el => {
        // const weight = el.plan_weight.replace(/,/g, '')
        const line = `"${el.vanning_id}","${el.contract_id}","${el.customer_id}","${el.vanning_date}","${el.totalWeight}","${el.vanning_status}"\n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = '出荷済一覧.csv'
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
</style>
