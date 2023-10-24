<template>
  <v-card min-height="75vh">
    <v-card-title class="align-start">
      <span>ルーター{{ routenum }}</span>

      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-text>
      <!-- <v-virtual-scroll
        :bench="0"
        :items="reservations"
        min-height="400"
        :item-height="66"
        class="pb-0"
      > -->
      <v-virtual-scroll

        :items="reservations"
        :height="vScrollHeight"
        :item-height="80"
      >
        <template v-slot:default="{ item }">
          <v-list-item class="d-flex align-center px-0 mt-4">
            <v-list-item-content>
              <div class="d-flex align-center flex-grow-1 flex-wrap">
                <div class="me-2">
                  <div class="font-weight-semibold text-base">
                    <span>{{ item.id }}</span>
                  </div>

                  <v-list-item-subtitle class="text--primary font-weight-semibold text-base me-1">
                    {{ item.name }}
                  </v-list-item-subtitle>
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
  props: {
    routenum: {
      type: Number,
      required: true,
    },
  },

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
    ...mapState('app', ['clientHeight']),
  },
  watch: {
    $route() {
      this.loadProductionsum(this.routenum).then(() => {
      })
    },
  },
  created() {
    this.loadProductionsum(this.routenum).then(() => {
    })
  },
  methods: {
    ...mapActions('dashboardStore', ['loadProductionsum']),
  },
}
</script>
