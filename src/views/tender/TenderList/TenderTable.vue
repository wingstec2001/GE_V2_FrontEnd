<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <!-- <v-card-title>商品登録</v-card-title>
        <v-card-text>
        </v-card-text> -->

        <TenderTableFixed></TenderTableFixed>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import TenderTableFixed from './TenderTableFixed.vue'

export default {
  components: {
    TenderTableFixed,
  },
  setup() {
    return {}
  },
}
</script>
