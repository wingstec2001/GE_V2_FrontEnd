<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
    >
      <v-icon size="22">
        {{ icon }}
      </v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">生産</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="date"
                  label="粉砕開始日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.materialid"
                  label="材料ID*"
                  required
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.materialname"
                  label="材料名*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.actualweight"
                  label="粉砕重量*"
                  disabled
                  suffix="Kg"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="deleteItem(item)"
          >
            YES
          </v-btn>
          <v-btn
            color="error"
            @click="dialog = false"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiCalendar } from '@mdi/js'
import { mapActions } from 'vuex'

export default {
  props: ['icon', 'item'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
  }),
  methods: {
    deleteItem(item) {
      this.apierror.messages = []

      this.deleteCrushingActual(item.id)
        .then(() => {
          this.dialog = false
          this.loadCrushingActualdetails()
        })
        .catch(error => {
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },
    ...mapActions('dashboardStore', ['deleteCrushingActual', 'loadCrushingActualdetails']),
  },
}
</script>
