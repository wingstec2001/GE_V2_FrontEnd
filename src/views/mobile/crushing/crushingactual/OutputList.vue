<template>
  <v-card>
    <v-card-title class="align-start">
      <v-spacer></v-spacer>
      <create-form
        :icon="icons.mdiPlus"
        @success="refreshList()"
      ></create-form>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="crushMaterials"
        :height="vScrollHeight"
        :item-height="80"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item class="d-flex align-center px-0 mt-4">
            <v-avatar
              tile
              :color="index % 2 == 0 ? 'success' : 'orange'"
              size="60"
              :class="`white--text font-weight-medium me-3 `"
            >
              <span class="text-base">{{ item.crushed_id }}</span>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ item.material_id }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.actual_date.toString().substring(5, 16) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>{{ item.note }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <h4 class="font-weight-semibold text-base">
                {{ item.actual_weight }}
              </h4>
            </v-list-item-action>
            <v-menu
              v-if="!item.processed"
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
                    <!-- <v-icon
                      class="mr-1"
                      @click="openEdit(item)"
                    >
                      {{ icons.mdiPencil }}
                    </v-icon> -->
                    <EditForm
                      :icon="icons.mdiPencil"
                      :item="item"
                      @success="refreshList()"
                    ></EditForm>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <!-- <v-icon>{{ icons.mdiDelete }}</v-icon> -->
                    <v-icon
                      class="mr-1"
                      @click="openDelete(item)"
                      @success="refreshList()"
                    >
                      {{ icons.mdiDelete }}
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
            <div
              v-else
              style="width: 38px"
            ></div>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
      <!-- <v-btn
        block
        color="primary"
        class="mt-6"
        outlined
        :to="{ name: 'crushingactual-list' }"
      >
        Details
      </v-btn> -->
    </v-card-text>
    <delete-form
      ref="deleteForm"
      :item="deleteItem"
      @success="refreshList()"
    ></delete-form>
  </v-card>
</template>

<script>
/* eslint-disable */
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import CreateForm from './CreateForm.vue'
import EditForm from './EditForm.vue'
import DeleteForm from './DeleteForm.vue'
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
    editItem: '',
    deleteItem: '',
  }),


  computed: {
    vScrollHeight() {
      return `${this.clientHeight - 180}`
    },
    crushMaterials() {
      const datas = this.crushingactualdetails.length
      console.log("vScrollHeight:",this.vScrollHeight)
      return Array.from({ length: datas }, (k, v) => {
        const data = this.crushingactualdetails[v]

        return {
          processed: data.processed,
          crushed_id: data.crushed_id,
          actual_date: data.actual_date,
          material_id: data.material_id,
          actual_weight: data.actual_weight,
          note: data.note,
        }
      })
    },
    ...mapState('dashboardStore', ['crushingactualdetails']),
    ...mapState('app', ['clientHeight']),
  },
  mounted() {
    this.refreshList()
    // this.loadCrushingActualdetails().then(() => {
    //   console.log('dashboard crushingactual', this.crushingactualdetails)
    // })
  },
  methods: {
    ...mapActions('dashboardStore', ['loadCrushingActualdetails', 'loadCrushingDaySum']),
    ...mapMutations('app', ['setOverlayStatus']),

    openEdit(item) {

      this.editItem = item
      this.$refs.editForm.openForm()
    },
    openDelete(item) {
      this.deleteItem = item
      this.$refs.deleteForm.openForm()
    },

    refreshList() {
      this.setOverlayStatus(true)
      this.loadCrushingActualdetails()

      this.loadCrushingDaySum()
      this.setOverlayStatus(false)
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
