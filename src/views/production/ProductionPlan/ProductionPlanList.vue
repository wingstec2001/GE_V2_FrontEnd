<template>
  <div id="productionactual-list">
    <v-card>
      <v-card-title> 生産計画一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="route_id"
            :items="items1"
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
                v-bind="attrs"
                :prepend-icon="icon.mdiCalendar"
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
                :prepend-icon="icon.mdiCalendar"
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
            :to="{ name: 'productionplan-create' }"
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
              {{ icon.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="productionplanList"
        :search="searchQuery"
        sort-by
        class="elevation-1"
      >
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
                {{ icon.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col
              style="padding-left:0px"
              cols="6"
            >
              <delete-form
                :icon="icon.mdiDelete"
                :item="item"
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
  mdiCalendar,
  mdiMagnify,
  mdiPencil,
  mdiDelete,
  mdiExportVariant,
} from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import DeleteForm from './ProductionPlanDelete.vue'

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
    productionplanList: [],
    items1: ['1', '2'],
    icon: {
      mdiCalendar,
      mdiMagnify,
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
    },
    searchQuery: '',
    headers: [
      {
        text: '生産計画日',
        align: 'left',
        sortable: true,
        value: 'plan_date',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ルーター', value: 'route_id', align: 'left', width: '12%', fixed: true,
      },
      {
        text: 'ペレットID', value: 'product_id', align: 'left', width: '20%', fixed: true,
      },
      {
        text: 'ペレット名', value: 'product_name', align: 'left', width: '20%', fixed: true,
      },
      {
        text: '生産量', value: 'plan_weight', align: 'right', width: '20%', fixed: true,
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
  }),
  computed: {
    ...mapState('productionplanStore', ['productionplans', 'f_productionplans']),
    ...mapState('productStore', ['productIds']),
  },
  watch: {
    route_id(routeId) {
      this.filterProductionPlans({
        routeId,
        productId: this.product_id,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      this.productionplanList = this.f_productionplans
    },

    product_id(productId) {
      this.filterProductionPlans({
        routeId: this.route_id,
        productId,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      this.productionplanList = this.f_productionplans
    },
    startDate(startDate) {
      this.filterProductionPlans({
        routeId: this.route_id,
        productId: this.product_id,
        startDate,
        endDate: this.endDate,
      })
      this.productionplanList = this.f_productionplans
    },
    endDate(endDate) {
      this.filterProductionPlans({
        routeId: this.route_id,
        productId: this.product_id,
        startDate: this.startDate,
        endDate,
      })
      this.productionplanList = this.f_productionplans
    },
    productionplans(value) {
      this.productionplanList = value
    },
  },

  created() {
    this.loadProductIds()
    this.loadProductionPlans().then(() => {
      this.productionplanList = this.productionplans
    })
  },

  methods: {
    ...mapMutations('productionplanStore', ['filterProductionPlans']),
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionplanStore', ['loadProductionPlans']),
    editItem(item) {
      this.$router.push({ name: 'productionplan-edit', params: { id: item.id } })
    },
    downloadCSV() {
      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + '生産計画日,ルーター,ペレットID,生産量\n'
      this.productionplanList.forEach(el => {
        const line = `"${el.plan_date}","${el.route_id}","${el.product_id}","${el.plan_weight}"\n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = '生産計画一覧.csv'
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
