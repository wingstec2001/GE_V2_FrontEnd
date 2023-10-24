<template>
  <v-card>
    <v-card-title class="align-start">
      <span>ルーター{{ routenum }}</span>

      <v-spacer></v-spacer>
      <CreateForm
        :route-no="route_id"
        :icon="icons.mdiPlus"
        @success="refreshList()"
      ></CreateForm>
    </v-card-title>

    <v-card-text>
      <v-virtual-scroll
        :bench="0"
        :items="pelletItems"
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
              <span class="text-base">{{ item.id }}</span>
            </v-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="text--primary text-base"
                v-text="item.productid"
              ></v-list-item-title>

              <v-list-item-subtitle class="text--primary text-base me-1">
                <div>
                  {{ item.outputDate.substring(5, 16) }}
                </div>
                <v-list-item-subtitle>{{ item.note }}</v-list-item-subtitle>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action class="mr-2">
              <div class="font-weight-semibold text-base">
                {{ item.producedweight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}
              </div>
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
                      @success="refreshList()"
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
/*eslint-disable*/
import { mdiDotsVertical, mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import format from 'date-fns/format'
import CreateForm from './CreateOutput.vue'
import EditForm from './EditOutput.vue'
/*eslint-disable*/
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
    vScrollHeight() {
      return `${this.clientHeight -180}px`
    },

    pelletItems() {
      const datas = this.productions.length
      console.log("pellet datas:",datas)

      console.log("clientHeight,vScrollHeight:",this.clientHeight,this.vScrollHeight)
      return Array.from({ length: datas }, (k, v) => {
        const data = this.productions[v]

        return {
          id: data.id,
          outputDate: data.produced_dt,
          productid: data.product_id,
          producedweight: data.produced_weight,
          note: data.note,
        }
      })
    },
    ...mapState('dashboardStore', ['productiondetails']),
    ...mapState('app', ['clientHeight', 'todayWorkDate']),
    ...mapState('productionStore', ['productions']),

  },

  mounted() {
    console.log("router:",this.routenum)


  },
  watch:{
    routenum(newVal){
      console.log("router changed to:",newVal)

      this.route_id = this.routenum
      this.refreshList()
    }

  },
  methods: {
    ...mapActions('dashboardStore', ['loadProductiondetails']),
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['loadProductions']),
    ...mapMutations('app', ['refreshTime']),


    refreshList() {
      this.loadProductions({

        route_id: this.routenum,
        wuf: 'mobile',
      }).then(() => {})
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
