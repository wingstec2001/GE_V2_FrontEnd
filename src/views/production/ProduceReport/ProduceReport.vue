<template>
  <div id="produce-report">
    <v-card>
      <v-card-title>生産実績-帳票 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="id"
            :items="items1"
            placeholder="ルーター"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="id"
            :items="items"
            placeholder="ペレットID"
            outlined
            clearable
            dense
            hide-details
          ></v-select>
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
                v-model="startDate"
                placeholder="From"
                dense
                hide-details
                outlined
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
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
                v-model="endDate"
                placeholder="To"
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
              v-model="endDate"
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
        :headers="headers"
        :items="stockmasters"
        sort-by="calories"
        class="elevation-1"
      >
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> {{ icons.mdiPencil }}</v-icon>
          <v-icon small @click="deleteItem(item)">{{ icons.mdiDelete }} </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template> -->
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import {
  mdiCalendar, mdiMagnify, mdiPencil, mdiDelete, mdiExportVariant,
} from '@mdi/js'

export default {
  data: () => ({
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    id: '',
    items: ['ABS-White', 'ABS-White-10', 'ABS-White^2-', '3-3dS-White'],
    items1: ['1', '2'],
    icons: {
      mdiCalendar,
      mdiMagnify,
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
    },
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '生産日時',
        align: 'left',
        sortable: true,
        value: 'produced_dt',
      },
      { text: 'ルーター', value: 'route_id', align: 'left' },
      { text: 'ペレットID', value: 'product_id', align: 'left' },
      { text: 'ペレット名', value: 'product_name', align: 'left' },
      { text: '生産量', value: 'produced_wight', align: 'right' },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
      },
    ],
    stockmasters: [],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog() {
    },

    dialogDelete(val) {
      if (val) this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.stockmasters = [
        {
          produced_dt: '2021-09-25',
          route_id: '1',
          product_id: 'C12-25-26',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-09-25',
          route_id: '1',
          product_id: 'ABCD=1-3e4',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-09-25',
          route_id: '1',
          product_id: 'C12-25-26',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-09-25',
          route_id: '1',
          product_id: 'C12-25-27',
          produced_wight: '100,000',
        },
        {
          produced_dt: '2021-08-25',
          route_id: '1',
          product_id: 'C12-28-29w',
          produced_wight: '1,000',
        },
        {
          produced_dt: '2021-09-25',
          route_id: '1',
          product_id: 'C12-25-26',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-09-27',
          route_id: '2',
          product_id: 'C12-25-26',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-09-30',
          route_id: '2',
          product_id: 'C12-25-2x36',
          produced_wight: '100',
        },
        {
          produced_dt: '2021-10-02',
          route_id: '2',
          product_id: 'C12-25-26',
          produced_wight: '100,000',
        },
        {
          produced_dt: '2021-10-05',
          route_id: '2',
          product_id: 'C12-28-29w',
          produced_wight: '1,000',
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.stockmasters.indexOf(item)

      // this.editedItem = Object.assign({}, item)
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.stockmasters.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.stockmasters.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.stockmasters[this.editedIndex], this.editedItem)
      } else {
        this.stockmasters.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
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
