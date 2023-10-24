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
      md="3"
      style="text-align:right"
    >
      <v-btn
        color="secondary"
        outlined
        :loading="exportStatus"
        :disabled="selProductIds.length === 0"
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
    </v-col>
    <v-col
      cols="12"
      class="pa-0"
    >
      <v-data-table
        ref="MthlyProdStock"
        v-model="selectedDatas"
        :headers="headers"
        :items="f_MthlyProdStock"
        item-key="product_id"
        :items-per-page="-1"
        show-select
      >
        <template v-slot:[`item.product_id`]="{ item }">
          <a
            href="javascript:void(0);"
            @click="pushProductDaily(item)"
          >{{ item.product_id }}</a>
        </template>
        <template v-slot:[`item.weight_in`]="{ item }">
          <label>{{ item.weight_in ? item.weight_in.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.weight_out`]="{ item }">
          <label style="color:#F44336">{{ item.weight_out ? item.weight_out.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.weight_sum`]="{ item }">
          <label :style="item.weight_sum < 0 ? 'color:#F44336' : ''">{{ item.weight_sum ? item.weight_sum.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.lm_weight`]="{ item }">
          <label :style="item.lm_weight < 0 ? 'color:#F44336' : ''">{{ item.lm_weight ? item.lm_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.sum_total`]="{ item }">
          <label :style="item.sum_total < 0 ? 'color:#F44336' : ''">{{ item.sum_total ? item.sum_total.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'
import agent from '@/api/agent'

export default {
  data: () => ({
    dialogDelete: false,
    icon: { mdiPencil, mdiDelete, mdiExportVariant },
    productIds: [],
    product_id: '',
    selectedDatas: [],
    selProductIds: [],
    exportStatus: false,
    headers: [
      {
        text: 'ペレットID',
        align: 'left',
        value: 'product_id',
        width: '15%',
        fixed: true,
      },
      {
        text: '入庫合計(kg)',
        value: 'weight_in',
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '出庫合計(kg)',
        value: 'weight_out',
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '当月小計(kg)',
        value: 'weight_sum',
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '前月繰越分(kg)',
        value: 'lm_weight',
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '累計在庫(kg)',
        value: 'sum_total',
        align: 'right',
        width: '17%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('monthlyStockStore', ['MthlyProdStock', 'f_MthlyProdStock']),
  },

  watch: {
    product_id() {
      this.filterMthlyProdStock(this.product_id)
    },
    selectedDatas(newValue) {
      this.selProductIds = newValue.map(n => n.product_id)
    },
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('monthlyStockStore', ['loadMthlyProdStock']),
    ...mapMutations('monthlyStockStore', ['filterMthlyProdStock']),
    ...mapMutations('app', ['setOverlayStatus']),
    pushProductDaily(item) {
      console.log('pushProduct:', this.$route.params.month, item.product_id)
      this.$router.push({
        name: 'dailystocked-list',
        params: { month: this.$route.params.month },
        query: {
          selTab: 'product',
          product_id: item.product_id,
        },

        // query: { originalMth: this.$route.params.month, selTab: 'product' },
      })
    },
    loadData(selMonth) {
      this.loadMthlyProdStock(selMonth).then(() => {
        this.filterMthlyProdStock(this.product_id)
        this.productIds = this.MthlyProdStock.map(fs => fs.product_id)
        this.$nextTick(() => {
          this.$refs.MthlyProdStock.toggleSelectAll(true)
        })
        this.setOverlayStatus(false)
      })
    },
    downloadCSV() {
      this.exportStatus = true
      agent.Report.monthlyReportDownload({
        date: this.$route.params.month,
        data: {
          type: 'product',
          target_ids: this.selProductIds,
        },
      }).then(() => {
        this.exportStatus = false
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
