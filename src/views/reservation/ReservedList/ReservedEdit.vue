<template>
  <v-card>
    <v-card-title>予約実績-編集</v-card-title>
    <template>
      <v-spacer></v-spacer>
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
      <template>
        <v-spacer></v-spacer>
        <v-form class="ma-6">
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_id">予約ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <label for="reserve_id">{{ ReservedForm.reserve_id }}</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="customer_id">取引先ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <label for="reserve_id">{{ ReservedForm.customer_id }}</label>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserved_dt">予約日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <label>{{ ReservedForm.reserved_dt.substring(0, 10) }}</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserved_note">連絡事項</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="ReservedForm.reserved_note"
                name="reserve_desc"
                outlined
                dense
                placeholder="説明"
                hide-details
                disabled
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserved_count">予約商品数</label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserved_count">{{
                ReservedForm.reserved_count.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
              }}</label>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="contract_status">契約状態</label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                id="contract_status"
                v-model="ReservedForm.contract_status"
                :items="statuses"
                outlined
                dense
                placeholder="契約状態"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit(ReservedForm)"
              >
                Submit
              </v-btn>
              <v-btn
                class="mx-2"
                outlined
                @click="cancelClick"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </template>
  </v-card>
</template>

<script>
import { mdiPlus, mdiCalendar } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  components: {},
  data: () => ({
    icons: {
      mdiPlus,
      mdiCalendar,
    },
    statuses: [
      { text: '承認待', value: 0 },
      { text: '承認済', value: 1 },
      { text: '契約済', value: 2 },
      { text: '出荷済', value: 3 },
      { text: '却下', value: 4 },
    ],
    submitStatus: false,
    changeFlag: false,
    apierror: [],
    ReservedForm: {
      reserve_id: '',
      customer_id: '',
      reserved_dt: '',
      reserved_note: '',
      reserved_count: '',
      contract_status: '',
    },
  }),
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('reservedStore', ['selectedReserved']),
  },
  watch: {
    ReservedForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  mounted() {
    this.setOverlayStatus(true)
    this.loadReserved(this.$route.params.id)
      .then(() => {
        this.ReservedForm = { ...this.selectedReserved }
        this.setOverlayStatus(false)
      })
      .catch(error => {
        this.apierror.status = error.response.data.status
        this.apierror.code = error.response.data.code
        this.apierror.messages.push(error.response.data.message)
        this.setOverlayStatus(false)
      })
  },
  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('reservedStore', ['editReserved', 'loadReserved']),
    ...mapMutations('app', ['setOverlayStatus']),
    cancelClick() {
      if (this.changeFlag) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },
    jumpToListPage() {
      this.$router.push({ path: '/reservation-list', query: this.$route.params.query ?? {} })
    },
    submit(ReservedForm) {
      this.apierror.messages = []
      this.submitStatus = true
      this.editReserved(ReservedForm)
        .then(() => {
          this.submitStatus = false
          this.jumpToListPage()
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
        })
    },
  },
}
</script>
