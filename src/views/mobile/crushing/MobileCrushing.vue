<template>
  <!-- <v-card tile> -->

  <v-row no-gutters>
    <v-col cols="12">
      <v-tabs v-model="tabs">
        <v-tab href="#1">
          粉砕実績
        </v-tab>
        <v-tab href="#2">
          粉砕集計
        </v-tab>
        <v-tabs-slider color="pink"></v-tabs-slider>
        <v-tabs-items
          v-model="tabs"
          touchless
        >
          <v-tab-item value="1">
            <OutputList />
          </v-tab-item>
          <v-tab-item value="2">
            <DaySum />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-col>
  </v-row>
</template>
<script>

// import { mapActions } from 'vuex'

import OutputList from './crushingactual/OutputList.vue'
import DaySum from './crushingactual/DaySum.vue'

export default {
  name: 'MobileCrushing',
  components: {
    OutputList,
    DaySum,
  },
  data: () => ({
    tabs: '',
  }),
  created() {},
  mounted() {},
  methods: {
    // ...mapActions('dashboardStore', ['loadCrushingDaySum']),

    slideChange(val) {
      val.node.resetSlider()
    },
  },
}
</script>
