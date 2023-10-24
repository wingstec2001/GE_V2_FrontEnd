<template>
  <v-card min-height="75vh">
    <v-card-text>
      <!-- <v-virtual-scroll
        :bench="0"
        :items="reservations"
        min-height="400"
        :item-height="66"
        class="pb-0"
      > -->
      <v-virtual-scroll
        :bench="0"
        :items="reservations"
        :height="vScrollHeight"
        :item-height="70"
      >
        <template v-slot:default="{ item }">
          <v-list-item class="d-flex align-center px-0 mt-4">
            <v-list-item-content>
              <div class="d-flex align-center flex-grow-1 flex-wrap">
                <div class="font-weight-semibold text-base">
                  <span>{{ item.id }}</span>
                </div>

                <v-spacer></v-spacer>
              </div>
            </v-list-item-content>

            <v-list-item-action class="mr-2">
              <div class="font-weight-semibold text-base">
                {{ item.amount.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}
              </div>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from '@mdi/js'
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
    },
  }),
  computed: {
    vScrollHeight() {
      return `${this.clientHeight - 220}px`
    },
    reservations() {
      const reservationsLength = this.crushingDaySum.length

      return Array.from({ length: reservationsLength }, (k, v) => {
        const reservation = this.crushingDaySum[v]

        return {
          id: reservation.material_id,
          amount: reservation.actual_weight,
        }
      })
    },
    ...mapState('dashboardStore', ['crushingDaySum']),
    ...mapState('app', ['clientHeight']),
  },
  watch: {},
  created() {
    console.log('crushing,created.')
    this.loadCrushingDaySum().then(() => {})
  },
  methods: {
    ...mapActions('dashboardStore', ['loadCrushingDaySum']),
  },
}
</script>
