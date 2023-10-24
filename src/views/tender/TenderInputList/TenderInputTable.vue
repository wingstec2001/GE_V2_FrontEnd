<template>
  <v-card>
    <v-card-title>入札実績一覧</v-card-title>
    <v-row class="px-2 ma-0">
      <v-col
        cols="12"
        md="2"
      >
        <v-select
          v-model="searchBar.bidID.val"
          :items="Array.from(tableDatas, data => data.bidID)"
          placeholder="入札ID"
          hide-details
          dense
          outlined
          clearable
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-model="searchBar.materialName.val"
          dense
          hide-details
          placeholder="入札商品名"
          outlined
          clearable
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          v-model="searchBar.minAmount.val"
          dense
          outlined
          hide-details
          placeholder="最低入札金額"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-menu
          v-model="dateStartMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="searchBar.date_start.start"
              placeholder="入札開始日From"
              dense
              outlined
              hide-details
              v-bind="attrs"
              :prepend-icon="icons.mdiCalendar"
              clearable
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="searchBar.date_start.start"
            @input="dateStartMenu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-menu
          v-model="dateEndMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="searchBar.date_start.end"
              placeholder="入札終了日To"
              dense
              outlined
              hide-details
              v-bind="attrs"
              :prepend-icon="icons.mdiCalendar"
              clearable
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="searchBar.date_start.end"
            @input="dateEndMenu = false"
          ></v-date-picker>
        </v-menu>
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
          :to="{ name: 'tender-create' }"
        >
          <span>NEW</span>
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
</template>

<script>

// import AuctionTable from './tables/AuctionTable.vue'
import {
  mdiPencil,
  mdiDelete,
  mdiCalendar,
  mdiClose,
  mdiExportVariant,
} from '@mdi/js'

export default {
  data: () => ({
    search: '',
    searchQuery: '',
    date: '',
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    selectId: '',
    counter: 0,
    searchBar: {},
    filters: {
      materialName: { val: null, type: 'include' },
      bidID: { val: null, type: 'equal' },
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
      // {
      //   text: 'Image',
      //   value: 'imageName',
      //   sortable: false,
      //   align: 'left',
      //   width: '5%',
      // },
      {
        text: 'No.',
        value: 'id',
        align: 'center',
        width: '5%',
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
        value: 'bidName',
        align: 'left',
        width: '20%',
      },
      {
        text: '取引先',
        value: 'customer_name',
        align: 'left',
        width: '20%',
      },
      {
        text: '入札日',
        value: 'bidDate',
        align: 'center',
        width: '10%',
      },
      {
        text: '入札金額',
        value: 'bidPrice',
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
          bidName: 'ABC樹脂純度高21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customer_name: '青島勝利化学',
          bidDate: '2021-10-04',
          bidPrice: '399,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 100,
          bidID: 'NS000001',
          productID: 'ABC-11-3q112231-324',
          bidName: 'ABC樹脂純度高21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customer_name: '広州高遠信科技',
          bidDate: '2021-10-04',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 101,
          bidID: 'NS000001',
          productID: 'ABC-11-3q112231-324',
          bidName: 'ABC樹脂純度高21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customer_name: 'ハノイ　VIM　HOO　TIDE',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 102,
          bidID: 'NS000001',
          productID: 'ABC-11-3q112231-324',
          bidName: 'ABC樹脂純度高21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customer_name: 'EverGreen Trade Taibei',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/slack.png'),
          id: 103,
          bidID: 'NS000001',
          productID: 'ABC-11-3q112231-324',
          bidName: 'ABC樹脂純度高21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，将持续推进体能测试。两次测试不达标将列入观察对象，评估是否胜任公司工作要求',
          customer_name: '福州下梨村丽尔哈',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 110000,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customer_name: '福州市莆田达美乐进出口总公司上是一尔萨斯分厂',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 104,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customer_name: '上海昆山万里实业有限公司',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 105,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customer_name: '厦门市前进化工厂',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 106,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customer_name: 'Hangzhou 村丽哈',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
          url: './auction-confirm',
        },
        {
          imageName: require('@/assets/images/logos/bitbank.png'),
          id: 107,
          bidID: 'NS000002',
          productID: 'TBX-D-13-FX-W',
          bidName: 'TBX樹脂 21年10月入札用商品',
          bidDesc:
            'ABC樹脂純度高21年10月入札あいうえお。与此同时，各种变相裁员的套路开始出现，比如买员工房、买理财产品、降薪降职、买酒、捐款……我看到最绝的一个房企，它的城市更新板块发布通知称，',
          customer_name: '福州下梨村丽尔哈',
          bidDate: '2021-10-05',
          bidPrice: '400,999',
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
      console.log('customFilter')

      Object.keys(this.filters).forEach(key => {
        // console.log(key, this.filters[key])
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
            // console.log(`min${filter.val} ${item[key]} ${filter.val > item[key]}`)

            if (filter.val != null && parseInt(filter.val, 10) > parseInt(item[key], 10)) {
              result = result && false
            }

            break
          case 'date':
            // console.log(`date filter${new Date(filter.start)}`)
            if (filter.start != null && new Date(filter.start) > new Date(item[key])) {
              result = result && false
            }

            // console.log(`date start ${result}`)
            if (filter.end != null && new Date(filter.end) < new Date(item[key])) {
              result = result && false
            }

            // console.log(`date end ${result}`)
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
