<template>
  <v-card>
    <v-card-title class="px-5">
      月末繰越
    </v-card-title>
    <v-divider class="mt-3"></v-divider>
    <v-card-text class="d-flex align-center flex-wrap pb-0">
      <label
        class="me-3 mb-4"
        style="font-size: 16px"
      >ペレットID: {{ $route.params.id }}</label>
      <v-spacer></v-spacer>
      <div class="d-flex align-center flex-wrap">
        <v-btn
          color="secondary"
          outlined
          class="mb-4 me-3"
          @click="comeback"
        >
          <v-icon
            size="17"
            class="me-1"
          >
            {{ icons.mdiKeyboardReturn }}
          </v-icon>
          <span>戻る</span>
        </v-btn>
        <v-btn
          color="secondary"
          outlined
          :loading="exportStatus"
          class="mb-4"
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
      </div>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="perettoGetsujiInfo"
      item-key="target_date"
      :items-per-page="36"
    >
      <template v-slot:[`item.yyyymm`]="{ item }">
        <label>{{ item.yyyymm.substring(0, 4) }}年{{ item.yyyymm.substring(4, 6) }}月</label>
      </template>
      <template v-slot:[`item.product_weight`]="{ item }">
        <label :style="item.product_weight < 0 ? 'color:#F44336' : ''">{{
          item.product_weight ? item.product_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
        }}</label>
      </template>
      <template v-slot:[`item.crushed_weight`]="{ item }">
        <label :style="item.crushed_weight < 0 ? 'color:#F44336' : ''">{{
          item.crushed_weight ? item.crushed_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
        }}</label>
      </template>
      <template v-slot:[`item.material_weight`]="{ item }">
        <label :style="item.material_weight < 0 ? 'color:#F44336' : ''">{{
          item.material_weight ? item.material_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
        }}</label>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <v-col cols="12">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              {{ icons.mdiPencil }}
            </v-icon>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>

import {
  mdiPencil, mdiKeyboardReturn, mdiChevronLeft, mdiChevronRight, mdiExportVariant,
} from '@mdi/js'
import { mapState, mapActions } from 'vuex'
import agent from '@/api/agent'

export default {
  data: () => ({
    icons: {
      mdiPencil,
      mdiKeyboardReturn,
      mdiChevronLeft,
      mdiChevronRight,
      mdiExportVariant,
    },
    exportStatus: false,
    perettoGetsujiInfo: [],
    headers: [
      {
        text: '年月',
        align: 'left',
        value: 'yyyymm',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ペレット(kg)',
        value: 'product_weight',
        align: 'right',
        width: '25%',
        fixed: true,
      },
      {
        text: '粉砕済(kg)',
        value: 'crushed_weight',
        align: 'right',
        width: '25%',
        fixed: true,
      },
      {
        text: '未粉砕(kg)',
        value: 'material_weight',
        align: 'right',
        width: '25%',
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
    ...mapState('getsujiInfoStore', ['MonthlyInfo']),
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...mapActions('getsujiInfoStore', ['loadMonthlyInfo']),
    comeback() {
      this.$router.push({ name: 'monthlystocked-list', params: { month: this.$route.query.month } })
    },
    loadData() {
      this.loadMonthlyInfo().then(() => {
        this.perettoGetsujiInfo = this.MonthlyInfo.filter(f => {
          const pFlag = this.$route.params.id ? f.product_id === this.$route.params.id : true

          return pFlag
        })
      })
    },
    editItem(item) {
      this.$router.push({
        name: 'monthlystocked-edit',
        params: { month: item.yyyymm, id: item.id },
        query: { originalPage: 'perettogetsujiinfo', month: this.$route.query.month },
      })
    },
    downloadCSV() {
      this.exportStatus = true
      agent.Report.monthlyReportDownload({
        date: this.selectedDate,
        data: {
          type: 'product',
          product_ids: [this.$route.params.id],
        },
      }).then(() => {
        this.exportStatus = false
      })
    },
  },
}
</script>
