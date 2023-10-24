<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <v-card
        color=""
        dense
        flat
        class="pl-4 pr-4"
      >
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              v-model="searchBar.id"
              :items="Array.from(tableDatas, data => data.id)"
              placeholder="入札ID"
              dense
              clearable
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="searchBar.name"
              dense
              hide-details
              placeholder="入札商品名"
              clearable
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-text-field
              v-model="searchBar.amount"
              dense
              hide-details
              placeholder="最低入札金額"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="2"
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
                  v-model="searchBar.date.start"
                  placeholder="入札日From"
                  dense
                  hide-details
                  v-bind="attrs"
                  :prepend-icon="icons.mdiCalendar"
                  clearable
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="searchBar.date.start"
                @input="dateStartMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
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
                  v-model="searchBar.date.end"
                  placeholder="入札日To"
                  dense
                  hide-details
                  v-bind="attrs"
                  :prepend-icon="icons.mdiCalendar"
                  clearable
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="searchBar.date.end"
                @input="dateEndMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="1"
          >
            <v-btn
              color="primary"
              dark
              block
              class=""
              @click="searchBtnClicked"
            >
              検索
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="1"
            sm="8"
          >
            <v-btn
              color="primary"
              dark
              block
            >
              新規
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-data-table
          :search="search"
          :custom-filter="customFilter"
          :headers="headers"
          :items="tableDatas"
          sort-by="calories"
          class="elevation-1"
        >
          <!-- <template v-slot:top>
          </template> -->
          <!-- <template v-slot:item.actions="{ item }"> -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
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
    </v-col>
  </v-row>
</template>

<script>

// import AuctionTable from './tables/AuctionTable.vue'
import {
  mdiPencil, mdiDelete, mdiCalendar, mdiClose,
} from '@mdi/js'

export default {
  data: () => ({
    search: '',
    date: '',
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    selectId: '',
    counter: 0,
    searchBar: {
      name: null,
      id: null,
      date: {
        start: null,
        end: null,
      },
      amount: null,
    },
    filters: {
      name: { val: null, type: 'include' },
      id: { val: null, type: 'equal' },
      date: {
        start: null,
        end: null,
        type: 'date',
      },
      amount: {
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
    },
    headers: [
      {
        text: '入札ID',
        align: 'left',
        sortable: true,
        value: 'id',
      },
      { text: '入札商品名', value: 'name', align: 'center' },
      { text: 'ペレットID', value: 'product_id', align: 'center' },
      { text: '重量', value: 'weight', align: 'center' },
      { text: '取引先名', value: 'company_name', align: 'center' },
      {
        text: '入札金額',
        value: 'amount',
        sortable: false,
        align: 'right',
      },
      {
        text: '入札日',
        value: 'date',
        sortable: false,
        align: 'center',
      },
      { text: 'Actions', value: 'actions', sortable: false },
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
          id: 'NS000001',
          name: 'syohinn',
          product_id: 'sh00001',
          weight: '100',
          company_name: 'ｘｘ会社',
          amount: '123',
          date: '2021-08-08',
        },
        {
          id: 'NS000002',
          name: 'ss',
          product_id: 'sh00001',
          weight: '100',
          company_name: 'ｘｘ会社',
          amount: '123',
          date: '2021-08-08',
        },
        {
          id: 'NS000002',
          name: 'ss',
          product_id: 'sh00001',
          weight: '100',
          company_name: 'ｘｘ会社',
          amount: '123',
          date: '2021-08-08',
        },
        {
          id: 'NS000002',
          name: 'ss',
          product_id: 'sh00001',
          weight: '100',
          company_name: 'ｘｘ会社',
          amount: '123',
          date: '2021-08-08',
        },
      ]
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
            console.log(`min${filter.val} ${item[key]} ${filter.val > item[key]}`)

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
      console.log('searchBtnClicked')

      this.filters.id.val = this.searchBar.id
      this.filters.date.start = this.searchBar.date.start
      this.filters.date.end = this.searchBar.date.end
      this.filters.amount.val = this.searchBar.amount
      this.filters.name.val = this.searchBar.name
      console.log(this.filters)

      // change value trigger search event
      this.counter += 1
      this.search = `${this.counter}`
    },
  },
}
</script>
<style >
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
