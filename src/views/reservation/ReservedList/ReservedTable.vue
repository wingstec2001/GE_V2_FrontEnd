<template>
  <v-row>
    <v-col cols="12">
       <v-card>
        <SearchBar></SearchBar>
      </v-card>
    </v-col>
     <v-col cols="12">
      <v-card>
        <ReservedTableFixed></ReservedTableFixed>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SearchBar from './SearchBar.vue'
import ReservedTableFixed from './ReservedList.vue'

export default {
  components: {
    ReservedTableFixed,
    SearchBar,
  },
  setup() {
    return {}
  },
}
</script>
