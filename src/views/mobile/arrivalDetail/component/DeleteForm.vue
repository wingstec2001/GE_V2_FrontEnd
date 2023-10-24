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
          <span
            style="color: red"
            class="text-h6"
          >入荷実績-削除V2</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <template v-if="apierror.status == 'error'">
              <div
                v-for="msg of apierror.messages"
                :key="msg"
              >
                <v-row class="ml-6 mb-3 ma-3">
                  <span style="color: red">* {{ msg }} </span>
                </v-row>
              </div>
            </template>
            <v-row align="center">
              <v-col cols="5">
                <label class="text-h7">No.</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h7"
                  for="aad_id"
                >{{ item.aad_id }}</label>
              </v-col>
              <v-col cols="5">
                <label
                  class="text-h7"
                  for="material_id"
                >材料ID</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h7"
                  for="materil_id"
                >{{ item.material_id }}</label>
              </v-col>
              <!-- <v-col
                cols="5"
              >
                <label class="text-h6" for="arrival_goods_name">材料名</label>
              </v-col>
              <v-col
                cols="7"
              >
                <label class="text-h6" for="arrival_goods_name">{{ item.arrival_goods_name }}</label>
              </v-col> -->
              <v-col cols="5">
                <label
                  class="text-h7"
                  for="arrival_weight"
                >重量</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h7"
                  for="arrival_weight"
                >{{ item.arrival_weight }}</label>
              </v-col>
              <v-col cols="5">
                <label
                  class="text-h6"
                  for="crushing_status"
                >粉砕状態</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="crushing_status"
                >{{
                  item ? crushing_status[item.crushing_status].text : ''
                }}</label>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="deleteStatus"
            @click="deleteItem(item)"
          >
            YES
          </v-btn>
          <v-btn
            color="error"
            @click="closeForm(item)"
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
    crushing_status: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],
    dialog: false,
    deleteStatus: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  methods: {
    openForm() {
      this.apierror = {}
      this.dialog = true
    },

    closeForm() {
      this.apierror = {}
      this.dialog = false
    },

    deleteItem(item) {
      this.apierror.messages = []

      this.deleteStatus = true
      this.deleteTodayArrivalDetails(item.aad_id)
        .then(() => {
          this.$emit('deleteDetail', item.arrival_id)
          this.deleteStatus = false
          this.$emit('success')

          // this.loadArrivalDetailDaySum()
          this.dialog = false
        })
        .catch(error => {
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)

          this.deleteStatus = false
        })
    },
    ...mapActions('arrivalactualStore', ['deleteTodayArrivalDetails']),

    // ...mapActions('dashboardStore', ['loadArrivalDetailDaySum']),
  },
}
</script>
