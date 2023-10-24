<template>
  <div justify="center">
    <a
      v-if="weight_in>0"
      href="javascript:void(0);"
      @click="openForm"
    >{{ formatData(weight_in) }}</a>
    <span v-else> {{ formatData(weight_in) }}</span>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span>粉砕入庫：</span>
          <span style="color: red">{{ material_id }}</span>
          <span class="ml-10">入庫日：</span>
          <span style="color: red">{{ date }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="pb-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >合計重量</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                >{{ totalWeight }} Kg</span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="pt-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >入荷粉砕</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                >{{ sumWeightArrival.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }} Kg</span>
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
            <v-col cols="12">
              <v-data-table
                v-show="displayArrival"
                :headers="arrival_headers"
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

            <v-row class="pt-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >自社粉砕</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                >{{ sumWeightCrushed.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }} Kg</span>
              </v-col>
              <v-col
                cols="2"
                style="text-align: right"
              >
                <v-btn
                  color="yellow"
                  small
                  @click="showCrushed"
                >
                  <span v-if="displayCrushed"> Hide</span>
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
                  @click="jumpToCrushed"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-data-table
                v-if="displayCrushed"
                :headers="crushed_headers"
                :items="crushingactuals"

                :items-per-page="-1"
              >
                <template v-slot:[`item.actual_weight`]="{ item }">
                  <label>{{ item.actual_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
                      <label>{{ sumWeightCrushed.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
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

// import { mdiConsole } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  props: ['material_id', 'weight_in', 'date'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
    displayArrival: false,
    displayCrushed: false,

    sumWeightArrival: 0,
    sumWeightCrushed: 0,
    DailyArrivalInbound: [],
    DailyCrushedInbound: [],
    arrival_headers: [
      {
        text: 'No.',
        value: 'aad_id',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      {
        text: '入荷日時',
        align: 'left',
        sortable: true,
        value: 'arrival_date',
        width: '30%',
        fixed: true,
      },
      {
        text: '仕入ID',
        value: 'customer_id',
        align: 'left',
        width: '20%',
        sortable: true,
        fixed: false,
      },
      {
        text: '重量(kg)',
        value: 'arrival_weight',
        align: 'right',
        width: '30%',
        fixed: true,
      },
    ],
    crushed_headers: [
      {
        text: 'No.',
        value: 'crushed_id',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      {
        text: '粉砕日時',
        align: 'left',
        sortable: true,
        value: 'actual_date',
        width: '30%',
        fixed: true,
      },
      {
        text: '備考',
        align: 'left',
        sortable: true,
        value: 'note',
        width: '30%',
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'actual_weight',
        width: '30%',
        align: 'right',
        sortable: true,
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('arrivalactualStore', ['arrivaldetails']),
    ...mapState('crushingactualStore', ['crushingactuals']),
    totalWeight() {
      const sum = this.sumWeightArrival + this.sumWeightCrushed

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },

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
    ...mapActions('crushingactualStore', ['loadCrushingActuals']),

    showArrival() {
      this.displayArrival = !this.displayArrival
    },

    showCrushed() {
      this.displayCrushed = !this.displayCrushed
    },
    jumpToArrival() {
      const query = {}
      query.crushing_status = 1
      query.material_id = this.material_id
      query.startDate = this.date
      query.endDate = this.date
      this.$router.push({ path: '/arrivalmaterial-list', query })
    },
    jumpToCrushed() {
      const query = {}
      query.material_id = this.material_id
      query.start_date = this.date
      query.end_date = this.date
      this.$router.push({ path: '/crushingactual-list', query })
    },
    openForm() {
      this.setOverlayStatus(true)

      this.dialog = true

      // 入荷粉砕を取得する
      const queryArrival = {
        material_id: this.material_id,
        crushing_status: 1,
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

      const queryCrushed = {
        material_id: this.material_id,
        crushing_status: 1,
        start_date: this.date,
        end_date: this.date,
      }

      // 自社粉砕を取得する
      this.loadCrushingActuals(queryCrushed).then(() => {
        this.setOverlayStatus(false)
        let sum = 0
        this.crushingactuals.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.actual_weight
        })
        this.sumWeightCrushed = sum
      })
    },
    closeForm() {
      this.dialog = false
      this.displayArrival = false
      this.displayCrushed = false
      this.$emit('ok')
    },
  },
}
</script>
