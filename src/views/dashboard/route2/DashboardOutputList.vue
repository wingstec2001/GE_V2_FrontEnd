<template>
  <v-card height="472">
    <v-card-title class="align-start">
      <span>生産実績(ルーター2)</span>

      <v-spacer></v-spacer>
      <create-form
        :icon="icons.mdiPlus"
      ></create-form>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="crushMaterials"
        height="330"
        :item-height="66"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item
            class="d-flex align-center px-0 mt-4"
          >
            <v-avatar
              tile
              :color="index%2 ==0?'success':'orange'"
              size="50"
              :class="`white--text font-weight-medium me-3`"
            >
              <span class="text-base">{{ item.outputDate }}</span>
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="font-weight-semibold text-xs"
                v-text="item.productid"
              ></v-list-item-title>

              <v-list-item-subtitle class="text--primary text-base me-1">
                <div
                  class="displaytext"
                  :title="item.productname"
                >
                  {{ item.productname }}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <h4 class="font-weight-semibold">
                {{ item.producedweight }}Kg
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
                    <!-- <v-icon>{{ icons.mdiPencil }}</v-icon> -->
                    <edit-form
                      :icon="icons.mdiPencil"
                      :item="item"
                    ></edit-form>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <!-- <v-icon>{{ icons.mdiDelete }}</v-icon> -->
                    <delete-form
                      :icon="icons.mdiDelete"
                      :item="item"
                    ></delete-form>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
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
  mdiPencil,
  mdiDelete,
  mdiPlus,
} from '@mdi/js'
import { mapActions, mapState } from 'vuex'
import CreateForm from './CreateForm.vue'
import EditForm from './EditForm.vue'
import DeleteForm from './DeleteForm.vue'

export default {
  components: {
    CreateForm,
    EditForm,
    DeleteForm,
  },

  data: () => ({
    icons: {
      mdiDotsVertical,
      mdiPencil,
      mdiDelete,
      mdiPlus,
    },
  }),
  computed: {
    crushMaterials() {
      const crushMaterialsLength = this.productiondetails.length

      return Array.from({ length: crushMaterialsLength }, (k, v) => {
        const crushMaterial = this.productiondetails[v]

        return {
          id: crushMaterial.id,
          outputDate: crushMaterial.produced_dt,
          productid: crushMaterial.product_id,
          productname: crushMaterial.product_name,
          producedweight: crushMaterial.produced_weight,
          color: crushMaterial.color,
        }
      })
    },
    ...mapState('dashboardStore', ['productiondetails']),

  },
  mounted() {
    this.loadProductiondetails(2).then(() => {
    })
  },
  methods: {
    ...mapActions('dashboardStore', ['loadProductiondetails']),

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
