<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <SearchBar></SearchBar>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <StockListTableFixed></StockListTableFixed>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import StockListTableFixed from './StockList.vue'
import SearchBar from './SearchBar.vue'

export default {
  components: {
    StockListTableFixed,
    SearchBar,
  },
  setup() {
    return {}
  },
}
</script>
