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
            style="color: red"
          >ペレット実績-削除</span>
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
              <v-col cols="4">
                <v-text-field
                  v-model="item.id"
                  label="No."
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="item.produced_dt"
                  label="生産日時"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="item.route_id"
                  label="ルーターID"
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
              <v-col cols="6">
                <v-text-field
                  v-model="item.product_name"
                  label="ペレット名"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <WeightInput
                  v-model="item.produced_weight"
                  label="生産量"
                  readonly
                ></WeightInput>
                <!-- <v-text-field
                  v-model="item.produced_weight"
                  label="生産量"
                  readonly
                  suffix="kg"
                ></v-text-field> -->
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
  props: ['icon', 'id'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  computed: {
    ...mapState('productionStore', ['selectedProduction']),
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('productionStore', ['deleteProduction', 'loadProduction']),
    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteProduction(item.id)
        .then(() => {
          this.submitStatus = false
          this.dialog = false
          this.$emit('deleted')
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },
    openForm() {
      this.setOverlayStatus(true)
      this.loadProduction(this.id)
        .then(() => {
          this.item = { ...this.selectedProduction }
          this.item.produced_dt = this.selectedProduction.produced_dt.substring(0, 16)
          this.item.product_name = this.selectedProduction.product[0]
            ? this.selectedProduction.product[0].product_name
            : ''
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
      this.item = {}
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
