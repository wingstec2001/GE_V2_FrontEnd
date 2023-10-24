<template>
  <div class="text-center">
    <v-overlay :value="isShow">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
export default {
  props: ['isShow'],
  data: () => ({
  }),

}
</script>
