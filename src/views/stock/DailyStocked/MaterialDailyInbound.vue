<template>
  <div justify="center">
    <a
      v-if="weight_in>0"
      href="javascript:void(0);"
      @click="openForm"
    >{{ formatData(weight_in) }}</a>
    <span v-else>{{ formatData(weight_in) }}</span>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span>未粉砕入庫：</span>
          <span style="color: red">{{ material_id }}</span>
          <span class="ml-10">入庫日：</span>
          <span style="color: red">{{ date }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="pt-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >未粉砕入庫</span>
              </v-col>
              <v-col cols="3">
                <span
                  class="text-h6"
                  style="color: black;text-align: right"
                >{{ sumWeightArrival.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}Kg</span>
              </v-col>
              <v-col
                cols="2"
                style="text-align: right"
              >
                <v-btn
                  color="yellow"
                  small
                  @click="showArrival"
                >
                  <span v-if="displayArrival"> Hide</span>
                  <span v-else>Show</span>
                </v-btn>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <v-btn
                  color="cyan"
                  small
                  @click="jumpToArrival"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-if="displayArrival"
                  :headers="headers"
                  :items="arrivaldetails"
                  :items-per-page="-1"
                >
                  <template v-slot:[`item.arrival_weight`]="{ item }">
                    <label>{{ item.arrival_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                  </template>
                  <template v-slot:[`body.append`]>
                    <tr>
                      <td
                        class="font-weight-bold"
                        style="background: #fafafa"
                        :colspan="1"
                      >
                        <label>合計</label>
                      </td>
                      <td
                        style="background: #fafafa"
                        :colspan="2"
                      ></td>
                      <td
                        class="font-weight-bold"
                        style="text-align: right; background: #fafafa"
                      >
                        <label>{{ sumWeightArrival.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="closeForm()"
          >
            戻る
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  props: ['material_id', 'weight_in', 'date'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
    DailyMaterialInbound: [],
    displayArrival: false,
    sumWeightArrival: 0,
    headers: [
      {
        text: 'No.',
        value: 'aad_id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '入荷日時',
        align: 'left',
        sortable: true,
        value: 'arrival_date',
        width: '15%',
        fixed: true,
      },
      {
        text: '仕入ID',
        value: 'customer_id',
        align: 'left',
        width: '15%',
        sortable: true,
        fixed: false,
      },
      {
        text: '重量(kg)',
        value: 'arrival_weight',
        align: 'right',
        width: '12%',
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('arrivalactualStore', ['arrivaldetails']),
    formatData() {
      return function (data) {
        if (typeof data === 'number') {
          return data.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }
        if (typeof data === 'string') {
          return data.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }

        return data
      }
    },
  },
  methods: {
    ...mapActions('arrivalactualStore', ['loadArrivalDetails']),
    ...mapMutations('app', ['setOverlayStatus']),

    showArrival() {
      this.displayArrival = !this.displayArrival
    },

    openForm() {
      this.setOverlayStatus(true)
      this.dialog = true

      // 未粉砕入荷を取得する
      const queryArrival = {
        material_id: this.material_id,
        crushing_status: 0,
        startDate: this.date,
        endDate: this.date,
      }
      this.loadArrivalDetails(queryArrival).then(() => {
        console.log('openform:', this.date, this.product_id)
        this.setOverlayStatus(false)

        let sum = 0
        this.arrivaldetails.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.arrival_weight
        })
        this.sumWeightArrival = sum
      })
    },
    closeForm() {
      this.$emit('ok')
      this.dialog = false
      this.item = {
      }
    },

    jumpToArrival() {
      const query = {}
      query.crushing_status = 0
      query.material_id = this.material_id
      query.startDate = this.date
      query.endDate = this.date
      this.$router.push({ path: '/arrivalmaterial-list', query })
    },
  },
}
</script>
