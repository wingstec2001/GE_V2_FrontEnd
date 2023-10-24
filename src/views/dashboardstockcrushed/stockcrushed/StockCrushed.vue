<template>
  <v-card height="472">
    <v-card-title class="align-start">
      <span>在庫_材料粉砕済</span>

      <v-spacer></v-spacer>
      <create-form
        :icon="icons.mdiPlus"
        @crushed="addCrushed"
      ></create-form>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="crusheds"
        height="330"
        :item-height="90"
      >
        <template v-slot:default="{ item }">
          <v-list-item class="d-flex align-center px-0 mt-4">
            <!-- <v-avatar
              tile
              :color="index%2 ==0?'success':'orange'"
              size="60*90"
              :class="`white--text font-weight-medium me-3`"
            >
              <span class="text--primary">{{ item.actual_date }}</span>
            </v-avatar> -->

            <v-list-item-content>
              <v-list-item-subtitle
                v-if="item.inout_direction == 0"
                class="text--primary"
              >
                {{ item.inout_date }} 入庫
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="item.inout_direction == 1"
                class="text--primary"
              >
                {{ item.inout_date }} 出庫
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text--primary">
                {{ item.material_id }} | {{ item.material_name }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <h4 class="font-weight-semibold">
                {{ item.crushed_weight }}Kg
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
        :to="{ name: 'crushingactual-list' }"
      >
        Details
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable */
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'
// import { mapActions, mapState } from 'vuex'
import CreateForm from './StockCrushedCreate.vue'
import EditForm from './StockCrushedEdit.vue'
import DeleteForm from './StockCrushedDelete.vue'
/* eslint-disable */
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
    crusheds: [
      {
        inout_direction: 0,
        inout_date: '2021-12-07',
        material_id: 'PPE',
        material_name: 'PPE-1500565',
        crushed_weight: '100',
      },
    ],
  }),



  methods: {
    editItem(item) {
      this.$router.push({ name: 'arrivalactualdetail-create', params: { id: item.id } })
    },
    addCrushed(item) {
      this.crusheds.push(item)
    },
  },
}
</script>

<style scoped>
.displaytext {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.displaytext:hover {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
