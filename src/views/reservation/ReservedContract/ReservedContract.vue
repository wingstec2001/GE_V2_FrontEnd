<template>
  <div id="reserved-list">
    <v-card>
      <v-card-title> 契約手続 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="searchBar.reservationID.val"
            placeholder="予約商品ID"
            :items="Array.from(listData, data => data.reservationID)"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="searchBar.productID.val"
            placeholder="ペレットID"
            :items="Array.from(listData, data => data.productID)"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-select
            v-model="searchBar.customerID.val"
            placeholder="取引先ID"
            :items="Array.from(listData, data => data.customerID)"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
        </v-col>
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
            color="primary"
            class="mb-4 me-3"
            @click="itemClick"
          >
            <v-icon>{{ icons.mdiPlus }}</v-icon>
            <span>仮契約</span>
          </v-btn>
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

      <!-- table -->
      <v-data-table
        v-model="selectedRows"
        class="class-on-data-table elevation-1"
        :headers="headers"
        :items="listData"
        item-key="reservationID"
        show-select
        fixed-header
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            {{ icons.mdiPencil }}
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            {{ icons.mdiDelete }}
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'

export default {
  data: () => ({
    search: '',
    date: '',
    searchQuery: '',
    selectId: '',
    counter: 0,
    searchBar: {},
    selectedRows: [],
    talbeDatas: {},
    filters: {
      customer_name: { val: null, type: 'include' },
      reservationID: { val: null, type: 'equal' },
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
    icons: {
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
    },
    headers: [
      {
        text: '商品ID',
        align: 'left',
        value: 'reservationID',
        width: '10%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        value: 'productID',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '商品名',
        value: 'reservationName',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '取引先',
        value: 'customer_name',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '予約日',
        value: 'reservedDate',
        align: 'right',
        width: '10%',
        fixed: true,
      },
      {
        text: '重合合計',
        value: 'reservedWeight',
        align: 'right',
        width: '15%',
        fixed: true,
      },
      {
        text: ' ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
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
      this.listData = [
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 99,
          reservationID: 'BX123sdsdfsf456780',
          productID: 'ABC-11-3dsafadfsdfsf',
          reservationName:
            'ABC樹脂純度高21年10月与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          reservationDesc:
            'ABC樹脂純度高21年10月お。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customerID: 'QD Shengli',
          customer_name: '青島勝利化学xxxxxxx',
          reservedDate: '2021-10-04',
          reservedWeight: '85000',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 108,
          reservationID: 'B-000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月商品',
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

      return result
    },

    searchBtnClicked() {
      this.filters = JSON.parse(JSON.stringify(this.searchBar))

      // change value trigger search event
      this.counter += 1
      this.search = `${this.counter}`
    },

    itemClick() {
    },
  },
}
</script>
<style>
.class-on-data-table table {
  table-layout: fixed;
}
</style>
