<template>
  <div id="reservation-list">
    <v-card>
      <v-card-title>予約商品</v-card-title>
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
            color="primary"
            class="mb-4 me-3"
            :to="{ name: 'reservation-create' }"
          >
            <span>NEW</span>
          </v-btn>
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
        :items="reserveList"
        :search="searchQuery"
      >
        <template v-slot:[`item.reserve_weight`]="{ item }">
          <label>{{ item.reserve_weight ? item.reserve_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.reserve_open_dt`]="{ item }">
          <label>{{ item.reserve_open_dt ? item.reserve_open_dt.substring(0, 10) : '' }}</label>
        </template>
        <template v-slot:[`item.reserve_comp_dt`]="{ item }">
          <label>{{ item.reserve_comp_dt ? item.reserve_comp_dt.substring(0, 10) : '' }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-right:0px"
              cols="6"
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
              style="padding-left:0px"
              cols="6"
            >
              <delete-form
                :id="item.id"
                :icon="icons.mdiDelete"
                @deleted="loadData"
                @cancel="loadData"
              ></delete-form>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import {
  mdiPencil,
  mdiDelete,
  mdiExportVariant,
  mdiCalendar,
} from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import DeleteForm from './ReservedDelete.vue'

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
    },
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    product_id: '',
    reserveIds: [],
    searchQuery: '',
    reserve_id: '',
    headers: [
      {
        text: '予約ID',
        align: 'left',
        sortable: false,
        value: 'reserve_id',
        width: '13%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        value: 'product_id',
        align: 'left',
        width: '13%',
        fixed: true,
      },
      {
        text: '予約商品名',
        value: 'reserve_name',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      {
        text: '重量',
        value: 'reserve_weight',
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: '単価',
        value: 'reserve_price',
        sortable: false,
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: '上限',
        value: 'reserve_maximum',
        sortable: false,
        align: 'left',
        width: '7%',
        fixed: true,
      },
      {
        text: '開始日',
        value: 'reserve_open_dt',
        align: 'left',
        width: '12%',
        fixed: true,
      },
      {
        text: '終了日',
        value: 'reserve_comp_dt',
        align: 'left',
        width: '12%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
        fixed: true,
      },
    ],
    reserveList: [],
  }),
  computed: {
    ...mapState('productStore', ['productIds']),
    ...mapState('reserveStore', ['reserves']),
  },

  watch: {
    reserve_id(val) {
      this.changeRouteQuery('reserve_id', val)
      this.loadData()
    },
    product_id(val) {
      this.changeRouteQuery('product_id', val)
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
    this.loadProductIds()
    this.loadData()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('reserveStore', ['loadReserves']),
    ...mapMutations('app', ['setOverlayStatus']),
    editItem(item) {
      this.$router.push({ name: 'reservation-edit', params: { id: item.id, query: this.$route.query } })
    },
    loadQuery() {
      this.reserve_id = this.$route.query.reserve_id ?? ''
      this.product_id = this.$route.query.product_id ?? ''
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
      this.loadReserves(this.$route.query).then(() => {
        this.reserveList = [...this.reserves]
        this.reserveIds = this.reserves.map(rs => rs.reserve_id)

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
