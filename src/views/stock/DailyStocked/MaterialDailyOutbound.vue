<template>
  <div justify="center">
    <a
      href="javascript:void(0);"
      style="color: #f44336"
      @click="openForm"
    >{{ formatData(weight_out) }}</a>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span>未粉砕出庫：</span>
          <span style="color: red">{{ material_id }}</span>
          <span class="ml-10">出庫日：</span>
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
              <v-col
                cols="4"
              >
                <span
                  class="text-h6"
                  style="color: black"
                >粉砕出庫</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                  style="color: black;text-align: right"
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
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-if="displayCrushed"
                  :headers="crushed_header"
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
            </v-row>
            <v-row class="pt-4">
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >契約出庫</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                  style="color: black"
                >{{ sumWeightContracted.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }} Kg</span>
              </v-col>
              <v-col
                cols="2"
                style="text-align: right"
              >
                <v-btn
                  color="yellow"
                  small
                  @click="showContracted"
                >
                  <span v-if="displayContracted"> Hide</span>
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
                  @click="jumpToContracted"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-data-table
                v-if="displayContracted"
                :headers="contract_header"
                :items="contractedList"
                :items-per-page="-1"
              >
                <template v-slot:[`item.contract_weight`]="{ item }">
                  <label>{{ item.contract_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
                      <label>{{ sumWeightContracted.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  props: ['material_id', 'weight_out', 'date'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },

    sumWeightCrushed: 0,
    sumWeightContracted: 0,
    displayCrushed: false,
    displayContracted: false,
    contractedList: [],
    crushed_header: [
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
    contract_header: [
      {
        text: '契約ID',
        value: 'contract_id',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '契約日',
        value: 'contract_date',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '出荷先ID',
        value: 'customer_id',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'contract_weight',
        align: 'right',
        width: '20%',
        sortable: true,
        fixed: true,
      },
    ],
  }),
  computed: {

    ...mapState('crushingactualStore', ['crushingactuals']),
    ...mapState('contractStore', ['materialContracts']),

    totalWeight() {
      const sum = this.sumWeightContracted + this.sumWeightCrushed

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

    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('crushingactualStore', ['loadCrushingActuals']),
    ...mapActions('contractStore', ['loadMaterialContracts']),

    showCrushed() {
      this.displayCrushed = !this.displayCrushed
    },

    showContracted() {
      this.displayContracted = !this.displayContracted
    },
    openForm() {
      this.displayCrushed = false
      this.displayContracted = false
      this.setOverlayStatus(true)
      this.dialog = true

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

      const queryContracted = {
        material_id: this.material_id,
        startDate: this.date,
        endDate: this.date,
      }

      // 契約出庫を取得する
      this.loadMaterialContracts(queryContracted).then(() => {
        this.contractedList = [...this.materialContracts]
        this.setOverlayStatus(false)
        let sum = 0
        this.contractedList.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.contract_weight
        })
        this.sumWeightContracted = sum

        console.log('contractedList:', this.contractedList)
      })
    },
    closeForm() {
      this.$emit('ok')
      this.dialog = false
      this.item = {
      }
    },

    jumpToCrushed() {
      const query = {}
      query.material_id = this.material_id
      query.start_date = this.date
      query.end_date = this.date
      this.$router.push({ path: '/crushingactual-list', query })
    },

    jumpToContracted() {
      const query = {}
      query.material_id = this.material_id
      query.startDate = this.date
      query.endDate = this.date
      this.$router.push({ path: '/contract-material-list', query })
    },
  },
}
</script>
