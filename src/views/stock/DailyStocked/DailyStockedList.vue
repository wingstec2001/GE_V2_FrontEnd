<template>
  <div id="stock-list">
    <v-card>
      <v-card-title>月次入出庫詳細</v-card-title>
      <v-tabs v-model="MthStocktabs">
        <v-tab
          href="#product"
          @click="jumpOrLoadProduct"
        >
          ペレット
        </v-tab>
        <v-tab
          href="#crushed"
          @click="jumpOrLoadCrushed"
        >
          粉砕済
        </v-tab>
        <v-tab
          href="#material"
          @click="jumpOrLoadMaterial"
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
          <label>{{ selectedMonth.substring(0, 4) }}年{{ selectedMonth.substring(4, 6) }}月</label>
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
        v-model="MthStocktabs"
        touchless
      >
        <v-tab-item value="product">
          <prod-daily-stocked
            ref="prodDailyStocked"
            @has-mounted="getprodDailyStock"
          ></prod-daily-stocked>
        </v-tab-item>
        <v-tab-item value="crushed">
          <cru-daily-stocked
            ref="cruDailyStocked"
            @has-mounted="getcruDailyStock"
          ></cru-daily-stocked>
        </v-tab-item>
        <v-tab-item value="material">
          <mat-daily-stocked
            ref="matDailyStocked"
            @has-mounted="getmatDailyStock"
          ></mat-daily-stocked>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable*/
import { mdiKeyboardReturn, mdiChevronLeft, mdiChevronRight, mdiExportVariant } from '@mdi/js'
import { mapMutations } from 'vuex'
import ProdDailyStocked from './ProductDailyStocked.vue'
import MatDailyStocked from './MaterialDailyStocked.vue'
import CruDailyStocked from './CrushedDailyStocked.vue'
/* eslint-disable*/

export default {
  components: {
    ProdDailyStocked,
    MatDailyStocked,
    CruDailyStocked,
  },
  data: () => ({
    icons: {
      mdiKeyboardReturn,
      mdiChevronLeft,
      mdiChevronRight,
      mdiExportVariant,
    },
    MthStocktabs: 'product',
    ProductFlage: false,
    CrushedFlag: false,
    MaterialFlag: false,
    // currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 7).replace('-', ''),
    // time go back 8 hours
    currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
  }),

  computed: {
    selectedMonth() {
      return this.$route.params.month
    },
  },

  mounted() {

    this.clearCache()
    if (this.$route.query.selTab) {
      this.MthStocktabs = this.$route.query.selTab
    }
    this.loadSelTab()
  },

  methods: {
    ...mapMutations('dailyStockStore', ['clearCache']),
    ...mapMutations('app', ['setOverlayStatus']),
    
    sleep(t) {
      const a = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, t)
      })

      return a
    },
    loadSelTab() {
      if (this.MthStocktabs === 'product') {
   
        this.loadProdDailyStocked()
      }
      if (this.MthStocktabs === 'crushed') {
        this.loadCruDailyStocked()
      }
      if (this.MthStocktabs === 'material') {
        this.loadMatDailyStocked()
      }
    },
    comeback(tab) {
      this.$router.push({
        name: 'monthlytransferred-list',
        params: { month: this.$route.params.month },
        query: { selTab: tab },
      })
    },
    jumpOrLoadProduct() {
      if (this.$route.query.selTab === 'product') {
        this.loadProdDailyStocked()
      } else {
        this.comeback('product')
      }
    },
    jumpOrLoadCrushed() {
      if (this.$route.query.selTab === 'crushed') {
        this.loadCruDailyStocked()
      } else {
        this.comeback('crushed')
      }
    },
    jumpOrLoadMaterial() {
      if (this.$route.query.selTab === 'material') {
        this.loadMatDailyStocked()
      } else {
        this.comeback('material')
      }
    },
    getprodDailyStock() {
      this.ProductFlage = true
    },
    getcruDailyStock() {
      this.CrushedFlag = true
    },
    getmatDailyStock() {
      this.MaterialFlag = true
    },
    async loadProdDailyStocked() {

      this.setOverlayStatus(true)

      /* eslint-disable-next-line */
      while (!this.ProductFlage) {
        await this.sleep(1000)
      }
      this.$refs.prodDailyStocked.loadData()
    },
    async loadCruDailyStocked() {
       console.log("loadMatloadCruDailyStocked ")
      this.setOverlayStatus(true)
      console.log(this.MthStocktabs)
      /* eslint-disable-next-line */
      while (!this.CrushedFlag) {
        await this.sleep(1000)
      }
      this.$refs.cruDailyStocked.loadData()
    },
    
    async loadMatDailyStocked() {

      this.setOverlayStatus(true)
      /* eslint-disable-next-line */
      while (!this.MaterialFlag) {
        await this.sleep(1000)
      }
      this.$refs.matDailyStocked.loadData()
    },
    reduceMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().substring(0, 7).replace('-', '')
      console.log('id params:',this.$route.params.id,this.MthStocktabs)
      console.log('id query:',this.$route.query)
      if (selMonth <= this.currentMonth) {
     

        if (this.MthStocktabs == "product") {
      
          console.log('id query:',this.$route.query)
          this.$router.push({
            name: 'dailystocked-list',
            params: { id: this.$route.params.id, month: selMonth },
            query: { 
              originalMth: this.$route.query.originalMth, 
              selTab: this.MthStocktabs,
              product_id: this.$route.query.product_id,
            },
          })
        }else {
           console.log('material_id query:',this.$route.query.material_id)
          this.$router.push({
           
            name: 'dailystocked-list',
            params: { id: this.$route.params.id, month: selMonth },
            query: { 
              originalMth: this.$route.query.originalMth, 
              selTab: this.MthStocktabs,
              material_id: this.$route.query.material_id,
   
            },
          })

        }
      }
      this.loadSelTab()
    },
    addMonth() {
      const date = new Date(`${this.selectedMonth.substring(0, 4)}-${this.selectedMonth.substring(4, 6)}`)
      const selMonth = new Date(date.setMonth(date.getMonth() + 1)).toISOString().substring(0, 7).replace('-', '')
      console.log(this.Stocktabs)
      if (selMonth <= this.currentMonth) {
        console.log('id params:',this.$route.params.id)
        console.log('id query:',this.$route.query)

        if (this.MthStocktabs == "product") {
          this.$router.push({
            name: 'dailystocked-list',
            params: { id: this.$route.params.id, month: selMonth },
            query: { 
              originalMth: this.$route.query.originalMth, 
              selTab: this.MthStocktabs,
              product_id: this.$route.query.product_id,
            },
          })
        }else {
          this.$router.push({
            name: 'dailystocked-list',
            params: { id: this.$route.params.id, month: selMonth },
            query: { 
              originalMth: this.$route.query.originalMth, 
              selTab: this.MthStocktabs,
              material_id: this.$route.query.material_id,
            },
          })

        }
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
