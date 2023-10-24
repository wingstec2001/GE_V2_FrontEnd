<template>
  <v-card height="342.55">
    <v-card-title class="align-start">
      <span>生産集計(ルーター1)</span>

      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="reservations"
        height="198"
        :item-height="66"
        class="pb-0"
      >
        <template v-slot:default="{ item }">
          <v-list-item
            class="d-flex align-center px-0 mt-4"
          >
            <div class="d-flex align-center flex-grow-1 flex-wrap">
              <div class="me-2">
                <div class="font-weight-semibold">
                  <span class="text-xs">{{ item.id }}</span>
                </div>

                <v-list-item-subtitle class="text--primary text-base me-1">
                  {{ item.name }}
                </v-list-item-subtitle>
              </div>

              <v-spacer></v-spacer>

              <div style="padding-right:5%">
                <h4 class="font-weight-semibold">
                  {{ item.amount }}Kg
                </h4>
              </div>
            </div>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
      <v-btn
        block
        color="primary"
        class="mt-6"
        outlined
        :to="{ name: 'productionactual-list' }"
      >
        Details
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiDotsVertical,
  mdiTrendingUp,
  mdiCurrencyUsd,
} from '@mdi/js'
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
    reservations() {
      const reservationsLength = this.productionsum.length

      return Array.from({ length: reservationsLength }, (k, v) => {
        const reservation = this.productionsum[v]

        return {
          id: reservation.product_id,
          name: reservation.product_name,
          amount: reservation.produced_weight,
        }
      })
    },
    ...mapState('dashboardStore', ['productionsum']),

  },
  created() {
    this.loadProductionsum(1).then(() => {
    })
  },
  methods: {
    ...mapActions('dashboardStore', ['loadProductionsum']),

  },
}
</script>
