<template>
  <!-- <v-card tile> -->

  <v-row no-gutters>
    <v-col cols="12">
      <v-tabs v-model="tabs">
        <!-- <v-tab href="#1">
          生産計画
        </v-tab> -->
        <v-tab href="#2">
          生産実績
        </v-tab>
        <v-tab href="#3">
          生産集計
        </v-tab>
        <v-tabs-slider color="pink"></v-tabs-slider>
        <!-- <v-tab-item value="1">
          <BeforeProduct :routenum="parseInt($route.params.num)" />
        </v-tab-item> -->
        <v-tab-item value="2">
          <OutputList :routenum="parseInt($route.params.num)" />
        </v-tab-item>
        <v-tab-item value="3">
          <ActualProducted :routenum="parseInt($route.params.num)" />
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>
<script>
import ActualProducted from './component/ActualProducted.vue'
import OutputList from './component/OutputList.vue'

export default {
  name: 'Dashboard',
  components: {
    ActualProducted,
    OutputList,
  },
  data: () => ({
    routeNum: '',
    tabs: '',
    text: '<div><span style="color:red ">12312312</span></div>',
    messages: [
      {
        id: '1',
        img: "require('@/assets/images/show.jpg')",
        body: [
          {
            fontsize: 'small', // .text-h5 h6 subtitle-1
            fontcolor: 'red', // red--text  red blue black
            text: 'messages-1',
            class: 'text-h5 red--text',
          },
          {
            fontsize: 'small', // .text-h5 h6 subtitle-1
            fontcolor: 'red', // red--text  red blue black
            text: 'messages-2',
            class: 'text-h5 red--text',
          },
        ],
      },
      {
        id: '2',
        img: "require('@/assets/logo.jpg')",
        body: [
          {
            fontsize: 'small', // .text-h5 h6 subtitle-1
            fontcolor: 'red', // red--text  red blue black
            text: 'messages-3',
            class: 'text-h5 red--text',
          },
          {
            fontsize: 'small', // .text-h5 h6 subtitle-1
            fontcolor: 'red', // red--text  red blue black
            text: 'messages-4',
            class: 'text-h5 red--text',
          },
        ],
      },
    ],
  }),
  created() {

  },
  mounted() {

  },
  methods: {
    slideChange(val) {
      val.node.resetSlider()
    },
  },
}
</script>
