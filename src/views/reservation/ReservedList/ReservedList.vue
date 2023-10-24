<template>
  <div id="reserved-list">
    <v-card>
      <v-card-title>予約実績</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="reserve_id"
            :items="reserveIds"
            placeholder="予約商品ID"
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
            v-model="customer_id"
            :items="customerIds"
            placeholder="取引先ID"
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
        :headers="headers"
        :items="reservedList"
        :search="searchQuery"
      >
        <template v-slot:[`item.reserved_dt`]="{ item }">
          <label>{{ item.reserved_dt.substring(0, 10) }}</label>
        </template>
        <template v-slot:[`item.contract_status`]="{ item }">
          <v-chip
            small
            :color="statusColor[item.contract_status].text"
            class="font-weight-medium"
          >
            {{ status[item.contract_status].text }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            {{ icons.mdiPencil }}
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import {
  mdiSquareEditOutline,
  mdiDotsVertical,
  mdiPencil,
  mdiDelete,
} from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  data: () => ({
    icons: {
      mdiSquareEditOutline,
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
    },
    statusColor: [
      { text: 'success', value: '0' },
      { text: 'error', value: '1' },
      { text: 'primary', value: '2' },
      { text: 'warning', value: '3' },
      { text: 'info', value: '4' },
    ],
    status: [
      { text: '承認待', value: '0' },
      { text: '承認済', value: '1' },
      { text: '契約済', value: '2' },
      { text: '出荷済', value: '3' },
      { text: '却下', value: '4' },
    ],
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    reserveIds: [],
    reservedList: [],
    reserve_id: '',
    customer_id: '',
    searchQuery: '',
    headers: [
      {
        text: '予約ID',
        align: 'left',
        value: 'reserve_id',
        width: '20%',
      },
      {
        text: '取引先ID',
        value: 'customer_id',
        align: 'left',
        width: '20%',
      },
      {
        text: '予約日',
        value: 'reserved_dt',
        align: 'left',
        width: '20%',
      },
      {
        text: '予約数量',
        value: 'reserved_count',
        align: 'right',
        width: '20%',
      },
      {
        text: 'status',
        value: 'contract_status',
        sortable: false,
        align: 'center',
        width: '10%',
      },
      {
        text: '',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '5%',
      },
    ],
  }),
  computed: {
    ...mapState('customerStore', ['customerIds']),
    ...mapState('reservedStore', ['reserveds']),
  },
  watch: {
    reserve_id(val) {
      this.changeRouteQuery('reserve_id', val)
      this.loadData()
    },
    customer_id(val) {
      this.changeRouteQuery('customer_id', val)
      this.loadData()
    },
    startDate(val) {
      this.changeRouteQuery('start_date', val)
      this.loadData()
    },
    endDate(val) {
      this.changeRouteQuery('end_date', val)
      this.loadData()
    },
  },
  created() {
    this.loadQuery()
    this.loadCustomerIds()
    this.loadData()
  },

  methods: {
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapActions('reservedStore', ['loadReserveds']),
    ...mapMutations('app', ['setOverlayStatus']),
    editItem(item) {
      this.$router.push({ name: 'reserved-edit', params: { id: item.id } })
    },
    loadQuery() {
      this.reserve_id = this.$route.query.reserve_id ?? ''
      this.customer_id = this.$route.query.customer_id ?? ''
      this.startDate = this.$route.query.start_date ?? ''
      this.endDate = this.$route.query.end_date ?? ''
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
    loadData() {
      this.setOverlayStatus(true)
      this.loadReserveds(this.$route.query).then(() => {
        this.reservedList = [...this.reserveds]
        this.reserveIds = this.reserveds.map(rs => rs.reserve_id)
        this.setOverlayStatus(false)
      })
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
