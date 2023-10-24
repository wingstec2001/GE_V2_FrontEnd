<template>
  <div justify="center">
    <v-icon
      class="mr-2"
      small
      @click.stop="openForm"
    >
      {{ icon }}
    </v-icon>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
          >ペレット入荷<span style="color: red">(削除)</span>
          </span>
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
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.aad_id"
                  label="No."
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.arrival_date"
                  label="入荷日時"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.product_id"
                  label="ペレットID"
                  readonly
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="6">
                <v-text-field
                  v-model="item.material_name"
                  label="材料名"
                  readonly
                ></v-text-field>
              </v-col> -->
            </v-row>
            <v-row>
              <v-col cols="6">
                <WeightInput
                  v-model="item.arrival_weight"
                  label="入荷重量"
                  readonly
                ></WeightInput>
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
            @click="closeForm()"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  props: ['icon', 'aadId'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
      customer: {},
    },

    // actual_ampm_items: [
    //   { text: '午前', value: 0 },
    //   { text: '午後', value: 1 },
    // ],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  computed: {
    ...mapState('arrivalactualStore', ['selectedArrivalPellet']),
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('arrivalactualStore', ['deleteArrivalPellet', 'loadArrivalPellet']),
    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteArrivalPellet(item.aad_id)
        .then(() => {
          this.submitStatus = false
          this.dialog = false
          this.$emit('deleted')
        })
        .catch(error => {
          console.log('error:', error.response.data.message)
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },
    openForm() {
      this.setOverlayStatus(true)

      this.loadArrivalPellet(this.aadId)
        .then(() => {
          this.item = { ...this.selectedArrivalPellet }

          this.setOverlayStatus(false)
          this.dialog = true
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
          this.dialog = true
        })
    },
    closeForm() {
      this.$emit('cancel')
      this.apierror.messages = []
      this.dialog = false
      this.item = {
        customer: {},
      }
    },
  },
}
</script>
<style scoped>
/* .theme--light.v-label--is-disabled {
  color: rgba(241, 104, 12, 0.87)  !important;
}
.theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
    color: rgba(15, 218, 140, 0.87)  !important;
} */
</style>
