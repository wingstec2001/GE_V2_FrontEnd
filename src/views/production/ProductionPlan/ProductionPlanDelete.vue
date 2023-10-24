<template>
  <div justify="center">
    <v-icon
      class="mr-2"
      small
      @click.stop="dialog = true"
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
          >削除</span>
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
              <v-col cols="12">
                <v-text-field
                  v-model="item.plan_date"
                  label="生産計画日"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.route_id"
                  label="ルーターID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.product_id"
                  label="ペレットID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.product_name"
                  label="ペレット名"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.plan_weight"
                  label="生産量"
                  readonly
                  suffix="kg"
                ></v-text-field>
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['icon', 'item'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  methods: {
    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteProductionPlan(item.id)
        .then(() => {
          this.submitStatus = false
          this.dialog = false
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
        })
    },
    ...mapActions('productionplanStore', ['deleteProductionPlan']),
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
