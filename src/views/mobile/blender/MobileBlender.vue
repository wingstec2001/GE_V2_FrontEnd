<template>
  <!-- <v-card tile> -->

  <v-row no-gutters>
    <v-col cols="12">
      <v-tabs
        v-model="tabs"
      >
        <!-- <v-tab href="#1">
          自社紛済
        </v-tab> -->
        <v-tab href="#1">
          ブレンド対象
        </v-tab>
        <v-tab href="#2">
          ブレンド集計
        </v-tab>
        <v-tabs-slider color="pink"></v-tabs-slider>
        <v-tabs-items
          v-model="tabs"
          touchless
        >
          <!-- <v-tab-item value="1">
            <InhouseCrushed />
          </v-tab-item> -->
          <v-tab-item value="1">
            <BeforeBlending />
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

// import InhouseCrushed from './component/InhouseCrushed.vue'
import BeforeBlending from './component/BeforeBlending.vue'
import DaySum from './component/DaySum.vue'

export default {
  name: 'MobileCrushing',
  components: {
    BeforeBlending,
    DaySum,
  },

  data: () => ({
    tabs: '',
  }),

  created() {

  },
  mounted() {

  },
  methods: {

  },
}
</script>
