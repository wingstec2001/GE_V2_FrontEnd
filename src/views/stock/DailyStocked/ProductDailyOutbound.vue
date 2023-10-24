<template>
  <div justify="center">
    <a
      v-if="weight_out>0"
      href="javascript:void(0);"
      style="color: #f44336"
      @click="openForm"
    >{{ formatData(weight_out) }}</a>
    <span v-else> {{ formatData(weight_out) }}</span>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span>ペレット出庫：</span>
          <span
            style="color: red"
          >{{ product_id }}</span>
          <span
            class="ml-10"
          >出庫日：</span>
          <span
            style="color: red"
          >{{ date }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <span
                  class="text-h6"
                  style="color: black"
                >契約実績</span>
              </v-col>
              <v-col cols="3">
                <span
                  class="text-h6"
                  style="color: black;text-align: right"
                >{{ sumWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}Kg</span>
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
                  @click="jumptocontract()"
                >
                  JUMP
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-show="displayPellet"
                  :headers="headers"
                  :items="pelletContracts"

                  :items-per-page="-1"
                >
                  <template v-slot:[`item.contract_id`]="{ item }">
                    CP-{{ item.contract_id }}-{{ item.detail_id }}
                  </template>
                  <template v-slot:[`item.contract_weight`]="{ item }">
                    <label>{{ item.contract_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                  </template>
                  <template v-slot:[`body.append`]>
                    <tr>
                      <td
                        class="font-weight-bold"
                        style="background: #fafafa"
                        :colspan="2"
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
                        <label>{{ sumWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
  props: ['product_id', 'weight_out', 'date'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    sumWeight: 0,
    displayPellet: false,
    item: {
    },
    DailyProductOutbound: [],
    headers: [
      {
        text: '契約ID',
        value: 'contract_id',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '取引先',
        value: 'customer_id',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '契約名',
        value: 'contract_name',
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
    ...mapState('contractStore', ['pelletContracts', 'f_contracts', 'contractIds']),
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
    ...mapActions('contractStore', ['loadPelletContracts']),
    ...mapMutations('app', ['setOverlayStatus']),

    showPellet() {
      this.displayPellet = !this.displayPellet
    },

    openForm() {
      this.setOverlayStatus(true)
      this.dialog = true
      this.loadPelletContracts(
        {
          product_id: this.product_id,
          startDate: this.date,
          endDate: this.date,
        },
      ).then(() => {
        console.log('openform:', this.date, this.product_id)
        this.setOverlayStatus(false)

        let sum = 0
        this.pelletContracts.forEach(k => {
        // eslint-disable-next-line no-const-assign
          sum += k.contract_weight
        })
        this.sumWeight = sum
      })
    },
    closeForm() {
      this.$emit('ok')
      this.dialog = false
      this.item = {
      }
    },
    jumptocontract() {
      this.$router.push(
        {
          path: '/contract-pellet-list',
          query: {
            product_id: this.product_id,
            startDate: this.date,
            endDate: this.date,
          },
        },
      )
    },
  },
}
</script>
