<template>
  <div id="production-list">
    <v-card>
      <v-card-title> ペレット実績一覧V2 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="route_id"
            :items="routers"
            placeholder="ルーター"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
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
                readonly
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
                readonly
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
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        ref="filteredTable"
        :headers="headers"
        :items="productions"
        :search="searchQuery"
        sort-by
        class="elevation-1"
      >
        <template v-slot:[`item.produced_weight`]="{ item }">
          <label>{{ item.produced_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-right: 0px"
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
              style="padding-left: 0px"
              cols="6"
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
import { mdiCalendar, mdiMagnify, mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import DeleteForm from './ProductionActualDelete.vue'
/*eslint-disable*/
export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    route_id: '',
    product_id: '',
    productionList: [],
    routers: ['1', '2','3'],
    icons: {
      mdiCalendar,
      mdiMagnify,
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
    },
    searchQuery: '',
    headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '生産日時',
        align: 'left',
        sortable: true,
        value: 'produced_dt',
        width: '15%',
        fixed: true,
      },
      {
        text: 'ルーター',
        value: 'route_id',
        align: 'center',
        width: '10%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        value: 'product_id',
        align: 'left',
        width: '15%',
        fixed: true,
      },


      {
        text: '生産重量(kg)',
        value: 'produced_weight',
        align: 'right',
        width: '15%',
        fixed: true,
      },
      {
        text: '備考',
        value: 'note',
        align: 'left',
        width: '30%',
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
    ...mapState('productionStore', ['productions']),
    ...mapState('productStore', ['productIds']),
    sumWeight() {
      let sum = 0

      this.productionList.forEach(k => {
        // eslint-disable-next-line no-const-assign
        sum += k.produced_weight
      })

      return sum
    },
  },
  watch: {
    route_id(val) {
      this.changeRouteQuery('route_id', val)
      this.refreshList()

      // this.refreshFilter()
    },
    product_id(val) {
      this.changeRouteQuery('product_id', val)
      this.refreshList()

      // this.refreshFilter()
    },
    startDate(val) {
      this.changeRouteQuery('start_date', val)
      this.refreshList()

      // this.refreshFilter()
    },
    endDate(val) {
      this.changeRouteQuery('end_date', val)
      this.refreshList()

      // this.refreshFilter()
    },
    productions(value) {
      this.productionList = value
    },
  },

  created() {
    this.loadProductIds()

    // add default end_date in query
    this.changeRouteQuery()
    this.loadQuery()
    this.refreshList()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['loadProductions', 'deleteProduction']),
    ...mapMutations('app', ['setOverlayStatus']),

    // item新規作成
    newItem() {
      this.$router.push({
        name: 'productionactual-create',
        params: {
          product_id: this.$route.query.product_id,
          route_id: this.$route.query.route_id,
          query: this.$route.query,
        },
      })
    },

    editItem(item) {
      this.$router.push({ name: 'productionactual-edit', params: { id: item.id, query: this.$route.query } })

    },
    refreshList() {
      this.setOverlayStatus(true)
      this.loadProductions(this.$route.query).then(() => {
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

    // http://localhost:8080/productionactual-list?product_id=ABS-W&route_id=1&start_date=2022-01-12&end_date=2022-01-13
    loadQuery() {
      this.route_id = this.$route.query.route_id ?? ''
      this.product_id = this.$route.query.product_id ?? ''
      this.startDate = this.$route.query.start_date ?? ''
      this.endDate = this.$route.query.end_date ?? this.endDate
    },

    downloadCSV() {
      const items = this.$refs.filteredTable.$children[0].filteredItems
      const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

      let csv = '\ufeff' + 'No.,製品ID,生産日時,ルーター,ペレットID,ペレット名,生産量(kg),備考\n'
      let no = 0
      sorted.forEach((el) => {
        no += 1
        const note= el.note ?? ''
        const line = `${no},"${el.id}","${el.produced_dt}","${el.route_id}","${el.product_id}","${
          el.product_name
        }","${el.produced_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}","${note}"\n`

        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')
      link.download =`生産実績一覧-${newstr}.csv`
      link.click()
    },
  },
}
</script>

<style>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
.v-input__prepend-outer {
  margin: auto !important;
}
.text-field-dense-append-prepend-margin {
  margin: auto;
}
.v-input__append-inner {
  margin: auto !important;
}
</style>
