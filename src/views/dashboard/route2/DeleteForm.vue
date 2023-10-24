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
                  label="生産開始日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="route_id"
                  label="ルーターID*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.productid"
                  label="ペレットID*"
                  required
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.productname"
                  label="ペレット名*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.producedweight"
                  label="生産量*"
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
    route_id: '2',
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
  }),
  methods: {
    deleteItem(item) {
      this.apierror.messages = []

      this.deleteProduction(item.id)
        .then(() => {
          this.dialog = false
          this.loadProductiondetails(2)
          this.loadProductionsum(2)
        })
        .catch(error => {
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },
    ...mapActions('dashboardStore', ['deleteProduction', 'loadProductiondetails', 'loadProductionsum']),

  },

}
</script>
