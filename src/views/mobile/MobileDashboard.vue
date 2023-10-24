<template>
  <v-row
    no-gutters
    style="height: 100%"
  >
    <v-col cols="12">
      <v-tabs v-model="tabs">
        <v-tab
          href="#dashborad"
          @click="loadDashboards"
        >
          お知らせ
        </v-tab>
        <v-tab
          href="#productStocked"
          @click="loadProductStocked"
        >
          ペレット
        </v-tab>
        <v-tab
          href="#crushedStocked"
          @click="loadCrushedStocked"
        >
          粉砕済
        </v-tab>
        <v-tab
          href="#materialStocked"
          @click="loadMaterialStocked"
        >
          未粉砕
        </v-tab>

        <v-tabs-items
          v-model="tabs"
          touchless
          :style="tabItemsStyle"
        >
          <v-tab-item value="dashborad">
            <dashboard-tab
              ref="dashboard"
              @has-mounted="getDashboard"
            ></dashboard-tab>
          </v-tab-item>
          <v-tab-item value="productStocked">
            <product-tab
              ref="productStocked"
              @has-mounted="getProductStock"
            ></product-tab>
          </v-tab-item>
          <v-tab-item value="crushedStocked">
            <crushed-tab
              ref="crushedStocked"
              @has-mounted="getCrushedStock"
            ></crushed-tab>
          </v-tab-item>
          <v-tab-item value="materialStocked">
            <material-tab
              ref="materialStocked"
              @has-mounted="getMaterialStock"
            ></material-tab>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-col>
  </v-row>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import DashboardTab from './DashboardTab.vue'
import ProductTab from './ProductTab.vue'
import CrushedTab from './CrushedTab.vue'
import MaterialTab from './MaterailTab.vue'

export default {
  name: 'Dashboard',
  components: {
    DashboardTab,
    ProductTab,
    CrushedTab,
    MaterialTab,
  },
  data: () => ({
    tabs: 'dashborad',
    DashboardFlag: false,
    ProductFlag: false,
    CrushedFlag: false,
    MaterialFlag: false,

    // currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    //   .toISOString()
    //   .substring(0, 7)
    //   .replace('-', ''),
    currentMonth: new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000).toISOString().substring(0, 7).replace('-', ''),
  }),
  computed: {
    tabItemsStyle() {
      return `height:${this.clientHeight - 98}px;overflow-y: scroll;`
    },
    ...mapState('app', ['clientHeight']),
  },
  watch: {},
  mounted() {
    if (this.tabs === 'dashborad') {
      this.loadDashboards()
    }
    if (this.tabs === 'productStocked') {
      this.loadProductStocked()
    }
    if (this.tabs === 'crushedStocked') {
      this.loadCrushedStocked()
    }
    if (this.tabs === 'materialStocked') {
      this.loadMaterialStocked()
    }
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    sleep(t) {
      const a = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, t)
      })

      return a
    },
    getDashboard() {
      this.DashboardFlag = true
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
    async loadDashboards() {
      this.setOverlayStatus(true)

      /* eslint-disable no-await-in-loop */
      while (!this.DashboardFlag) {
        await this.sleep(1000)
      }
      /* eslint-disable no-await-in-loop */
      this.$refs.dashboard.loadData()
    },
    async loadProductStocked() {
      this.setOverlayStatus(true)

      while (!this.ProductFlag) {
        await this.sleep(1000)
      }

      this.$refs.productStocked.loadData(this.currentMonth)
    },
    async loadCrushedStocked() {
      this.setOverlayStatus(true)

      while (!this.CrushedFlag) {
        await this.sleep(1000)
      }
      this.$refs.crushedStocked.loadData(this.currentMonth)
    },
    async loadMaterialStocked() {
      this.setOverlayStatus(true)

      while (!this.MaterialFlag) {
        await this.sleep(1000)
      }
      this.$refs.materialStocked.loadData(this.currentMonth)
    },
  },
}
</script>
<style lang="scss" >
.v-slide-group__prev.v-slide-group__prev--disabled {
  display: none !important;
}
</style>
