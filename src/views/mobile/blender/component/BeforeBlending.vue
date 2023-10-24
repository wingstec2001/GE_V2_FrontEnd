<template>
  <v-card>
    <v-row class="px-2 ma-0">
      <v-col cols="8">
        <v-select
          v-model="material_id"
          :items="materialIds"
          placeholder="材料ID"
          outlined
          clearable
          dense
          hide-details="auto"
          class="subtitle-1"
        ></v-select>
      </v-col>

      <v-col cols="4">
        <v-chip
          label
          class="ml-4"
          color="success"
        >
          自社紛
        </v-chip>
      </v-col>

      <v-col cols="8">
        <v-select
          v-model="origin"
          :items="supplierIds"
          placeholder="仕入先ID"
          outlined
          clearable
          dense
          hide-details="auto"
          class="subtitle-1"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-chip
          label
          class="ml-4 mt-2"
          color="orange"
        >
          入荷紛
        </v-chip>
      </v-col>

      <v-col cols="8">
        <WeightInput
          v-model="blended_weight"
          label="ブレンド重量*"
          :outlined="true"
          hide-details="auto"
        ></WeightInput>
      </v-col>
      <v-col cols="4">
        <v-btn
          color="primary"
          outlined
          @click="Submit()"
        >
          <v-icon class="me-1">
            {{ icons.mdiPlus }}
          </v-icon>
        </v-btn>
      </v-col>

      <v-card-text>
        <v-virtual-scroll
          :bench="0"
          :items="f_StockCrushed"
          :height="vScrollHeight"
          :item-height="76"
          class="pb-0"
        >
          <template v-slot:default="{ item }">
            <SliderComponent
              :id="item.id"
              type="confirm"
              @click="sliderClicked"
            >
              <v-list-item class="d-flex align-center px-2">
                <v-avatar
                  class="px-2"
                  tile
                  :color="item.origin=='自社紛'? 'success' : 'orange'"
                  size="60"
                  width="fit-content"
                  :class="`white--text font-weight-medium me-3`"
                >
                  <span class="font-weight-semibold text-base">{{ item.id }}</span>
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-semibold text-base"
                    v-text="item.material_id"
                  ></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary text-base me-1"
                  >
                    {{ item.origin }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <div class="font-weight-semibold text-base text-right pr-3">
                    {{ item.crushed_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </SliderComponent>
            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </v-card-text>
    </v-row>
  </v-card>
</template>

<script>
import {
  mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd, mdiPlus,
} from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import SliderComponent from '../../component/SliderComponent.vue'
import WeightInput from '@/components/WeightInputComponent.vue'

import agent from '@/api/agent'

export default {

  components: {
    SliderComponent,
    WeightInput,
  },
  props: {},
  data: () => ({
    material_id: '',
    origin: '',
    blended_weight: 0,
    time: '',
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
      mdiPlus,
    },
    materialIds: [],
    supplierIds: [],
    info: {
      material_id: '',
      blended_weight: 0,

    },
  }),

  computed: {
    ...mapState('app', ['clientHeight']),
    ...mapState('stockCrushingStore', ['f_StockCrushed', 'StockCrushed']),

    vScrollHeight() {
      return `${this.clientHeight - 220}px`
    },

  },

  watch: {
    material_id() {
      this.filterStockCrushed({ material_id: this.material_id, origin: this.origin })
      this.supplierIds = this.f_StockCrushed.map(fs => fs.origin).sort()
    },

    origin() {
      this.filterStockCrushed({ material_id: this.material_id, origin: this.origin })
      this.materialIds = this.f_StockCrushed.map(fs => fs.material_id).sort()
    },
  },

  mounted() {
    this.refreshList()
  },

  methods: {
    ...mapActions('blenderStore', ['addByWeight']),
    ...mapActions('stockCrushingStore', ['loadStockCrushed']),
    ...mapActions('dashboardStore', ['loadBlendedDaySum']),
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapMutations('stockCrushingStore', ['filterStockCrushed']),

    refreshList() {
      this.setOverlayStatus(true)

      this.loadStockCrushed().then(() => {
        this.filterStockCrushed({ material_id: this.material_id })

        this.materialIds = this.f_StockCrushed.map(fs => fs.material_id).sort()

        this.supplierIds = this.f_StockCrushed.map(fs => fs.origin).sort()

        if (this.f_StockCrushed.length === 0) {
          this.material_id = ''
          this.origin = ''
        }

        this.loadBlendedDaySum()
        this.setOverlayStatus(false)
      })
    },

    sliderClicked(val) {
      if (val.target === 'confirm') {
        agent.Perform.Blending([{ id: val.id }]).then(() => {
          this.refreshList()

          val.node.resetSlider()
        })
      }
    },

    materialIdErrors() {
      const errors = []
      if (!this.$v.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.material_id.required && errors.push('必須項目')

      return errors
    },

    // weightErrors() {
    //   console.log('weighterrors:', this.blended_weight)
    //   const errors = []
    //   if (!this.$v.material_id.$dirty) return errors
    //   // eslint-disable-next-line no-unused-expressions
    //   if (this.$v.blended_weight.minValue) {
    //     console.log('<1')
    //     errors.push('１以上を入力')
    //   }

    //   return errors
    // },

    // 数量によるブレンド
    Submit() {
      if (this.material_id === '' || this.material_id === null) {
        alert('材料IDを選択してください！')

        return
      }
      if (this.blended_weight <= 0) {
      // eslint-disable-next-line no-restricted-globals
        alert('重量は1以上にしてください!')

        return
      }

      let isBigger = true
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.f_StockCrushed.length; i++) {
        console.log('length:', this.f_StockCrushed.length)
        if (this.blended_weight <= this.f_StockCrushed[i].crushed_weight) {
          isBigger = false
          console.log(this.blended_weight, this.f_StockCrushed[i].crushed_weight, isBigger)
          break
        }
      }

      if (isBigger) {
        /* eslint no-alert: */
        alert('ブレンド重量を分割して下さい!')

        return
      }

      this.info.material_id = this.material_id
      this.info.blended_weight = this.blended_weight
      console.log('submit:', this.info)
      this.addByWeight(this.info).then(() => {
        this.refreshList()
        this.blended_weight = 0
      })
    },
  },
}
</script>
<style scoped>
.v-select__selections input {
  font-size: 14px !important;
}
.v-select__selection v-select__selection--comma {
  font-size: 14px !important;
}
.wrap-text {
  word-break: break-all;
  white-space: normal;
}
</style>
