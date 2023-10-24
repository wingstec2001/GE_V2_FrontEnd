<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span
          class="text-h6"
          style="color: red"
        >粉砕実績-削除V2</span>
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
                for="crushed_id"
              >{{ item.crushed_id }}</label>
            </v-col>
            <!-- <v-col cols="5">
              <label class="text-h6" for="crush_date">粉砕日</label>
            </v-col>
            <v-col cols="7">
              <label class="text-h6" for="crush_date">{{ crush_date }}</label>
            </v-col> -->
            <v-col cols="5">
              <label
                class="text-h7"
                for="material_id"
              >材料ID</label>
            </v-col>
            <v-col cols="7">
              <label
                class="text-h7"
                for="material_id"
              >{{ item.material_id }}</label>
            </v-col>
            <v-col cols="5">
              <label
                class="text-h7"
                for="actual_weight"
              >粉砕重量</label>
            </v-col>
            <v-col cols="7">
              <label
                class="text-h7"
                for="actual_weight"
              >{{ item.actual_weight }}</label>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          :loading="submitStatus"
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
</template>

<script>
import { mdiCalendar } from '@mdi/js'
import { mapActions } from 'vuex'

export default {
  props: ['item'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    submitStatus: false,
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    crush_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
  }),
  methods: {
    ...mapActions('dashboardStore', ['deleteCrushingActual']),

    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteCrushingActual(item.crushed_id)
        .then(() => {
          this.submitStatus = false
          this.$emit('success')

          // this.loadCrushingDaySum()
          this.dialog = false
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },

    openForm() {
      // this.loadCrushingActual(this.item.id).then(() => {
      //   this.CrushForm = this.selectedCrushingActual
      // })
      this.dialog = true
    },
  },
}
</script>
