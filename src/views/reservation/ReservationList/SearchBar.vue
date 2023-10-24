<template>
  <v-card color="" dense flat class="pl-4 pr-4">
    <v-row>
      <v-col cols="12" md="2">
        <v-select v-model="id" :items="items" placeholder="予約ID" dense clearable></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select v-model="id" :items="items" placeholder="ペレットID" dense clearable></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field dense hide-details placeholder="商品名" clearable></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
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
              v-bind="attrs"
              :prepend-icon="icons.mdiCalendar"
              clearable
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" @input="dateStartMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2" sm="12">
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
              hide-details
              v-bind="attrs"
              :prepend-icon="icons.mdiCalendar"
              clearable
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="dateEndMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col align="center" cols="12" md="1">
        <v-icon large>
          {{ icons.mdiMagnify }}
        </v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// import AuctionTable from './tables/AuctionTable.vue'
import { mdiCalendar, mdiMagnify } from '@mdi/js'

export default {
  data: () => ({
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    id: '',
    items: ['ABS-White', 'ABS-White-10', 'ABS-White^2-', '3-3dS-White'],
    icons: {
      mdiCalendar,
      mdiMagnify,
    },
  }),
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
