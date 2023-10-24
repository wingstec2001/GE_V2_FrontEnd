<template>
  <v-row class="match-height">
    <!-- horizontal -->
    <v-col
      cols="12"
    >
      <v-card>
        <v-card-title>商品新規</v-card-title>
        <v-card-text>
          <ReservationForm></ReservationForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ReservationForm from './ReservationCreate.vue'

export default {
  components: {
    ReservationForm,
  },
  setup() {
    return {}
  },
}
</script>
