<template>
  <v-card>
    <v-row
      class="px-2 ma-0"
      align="center"
    >
      <v-col cols="6">
        <v-select
          v-model="material_id"
          :items="materialIds"
          placeholder="材料ID"
          outlined
          clearable
          dense
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-card-text class="pb-0">
      <v-virtual-scroll
        :bench="0"
        :items="f_MthlyMatStock"
        :height="vScrollHeight"
        :item-height="50"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item
            :key="index"
            class="d-flex align-center px-2"
          >
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-semibold text-base"
                v-text="item.material_id"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <div class="font-weight-semibold text-base text-right pr-3">
                <label :style="item.sum_total < 0 ? 'color:#F44336' : ''">{{
                  item.sum_total ? item.sum_total.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0'
                }}</label>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data: () => ({
    icon: { mdiPencil, mdiDelete, mdiExportVariant },
    materialIds: [],
    material_id: '',
  }),

  computed: {
    ...mapState('app', ['clientHeight']),
    ...mapState('monthlyStockStore', ['MthlyMatStock', 'f_MthlyMatStock']),
    vScrollHeight() {
      return `${this.clientHeight - 162}px`
    },
  },

  watch: {
    material_id() {
      this.filterMthlyMatStock(this.material_id)
    },
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('monthlyStockStore', ['loadMthlyMatStock']),
    ...mapMutations('monthlyStockStore', ['filterMthlyMatStock']),
    ...mapMutations('app', ['setOverlayStatus']),
    loadData(selMonth) {
      this.loadMthlyMatStock(selMonth).then(() => {
        this.filterMthlyMatStock(this.material_id)
        this.materialIds = [...new Set(this.MthlyMatStock.map(fs => fs.material_id))]
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
