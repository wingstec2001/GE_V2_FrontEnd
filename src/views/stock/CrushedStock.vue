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
        v-model="material_id"
        :items="materialIds"
        placeholder="材料ID"
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
        :loading="exportStatus"
        color="secondary"
        outlined
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
        ref="crushedStock"
        :headers="headers"
        :items="f_MthlyCruStock"
        item-key="material_id"
        :items-per-page="-1"
      >
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
import { mdiExportVariant, mdiMinus, mdiPlus } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data: () => ({
    dialogDelete: false,
    exportStatus: false,
    icons: { mdiExportVariant, mdiMinus, mdiPlus },
    materialIds: [],
    material_id: '',
    isExpand: false,
    headers: [
      {
        text: '材料ID',
        value: 'material_id',
        align: 'left',
        width: '35%',
        fixed: true,
        sortable: false,
      },
      {
        text: '材料名',
        value: 'material_name',
        align: 'left',
        width: '35%',
        fixed: true,
        sortable: false,
      },
      {
        text: '粉砕済(kg)',
        value: 'sum_total',
        align: 'right',
        width: '30%',
        fixed: true,
        sortable: true,
      },
    ],
  }),

  computed: {
    ...mapState('monthlyStockStore', ['MthlyCruStock', 'f_MthlyCruStock']),
  },

  watch: {
    material_id() {
      this.filterMthlyCruStock(this.material_id)
    },
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {

    ...mapActions('monthlyStockStore', ['loadMthlyCruStock']),
    ...mapMutations('monthlyStockStore', ['filterMthlyCruStock']),
    ...mapMutations('app', ['setOverlayStatus']),

    downloadCSV() {
      const items = this.$refs.crushedStock.$children[0].filteredItems
      const sorted = this.$refs.crushedStock.$children[0].sortItems(items)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No,材料ID,材料名,粉砕済在庫重量(kg)\n'
      let no = 0
      sorted.forEach(el => {
        no += 1
        const materialId = el.material_id ?? ''
        const materialName = el.material_name ?? ''
        const weight = el.sum_total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

        const line = `${no},"${materialId}","${materialName}","${weight}"\n`
        csv += line
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)

      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')

      link.download = '粉砕済-現在在庫'.concat('-', newstr, '.csv')
      link.click()
    },

    loadData(selMonth) {
      this.loadMthlyCruStock(selMonth).then(() => {
        this.filterMthlyCruStock(this.material_id)
        this.materialIds = [...new Set(this.MthlyCruStock.map(fs => fs.material_id))]
        this.setOverlayStatus(false)
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
