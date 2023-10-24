<template>
  <div justify="center">
    <v-icon
      class="mr-2"
      small
      @click.stop="openForm"
    >
      {{ icon }}
    </v-icon>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
            style="color:red"
          >契約(粉砕済)―削除</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <template v-if="apierror.status=='error'">
              <div
                v-for="msg of apierror.message"
                :key="msg"
              >
                <v-row class="ml-6 mb-3 ma-3">
                  <span style="color: red">* {{ msg }} </span>
                </v-row>
              </div>
            </template>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="cc_id"
                  label="契約ID"
                  readonly
                >
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="item.contract_name"
                  label="契約名"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.customer_id"
                  label="取引先ID"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  ref="Contracts"
                  class="class-on-data-table elevation-1"
                  :headers="contractHeaders"
                  :items="item.contracted_details"
                  fixed-header
                >
                  <template v-slot:[`item.contract_weight`]="{ item }">
                    <label>{{ item.contract_weight ? item.contract_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
                  </template>
                  <template v-slot:[`item.contract_price`]="{ item }">
                    <label>{{ item.contract_price ? item.contract_price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="deleteStatus"
            @click="deleteItem(item)"
          >
            YES
          </v-btn>
          <v-btn
            color="error"
            @click="closeForm()"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: ['icon', 'contractId'],
  data: () => ({
    dialog: false,
    apierror: {
      code: '',
      status: '',
      message: [],
    },
    contractHeaders: [
      {
        text: 'No',
        value: 'detail_id',
        sortable: false,
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '材料ID',
        value: 'material_id',
        sortable: false,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '入庫ID',
        value: 'id',
        sortable: true,
        align: 'left',
        width: '20%',
        fixed: true,
      },

      {
        text: '契約重量(Kg)',
        value: 'crushed_weight',
        sortable: false,
        align: 'right',
        width: '20%',
        fixed: true,
      },

      {
        text: 'FROM',
        value: 'origin',
        sortable: false,
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
      },
    ],
    deleteStatus: false,
    item: {},

  }),
  computed: {
    ...mapState('contractStore', ['selectedCrushedContract']),
    cc_id: {
      get() {
        // return `CF-${this.contractId.toString()}`
        return `CF-${this.item.did}`
      },

    },
  },
  methods: {
    ...mapActions('contractStore', ['loadCrushedContract', 'deleteCrushedContract']),
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),

    openForm() {
      this.loadCrushedContract(this.contractId).then(() => {
        this.item = { ...this.selectedCrushedContract }
        for (let i = 0; i < this.item.contracted_details.length; i += 1) {
          this.item.contracted_details[i].detail_id = i + 1
        }
      })
      this.dialog = true
    },
    closeForm() {
      this.$emit('cancel')
      this.apierror.messages = []
      this.dialog = false
    },

    deleteItem(item) {
      this.apierror.messages = []
      this.deleteStatus = true

      this.deleteCrushedContract(item.did).then(() => {
        this.dialog = false
        this.deleteStatus = false
        this.$emit('deleted')
      }).catch(error => {
        this.deleteStatus = false
        this.apierror.status = 'error'
        this.apierror.messages.push(error.response.data.message)

        // this.apierror.messages.push('削除できません。')
        console.log('apierror', this.apierror)
      })
    },

    getContractID(id) {
      return `CF-${id.toString()}`
    },
  },

}
</script>
