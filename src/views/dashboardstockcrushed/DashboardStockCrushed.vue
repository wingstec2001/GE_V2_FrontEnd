<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="12">
        <v-chip-group v-model="selectiontitle" mandatory active-class="primary--text">
          <v-chip v-for="title in titles" :key="title" :value="title">
            {{ title }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row v-if="selectiontitle == '材料粉砕済'">
      <v-col>
        <v-row>
          <v-col cols="12">
            <stock-crushed></stock-crushed>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StockCrushed from './stockcrushed/StockCrushed.vue'

export default {
  components: {
    StockCrushed,
  },

  data: () => ({
    selectiontitle: '材料粉砕済',
    titles: ['材料粉砕済'],
  }),
}
</script>
