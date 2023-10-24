<template>
  <div id="produce-report">
    <v-card>
      <v-card-title>入札商品  一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="bid_id"
            :items="bidIds"
            placeholder="入札ID"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete v-model="product_id" :items="productIds" placeholder="ペレットID" outlined clearable dense hide-details></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            v-model="bid_min_price"
            placeholder=">=金額"
            outlined
            clearable
            dense
            hide-details
          ></v-text-field>
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
                placeholder="入札開始日From"
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
        <v-col cols="12" md="3">
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
                placeholder="To入札終了日"
                dense
                outlined
                hide-details
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" @input="dateEndMenu = false"></v-date-picker>
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
          <v-btn color="primary" class="mb-4 me-3" :to="{ name: 'tender-create' }">
            <span>NEW</span>
          </v-btn>
          <v-btn color="secondary" outlined class="mb-4">
            <v-icon size="17" class="me-1">
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="bidList"
        :search="searchQuery"
      >
        <template v-slot:[`item.bid_weight`]="{ item }">
          <label>{{ item.bid_weight ? item.bid_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.bid_open_dt`]="{ item }">
          <label>{{ item.bid_open_dt ? item.bid_open_dt.substring(0, 10) : '' }}</label>
        </template>
        <template v-slot:[`item.bid_comp_dt`]="{ item }">
          <label>{{ item.bid_comp_dt ? item.bid_comp_dt.substring(0, 10) : '' }}</label>
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
  mdiCalendar,
  mdiDelete,
  mdiMagnify,
} from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import DeleteForm from './TenderDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    bid_min_price: '',
    bid_id: '',
    bidIds: [],
    product_id: '',
    startDate: '',
    endDate: '',
    dateStartMenu: '',
    dateEndMenu: '',
    searchQuery: '',
    icons: {
      mdiPencil,
      mdiDelete,
      mdiMagnify,
      mdiCalendar,
    },
    headers: [
      {
        text: '入札ID',
        value: 'bid_id',
        align: 'left',
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
        text: '入札商品名',
        value: 'bid_name',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      {
        text: '重量',
        value: 'bid_weight',
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: '単価',
        value: 'bid_min_price',
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: '上限',
        value: 'bid_max_c_cnt',
        align: 'left',
        width: '7%',
        fixed: true,
      },
      {
        text: '開始日',
        value: 'bid_open_dt',
        align: 'left',
        width: '12%',
        fixed: true,
      },
      {
        text: '締切日',
        value: 'bid_comp_dt',
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
    bidList: [],
  }),
  computed: {
    ...mapState('productStore', ['productIds']),
    ...mapState('bidStore', ['bids']),
  },

  watch: {
    bid_id(val) {
      this.changeRouteQuery('bid_id', val)
      this.loadData()
    },
    product_id(val) {
      this.changeRouteQuery('product_id', val)
      this.loadData()
    },
    bid_min_price(val) {
      this.changeRouteQuery('bid_min_price', val)
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
    ...mapActions('bidStore', ['loadBids']),
    ...mapMutations('app', ['setOverlayStatus']),
    editItem(item) {
      this.$router.push({ name: 'tender-edit', params: { id: item.id, query: this.$route.query } })
    },
    loadQuery() {
      this.bid_id = this.$route.query.bid_id ?? ''
      this.product_id = this.$route.query.product_id ?? ''
      this.bid_min_price = this.$route.query.bid_min_price ?? ''
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
      this.loadBids(this.$route.query).then(() => {
        this.bidList = [...this.bids]
        this.bidIds = this.bids.map(bs => bs.bid_id)
        console.log('load success', this.bidList)
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
