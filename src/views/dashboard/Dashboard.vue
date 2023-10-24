<template>
  <v-container>
    <v-row align="center">
      <v-col cols="9">
        <v-chip-group
          v-model="selectiontitle"
          mandatory
          active-class="primary--text"
        >
          <v-chip
            v-for="title in titles"
            :key="title"
            :value="title"
          >
            {{ title }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col
        cols="3"
        style="text-align:right"
      >
        <v-btn
          color="primary"
          small
          :to="{ name: 'dashboard-create' }"
        >
          <span>NEW</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="selectiontitle == 'ルーター1'">
      <v-col>
        <v-row>
          <v-col cols="12">
            <dashboard-output-list1></dashboard-output-list1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <dashboard-actual-producted1></dashboard-actual-producted1>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="selectiontitle == 'ルーター2'">
      <v-col>
        <v-row>
          <v-col cols="12">
            <dashboard-output-list2></dashboard-output-list2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <dashboard-actual-producted2></dashboard-actual-producted2>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="selectiontitle == '入荷情報'">
      <v-col cols="12">
        <purchase-project></purchase-project>
      </v-col>
    </v-row>
    <v-row v-if="selectiontitle == '粉砕実績'">
      <v-col cols="12">
        <dashboard-crush-actual></dashboard-crush-actual>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardOutputList1 from './route1/DashboardOutputList.vue'
import DashboardOutputList2 from './route2/DashboardOutputList.vue'
import DashboardActualProducted1 from './route1/DashboardActualProducted.vue'
import DashboardActualProducted2 from './route2/DashboardActualProducted.vue'
import DashboardCrushActual from './crushingactual/DashboardCrushActual.vue'

export default {
  components: {
    DashboardActualProducted1,
    DashboardActualProducted2,
    DashboardCrushActual,
    DashboardOutputList1,
    DashboardOutputList2,
  },

  data: () => ({
    selectiontitle: 'ルーター1',
    titles: ['ルーター1', 'ルーター2', '入荷情報', '粉砕実績'],
  }),
}
</script>
