<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <SearchBar></SearchBar>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <ReservationTableFixed></ReservationTableFixed>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ReservationTableFixed from './ReservationList.vue'
import SearchBar from './SearchBar.vue'

export default {
  components: {
    ReservationTableFixed,
    SearchBar,
  },
  setup() {
    return {}
  },
}
</script>
