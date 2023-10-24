<template>
  <div id="stock-list">
    <v-card>
      <v-card-title>月末繰越</v-card-title>
      <v-tabs v-model="Stocktabs">
        <v-tab
          href="#product"
          @click="loadProductStocked()"
        >
          ペレット
        </v-tab>
        <v-tab
          href="#crushed"
          @click="loadCrushedStocked()"
        >
          粉砕済
        </v-tab>
        <v-tab
          href="#material"
          @click="loadMaterialStocked()"
        >
          未粉砕
        </v-tab>
        <v-spacer></v-spacer>
        <v-col cols="1">
          <v-icon
            class="me-1"
            @click="reduceMonth"
          >
            {{ icons.mdiChevronLeft }}
          </v-icon>
        </v-col>
        <v-col cols="2">
          <label>{{ selectedMonth.substring(0, 4) }}年{{ selectedMonth.substring(4,6) }}月</label>
        </v-col>
        <v-col
          v-if="selectedMonth < lastMonth"
          cols="1"
        >
          <v-icon
            class="me-1"
            @click="addMonth"
          >
            {{ icons.mdiChevronRight }}
          </v-icon>
        </v-col>
        <v-col
          v-else
          cols="1"
        >
        </v-col>
      </v-tabs>
      <v-tabs-items
        v-model="Stocktabs"
        touchless
      >
        <v-tab-item value="product">
          <product-monthly-stocked
            ref="prodMonthlyStock"
            @has-mounted="getProductStock"
            @reload="loadProductStocked"
          ></product-monthly-stocked>
        </v-tab-item>
        <v-tab-item value="crushed">
          <crushed-monthly-stocked
            ref="cruMonthlyStock"
            @has-mounted="getCrushedStock"
            @reload="loadCrushedStocked"
          ></crushed-monthly-stocked>
        </v-tab-item>
        <v-tab-item value="material">
          <material-monthly-stocked
            ref="matMonthlyStock"
            @has-mounted="getMaterialStock"
            @reload="loadMaterialStocked"
          ></material-monthly-stocked>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
} from '@mdi/js'
import { mapMutations } from 'vuex'
import productMonthlyStocked from './product/ProductMonthlyStocked.vue'
import materialMonthlyStocked from './material/MaterialMonthlyStocked.vue'
import crushedMonthlyStocked from './crushed/CrushedMonthlyStocked.vue'

export default {
  components: {
    productMonthlyStocked,
    materialMonthlyStocked,
    crushedMonthlyStocked,
  },
  data: () => ({
    Stocktabs: 'product',
    ProdMonthlyStFlag: false,
    CruMonthlyStFlag: false,
    MatMonthlyStFlag: false,
    icons: {
      mdiChevronLeft,
      mdiChevronRight,
      mdiPencil,
    },

    // lastMonth: new Date(new Date(Date.now()).setDate(0) - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
    // time go back 8 hours
    lastMonth: new Date(new Date(Date.now()).setDate(0) - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
  }),

  computed: {
    selectedMonth() {
      return this.$route.params.month
    },
  },

  watch: {
    Stocktabs(newValue) {
      this.$router.push({ query: { selTab: newValue } })
    },
  },

  mounted() {
    if (this.$route.query.selTab) {
      this.Stocktabs = this.$route.query.selTab
    }
    this.loadSelTab()
  },

  methods: {
    ...mapMutations('getsujiProductStore', ['clearMonthlyProducts']),
    ...mapMutations('getsujiCrushedStore', ['clearMonthlyCrusheds']),
    ...mapMutations('getsujiMaterialStore', ['clearMonthlyMaterials']),
    ...mapMutations('app', ['setOverlayStatus']),
    sleep(t) {
      const a = new Promise(resolve => {
        setTimeout(() => { resolve() }, t)
      })

      return a
    },
    clearCache() {
      this.clearMonthlyProducts()
      this.clearMonthlyCrusheds()
      this.clearMonthlyMaterials()
    },
    loadSelTab() {
      if (this.Stocktabs === 'product') {
        this.loadProductStocked()
      }
      if (this.Stocktabs === 'crushed') {
        this.loadCrushedStocked()
      }
      if (this.Stocktabs === 'material') {
        this.loadMaterialStocked()
      }
    },
    getProductStock() {
      this.ProdMonthlyStFlag = true
    },
    getCrushedStock() {
      this.CruMonthlyStFlag = true
    },
    getMaterialStock() {
      this.MatMonthlyStFlag = true
    },
    async loadProductStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.ProdMonthlyStFlag) { await this.sleep(1000) }

      this.$refs.prodMonthlyStock.loadData(this.selectedMonth)
    },
    async loadCrushedStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.CruMonthlyStFlag) { await this.sleep(1000) }
      this.$refs.cruMonthlyStock.loadData(this.selectedMonth)
    },
    async loadMaterialStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.MatMonthlyStFlag) { await this.sleep(1000) }
      this.$refs.matMonthlyStock.loadData(this.selectedMonth)
    },
    reduceMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().substring(0, 7).replace('-', '')
      this.$router.push({ name: 'monthlystocked-list', params: { month: selMonth }, query: { selTab: this.$route.query.selTab } })
      this.loadSelTab()
    },
    addMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() + 1)).toISOString().substring(0, 7).replace('-', '')
      console.log(selMonth, this.lastMonth)
      if (selMonth <= this.lastMonth) {
        this.$router.push({ name: 'monthlystocked-list', params: { month: selMonth }, query: { selTab: this.$route.query.selTab } })
      }
      this.loadSelTab()
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
