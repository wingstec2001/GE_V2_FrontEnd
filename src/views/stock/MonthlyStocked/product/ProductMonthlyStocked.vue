<template>
  <v-row
    class="px-2 mt-2"
    align="center"
  >
    <v-col
      cols="12"
      md="3"
      class="py-4"
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
    <v-spacer></v-spacer>
    <v-col
      cols="12"
      class="pa-0"
    >
      <v-data-table
        ref="MthlyProdStockSt"
        :headers="headers"
        :items="f_MonthlyProducts"
        item-key="product_id"
        :items-per-page="-1"
      >
        <template v-slot:[`item.total_weight`]="{ item }">
          <label :style="item.total_weight < 0 ? 'color:#F44336' : ''">{{ item.total_weight ? item.total_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col cols="12">
              <product-monthly-st-edit
                :id="item.id"
                :icon="icons.mdiPencil"
                @edited="reload"
              ></product-monthly-st-edit>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil, mdiExportVariant } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'
import ProductMonthlyStEdit from './ProductMonthlyStEdit.vue'

export default {
  components: {
    ProductMonthlyStEdit,
  },
  data: () => ({
    dialogDelete: false,
    icons: { mdiPencil, mdiExportVariant },
    productIds: [],
    product_id: '',
    exportStatus: false,
    headers: [
      {
        text: 'ペレットID',
        align: 'left',
        value: 'product_id',
        width: '45%',
        fixed: true,
      },
      {
        text: '在庫量(kg)',
        value: 'total_weight',
        align: 'right',
        width: '50%',
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
  }),

  computed: {
    ...mapState('getsujiProductStore', ['MonthlyProducts', 'f_MonthlyProducts']),
  },

  watch: {
    product_id() {
      this.filterIdMonthlyProducts(this.product_id)
    },
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('getsujiProductStore', ['loadMonthlyProducts']),
    ...mapMutations('getsujiProductStore', ['filterIdMonthlyProducts']),
    ...mapMutations('app', ['setOverlayStatus']),
    reload() {
      this.$emit('reload')
    },
    loadData(selMonth) {
      console.log('month:', selMonth)
      this.loadMonthlyProducts(selMonth).then(() => {
        this.filterIdMonthlyProducts(this.product_id)

        this.productIds = this.MonthlyProducts.map(fs => fs.product_id)
        this.setOverlayStatus(false)
      })
    },
  },
}
</script>
