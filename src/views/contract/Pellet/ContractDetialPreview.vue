<template>
  <div justify="center">
    <a href="javascript:void(0);" @click="dialog = true">{{ item.contract_id }}</a>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
          >契約詳細</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-col cols="2">
                <label class="text-right" for="contractID">契約ID</label>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  id="contract_id"
                  v-model="item.contract_id"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <label for="contract_name">契約名</label>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  id="contract_name"
                  v-model="item.contract_name"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="2">
                <label for="customer_id">取引先ID</label>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="item.customer_id"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  class="class-on-data-table elevation-1"
                  ref="Contracts"
                  :headers="contractHeaders"
                  :items="item.contract_details"
                  fixed-header
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['icon', 'item'],
  data: () => ({
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    contractHeaders: [
      {
        text: 'No.',
        value: 'detail_id',
        sortable: false,
        align: 'left',
        width: '3%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        value: 'product_id',
        sortable: false,
        align: 'left',
        width: '18%',
        fixed: true,
      },
      {
        text: '契約商品名',
        value: 'contract_goods_name',
        sortable: false,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '契約重量',
        value: 'contract_weight',
        sortable: false,
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '契約金額',
        value: 'contract_price',
        sortable: false,
        align: 'right',
        width: '17%',
        fixed: true,
      },
      {
        text: '備考',
        value: 'contract_note',
        sortable: false,
        align: 'center',
        width: '25%',
        fixed: true,
      },
    ],
  }),
  methods: {

  },

}
</script>
