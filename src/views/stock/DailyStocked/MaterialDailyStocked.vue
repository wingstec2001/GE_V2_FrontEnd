<!-- 月単位毎日入出庫ー材料 -->
<template>
  <div>
    <v-row
      align="center"
      class="mx-0 px-0 mt-1"
    >
      <v-col
        cols="12"
        md="4"
        class="px-5"
      >
        <label style="font-size: 16px">材料ID: {{ $route.query.material_id }}</label>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        md="4"
        class="px-5"
      >
        <div class="d-flex align-center flex-wrap">
          <v-spacer></v-spacer>
          <v-btn
            class="me-3"
            color="primary"
            outlined
            @click="recalculate"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiCalculator }}
            </v-icon>
            <span>再計算</span>
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="px-5"
      >
        <div class="d-flex align-center flex-wrap">
          <v-spacer></v-spacer>
          <v-btn
            class="me-3"
            color="secondary"
            outlined
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
            :loading="exportStatus"
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
        </div>
      </v-col>
    </v-row>
    <v-divider class="mt-3"></v-divider>
    <v-card-text class="pa-0">
      <v-row
        align="center"
        class="ma-0"
      >
        <v-col
          cols="12"
          class="pa-0"
        >
          <v-data-table
            :headers="headers"
            :items="DailyMaterialStock"
            group-by="material_id"
            item-key="target_date"
            :items-per-page="-1"
          >
            <template v-slot:[`item.weight_in`]="{ item }">
              <MaterialDailyInbound
                :material_id="$route.query.material_id"
                :weight_in="item.weight_in"
                :date="item.target_date"
                @ok="loadData"
              ></MaterialDailyInbound>
              <!-- {{ formatData(item.weight_in) }} -->
            </template>
            <template v-slot:[`item.weight_out`]="{ item }">
              <MaterialDailyOutbound
                :material_id="$route.query.material_id"
                :weight_out="item.weight_out"
                :date="item.target_date"
                @ok="loadData"
              ></MaterialDailyOutbound>
              <!-- {{ formatData(item.weight_out) }} -->
            </template>
            <template v-slot:[`item.daily_weight`]="{ item }">
              <label :style="item.daily_weight < 0 ? 'color:#F44336' : ''">{{ formatData(item.daily_weight) }}</label>
            </template>
            <template v-slot:[`item.net_weight`]="{ item }">
              <label :style="item.net_weight < 0 ? 'color:#F44336' : ''">{{ formatData(item.net_weight) }}</label>
            </template>
            <template v-slot:[`group.header`]>
            </template>
            <template v-slot:[`body.prepend`]>
              <tr>
                <td style="background: #ffffff">
                  前月繰越分
                </td>
                <td style="background: #ffffff; text-align: right">
                  <MaterialMthInboundEdit
                    :id="getsuji_id"
                    :material_id="$route.query.material_id"
                    :month="$route.params.month"
                    :weight="wgtin_lmSum"
                    @edited="loadData"
                  ></MaterialMthInboundEdit>
                  <!-- {{ formatData(wgtin_lmSum) }} -->
                </td>
                <td style="background: #ffffff; text-align: right; color: #f44336 !important">
                  {{ formatData(wgtout_lmSum) }}
                </td>
                <td
                  :style="`background:#FFFFFF;text-align:right;${
                    wgtin_lmSum - wgtout_lmSum < 0 ? 'color:#F44336 !important;' : ''
                  }`"
                >
                  {{ formatData(wgtin_lmSum - wgtout_lmSum) }}
                </td>
                <td :style="`background:#FFFFFF;text-align:right;${net_weight < 0 ? 'color:#F44336 !important;' : ''}`">
                  {{ formatData(net_weight) }}
                </td>
              </tr>
            </template>
            <template v-slot:[`group.summary`]>
              <td style="background: #ffffff; text-align: right"></td>
              <td style="background: #ffffff; text-align: right">
                {{ formatData(MthWgtIn) }}
              </td>
              <td style="background: #ffffff; text-align: right; color: #f44336 !important">
                {{ formatData(MthWgtOut) }}
              </td>
              <td :style="`background:#FFFFFF;text-align:right;${MthWgt < 0 ? 'color:#F44336 !important;' : ''}`">
                {{ formatData(MthWgt) }}
              </td>
              <td style="background: #ffffff; text-align: right"></td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
  <!-- </v-card> -->
</template>

<script>
/* eslint-disable */
import { mdiKeyboardReturn, mdiChevronLeft, mdiChevronRight, mdiExportVariant,mdiCalculator } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'
import agent from '@/api/agent'
import MaterialMthInboundEdit from './MaterialMthInboundEdit.vue'
import MaterialMthOutboundEdit from './MaterialMthOutboundEdit.vue'
import MaterialDailyInbound from './MaterialDailyInbound.vue'
import MaterialDailyOutbound from './MaterialDailyOutbound.vue'
/* eslint-disable */

export default {
  components: {
    MaterialMthInboundEdit,
    MaterialMthOutboundEdit,
    MaterialDailyInbound,
    MaterialDailyOutbound,
  },
  data: () => ({
    icons: {
      mdiKeyboardReturn,
      mdiChevronLeft,
      mdiChevronRight,
      mdiExportVariant,
      mdiCalculator,
    },
    exportStatus: false,
    currentDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(),

    headers: [
      {
        text: '',
        align: 'left',
        value: 'target_date',
        width: '20%',
        fixed: true,
      },
      {
        text: '入庫量(kg)',
        value: 'weight_in',
        align: 'right',
        width: '20%',
        fixed: true,
      },
      {
        text: '出庫量(kg)',
        value: 'weight_out',
        align: 'right',
        width: '20%',
        fixed: true,
      },
      {
        text: '当日小計(kg)',
        value: 'daily_weight',
        align: 'right',
        width: '20%',
        fixed: true,
      },
      {
        text: '累計在庫(kg)',
        value: 'net_weight',
        align: 'right',
        width: '20%',
        fixed: true,
      },
    ],
    f_StockedProducts: [
      {
        material_id: 'AAAAA',
        date: '12月1日',
        weight_in: '3250',
        weight_out: '2600',
        net_weight_daily: '650',
        net_weight: '15600',
      },
    ],
  }),
  computed: {
    ...mapState('dailyStockStore', ['DailyMaterialStock', 'wgtin_lmSum', 'wgtout_lmSum', 'net_weight','getsuji_id']),
    selectedMonth() {
      return this.$route.params.month
    },
    formatData() {
      return function (data) {
        if (typeof data === 'number') {
          return data.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }
        if (typeof data === 'string') {
          return data.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }

        return data
      }
    },
    MthWgtIn() {
      let sum = 0
      if (this.DailyMaterialStock) {
        this.DailyMaterialStock.forEach(cp => {
          sum += cp.weight_in
        })
      }
      sum += this.wgtin_lmSum

      return sum
    },
    MthWgtOut() {
      let sum = 0
      if (this.DailyMaterialStock) {
        this.DailyMaterialStock.forEach(cp => {
          sum += cp.weight_out
        })
      }
      sum += this.wgtout_lmSum

      return sum
    },
    MthWgt() {
      let sum = 0
      if (this.DailyMaterialStock) {
        this.DailyMaterialStock.forEach(cp => {
          sum += cp.daily_weight
        })
      }
      sum = sum + this.wgtin_lmSum - this.wgtout_lmSum

      return sum
    },
  },
  mounted() {
    this.$emit('has-mounted')
  },
  methods: {
    ...mapActions('dailyStockStore', ['loadDailyMaterialStock','recalculateMaterialStock']),
    ...mapMutations('app', ['setOverlayStatus']),

    //再計算
    recalculate() {
      this.setOverlayStatus(true)

      this.recalculateMaterialStock({
        month: this.$route.params.month,
        material_id: this.$route.query.material_id,
      }).then(() => {
        this.setOverlayStatus(false)
      })
    },

    comeback() {
      this.$router.push({
        name: 'monthlytransferred-list',
        params: { month: this.$route.params.month },
        query: { selTab: this.$route.query.selTab },
      })
    },

    loadData() {
      this.setOverlayStatus(true)

      this.loadDailyMaterialStock({
        month: this.$route.params.month,
        material_id: this.$route.query.material_id,
      }).then(() => {
        this.setOverlayStatus(false)
      })
    },

    downloadCSV() {
      this.exportStatus = true
      agent.Report.monthlyReportDownload({
        date: this.selectedMonth,
        data: {
          type: 'material',
          target_ids: [this.$route.params.id],
        },
      }).then(() => {
        this.exportStatus = false
      })
    },
  },
}
</script>
