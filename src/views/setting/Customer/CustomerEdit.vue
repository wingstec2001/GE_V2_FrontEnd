<template>
  <v-card>
    <v-card-title>取引先-編集</v-card-title>
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
              <label for="customer_id">取引先ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="customer_id"
                v-model="$v.CustomerEditForm.customer_id.$model"
                outlined
                dense
                disabled
                :error-messages="idErrors"
                placeholder="取引先ID"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="1"
            >
            </v-col>
            <v-col
              cols="12"
              md="1"
            >
              <label for="supplier">仕入先</label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-checkbox
                id="supplier"
                v-model="CustomerEditForm.supplier"
                hide-details
                outlined
                dense
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="customer_name">取引先名<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="customer_name"
                v-model="$v.CustomerEditForm.customer_name.$model"
                outlined
                dense
                :error-messages="nameErrors"
                placeholder="取引先名（日本語、中国語等）"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="customer_name_eng"
                v-model="CustomerEditForm.customer_name_eng"
                outlined
                dense
                placeholder="取引先名(英語)"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="country_id">国・地域ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                id="country_id"
                v-model="$v.CustomerEditForm.country_id.$model"
                :items="countryIds"
                clearable
                :error-messages="countryErrors"
                outlined
                dense
                placeholder="国・地域ID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="country_name"
                v-model="country_name"
                disabled
                dense
                placeholder="国・地域名"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="area_id">都市ID</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                id="area_id"
                v-model="CustomerEditForm.area_id"
                :items="areaIds"
                clearable
                outlined
                dense
                placeholder="都市ID"
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="area_name"
                v-model="area_name"
                disabled
                dense
                placeholder="都市名"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="postcode">郵便番号</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="postcode"
                v-model="CustomerEditForm.postcode"
                outlined
                dense
                placeholder="郵便番号"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="address1">住所1</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="address1"
                v-model="CustomerEditForm.address1"
                outlined
                dense
                placeholder="住所1（東京都台東区/中国湖北省武漢市）"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="address1_eng">Address1</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="address1_eng"
                v-model="CustomerEditForm.address1_eng"
                outlined
                dense
                placeholder="Address1"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="address2">住所2</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="address2"
                v-model="CustomerEditForm.address2"
                outlined
                dense
                placeholder="住所２（台東区上の１－３－１）"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="address2_eng">Address2</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="address2_eng"
                v-model="CustomerEditForm.address2_eng"
                outlined
                dense
                placeholder="Address2"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="building">建物名</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="building"
                v-model="CustomerEditForm.building"
                outlined
                dense
                placeholder="建物名（千代田ビル３２１室）"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="building_eng">Building</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-text-field
                id="building_eng"
                v-model="CustomerEditForm.building_eng"
                outlined
                dense
                placeholder="Building"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="manager_sei">連絡人姓名</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="manager_sei"
                v-model="CustomerEditForm.manager_sei"
                outlined
                dense
                placeholder="連絡人姓（佐藤・劉）"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            ></v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="manager_mei"
                v-model="CustomerEditForm.manager_mei"
                outlined
                dense
                placeholder="連絡人名（一郎・大剛）"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="manager_sei">連絡人姓名（ENG）</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="manager_firstname"
                v-model="CustomerEditForm.manager_firstname"
                outlined
                dense
                placeholder="連絡人姓(ENG)"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="manager_lastname"
                v-model="CustomerEditForm.manager_lastname"
                outlined
                dense
                placeholder="連絡人名(ENG)"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="mobile">携帯電話番号</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="mobile"
                v-model="CustomerEditForm.mobile"
                outlined
                :error-messages="moblieErrors"
                dense
                placeholder="携帯電話番号"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="tel">固定電話番号</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="tel"
                v-model="CustomerEditForm.tel"
                outlined
                dense
                placeholder="固定電話番号"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="email">E-mail</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="email"
                v-model="CustomerEditForm.email"
                outlined
                :error-messages="emailErrors"
                dense
                placeholder="E-mail"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="fax">FAX</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="fax"
                v-model="CustomerEditForm.fax"
                outlined
                dense
                placeholder="FAX"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="website">Website</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="website"
                v-model="CustomerEditForm.website"
                outlined
                dense
                placeholder="Website"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="wechat">WECHAT</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="wechat"
                v-model="CustomerEditForm.wechat"
                outlined
                dense
                placeholder="WECHAT"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="line">LINE</label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="line"
                v-model="CustomerEditForm.line"
                outlined
                dense
                placeholder="LINE"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              offset-md="5"
              cols="12"
            >
              <v-btn
                color="primary"
                :loading="submitStatus"
                @click="submit(CustomerEditForm)"
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
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  data: () => ({
    submitStatus: false,
    CustomerEditForm: {
      country_id: '',
      customer_id: '',
      customer_name: '',
      customer_name_eng: '',
      area_id: '',
      postcode: '',
      address1: '',
      address1_eng: '',
      address2: '',
      adderss2_eng: '',
      building: '',
      building_eng: '',
      manager_sei: '',
      manager_firstname: '',
      manager_lastname: '',
      mobile: '',
      email: '',
      tel: '',
      fax: '',
      website: '',
      line: '',
      wechat: '',
      supplier: '',
    },
    OriginalForm: {},
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
  }),

  validations: {
    CustomerEditForm: {
      customer_id: {
        required,
      },
      customer_name: {
        required,
      },
      country_id: {
        required,
      },

      // email: {
      //   required,
      //   email,
      // },
      // mobile: {
      //   required,
      //   numeric,
      // },
    },
  },

  computed: {
    ...mapState('countryStore', ['countryMaster', 'countryIds']),
    ...mapState('areaStore', ['areaMaster', 'areaIds']),
    ...mapState('customerStore', ['selectedCustomer']),
    country_name() {
      if (this.countryMaster) {
        const countryKey = this.CustomerEditForm.country_id

        // console.log('CustomerEditForm.country_id', this.countryMaster[countryKey])

        return this.countryMaster[countryKey]
      }

      return ''
    },

    area_name() {
      if (this.areaMaster) {
        const areaKey = this.CustomerEditForm.area_id

        // console.log('CustomerEditForm.area_id', this.areaMaster[areaKey])

        return this.areaMaster[areaKey]
      }

      return ''
    },

    idErrors() {
      const errors = []
      if (!this.$v.CustomerEditForm.customer_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CustomerEditForm.customer_id.required && errors.push('必須項目')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.CustomerEditForm.customer_name.$dirty) return errors

      // eslint-disable-next-line no-unused-expressions
      !this.$v.CustomerEditForm.customer_name.required && errors.push('必須項目')

      return errors
    },
    countryErrors() {
      const errors = []
      if (!this.$v.CustomerEditForm.country_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CustomerEditForm.country_id.required && errors.push('必須項目')

      return errors
    },
    moblieErrors() {
      const errors = []

      // if (!this.$v.CustomerEditForm.mobile.$dirty) return errors
      // // eslint-disable-next-line no-unused-expressions
      // !this.$v.CustomerEditForm.mobile.required && errors.push('必須項目')
      // // eslint-disable-next-line no-unused-expressions
      // !this.$v.CustomerEditForm.mobile.numeric && errors.push('必須数字')

      return errors
    },
    emailErrors() {
      const errors = []

      // if (!this.$v.CustomerEditForm.email.$dirty) return errors
      // // eslint-disable-next-line no-unused-expressions
      // !this.$v.CustomerEditForm.email.required && errors.push('必須項目')
      // // eslint-disable-next-line no-unused-expressions
      // !this.$v.CustomerEditForm.email.email && errors.push('正しくメールアドレスを入力してください。')

      return errors
    },
  },
  created() {
    this.loadCountryIds()
    this.loadAreaIds()
    this.loadData()
  },
  methods: {
    ...mapActions('customerStore', ['loadCustomer', 'editCustomer']),
    ...mapActions('countryStore', ['loadCountryIds']),
    ...mapActions('areaStore', ['loadAreaIds']),
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadCustomer(this.$route.params.id)
        .then(() => {
          this.CustomerEditForm = this.selectedCustomer
          this.OriginalForm = JSON.stringify(this.CustomerEditForm)
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
        })
    },
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.CustomerEditForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }
      this.jumpToListPage()
    },
    jumpToListPage() {
      this.$router.push({ path: '/customer-list', query: this.$route.params.query ?? {} })
    },
    submit(CustomerEditForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        this.editCustomer(CustomerEditForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false

            this.apierror.status = error.response.data.status
            this.apierror.code = error.response.data.code
            this.apierror.messages = error.response.data.message

            console.log('apierror', this.apierror)
          })
      } else {
        console.log('error submit!!')
      }
    },
  },
}
</script>
