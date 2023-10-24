<template>
  <v-row class="match-height">
    <!-- horizontal -->
    <v-col
      cols="12"
    >
      <v-card>
        <v-card-title>予約実績-管理</v-card-title>
        <v-card-text>
          <ReservedEditForm></ReservedEditForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ReservedEditForm from './ReservedEditForm.vue'

export default {
  components: {
    ReservedEditForm,
  },
  setup() {
    return {}
  },
}
</script>
