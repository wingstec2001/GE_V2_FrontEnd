<template>
  <v-card>
    <v-card-title class="px-5">月末繰越</v-card-title>
    <v-row align="center" class="mx-0 px-2 mt-4">
      <v-col cols="2">
        <label>対象年月</label>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1">
        <v-icon class="me-1" @click="reduceMonth">
          {{ icons.mdiChevronLeft }}
        </v-icon>
      </v-col>
      <v-col cols="2">
        <label>{{ selectedDate.substring(0, 4) }}年{{ selectedDate.substring(4,6) }}月</label>
      </v-col>
      <v-col cols="1" v-if="selectedDate < lastMonth">
        <v-icon class="me-1" @click="addMonth">
          {{ icons.mdiChevronRight }}
        </v-icon>
      </v-col>
      <v-col cols="1" v-else>
      </v-col>
    </v-row>
    <v-divider class="mt-4"></v-divider>
    <v-card-text class="pa-0">
      <v-row align="center" class="ma-0">
        <v-col cols="3" class="px-5">
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
        <v-spacer></v-spacer>
        <v-col cols="12" class="pa-0">
          <v-data-table
            :headers="headers"
            :items="f_MonthlyInfo"
            item-key="product_id"
            :items-per-page="-1"
          >
            <template v-slot:[`item.product_id`]="{ item }">
              <a href="javascript:void(0);" @click="pushDailyStocked(item)">{{ item.product_id }}</a>
            </template>
            <template v-slot:[`item.product_weight`]="{ item }">
              <label :style="item.product_weight < 0 ? 'color:#F44336' : ''">{{ item.product_weight? item.product_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
            </template>
            <template v-slot:[`item.crushed_weight`]="{ item }">
              <label :style="item.crushed_weight < 0 ? 'color:#F44336' : ''">{{ item.crushed_weight? item.crushed_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
            </template>
            <template v-slot:[`item.material_weight`]="{ item }">
              <label :style="item.material_weight < 0 ? 'color:#F44336' : ''">{{ item.material_weight? item.material_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    {{ icons.mdiPencil }}
                  </v-icon>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiExportVariant,
  mdiPencil,
} from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data: () => ({
    icons: {
      mdiChevronLeft,
      mdiChevronRight,
      mdiExportVariant,
      mdiPencil,
    },
    productIds: [],
    product_id: '',

    lastMonth: new Date(new Date(Date.now()).setDate(0) - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
    headers: [
      {
        text: 'ペレットID',
        align: 'left',
        value: 'product_id',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ペレット(kg)',
        value: 'product_weight',
        align: 'right',
        width: '25%',
        fixed: true,
      },
      {
        text: '粉砕済(kg)',
        value: 'crushed_weight',
        align: 'right',
        width: '25%',
        fixed: true,
      },
      {
        text: '未粉砕(kg)',
        value: 'material_weight',
        align: 'right',
        width: '25%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '5%',
        fixed: true,
      },
    ],
    f_StockedProducts: [],
  }),
  computed: {
    ...mapState('getsujiInfoStore', ['MonthlyInfo', 'f_MonthlyInfo']),
    selectedDate() {
      return this.$route.params.month
    },
  },
  watch: {
    product_id() {
      this.filterIdMonthlyInfo(this.product_id)
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('getsujiInfoStore', ['loadMonthInfo']),
    ...mapMutations('getsujiInfoStore', ['filterIdMonthlyInfo']),
    ...mapMutations('app', ['setOverlayStatus']),
    reduceMonth() {
      const date = new Date(`${this.selectedDate.substring(0, 4)}-${this.selectedDate.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().substring(0, 7).replace('-', '')
      this.$router.push({ name: 'monthlystocked-list', params: { month: selMonth } })
      this.loadData()
    },
    addMonth() {
      const date = new Date(`${this.selectedDate.substring(0, 4)}-${this.selectedDate.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() + 1)).toISOString().substring(0, 7).replace('-', '')
      if (selMonth <= this.lastMonth) {
        this.$router.push({ name: 'monthlystocked-list', params: { month: selMonth } })
        this.loadData()
      }
    },
    loadData() {
      this.setOverlayStatus(true)
      this.loadMonthInfo(this.selectedDate).then(() => {
        this.filterIdMonthlyInfo(this.product_id)
        this.productIds = this.MonthlyInfo.map(fs => fs.product_id)
        this.setOverlayStatus(false)
      })
    },
    pushDailyStocked(item) {
      this.$router.push({ name: 'perettogetsujiinfo', params: { id: item.product_id }, query: { month: this.selectedDate } })
    },
    editItem(item) {
      this.$router.push({ name: 'monthlystocked-edit', params: { month: this.selectedDate, id: item.id }, query: { originalPage: 'monthlystocked-list' } })
    },
  },
}
</script>
