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
          <span>ペレット入庫：</span>
          <span style="color: red">{{ product_id }}</span>
          <span class="ml-10">入庫日：</span>
          <span style="color: red">{{ date }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="4"
              >
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
                  style="color: black"
                >{{ totalWeight }} Kg</span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="pt-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >ペレット入荷</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                  style="color: black"
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
                :items="arrivalPellets"
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

            <v-row>
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >生産実績</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                  style="color: black"
                >{{ sumWeightProduction.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }} Kg</span>
              </v-col>
              <v-col
                cols="2"
                style="text-align: right"
              >
                <v-btn
                  color="yellow"
                  small
                  @click="showPellet"
                >
                  <span v-if="displayPellet"> Hide</span>
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
                  right
                  @click="jumpToProduction()"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-if="displayPellet"
                  :headers="headers"
                  :items="productions"

                  :items-per-page="-1"
                >
                  <template v-slot:[`item.produced_weight`]="{ item }">
                    <label>{{ item.produced_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
                        <label>{{ sumWeightProduction.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  props: ['product_id', 'weight_in', 'date'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
    sumWeightProduction: 0,
    sumWeightArrival: 0,
    displayPellet: false,
    displayArrival: false,
    arrival_headers: [
      {
        text: 'No.',
        value: 'aad_id',
        align: 'left',
        width: '20%',
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
        width: '30%',
        sortable: true,
        fixed: false,
      },
      {
        text: '重量(kg)',
        value: 'arrival_weight',
        align: 'right',
        width: '20%',
        fixed: true,
      },
    ],
    headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '生産日時',
        align: 'left',
        sortable: true,
        value: 'produced_dt',
        width: '30%',
        fixed: true,
      },
      {
        text: 'ルーター',
        value: 'route_id',
        align: 'center',
        width: '30%',
        fixed: true,
      },
      {
        text: '生産重量(kg)',
        value: 'produced_weight',
        align: 'right',
        width: '20%',
        fixed: true,
      },

    ],
  }),
  computed: {
    ...mapState('productionStore', ['productions']),
    ...mapState('arrivalactualStore', ['arrivalPellets']),
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

    totalWeight() {
      const sum = this.sumWeightProduction + this.sumWeightArrival

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
  },
  methods: {
    ...mapActions('productionStore', ['loadProductions']),
    ...mapActions('arrivalactualStore', ['loadArrivalPellets']),
    ...mapMutations('app', ['setOverlayStatus']),

    showPellet() {
      this.displayPellet = !this.displayPellet
      console.log('showPellet:', this.displayPellet)
    },

    showArrival() {
      this.displayArrival = !this.displayArrival
    },

    openForm() {
      this.dialog = true
      this.setOverlayStatus(true)

      // ペレット当日生産分を取得する
      this.loadProductions(
        {
          product_id: this.product_id,
          start_date: this.date,
          end_date: this.date,
        },
      ).then(() => {
        console.log('openform:', this.date, this.product_id)
        this.setOverlayStatus(false)

        let sum = 0
        this.productions.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.produced_weight
        })
        this.sumWeightProduction = sum
      })

      // ペレット当日入荷を取得する
      this.loadArrivalPellets(
        {
          product_id: this.product_id,
          startDate: this.date,
          endDate: this.date,
        },
      ).then(() => {
        this.setOverlayStatus(false)

        let sum = 0
        this.arrivalPellets.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.arrival_weight
        })
        this.sumWeightArrival = sum
        console.log('sumweight:', this.sumWeight)
      })
    },

    closeForm() {
      this.$emit('ok')
      this.dialog = false
      this.item = {
      }

      console.log('closeForm:', this.$route.query.month, this.$route.params)
    },

    jumpToArrival() {
      this.$router.push(
        {
          path: '/arrivalpellet-list',
          query: {
            product_id: this.product_id,
            startDate: this.date,
            endDate: this.date,
          },
        },
      )
    },

    jumpToProduction() {
      this.$router.push(
        {
          path: '/productionactual-list',
          query: {
            product_id: this.product_id,
            start_date: this.date,
            end_date: this.date,
          },
        },
      )
    },

  },
}
</script>
