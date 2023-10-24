<template>
  <v-row class="match-height">
    <!-- horizontal -->
    <v-col
      cols="12"
    >
      <v-card>
        <v-card-title>在庫新規</v-card-title>
        <v-card-text>
          <ProductForm></ProductForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ProductForm from './ProductForm.vue'

export default {
  components: {
    ProductForm,
  },
  setup() {
    return {}
  },
}
</script>
