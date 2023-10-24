<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-text class="pa-5">
          <v-img :src="url" height="100%" contain></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mdiMagnifyPlusOutline } from '@mdi/js'

export default {
  props: ['url'],
  data: () => ({
    dialog: false,
    icons: {
      mdiMagnifyPlusOutline,
    },
  }),
  methods: {
    openDailog() {
      this.dialog = true
    },
  },
}
</script>
