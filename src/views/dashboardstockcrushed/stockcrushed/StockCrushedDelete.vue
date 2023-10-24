<template>
  <div>
    <v-btn icon small class="mt-n2 me-n3" @click.stop="dialog = true">
      <v-icon size="22">
        {{ icon }}
      </v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">削除</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.inout_date"
                  label="粉砕日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="item.material_id" label="原材料ID*" disabled required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.crushed_weight"
                  label="粉砕済み重量*"
                  suffix="Kg"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="item.inout_direction"
                  :items="inout_direction"
                  label="入出庫"
                  disabled
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="deleteItem(item)"> YES </v-btn>
          <v-btn color="error" @click="dialog = false"> NO </v-btn>
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
    inout_direction: [
      { text: '入庫', value: 0 },
      { text: '出庫', value: 1 },
    ],
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  methods: {
    deleteItem(item) {
      console.log(item.id)
    },
    ...mapActions('dashboardStore', ['deleteProduction', 'loadProductiondetails', 'loadProductionsum']),
  },
}
</script>
