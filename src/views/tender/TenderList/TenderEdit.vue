<template>
  <v-card>
    <v-card-title>入札商品-編集</v-card-title>
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
              <label for="bid_id">入札商品ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <label for="bid_id">{{ BidForm.bid_id }}</label>
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
                v-model="BidForm.product_id"
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
              <label for="bid_name">入札商品名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="bid_id"
                v-model="$v.BidForm.bid_name.$model"
                outlined
                dense
                placeholder="入札商品名"
                :error-messages="bidNamedErrors"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="bid_desc">説明</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="BidForm.bid_desc"
                :error-messages="descErrors"
                name="bid_desc"
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
              <label for="bid_weight">商品重量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <WeightInput
                v-model="BidForm.bid_weight"
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
              <label for="bid_min_price">商品単価<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <price-input
                v-model="BidForm.bid_min_price"
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
              <label for="bid_max_c_cnt">上限<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-text-field
                id="bid_max_c_cnt"
                v-model="BidForm.bid_max_c_cnt"
                :error-messages="maximumErrors"
                type="number"
                outlined
                dense
                placeholder="上限"
                hide-details="auto"
                @click="handleClick($event)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="bid_open_dt">公開開始日</label>
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
                    v-model="BidForm.bid_open_dt"
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
                  v-model="BidForm.bid_open_dt"
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
              <label for="firstname">入札締切日<span style="color: red">*</span></label>
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
                    v-model="BidForm.bid_comp_dt"
                    :error-messages="compDtErrors"
                    outlined
                    dense
                    placeholder="入札締切日"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="BidForm.bid_comp_dt"
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
              <image-selected v-model="BidForm.bid_images"></image-selected>
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
                @click="submit(BidForm)"
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
    BidForm: {
      product_id: '',
      bid_id: '',
      bid_name: '',
      bid_weight: '',
      bid_min_price: '0',
      bid_max_c_cnt: '10',
      bid_desc: '',
      bid_open_dt: '',
      bid_comp_dt: '',
      bid_images: [],
    },
  }),
  validations: {
    BidForm: {
      product_id: {
        required,
      },
      bid_name: {
        required,
      },
      bid_weight: {
        required,
        numeric,
      },
      bid_min_price: {
        required,
        numeric,
      },
      bid_max_c_cnt: {
        required,
        numeric,
      },
      bid_open_dt: {
        required,
      },
      bid_comp_dt: {
        required,
      },
      bid_desc: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('bidStore', ['selectedBid']),
    bidNamedErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_name.required && errors.push('必須項目')

      return errors
    },
    productIdErrors() {
      const errors = []
      if (!this.$v.BidForm.product_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.product_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_weight.numeric && errors.push('必須数字')

      return errors
    },
    PriceErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_min_price.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_min_price.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_min_price.numeric && errors.push('必須数字')

      return errors
    },
    maximumErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_max_c_cnt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_max_c_cnt.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_max_c_cnt.numeric && errors.push('必須数字')

      return errors
    },
    descErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_desc.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_desc.maxLength && errors.push('255文字以下でなければなりません。')

      return errors
    },
    openDtErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_open_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_open_dt.required && errors.push('必須項目')

      return errors
    },
    compDtErrors() {
      const errors = []
      if (!this.$v.BidForm.bid_comp_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.BidForm.bid_comp_dt.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    BidForm: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  mounted() {
    this.setOverlayStatus(true)
    this.loadProductIds()
    this.loadBid(this.$route.params.id).then(() => {
      this.BidForm = { ...this.selectedBid }
      this.BidForm.bid_open_dt = this.selectedBid.bid_open_dt.substring(0, 10)
      this.BidForm.bid_comp_dt = this.selectedBid.bid_comp_dt.substring(0, 10)

      // console.log(this.selectedBid.reserve_images, typeof this.selectedBid.reserve_images)
      this.BidForm.bid_images = this.selectedBid.reserve_images.map(i => i.reserve_image)

      this.setOverlayStatus(false)
    })
  },
  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('bidStore', ['loadBid', 'editBid']),
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
      this.$router.push({ path: '/tender-list', query: this.$route.params.query ?? {} })
    },
    submit(BidForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editBid(BidForm)
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
      } else {
        console.log('error submit')
      }
    },
  },
}
</script>
