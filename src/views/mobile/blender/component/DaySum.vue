<template>
  <v-card min-height="75vh">
    <v-card-text>
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
                <div class="me-2">
                  <div class="font-weight-semibold text-base">
                    <span>{{ item.id }}</span>
                  </div>
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
      const reservationsLength = this.blendedDaySum.length

      return Array.from({ length: reservationsLength }, (k, v) => {
        const reservation = this.blendedDaySum[v]

        return {
          id: reservation.material_id,
          amount: reservation.blended_weight,
        }
      })
    },
    ...mapState('dashboardStore', ['blendedDaySum']),
    ...mapState('app', ['clientHeight']),
  },
  watch: {},
  created() {

  },
  methods: {
    ...mapActions('dashboardStore', ['loadBlendedDaySum']),
  },
}
</script>
