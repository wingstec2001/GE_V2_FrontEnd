<template>
  <v-data-table
    :headers="headers"
    :items="arrivals"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>入札実績一覧</v-toolbar-title>
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" :to="{ name: 'arrival-form' }"> 新規 </v-btn>
          </template> -->
        </v-dialog>
      </v-toolbar>
    </template>
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
    <!-- <template v-slot:item.actions="{ item }"> -->
    <template v-slot:[`item.auctionID`]="{ item }">
      <a
        target="_blank"
        :href="item.auctionID"
      >
        {{ item.auctionID }}
      </a>
    </template>
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
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>
<script>
import { mdiPencil, mdiDelete } from '@mdi/js'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    icons: { mdiPencil, mdiDelete },
    headers: [
      {
        text: 'イメージ',
        value: 'imageName',
        sortable: false,
        align: 'left',
      },
      {
        text: '入札商品ID',
        align: 'left',
        sortable: false,
        value: 'arrivalID',
      },
      { text: 'ペレットID', value: 'materialID', align: 'right' },
      { text: '商品名', value: 'materialName', align: 'right' },
      { text: '説明', value: 'company', align: 'right' },
      { text: '取引先名', value: 'preArrivalDate', align: 'center' },
      { text: '入札日', value: 'arrivalDate', align: 'center' },
      { text: '最低金額', value: 'arrivalDate', align: 'center' },
      { text: '最大入札者数', value: 'arrivalDate', align: 'center' },
      {
        text: ' ',
        value: 'actions',
        sortable: false,
        align: 'center',
      },
    ],
    arrivals: [],
  }),

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
      this.arrivals = []
    },
  },
}
</script>
<style scoped>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
</style>
