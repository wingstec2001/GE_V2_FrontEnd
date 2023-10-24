<template>
  <v-card>
    <v-card-title class="align-start">
      <span>粉砕実績</span>

      <v-spacer></v-spacer>

      <crush-reservation-form
        :icon="icons.mdiPlus"
        :materials-list="crushingplan"
      ></crush-reservation-form>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="reservations"
        height="330"
        :item-height="66"
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

              <div>
                <h4 class="font-weight-semibold">
                  {{ item.amount }}
                </h4>
              </div>
              <v-menu
                left
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-icon>
                      <!-- <v-icon>{{ icons.mdiPencil }}</v-icon> -->
                      <crush-reservation-form
                        :icon="icons.mdiPencil"
                        :item="item"
                        :materials-list="crushingplan"
                      ></crush-reservation-form>
                    </v-list-item-icon>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ icons.mdiDelete }}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-menu>
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
  mdiPencil,
  mdiDelete,
  mdiPlus,
} from '@mdi/js'

import CrushReservationForm from '../form-layouts/CrushReservationForm.vue'

export default {
  components: {
    CrushReservationForm,
  },

  data: () => ({
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
      mdiPencil,
      mdiDelete,
      mdiPlus,
    },
    crushingplan: [],
  }),
  computed: {
    reservations() {
      const reservationsLength = this.crushingplan.length

      return Array.from({ length: reservationsLength }, (k, v) => {
        const reservation = this.crushingplan[v]

        return {
          id: reservation.material_id,
          name: reservation.material_name,
          amount: reservation.plan_weight,
        }
      })
    },
  },
  created() {
    const tCrushingplan = [
      {
        id: '1',
        route_id: '',
        plan_date: '',
        material_id: 'C-992-IV1',
        material_name: 'ABS樹脂',
        plan_weight: '200KG',
      },
      {
        id: '2',
        route_id: '',
        plan_date: '',
        material_id: 'C-992-IV2',
        material_name: 'ABB樹脂',
        plan_weight: '400KG',
      },
      {
        id: '3',
        route_id: '',
        plan_date: '',
        material_id: 'C-992-IV3',
        material_name: 'BPS樹脂',
        plan_weight: '1000KG',
      },
      {
        id: '4',
        route_id: '',
        plan_date: '',
        material_id: 'C-993-IV1',
        material_name: 'AAB樹脂',
        plan_weight: '500KG',
      },
      {
        id: '5',
        route_id: '',
        plan_date: '',
        material_id: 'C-993-IV4',
        material_name: 'BBS樹脂',
        plan_weight: '800KG',
      }]
    this.crushingplan = tCrushingplan
  },
}
</script>
