<template>
  <div id="auction-result-list">
    <v-card>
      <v-card-title> 落札一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="searchBar.bidID.val"
            :items="Array.from(tableDatas, data => data.bidID)"
            placeholder="入札商品ID"
            dense
            clearable
            outlined
            hide-details
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="searchBar.productID.val"
            :items="Array.from(tableDatas, data => data.productID)"
            placeholder="ペレットID"
            dense
            clearable
            hide-details
            outlined
          ></v-select>
        </v-col>
        <!-- <v-col cols="12" sm="3">
          <v-select
            v-model="searchBar.customerID.val"
            :items="Array.from(tableDatas, data => data.customerID)"
            placeholder="取引先ID"
            dense
            clearable
            hide-details
            outlined
          ></v-select>
        </v-col> -->
      </v-row>
      <v-divider class="mt-4"></v-divider>
      <v-card-text class="d-flex align-center flex-wrap pb-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          outlined
          hide-details
          dense
          class="user-search me-3 mb-4"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <div class="d-flex align-center flex-wrap">
          <v-btn
            color="secondary"
            outlined
            class="mb-4"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        :search="search"
        :custom-filter="customFilter"
        :headers="headers"
        :items="tableDatas"
        class="elevation-1"
      >
        <template v-slot:[`item.imageName`]="{ item }">
          <div class="p-2">
            <v-img
              :src="item.imageName"
              max-height="30"
              max-width="30"
              class="me-3"
            >
            </v-img>
          </div>
        </template>
        <template v-slot:[`item.bidID`]="{ item }">
          <a :href="item.url"> {{ item.bidID }}</a>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            @click="editItem(item)"
          >
            {{ icons.mdiPencil }}
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            color="primary"
            @click="initialize"
          >
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable*/
import { mdiPencil, mdiDelete, mdiCalendar, mdiClose, mdiExportVariant } from '@mdi/js'
/* eslint-disable*/

export default {
  data: () => ({
    search: '',
    date: '',
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    searchQuery: '',
    selectId: '',
    counter: 0,
    searchBar: {},
    filters: {
      customer_name: { val: null, type: 'include' },
      bidID: { val: null, type: 'equal' },
      productID: { val: null, type: 'equal' },
      customerID: { val: null, type: 'equal' },
      date_start: {
        start: null,
        end: null,
        type: 'date',
      },
      minAmount: {
        val: null,
        type: 'min',
      },
    },
    email: '',
    dialog: false,
    dialogDelete: false,
    icons: {
      mdiPencil,
      mdiDelete,
      mdiCalendar,
      mdiClose,
      mdiExportVariant,
    },
    headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'center',
        width: '8%',
      },
      {
        text: '入札商品ID',
        align: 'left',
        sortable: false,
        value: 'bidID',
        width: '10%',
      },
      {
        text: 'ペレットID',
        value: 'productID',
        align: 'left',
        width: '10%',
      },
      {
        text: '商品名',
        value: 'reservationName',
        align: 'left',
        width: '20%',
      },
      {
        text: '取引先',
        value: 'customer_name',
        align: 'left',
        width: '10%',
      },
      {
        text: '入札日',
        value: 'reservedDate',
        align: 'right',
        width: '15%',
      },
      {
        text: '重合合計',
        value: 'reservedWeight',
        align: 'right',
        width: '10%',
      },
      {
        text: ' ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '5%',
      },
    ],
  }),

  computed: {},

  watch: {},

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.tableDatas = [
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 99,
          bidID: 'NS000001',
          productID: 'ABC-11-3q112231-324',
          reservationName: 'ABC樹脂純度高21年10月入札用商品',
          reservationDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customerID: 'QD Shengli',
          customer_name: '青島勝利化学',
          reservedDate: '2021-10-04',
          reservedWeight: '850',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 108,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customerID: 'FZLEH',
          customer_name: '福州下梨村丽尔哈',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
      ]
      this.searchBar = JSON.parse(JSON.stringify(this.filters))
    },
    customFilter(value, search, item) {
      let result = true

      Object.keys(this.filters).forEach(key => {
        const filter = this.filters[key]
        switch (filter.type) {
          case 'equal':
            if (filter.val != null && item[key] !== filter.val) {
              result = result && false
            }
            break
          case 'include':
            if (filter.val != null && !item[key].toLowerCase().includes(filter.val)) {
              result = result && false
            }
            break
          case 'min':

            if (filter.val != null && parseInt(filter.val, 10) > parseInt(item[key], 10)) {
              result = result && false
            }

            break
          case 'date':
            if (filter.start != null && new Date(filter.start) > new Date(item[key])) {
              result = result && false
            }

            if (filter.end != null && new Date(filter.end) < new Date(item[key])) {
              result = result && false
            }

            break
          default:
            break
        }
      })
      console.log(`search list  ${result}`)

      return result
    },

    searchBtnClicked() {

      this.filters = JSON.parse(JSON.stringify(this.searchBar))

      // change value trigger search event
      this.counter += 1
      this.search = `${this.counter}`
    },
  },
}
</script>
<style>
.v-input__prepend-outer {
  margin: auto !important;
}
.text-field-dense-append-prepend-margin {
  margin: auto;
}
.v-input__append-inner {
  margin: auto !important;
}
</style>
