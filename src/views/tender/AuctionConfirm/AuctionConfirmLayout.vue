<template>
  <v-row class="match-height">
    <!-- horizontal -->
    <v-col
      cols="12"
    >
      <v-card>
        <v-card-title>入札実績-決定</v-card-title>
        <v-card-text>
          <AuctionConfirm></AuctionConfirm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AuctionConfirm from './AuctionConfirm.vue'

export default {
  components: {
    AuctionConfirm,
  },
  setup() {
    return {}
  },
}
</script>
