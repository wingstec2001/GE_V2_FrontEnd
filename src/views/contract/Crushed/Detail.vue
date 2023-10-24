<template>
  <div justify="center">
    <v-btn
      outlined
      :disabled="materialId===''"
      @click.stop="openForm"
    >
      <v-icon class="me-1">
        {{ icon }}
      </v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <v-row align="center">
            <v-col cols="3">
              <span>粉砕済在庫一覧</span>
            </v-col>
            <v-col
              cols="12"
              sm="5"
            >
              <span>材料ID:</span>
              <span
                style="color:red"
                class="ml-2"
              >{{ materialId }}</span>
            </v-col>
            <v-col
              cols="4"
            >
              <span>合計重量:</span>

              <span
                style="color:red"
                class="ml-4"
              >{{ weightSum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') }} Kg</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-model="selectedList"
            :headers="headers"
            :items="StockCrushedList"
            item-key="id"
            show-select
            class="elevation-1"
          >
            <!-- <template v-slot:[`item.data-table-select`]="{item}">
              <v-simple-checkbox
                color="primary"
                :value="item.selected"
              ></v-simple-checkbox>
            </template> -->
            <template v-slot:[`item.crushed_weight`]="{ item }">
              <label>{{ item.crushed_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="goBack"
          >
            OK
          </v-btn>
          <v-btn
            type="reset"
            class="mx-2"
            outlined
            @click="cancelClick"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  components: {

  },
  props: ['icon', 'materialId', 'uuid', 'selectedIds'],

  data: () => ({
    goSumWeight: '',

    materialIds: [],
    StockCrushedList: [],
    selectedList: [],
    submitStatus: false,
    url: null,
    weightSum: 0,
    dialog: false,
    item: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },

    headers: [
      {
        text: '',
        value: 'data-table-select',
        width: '5%',
      },
      {
        text: '入庫ID',
        value: 'id',
        align: 'left',

        width: '10%',
        fixed: true,
      },
      {
        text: '材料ID',
        align: 'left',
        value: 'material_id',

        width: '20%',
        fixed: true,
      },

      {
        text: 'Form',
        value: 'origin',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '    重量(㎏)',
        value: 'crushed_weight',
        sortable: true,
        align: 'right',

        width: '15%',
        fixed: true,
      },

      // {
      //   text: '入庫日時',
      //   value: 'crushed_weight',
      //   sortable: false,
      //   align: 'right',
      //   width: '20%',
      //   fixed: true,
      // },

      {
        text: '',
        value: '',
        sortable: false,
        align: 'right',
        width: '5%',
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('stockCrushingStore', ['f_StockCrushed', 'StockCrushed']),
  },
  watch: {

    // materialId(newValue) {
    //   this.setOverlayStatus(true)
    //   this.changeRouteQuery('material_id', newValue)
    //   this.refreshList(newValue)

    //   // console.log('material_id:', newValue, this.material_id)
    //   // this.filterStockCrushed({ material_id: this.material_id })
    //   // this.StockCrushedList = this.f_StockCrushed
    // },

    selectedList(after) {
      let sum = 0
      for (let i = 0; i < after.length; i += 1) {
        sum += after[i].crushed_weight
      }

      this.weightSum = sum
    },
    pellet_id(after) {
      if (after === null) {
        this.PelletGoList = this.pelletIdBfo
      } else {
        const fillterResult = this.PelletGoList.filter(element => element.pellet_id === after)
        this.PelletGoList = fillterResult
      }
    },
    pellet_name(after) {
      if (after === null) {
        this.PelletGoList = this.pelletNameBfo
      } else {
        const fillterResult = this.PelletGoList.filter(element => element.pellet_name === after)
        this.PelletGoList = fillterResult
      }
    },
    pellet_from(after) {
      if (after === null) {
        this.PelletGoList = this.pelletFromBfo
      } else {
        const fillterResult = this.PelletGoList.filter(element => element.pellet_from === after)
        this.PelletGoList = fillterResult
      }
    },
  },
  created() {
    this.pelletIdBfo = this.PelletGoList
    this.pelletNameBfo = this.PelletGoList
    this.pelletFromBfo = this.PelletGoList
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),

    ...mapActions('stockCrushingStore', ['loadStockCrushed']),
    ...mapMutations('stockCrushingStore', ['filterStockCrushed']),

    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteProduct(item.id)
        .then(() => {
          this.submitStatus = false
          this.dialog = false
          this.$emit('deleted')
        })
        .catch(() => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push('使用中か削除済みです。')
          console.log('apierror', this.apierror)
        })
    },
    goBack() {
      this.$emit('onSelected', this.selectedList, this.uuid)
      this.dialog = false
    },

    refreshList() {
      this.setOverlayStatus(true)

      this.loadStockCrushed({ material_id: this.materialId }).then(() => {
        this.StockCrushedList = this.StockCrushed

        this.setOverlayStatus(false)

        if (this.selectedIds !== undefined && this.selectedIds.length > 0) {
          this.selectedList = this.selectedIds.map(s => {
            const item = this.StockCrushedList.find(s1 => s1.id === s)

            return item
          })
        }
        this.dialog = true
      })
    },

    openForm() {
      this.selectedList = []

      this.setOverlayStatus(true)

      this.refreshList()
    },

    cancelClick() {
      this.dialog = false
      this.selectedList = []
    },

    changeRouteQuery(key, val) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      if (val) {
        query[key] = val
      } else {
        delete query[key]
      }
      this.$router.push({ path: this.$route.path, query })
    },
  },
}
</script>

<style scoped>
  .v-data-table tr:nth-child(odd) td {
    background-color: #bfa;
  }
</style>
