<template>
  <v-card>
    <v-card-title>予約商品-新規</v-card-title>
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
              <label for="reserve_id">{{ ReserveForm.reserve_id }}</label>
              <!-- <v-text-field
                id="reserve_id"
                v-model="$v.ReserveForm.reserve_id.$model"
                readonly
                :error-messages="reserveIdErrors"
                hide-details="auto"
              ></v-text-field> -->
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="product_id">ペレットID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                id="product_id"
                v-model="ReserveForm.product_id"
                :error-messages="productIdErrors"
                :items="productIds"
                outlined
                clearable
                dense
                placeholder="ペレットID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_name">予約商品名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="reserve_id"
                v-model="$v.ReserveForm.reserve_name.$model"
                outlined
                dense
                placeholder="予約商品名"
                :error-messages="reserveNamedErrors"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_desc">説明</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="ReserveForm.reserve_desc"
                :error-messages="descErrors"
                name="reserve_desc"
                outlined
                dense
                placeholder="説明"
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_weight">商品重量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <WeightInput
                v-model="ReserveForm.reserve_weight"
                :error-messages="weightErrors"
                placeholder="商品重量"
                :outlined="true"
              ></WeightInput>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_price">商品単価<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <price-input
                v-model="ReserveForm.reserve_price"
                :outlined="true"
                :error-messages="PriceErrors"
              ></price-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reserve_maximum">上限<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
                id="reserve_maximum"
                v-model="ReserveForm.reserve_maximum"
                :error-messages="maximumErrors"
                type="number"
                outlined
                dense
                placeholder="上限"
                hide-details="auto"
                @click="handleClick($event)"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="9">
              <label>上限数量をいれてください。0：無制限</label>
            </v-col> -->
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="reseve_open_dt">公開開始日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                :nudge-right="40"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ReserveForm.reserve_open_dt"
                    :error-messages="openDtErrors"
                    outlined
                    dense
                    placeholder="公開開始日"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="ReserveForm.reserve_open_dt"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="firstname">予約締切日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                :nudge-right="40"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="ReserveForm.reserve_comp_dt"
                    :error-messages="compDtErrors"
                    outlined
                    dense
                    placeholder="予約締切日"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="ReserveForm.reserve_comp_dt"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="note">イメージ</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <image-selected v-model="ReserveForm.reserve_images"></image-selected>
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
                @click="submit(ReserveForm)"
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
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { mdiPlus, mdiCalendar } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'
import PriceInput from '@/components/PriceInputComponent.vue'
import ImageSelected from '@/components/ImageSelectedComponent.vue'

export default {
  components: {
    WeightInput,
    PriceInput,
    ImageSelected,
  },
  data: () => ({
    icons: {
      mdiPlus,
      mdiCalendar,
    },
    submitStatus: false,
    changeFlag: false,
    menu: false,
    menu1: false,
    apierror: [],
    ReserveForm: {
      product_id: '',
      reserve_id: '',
      reserve_name: '',
      reserve_weight: '',
      reserve_price: '0',
      reserve_maximum: '10',
      reserve_desc: '',
      reserve_open_dt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),

      // reserve_comp_dt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      reserve_comp_dt: new Date(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000).setMonth(new Date().getMonth() + 1),
      )
        .toISOString()
        .substring(0, 10),
      reserve_images: [],
    },
  }),
  validations: {
    ReserveForm: {
      product_id: {
        required,
      },
      reserve_id: {
        required,
      },
      reserve_name: {
        required,
      },
      reserve_weight: {
        required,
        numeric,
      },
      reserve_price: {
        required,
        numeric,
      },
      reserve_maximum: {
        required,
        numeric,
      },
      reserve_open_dt: {
        required,
      },
      reserve_comp_dt: {
        required,
      },
      reserve_desc: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    reserveIdErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_id.required && errors.push('必須項目')

      return errors
    },
    reserveNamedErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_name.required && errors.push('必須項目')

      return errors
    },
    productIdErrors() {
      const errors = []
      if (!this.$v.ReserveForm.product_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.product_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_weight.numeric && errors.push('必須数字')

      return errors
    },
    PriceErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_price.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_price.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_price.numeric && errors.push('必須数字')

      return errors
    },
    maximumErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_maximum.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_maximum.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_maximum.numeric && errors.push('必須数字')

      return errors
    },
    descErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_desc.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_desc.maxLength && errors.push('100文字以内にして下さい。')

      return errors
    },
    openDtErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_open_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_open_dt.required && errors.push('必須項目')

      return errors
    },
    compDtErrors() {
      const errors = []
      if (!this.$v.ReserveForm.reserve_comp_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ReserveForm.reserve_comp_dt.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    ReserveForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  mounted() {
    this.setOverlayStatus(true)
    this.loadProductIds().then(() => {
      this.setOverlayStatus(false)
    })
    this.ReserveForm.reserve_id = this.$getUniqueId(10, 'R')
  },
  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('reserveStore', ['createReserve']),
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
    handleClick(event) {
      event.target.select()
    },
    jumpToListPage() {
      this.$router.push({ path: '/reservation-list', query: this.$route.params.query ?? {} })
    },
    submit(ReserveForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.createReserve(ReserveForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false
            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)

            console.log('apierror', this.apierror)
          })
      } else {
        console.log('error submit')
      }
    },
  },
}
</script>
