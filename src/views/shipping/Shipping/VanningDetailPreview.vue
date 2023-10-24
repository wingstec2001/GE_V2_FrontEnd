<template>
  <div justify="center">
    <a
      href="javascript:void(0);"
      @click="openForm"
    >{{ vanningId }}</a>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
          >出荷詳細</span>
          <template>
            <v-spacer></v-spacer>
            <template v-if="apierror.status=='error'">
              <div
                v-for="msg of apierror.messages"
                :key="msg"
              >
                <v-row class="ml-6 mb-3 ma-3">
                  <span style="color: red">* {{ msg }} </span>
                </v-row>
              </div>
            </template>
          </template>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-col cols="2">
                <label for="vanning_date">出荷日時</label>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="item.vanning_date"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="2">
                <label for="contract_id">契約ID<span style="color:red">*</span></label>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="item.contract_id"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="2">
                <label for="contract_id">契約名<span style="color:red">*</span></label>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="contractMaster[item.contract_id]"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="2">
                <label for="contract_id">取引先ID<span style="color:red">*</span></label>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="item.customer_id"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="2">
                <label for="country">国名</label>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="item.country"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <label for="area">地域</label>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="item.area"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="3">
                <label for="container_no">CONTAINER NO.</label>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="item.container_no"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2">
                <label for="seal_no">SEAL NO.</label>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="item.seal_no"
                  dense
                  readonly
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <label for="vanning_memo">説明</label>
              </v-col>
              <v-col cols="10">
                <v-textarea
                  v-model="item.vanning_memo"
                  name="vanning_memo"
                  height="52px"
                  outlined
                  dense
                  readonly
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <v-data-table
                  ref="Contracts"
                  class="class-on-data-table elevation-1"
                  :headers="shippingHeaders"
                  :items="item.vanning_details"
                  item-key="detail_id"
                  fixed-header
                >
                  <template v-slot:[`item.mark`]="{ item }">
                    <v-icon
                      v-text="item.mark === '' ? '' : icons[marks[item.mark].icon]"
                    ></v-icon>
                  </template>
                  <template v-slot:[`item.label`]="{ item }">
                    <label>{{ labels[item.label] }}</label>
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
            text
            @click="closeForm"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiPlus,
  mdiMagnify,
  mdiPlusCircle,
  mdiMinusCircle,
  mdiCircleOutline,
  mdiCircleDouble,
  mdiTriangleOutline,
  mdiStarOutline,
  mdiClose,
} from '@mdi/js'
import { mapActions, mapState } from 'vuex'

export default {
  props: ['icon', 'vanningId'],
  data: () => ({
    dialog: false,
    item: {},
    marks: [
      { text: '0', icon: '' },
      { text: '1', icon: 'mdiCircleOutline' },
      { text: '2', icon: 'mdiCircleDouble' },
      { text: '3', icon: 'mdiTriangleOutline' },
      { text: '4', icon: 'mdiStarOutline' },
    ],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    icons: {
      mdiPlus,
      mdiMagnify,
      mdiPlusCircle,
      mdiMinusCircle,
      mdiCircleOutline,
      mdiCircleDouble,
      mdiTriangleOutline,
      mdiStarOutline,
      mdiClose,
    },
    labels: ['', '有'],
    shippingHeaders: [
      {
        text: 'No.',
        align: 'left',
        sortable: false,
        value: 'detail_id',
        width: '5%',
        fixed: true,
      },
      {
        text: '契約商品名',
        value: 'vanning_goods_name',
        sortable: false,
        align: 'left',
        width: '40%',
        fixed: true,
      },
      {
        text: '契約重量',
        value: 'vanning_weight',
        sortable: false,
        align: 'right',
        width: '27%',
        fixed: true,
      },
      {
        text: 'マーク',
        value: 'mark',
        sortable: false,
        align: 'center',
        width: '14%',
      },
      {
        text: 'ラベル',
        value: 'label',
        sortable: false,
        align: 'center',
        width: '14%',
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('vanningStore', ['selectedVanning']),
    ...mapState('contractStore', ['contractMaster']),
  },
  methods: {
    ...mapActions('vanningStore', ['loadVanning']),
    ...mapActions('contractStore', ['loadContractIds']),
    openForm() {
      this.loadContractIds()
      this.loadVanning(this.vanningId).then(() => {
        this.item = { ...this.selectedVanning }
        this.item.vanning_date = `${this.selectedVanning.vanning_date} ${this.selectedVanning.vanning_time.substring(0, 5)}`
      }).catch(error => {
        this.apierror.status = error.response.data.status
        this.apierror.code = error.response.data.code
        this.apierror.messages.push(error.response.data.message)
      })
      this.dialog = true
    },
    closeForm() {
      this.$emit('cancel')
      this.dialog = false
      this.item = {}
    },
  },

}
</script>
