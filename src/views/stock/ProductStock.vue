<template>
  <v-row
    class="px-2 my-2"
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
      v-if="this.$route.name === 'stock-list'"
      cols="12"
      md="3"
      style="text-align: right"
    >
      <v-btn
        color="secondary"
        outlined
        :loading="exportStatus"
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
    </v-col>
    <v-col
      cols="12"
      class="pa-0"
    >
      <v-data-table
        ref="productStock"
        :headers="headers"
        :items="f_MthlyProdStock"
        item-key="product_id"
        :items-per-page="-1"
      >
        <template v-slot:[`item.product_id`]="{ item }">
          <a :href="getURL(item)"> {{ item.product_id }}</a>
        </template>
        <template v-slot:[`item.sum_total`]="{ item }">
          <label :style="item.sum_total < 0 ? 'color:#F44336' : ''">{{
            item.sum_total ? item.sum_total.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
          }}</label>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data: () => ({
    dialogDelete: false,
    icons: { mdiPencil, mdiDelete, mdiExportVariant },
    productIds: [],
    product_id: '',
    exportStatus: false,
    headers: [
      {
        text: 'ペレットID',
        align: 'left',
        value: 'product_id',
        width: '30%',
        fixed: true,
      },
      {
        text: 'ペレット名',
        value: 'product_name',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '在庫量(kg)',
        value: 'sum_total',
        align: 'right',
        width: '40%',
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
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('monthlyStockStore', ['loadMthlyProdStock']),
    ...mapMutations('monthlyStockStore', ['filterMthlyProdStock']),
    ...mapMutations('app', ['setOverlayStatus']),
    loadData(selMonth) {
      console.log('loadproduct', selMonth, this.$route.name)
      this.loadMthlyProdStock(selMonth).then(() => {
        this.filterMthlyProdStock(this.product_id)
        this.productIds = [...new Set(this.MthlyProdStock.map(fs => fs.product_id))]
        this.setOverlayStatus(false)
      })
    },

    getURL(item) {
      // const today = new Date()
      // time go back 8 hours
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000 - 28800000)
      const year = today.getFullYear().toString()
      const month = (`0${today.getMonth() + 1}`).slice(-2)

      const url = `./dailystocked-list/${year}${month}?selTab=product&product_id=${item.product_id}`

      return url
    },

    downloadCSV() {
      const items = this.$refs.productStock.$children[0].filteredItems
      const sorted = this.$refs.productStock.$children[0].sortItems(items)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No,ペレットID,ペレット名,在庫重量(kg)\n'
      let no = 0
      sorted.forEach(el => {
        no += 1
        const pelletId = el.product_id ?? ''
        const pelletName = el.product_name ?? ''
        const weight = el.sum_total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        const line = `${no},"${pelletId}","${pelletName}","${weight}"\n`
        csv += line
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)

      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')

      link.download = 'ペレット-現在在庫'.concat('-', newstr, '.csv')
      link.click()

      // this.exportStatus = true
      // agent.Report.monthlyReportDownload({
      //   date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      //     .toISOString()
      //     .substring(0, 7)
      //     .replace('-', ''),
      //   data: {
      //     type: 'product',
      //     target_ids: this.productIds,
      //   },
      // }).then(() => {
      //   this.exportStatus = false
      // })
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
