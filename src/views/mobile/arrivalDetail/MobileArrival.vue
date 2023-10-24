<template>
  <!-- <v-card tile> -->

  <v-row no-gutters>
    <v-col cols="12">
      <v-tabs v-model="tabs">
        <v-tab href="#1">
          入荷一覧
        </v-tab>
        <v-tab href="#2">
          入荷集計
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
import OutputList from './component/OutputList.vue'
import DaySum from './component/DaySum.vue'

export default {
  name: 'MobileArrival',

  components: {
    OutputList, // 実績一覧
    DaySum, // 集計一覧
  },
  data: () => ({
    tabs: '',
  }),
  created() {},
  mounted() {},
  methods: {
    slideChange(val) {
      val.node.resetSlider()
    },
  },
}
</script>
