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
            <v-row align="center">
              <v-col cols="9">
                <v-text-field
                  v-model="item.customer_id"
                  label="取引先ID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <label>仕入先</label>
                <v-checkbox
                  v-model="item.supplier"
                  readonly
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.customer_name"
                  label="取引先名"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="item.customer_name_eng"
                  label="取引先名(ENG)"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="item.country_id"
                  label="国・地域ID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="item.area_id"
                  label="都市ID"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="item.postcode"
                  label="郵便番号"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.address1"
                  label="住所1"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.address1_eng"
                  label="Address1"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.address2"
                  label="住所2"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="item.address2_eng"
                  label="Address2"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.building"
                  label="建物名"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.building_eng"
                  label="Building"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="item.manager_sei"
                  label="連絡人姓"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.manager_mei"
                  label="連絡人名"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.manager_firstname"
                  label="連絡人姓(ENG)"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.manager_lastname"
                  label="連絡人名(ENG)"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.mobile"
                  label="携帯電話番号"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.tel"
                  label="固定電話番号"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.email"
                  label="Email"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.fax"
                  label="FAX"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.website"
                  label="Website"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.wechat"
                  label="WECHAT"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="item.line"
                  label="LINE"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row> -->
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

export default {
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
    ...mapState('customerStore', ['selectedCustomer']),
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    deleteItem(item) {
      this.apierror.messages = []
      this.submitStatus = true
      this.deleteCustomer(item.id)
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
      this.loadCustomer(this.id)
        .then(() => {
          this.item = { ...this.selectedCustomer }
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
    ...mapActions('customerStore', ['deleteCustomer', 'loadCustomer']),
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
