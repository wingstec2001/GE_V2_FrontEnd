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
                  v-model="item.bid_id"
                  hide-details="auto"
                  label="入札ID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.bid_name"
                  hide-details="auto"
                  label="入札商品名"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.product_id"
                  hide-details="auto"
                  label="ペレットID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="item.bid_max_c_cnt"
                  hide-details="auto"
                  label="上限"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col
                cols="4"
                align-self="end"
              >
                <WeightInput
                  v-model="item.bid_weight"
                  label="商品重量"
                  readonly
                ></WeightInput>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.bid_open_dt"
                  hide-details="auto"
                  label="開始日"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.bid_comp_dt"
                  hide-details="auto"
                  label="締切日"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="item.bid_desc"
                  hide-details="auto"
                  label="説明"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(url, index) in fileUrls"
                :key="index"
                cols="4"
                md="2"
              >
                <v-card height="100px">
                  <v-img
                    :src="url"
                    height="100px"
                    contain
                  ></v-img>
                </v-card>
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
import { mdiPlus, mdiCalendar } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

// import ImageSelected from '@/components/ImageSelectedComponent.vue'

export default {
  components: {
    WeightInput,

    // ImageSelected,
  },
  props: ['icon', 'id'],
  data: () => ({
    icons: {
      mdiPlus,
      mdiCalendar,
    },
    submitStatus: false,
    dialog: false,
    fileUrls: [],
    item: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),
  computed: {
    ...mapState('bidStore', ['selectedBid']),
  },
  methods: {
    ...mapActions('bidStore', ['deleteBid', 'loadBid']),
    ...mapMutations('app', ['setOverlayStatus']),
    deleteItem(item) {
      this.apierror.messages = []

      this.submitStatus = true
      this.deleteBid(item.id)
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
      this.loadBid(this.id)
        .then(() => {
          this.item = { ...this.selectedBid }
          this.item.bid_open_dt = this.selectedBid.bid_open_dt.substring(0, 10)
          this.item.bid_comp_dt = this.selectedBid.bid_comp_dt.substring(0, 10)
          this.fileUrls = this.selectedBid.reserve_images.map(i => i.reserve_image)

          this.setOverlayStatus(false)
          this.dialog = true
        })
        .catch(error => {
          this.apierror.status = 'error'
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
          this.dialog = true

          // console.log('apierror', this.apierror)
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
