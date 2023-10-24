<template>
  <div justify="center">
    <a
      v-if="weight_out>0"
      href="javascript:void(0);"
      style="color: #f44336"
      @click="openForm()"
    >{{ formatData(weight_out) }}</a>
    <span v-else> {{ formatData(weight_out) }}</span>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span>粉砕出庫：</span>
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
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >ブレンド出庫</span>
              </v-col>
              <v-col
                cols="3"
                style="text-align: right"
              >
                <span
                  class="text-h6"
                  style="color: black;text-align: right"
                >{{ sumWeightBlended.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }} Kg</span>
              </v-col>
              <v-col
                cols="2"
                style="text-align: right"
              >
                <v-btn
                  color="yellow"
                  small
                  @click="showBlended"
                >
                  <span v-if="displayBlended"> Hide</span>
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
                  @click="jumpToBlender"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-data-table
                v-show="displayBlended"
                :headers="blender_headers"
                :items="blendedList"
                :items-per-page="-1"
              >
                <template v-slot:[`item.blended_weight`]="{ item }">
                  <label>{{ item.blended_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
                      :colspan="1"
                    ></td>
                    <td
                      class="font-weight-bold"
                      style="text-align: right; background: #fafafa"
                    >
                      <label>{{ sumWeightBlended.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
                :headers="contract_headers"
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
    blendedList: [],
    contractedList: [],
    sumWeightBlended: 0,
    sumWeightContracted: 0,

    displayBlended: false,
    displayContracted: false,
    blender_headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ブレンド日時',
        align: 'left',
        sortable: true,
        value: 'blended_dt',
        width: '30%',
        fixed: true,
      },
      {
        text: 'ブレンド重量(kg)',
        value: 'blended_weight',
        align: 'right',
        width: '50%',
        fixed: true,
      },
    ],
    contract_headers: [
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
    ...mapState('getsujiMaterialStore', ['selMonthlyMaterial']),
    ...mapState('blenderStore', ['blenders']),
    ...mapState('contractStore', ['crushedContracts']),

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
      const sum = this.sumWeightBlended + this.sumWeightContracted

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
  },
  watch: {

  },
  methods: {

    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('blenderStore', ['loadBlenders']),
    ...mapActions('contractStore', ['loadCrushedContracts']),

    showBlended() {
      this.displayBlended = !this.displayBlended
    },

    showContracted() {
      this.displayContracted = !this.displayContracted
    },

    openForm() {
      this.setOverlayStatus(true)
      this.dialog = true

      // ブレンド実績を取得する
      const queryBlended = {
        material_id: this.material_id,
        start_date: this.date,
        end_date: this.date,
      }

      this.loadBlenders(queryBlended).then(() => {
        this.blendedList = this.blenders
        let sum = 0
        this.blendedList.forEach(k => {
          sum += k.blended_weight
        })

        this.sumWeightBlended = sum
        this.setOverlayStatus(false)
      })

      const queryContracted = {
        material_id: this.material_id,
        startDate: this.date,
        endDate: this.date,
      }

      // 契約出庫を取得する
      this.loadCrushedContracts(queryContracted).then(() => {
        this.contractedList = [...this.crushedContracts]
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

    jumpToBlender() {
      const query = {}

      query.material_id = this.material_id
      query.start_date = this.date
      query.end_date = this.date
      this.$router.push({ path: '/blender-list', query })
    },

    jumpToContracted() {
      const query = {}
      query.material_id = this.material_id
      query.startDate = this.date
      query.endDate = this.date
      this.$router.push({ path: '/contract-crushed-list', query })
    },

    closeForm() {
      this.$emit('ok')
      this.dialog = false
      this.item = {
      }
    },
  },
}
</script>
