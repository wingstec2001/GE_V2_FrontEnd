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
              <span>材料在庫</span>
            </v-col>
            <v-col
              cols="12"
              sm="5"
            >
              <span>材料ID:</span>
              <span
                style="color:red"
                class="ml-4"
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
            :items="details"
            item-key="aad_id"
            show-select
            class="elevation-1"
          >
            <!-- <template v-slot:[`item.data-table-select`]="{item}">
              <v-simple-checkbox
                color="primary"
                :value="item.selected"
              ></v-simple-checkbox>
            </template> -->
            <template v-slot:[`item.arrival_weight`]="{ item }">
              <label>{{ item.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
    details: [],
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
        text: 'ID',
        value: 'aad_id',
        align: 'left',

        width: '15%',
        fixed: true,
      },
      {
        text: '入荷日時',
        value: 'arrival_date',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '仕入先',
        value: 'customer_id',

        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '    重量(㎏)',
        value: 'arrival_weight',
        sortable: true,
        align: 'right',

        width: '20%',
        fixed: true,
      },

    ],
  }),
  computed: {

    ...mapState('arrivalactualStore', ['arrivaldetails', 'selectedArrivalDetail']),
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
        sum += after[i].arrival_weight
        console.log(i, after[i].arrival_weight, sum)
      }

      this.weightSum = sum
    },

  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('arrivalactualStore', ['loadArrivalDetails', 'loadArrivalActual', 'loadOrderByDetail']),
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
      console.log('refreshList begin')
      this.setOverlayStatus(true)

      this.loadArrivalDetails({ material_id: this.materialId, blended: 0, crushing_status: 0 }).then(() => {
        // this.filterStockCrushed({ material_id: this.materialId })
        this.details = this.arrivaldetails
        this.setOverlayStatus(false)
        this.dialog = true
      })
    },

    openForm() {
      this.selectedList = []
      console.log('OpenForm materialId:', this.materialId, this.selectedIds)
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
