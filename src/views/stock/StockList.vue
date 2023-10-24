<template>
  <div id="currnet-stock-list">
    <v-card>
      <v-card-title>現在在庫V2</v-card-title>
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

        <v-tabs-items
          v-model="Stocktabs"
          touchless
        >
          <v-tab-item value="product">
            <product-stock
              ref="productStocked"
              @has-mounted="getProductStock"
            ></product-stock>
          </v-tab-item>
          <v-tab-item value="crushed">
            <crushed-stock
              ref="crushedStocked"
              @has-mounted="getCrushedStock"
            ></crushed-stock>
          </v-tab-item>
          <v-tab-item value="material">
            <material-stock
              ref="materialStocked"
              @has-mounted="getMaterialStock"
            ></material-stock>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import { mdiChevronLeft, mdiChevronRight, mdiExportVariant, mdiPencil } from '@mdi/js'
import { mapMutations } from 'vuex'
import ProductStock from './ProductStock.vue'
import MaterialStock from './MaterialStock.vue'
import CrushedStock from './CrushedStock.vue'
/* eslint-disable */

export default {
  components: {
    ProductStock,
    MaterialStock,
    CrushedStock,
  },
  data: () => ({
    Stocktabs: 'productStocked',
    ProductFlag: false,
    CrushedFlag: false,
    MaterialFlag: false,
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

  computed: {},

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
    ...mapMutations('stockedStore', ['clearStocked']),
    ...mapMutations('app', ['setOverlayStatus']),
    sleep(t) {
      const a = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, t)
      })

      return a
    },
    clearCache() {
      this.clearMonthlyStock()
      this.clearStocked()
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
      this.ProductFlag = true
    },
    getCrushedStock() {
      this.CrushedFlag = true
    },
    getMaterialStock() {
      this.MaterialFlag = true
    },
    async loadProductStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.ProductFlag) {
        await this.sleep(1000)
      }
      this.$refs.productStocked.loadData(this.currentMonth)
    },
    async loadCrushedStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.CrushedFlag) {
        await this.sleep(1000)
      }
      this.$refs.crushedStocked.loadData(this.currentMonth)
    },
    async loadMaterialStocked() {
      this.clearCache()
      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.MaterialFlag) {
        await this.sleep(1000)
      }
      this.$refs.materialStocked.loadData(this.currentMonth)
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
