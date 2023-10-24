<template>
  <div id="monthyly-inout-stock-list">
    <v-card>
      <v-card-title>月次入出庫一覧</v-card-title>
      <v-tabs v-model="Stocktabs">
        <v-tab
          href="#product"
          @click="loadProductStocked"
        >
          ペレット
        </v-tab>
        <v-tab
          href="#crushed"
          @click="loadCrushedStocked"
        >
          粉砕済
        </v-tab>
        <v-tab
          href="#material"
          @click="loadMaterialStocked"
        >
          未粉砕
        </v-tab>
        <v-spacer></v-spacer>
        <v-col
          cols="1"
          @click="reduceMonth"
        >
          <v-icon class="me-1">
            {{ icons.mdiChevronLeft }}
          </v-icon>
        </v-col>
        <v-col cols="2">
          <label>{{ selectedMonth.substring(0, 4) }}年{{ selectedMonth.substring(4,6) }}月</label>
        </v-col>
        <v-col
          v-if="selectedMonth < currentMonth"
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
          <prod-mthly-transferred
            ref="prodMthlyStock"
            @has-mounted="getProductStock"
          ></prod-mthly-transferred>
        </v-tab-item>
        <v-tab-item value="crushed">
          <cru-mthly-transferred
            ref="cruMthlyStock"
            @has-mounted="getCrushedStock"
          ></cru-mthly-transferred>
        </v-tab-item>
        <v-tab-item value="material">
          <mat-mthly-transferred
            ref="matMthlyStock"
            @has-mounted="getMaterialStock"
          ></mat-mthly-transferred>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiExportVariant,
  mdiPencil,
} from '@mdi/js'
import { mapMutations } from 'vuex'
import ProdMthlyTransferred from './ProdMthlyTransferred.vue'
import MatMthlyTransferred from './MatMthlyTransferred.vue'
import CruMthlyTransferred from './CruMthlyTransferred.vue'

export default {
  components: {
    ProdMthlyTransferred,
    MatMthlyTransferred,
    CruMthlyTransferred,
  },
  data: () => ({
    Stocktabs: 'product',
    ProdMthlyTrFlag: false,
    CruMthlyTrFlag: false,
    MatMthlyTrFlag: false,
    icons: {
      mdiChevronLeft,
      mdiChevronRight,
      mdiExportVariant,
      mdiPencil,
    },

    // currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
    // time go back 8 hours
    currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
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
    ...mapMutations('monthlyStockStore', ['clearMonthlyStock']),
    ...mapMutations('app', ['setOverlayStatus']),
    sleep(t) {
      const a = new Promise(resolve => {
        setTimeout(() => { resolve() }, t)
      })

      return a
    },
    clearCache() {
      this.clearMonthlyStock()
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
      this.ProdMthlyTrFlag = true
    },
    getCrushedStock() {
      this.CruMthlyTrFlag = true
    },
    getMaterialStock() {
      this.MatMthlyTrFlag = true
    },
    async loadProductStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.ProdMthlyTrFlag) { await this.sleep(1000) }
      console.log('pellet clicked:', this.selectedMonth)
      this.$refs.prodMthlyStock.loadData(this.selectedMonth)
    },
    async loadCrushedStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.CruMthlyTrFlag) { await this.sleep(1000) }
      console.log('loadCrushedStocked:', this.selectedMonth)
      this.$refs.cruMthlyStock.loadData(this.selectedMonth)
    },

    async loadMaterialStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.MatMthlyTrFlag) { await this.sleep(1000) }
      console.log('loadMaterialStocked:', this.selectedMonth)
      this.$refs.matMthlyStock.loadData(this.selectedMonth)
    },
    reduceMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().substring(0, 7).replace('-', '')
      this.$router.push({ name: 'monthlytransferred-list', params: { month: selMonth }, query: { selTab: this.$route.query.selTab } })
      this.loadSelTab()
    },
    addMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() + 1)).toISOString().substring(0, 7).replace('-', '')
      console.log(selMonth, this.currentMonth)
      if (selMonth <= this.currentMonth) {
        this.$router.push({ name: 'monthlytransferred-list', params: { month: selMonth }, query: { selTab: this.$route.query.selTab } })
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
