<template>
  <v-card>
    <v-row class="px-2 ma-0">
      <v-col cols="6">
        <v-select
          v-model="material_id"
          :items="materialIds"
          placeholder="材料ID"
          outlined
          clearable
          dense
          hide-details
          class="subtitle-1"
        ></v-select>
      </v-col>
    </v-row>
    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="f_InhouseCrushed"
        :height="vScrollHeight"
        :item-height="70"
        class="pb-0"
      >
        <template v-slot:default="{ item, index }">
          <SliderComponent
            :id="item.id"
            type="confirm"
            @click="sliderClicked"
          >
            <v-list-item class="d-flex align-center px-2">
              <v-avatar
                class="px-2"
                tile
                :color="index % 2 == 0 ? 'success' : 'orange'"
                size="50"
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
                <v-list-item-subtitle class="text--primary text-base me-1">
                  <div
                    class="displaytext"
                    v-text="item.customer_id"
                  ></div>
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
  </v-card>
</template>

<script>
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'

import SliderComponent from '../../component/SliderComponent.vue'

import agent from '@/api/agent'

export default {
  components: {
    SliderComponent,
  },
  props: {},
  data: () => ({
    material_id: '',
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
    },
    materialIds: [],
  }),
  computed: {
    vScrollHeight() {
      return `${this.clientHeight - 220}px`
    },
    ...mapState('app', ['clientHeight']),
    ...mapState('stockCrushingStore', ['f_InhouseCrushed', 'InhouseCrushed']),
  },
  watch: {
    material_id() {
      this.filterInhouseCrushed({ material_id: this.material_id })
    },
  },
  mounted() {
    this.refreshList()
  },

  methods: {
    ...mapActions('stockCrushingStore', ['loadInhouseCrushed']),
    ...mapActions('dashboardStore', ['loadBlendedDaySum']),
    ...mapMutations('stockCrushingStore', ['filterInhouseCrushed']),

    refreshList() {
      this.loadInhouseCrushed().then(() => {
        this.filterInhouseCrushed({ material_id: this.material_id })
        this.materialIds = this.InhouseCrushed.map(fs => fs.material_id).sort()
      })
      this.loadBlendedDaySum()
    },

    sliderClicked(val) {
      if (val.target === 'confirm') {
        agent.Perform.Blending([{ id: val.id }]).then(() => {
          this.refreshList()

          val.node.resetSlider()
        })
      }
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
</style>
