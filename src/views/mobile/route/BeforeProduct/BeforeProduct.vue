<template>
  <v-card min-height="75vh">
    <v-card-title class="align-start">
      <span>ルーター{{ routenum }}</span>

      <v-spacer></v-spacer>
      <CreateForm
        :route-no="route_id"
        :icon="icons.mdiPlus"
      ></CreateForm>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="productions"
        min-height="430"
        :item-height="67"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item
            class="d-flex align-center px-0 mt-4"
          >
            <v-avatar
              tile
              :color="index%2 ==0?'success':'orange'"
              size="50"
              :class="`white--text font-weight-semibold text-base me-3`"
            >
              <span class="text-base">{{ item.plan_date }}</span>
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="font-weight-semibold text-base"
                v-text="item.product_id"
              ></v-list-item-title>

              <!-- <v-list-item-subtitle class="text--primary text-base me-1">
                <div
                  class="displaytext"
                  :title="item.productname"
                >
                  {{ item.productname }}
                </div>
              </v-list-item-subtitle> -->
            </v-list-item-content>

            <v-list-item-action class="mr-2">
              <h4 class="font-weight-semibold text-base ">
                {{ item.plan_weight }}
              </h4>
            </v-list-item-action>
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
                    <EditForm
                      :icon="icons.mdiPencil"
                      :item="item"
                    ></EditForm>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiDotsVertical,
  mdiPencil,
  mdiDelete,
  mdiPlus,
} from '@mdi/js'
import { mapActions, mapState } from 'vuex'
import format from 'date-fns/format'
import CreateForm from './CreateProduct.vue'
import EditForm from './EditProduct.vue'

export default {
  components: {
    CreateForm,
    EditForm,
  },
  props: {
    routenum: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    icons: {
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
      mdiPlus,
    },
    route_id: 0,
  }),
  computed: {
    productions() {
      const productionsLength = this.productionplans.length

      return Array.from({ length: productionsLength }, (k, v) => {
        const production = this.productionplans[v]

        return {
          id: production.id,
          product_id: production.product_id,
          route_id: production.route_id,
          plan_date: production.plan_date.substring(10, 16),
          plan_weight: production.plan_weight,

        }
      })
    },

    ...mapState('productionplanStore', ['productionplans']),

  },
  watch: {

    $route() {
      this.refresh()
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.route_id = this.routenum

      this.loadProductionPlans({ route_id: this.route_id, date: format(new Date(), 'yyyy-MM-dd') }).then(() => {
      })
    },
    ...mapActions('productionplanStore', ['loadProductionPlans']),

  },

}
</script>

<style scoped>
.displaytext{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.displaytext:hover{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
