<template>
  <v-card>
    <v-card-title class="align-start">
      <v-spacer></v-spacer>
      <create-form
        ref="CreateForm"
        :icon="icons.mdiPlus"
        @addDetail="refreshList()"
      ></create-form>
    </v-card-title>
    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="details"
        :height="vScrollHeight"
        :item-height="100"
      >
        <template v-slot:default="{ item, index }">
          <v-list-item class="d-flex align-center px-0 mt-4">
            <v-avatar
              tile
              :color="index % 2 == 0 ? 'success' : 'orange'"
              size="60"
              :class="`white--text font-weight-medium me-3`"
            >
              <span class="text-base">{{ item.aad_id }}</span>
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title class="text--primary">
                {{ item.material_id }}
              </v-list-item-title>

              <v-list-item-subtitle
                v-if="item.crushing_status == 0"
                class="text--primary"
              >
                {{ item.arrival_date.substring(5, 16) }} | 未粉砕
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="item.crushing_status == 1"
                class="text--primary"
              >
                {{ item.arrival_date.substring(5, 16) }} | 粉砕済
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text--primary">
                {{ item.customer_id }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <h4 class="font-weight-semibold text-base">
                {{ item.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}
              </h4>
            </v-list-item-action>
            <v-menu
              v-if="item.blended!==1"
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
                      v-if="item.blended !==1"
                      :icon="icons.mdiPencil"
                      :item="item"
                      @success="refreshList()"
                    >
                    </EditForm>
                  </v-list-item-icon>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <DeleteForm
                      v-if="item.blended!==1"
                      :icon="icons.mdiDelete"
                      :item="item"
                      @success="refreshList()"
                    >
                    </DeleteForm>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-virtual-scroll>
    </v-card-text>
    <!-- <edit-form ref="arrvialDetailsEdit" :item="editArrivalDetails" @editDetail="loadDetail"></edit-form>
    <delete-form ref="arrvialDetailsDelete" :item="deleteArrivalDetails" @deleteDetail="loadDetail"></delete-form> -->
  </v-card>
</template>

<script>
/*eslint-disable*/
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'
import { mapState, mapActions, mapMutations } from 'vuex'

import CreateForm from './CreateForm.vue'
import EditForm from './EditForm.vue'
import DeleteForm from './DeleteForm.vue'
/*eslint-disable*/
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
    editArrivalDetails: '',
    deleteArrivalDetails: '',
    company_info: {},
    details: [],
  }),
  computed: {
    ...mapState('stockCrushingStore', ['StockCrushing']),
    ...mapState('arrivalactualStore', ['materialMaster', 'materialIds']),
    ...mapState('arrivalactualStore', ['arrivaldetails', 'selectedArrivalActual']),
    ...mapState('app', ['clientHeight']),

    vScrollHeight() {
      return `${this.clientHeight - 220}px`
    },

    btnIsHide() {
      return function (item) {
        // const value = this.StockCrushing.find(sc => sc.aad_id === item.aad_id)
        // if (value) {
        //   return item.crushing_status === 1 && value.processed === 1
        // }
        console.log(item.aad_id,item.blended)
        // return false
        if (item.blended == 1)
        {
          console.log('blended:', item.blended)
          return true
        }

        return false
      }
    },
  },





  mounted() {
    this.refreshList()
  },

  methods: {
    ...mapActions('stockCrushingStore', ['loadStockCrushing']),
    ...mapActions('arrivalactualStore', ['loadArrivalDetails', 'loadArrivalActual']),
    ...mapActions('dashboardStore', ['loadArrivalDetailDaySum']),
    ...mapMutations('app', ['setOverlayStatus']),




    refreshList() {
      this.setOverlayStatus(true)
      this.loadArrivalDetails({ wuf: 'mobile' }).then(() => {
        console.log("arrival:",this.arrivaldetails)
        this.details = this.arrivaldetails
        this.setOverlayStatus(false)
        console.log("details:",this.details)
      })

      this.loadArrivalDetailDaySum({ wuf: 'mobile' })
    },

    // loadDetail() {
    //   this.loadArrivalDetails({
    //     wuf: 'mobile',
    //   }).then(() => {})
    // },

    confirm() {
      this.$router.push({ name: 'mobile-arrivalinfo' })
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
