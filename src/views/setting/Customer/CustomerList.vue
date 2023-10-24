<template>
  <div id="material-list">
    <v-card>
      <v-card-title> 取引先一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
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
        <!-- <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="mobile"
            placeholder="携帯番号"
            :items="mobileList"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col> -->
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="supplier"
            placeholder="仕入先"
            :items="supplierStatuses"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
      <v-card-text class="d-flex align-center flex-wrap pb-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          outlined
          hide-details
          single-line
          dense
          class="user-search me-3 mb-4"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <div class="d-flex align-center flex-wrap">
          <v-btn
            color="primary"
            class="mb-4 me-3"
            :to="{ name: 'customer-create', params: { query: this.$route.query } }"
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
        ref="filteredTable"
        :headers="headers"
        :items="customerList"

        class="elevation-1"
        :search="searchQuery"
      >
        <template v-slot:top>
        </template>
        <!-- <template v-slot:[`item.manager_name`]="{ item }">
          <label>{{ item.manager_sei }}  {{ item.manager_mei }}</label>
        </template> -->
        <!-- <template v-slot:[`item.country_info`]="{ item }">
          <label>{{ item.country_id }} (+{{ item.country_code }})</label>
        </template> -->
        <template v-slot:[`item.supplier`]="{ item }">
          <v-checkbox
            v-if="item.supplier == 0"
            v-model="Uncheck"
            readonly
            class="pa-0 ma-0"
            hide-details
          >
          </v-checkbox>
          <v-checkbox
            v-if="item.supplier == 1"
            v-model="Check"
            readonly
            class="pa-0 ma-0"
            hide-details
          >
          </v-checkbox>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
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
              style="padding-right: 10px"
              cols="2"
            >
              <delete-form
                :id="item.id"
                :icon="icons.mdiDelete"
                @deleted="refreshList"
                @cancel="refreshList"
              ></delete-form>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'

import DeleteForm from './CustomerDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icons: { mdiPencil, mdiDelete, mdiExportVariant },
    customer_id: '',
    mobile: '',
    supplier: '',
    customerList: [],
    supplierStatuses: [
      { text: '販売のみ', value: '0' },
      { text: '仕入販売', value: '1' },
    ],
    Check: true,
    Uncheck: false,
    searchQuery: '',
    headers: [
      {
        text: 'No.',
        align: 'left',
        sortable: true,
        value: 'id',
        width: '8%',
      },

      {
        text: '取引先ID',
        align: 'left',
        sortable: true,
        value: 'customer_id',
        width: '15%',
      },
      {
        text: '取引先名',
        sortable: true,
        value: 'customer_name',
        align: 'left',
        width: '20%',
      },

      // {
      //   text: '取引先名(ENG)',
      //   sortable: true,
      //   value: 'customer_name_eng',
      //   align: 'left',
      //   width: '10%',
      // },
      {
        text: '国・地域ID',
        sortable: true,
        value: 'country',
        align: 'center',
        width: '15%',
      },
      {
        text: '連絡人',
        value: 'manager_name',
        align: 'left',
        width: '10%',
      },
      {
        text: '携帯番号',
        value: 'mobile',
        align: 'left',
        width: '15%',
      },
      {
        text: '仕入先',
        value: 'supplier',
        filterable: false,
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
      },
    ],
  }),

  computed: {
    ...mapState('customerStore', ['customers', 'customerIds', 'mobileList']),
  },

  watch: {
    customer_id(val) {
      this.changeRouteQuery('customer_id', val)
      this.refreshList()
    },
    mobile(val) {
      this.changeRouteQuery('mobile', val)
      this.refreshList()
    },
    supplier(val) {
      this.changeRouteQuery('supplier', val)
      this.refreshList()
    },
    customers(value) {
      this.customerList = value
    },
  },

  created() {
    this.loadCustomerIds()
    this.loadMobileList()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('customerStore', ['loadCustomers', 'loadCustomerIds', 'loadMobileList']),
    refreshList() {
      this.setOverlayStatus(true)
      this.loadCustomers(this.$route.query).then(() => {
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
      this.mobile = this.$route.query.mobile ?? ''
      this.supplier = this.$route.query.supplier ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'customer-edit', params: { id: item.id, query: this.$route.query } })
    },

    // 画面で表示されている情報をcsvにダウンロードする
    downloadCSV() {
      this.loadCustomers(this.$route.query).then(() => {
        const items = this.$refs.filteredTable.$children[0].filteredItems
        const sorted = this.$refs.filteredTable.$children[0].sortItems(items)
        console.log('sorted:', sorted)
        // eslint-disable-next-line no-useless-concat
        let csv = '\ufeff' + 'No,取引先ID,取引先名,国・地域ID(番号),連絡人,携帯番号\n'
        let no = 0
        sorted.forEach(el => {
          if (el.customer_name_eng === null) {
            // eslint-disable-next-line no-param-reassign
            el.customer_name_eng = ''
          }
          if (el.manager_name === undefined) {
            // eslint-disable-next-line no-param-reassign
            el.manager_name = ''
          }

          if (el.country === null || el.country === undefined) {
            // eslint-disable-next-line no-param-reassign
            el.country = ''
          }

          if (el.mobile === null) {
            // eslint-disable-next-line no-param-reassign
            el.mobile = ''
          }

          // // eslint-disable-next-line no-param-reassign
          // el.country = el.country.replace('null', '')
          // // eslint-disable-next-line no-param-reassign
          // el.manager_name = el.manager_name.replace('null', '')

          no += 1
          const line = `${no},'${el.customer_id}','${el.customer_name}','${el.country}','${el.manager_name}','${el.mobile}',\n`
          csv += line
        })
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
        const newstr = nowstr.replace(/(-|:|T)/g, '')
        console.log(nowstr, newstr)
        link.download = '取引先一覧'.concat('-', newstr, '.csv')
        link.click()
      })
    },

    // ...mapMutations('customerStore', ['filterCustomers']),
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
