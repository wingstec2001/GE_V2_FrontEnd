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
              <v-col cols="12">
                <v-text-field
                  v-model="item.product_description"
                  label="説明"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <label>イメージ</label>
                <v-img
                  v-model="item.product_img"
                  :src="item.product_img ? `${item.product_img}` : require('@/assets/images/noimage.jpg')"
                  width="120px"
                  height="90px"
                  contain
                ></v-img>
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
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  props: ['icon', 'id'],
  data: () => ({
    submitStatus: false,
    url: null,
    dialog: false,
    item: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  computed: {
    ...mapState('productStore', ['selectedProduct']),
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('productStore', ['deleteProduct', 'loadProduct']),

    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteProduct(item.id)
        .then(() => {
          this.submitStatus = false
          this.dialog = false
          this.$emit('deleted')
        })
        .catch(() => {
          this.submitStatus = false
          this.apierror.status = 'error'
          this.apierror.messages.push('使用中か削除済みです。')
          console.log('apierror', this.apierror)
        })
    },

    openForm() {
      this.setOverlayStatus(true)
      this.loadProduct(this.id)
        .then(() => {
          this.item = { ...this.selectedProduct }
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
