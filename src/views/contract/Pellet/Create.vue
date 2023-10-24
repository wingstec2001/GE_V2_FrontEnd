<template>
  <v-card>
    <v-card-title>(契約)ペレット―新規</v-card-title>
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
    </template>
    <v-spacer></v-spacer>
    <v-form class="ma-6">
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="text-right"
            for="contract_date"
          >契約日<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="$v.ContractForm.contract_date.$model"
                :error-messages="contractDateErrors"
                hide-details="auto"
                v-bind="attrs"
                outlined
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="ContractForm.contract_date"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <!-- <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="text-right"
            for="contractID"
          >契約ID<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            id="contract_id"
            v-model="$v.ContractForm.contract_id.$model"
            outlined
            dense
            placeholder="契約ID"
            :error-messages="contractIdErrors"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row> -->
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <!-- <label for="customer_id">取引先ID<span style="color: red">*</span></label> -->
          <label for="customer_id">取引先ID</label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="ContractForm.customer_id"
            :items="customerIds"
            clearable
            outlined
            dense
            placeholder="取引先ID"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            id="customer_name"
            v-model="customer_name"
            disabled
            dense
            placeholder="取引先名"
            hide-details="auto"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="contract_name">契約名<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            id="contract_name"
            v-model="$v.ContractForm.contract_name.$model"
            outlined
            dense
            placeholder="契約名"
            :error-messages="contractNameErrors"
            :counter="100"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>

      <div style="padding: 12px; margin: 12px 0px; border: 1px solid #ccc">
        <v-row>
          <v-col
            cols="12"
            style="text-align: right; padding: 12px 12px 0px"
          >
            <v-btn
              outlined
              @click="addContract"
            >
              <v-icon class="me-1">
                {{ icons.mdiPlus }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12">
            <v-data-table
              ref="Contracts"
              class="class-on-data-table elevation-1"
              :headers="contractHeaders"
              :items="ContractForm.contract_details"
              fixed-header
            >
              <template v-slot:[`item.product_id`]="{ item }">
                <v-autocomplete
                  v-model="item.product_id"
                  :items="productIds"
                  :error-messages="productIdErrors(item)"
                  hide-details="auto"
                  outlined
                  dense
                  @update:search-input="setProducName($event, item)"
                ></v-autocomplete>
              </template>
              <template v-slot:[`item.contract_goods_name`]="{ item }">
                <v-text-field
                  v-model="item.contract_goods_name"
                  :error-messages="contractGoodsNameErrors(item)"
                  hide-details="auto"
                  outlined
                  dense
                ></v-text-field>
              </template>
              <template v-slot:[`item.contract_weight`]="{ item }">
                <weight-input
                  v-model="item.contract_weight"
                  :outlined="true"
                  :error-messages="contractWeightErrors(item)"
                ></weight-input>
                <!-- <v-text-field
                  v-model="item.contract_weight"
                  :error-messages="contractWeightErrors(item)"
                  prefix="kg "
                  hide-details="auto"
                  outlined
                  reverse
                  dense
                  @click="handleWeight($event)"
                  @input="handleWeightInput($event, item)"
                ></v-text-field> -->
              </template>
              <template v-slot:[`item.contract_price`]="{ item }">
                <price-input
                  v-model="item.contract_price"
                  :outlined="true"
                  :error-messages="contractPriceErrors(item)"
                ></price-input>
                <!-- <v-text-field
                  v-model="item.contract_price"
                  :error-messages="contractPriceErrors(item)"
                  prefix="¥"
                  hide-details="auto"
                  outlined
                  dense
                  @click="handlePrice($event)"
                  @input="handlePriceInput($event, item)"
                ></v-text-field> -->
              </template>
              <template v-slot:[`item.contract_note`]="{ item }">
                <v-text-field
                  v-model="item.contract_note"
                  name="contract_note"
                  height="40px"
                  :counter="100"
                  :error-messages="noteErrors(item)"
                  dense
                  placeholder="備考"
                  hide-details="auto"
                ></v-text-field>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-row>
                  <v-col style="padding: 0px">
                    <v-icon
                      class="mr-2"
                      color="red"
                      @click="removeContract(item)"
                    >
                      {{ icons.mdiMinusCircle }}
                    </v-icon>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            style="text-align: right; padding: 0px 12px 12px"
          >
            <v-btn
              outlined
              @click="addContract"
            >
              <v-icon class="me-1">
                {{ icons.mdiPlus }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col
          offset-md="5"
          cols="12"
        >
          <v-btn
            color="primary"
            :loading="submitStatus"
            @click="submit(ContractForm)"
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
  </v-card>
</template>

<script>
/* eslint-disable*/
import { mdiPlus, mdiPencil, mdiMinusCircle } from '@mdi/js'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import Sortable from 'sortablejs'
import { v4 } from 'uuid'
import WeightInput from '@/components/WeightInputComponent.vue'
import PriceInput from '@/components/PriceInputComponent.vue'
import { helpers } from '@vuelidate/validators'
/* eslint-disable*/
const allowdChar = helpers.regex(/^[0-9a-zA-Z]+[0-9a-zA-Z-_()]*$/)
export default {
  components: {
    WeightInput,
    PriceInput,
  },
  data: () => ({
    id: '',
    icons: {
      mdiPlus,
      mdiPencil,
      mdiMinusCircle,
    },
    changeFlag: false,
    dateMenu: '',
    contracts: [],
    ContractForm: {
      contract_id: '',
      contract_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      customer_id: '',
      contract_name: '',
      contract_details: [],
    },
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    contractHeaders: [
      {
        text: 'No.',
        value: 'detail_id',
        sortable: false,
        align: 'left',
        width: '3%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        value: 'product_id',
        sortable: false,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '契約商品名',
        value: 'contract_goods_name',
        sortable: false,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'contract_weight',
        sortable: false,
        align: 'right',
        width: '15%',
        fixed: true,
      },
      {
        text: '契約金額',
        value: 'contract_price',
        sortable: false,
        align: 'right',
        width: '15%',
        fixed: true,
      },
      {
        text: '備考',
        value: 'contract_note',
        sortable: false,
        align: 'center',
        width: '27%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '2%',
        fixed: true,
      },
    ],
    submitStatus: false,
  }),
  validations: {
    ContractForm: {
      // contract_id: {
      //   required,
      //   maxLength: maxLength(20),
      //   allowdChar,
      // },
      contract_date: {
        required,
      },
      contract_name: {
        required,
        maxLength: maxLength(100),
      },
   
 
      contract_details: {
        $each: {
          product_id: {
            required,
          },
          contract_goods_name: {
            required,
          },
          contract_weight: {
            required,
            numeric,
          },
          contract_price: {
            required,
            numeric,
          },
          contract_note:{
            maxLength:maxLength(100),
          }
        },
      },
    },
  },
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    ...mapState('customerStore', ['customerMaster', 'customerIds']),

    customer_name() {
      if (this.customerMaster) {
        const customerKey = this.ContractForm.customer_id
        return this.customerMaster[customerKey]
      }

      return ''
    },
    contractDateErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_date.required && errors.push('必須項目')

      return errors
    },
    contractIdErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_id.required && errors.push('必須項目')

      !this.$v.ContractForm.contract_id.allowdChar && errors.push('A-Za-z0-9-_()を入力してください。')

      return errors
    },
    contractNameErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_name.$dirty) return errors
     
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_name.required && errors.push('必須項目')

       // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_name.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
    // customerIdErrors() {
    //   const errors = []
    //   if (!this.$v.ContractForm.customer_id.$dirty) return errors
    //   // eslint-disable-next-line no-unused-expressions
    //   !this.$v.ContractForm.customer_id.required && errors.push('必須項目')

    //   return errors
    // },
    productIdErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractForm.contract_details.$each[index].product_id.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].product_id.required && errors.push('必須項目')
        }

        return errors
      }
    },
    contractGoodsNameErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractForm.contract_details.$each[index].contract_goods_name.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_goods_name.required && errors.push('必須項目')
        }

        return errors
      }
    },
    contractWeightErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractForm.contract_details.$each[index].contract_weight.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_weight.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_weight.numeric && errors.push('必須数字')
        }

        return errors
      }
    },
    contractPriceErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractForm.contract_details.$each[index].contract_price.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_price.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_price.numeric && errors.push('必須数字')
        }

        return errors
      }
    },

    noteErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractForm.contract_details.$each[index].contract_note.$dirty) return errors
          
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractForm.contract_details.$each[index].contract_note.maxLength && errors.push('100文字以内にしてください。')
        }

        return errors
      }
    },
  },
  watch: {
    ContractForm: {
      handler() {
        this.changeFlag = true

      },
      deep: true,
    },
  },
  mounted() {
    this.sortContracts()
    this.loadProductIds()
    this.loadCustomerIds()
  },
  methods: {
    ...mapActions('contractStore', ['createPelletContract']),
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),
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
    addContract() {
      const detailId = this.ContractForm.contract_details.length + 1
      this.ContractForm.contract_details.push({
        id: v4(),
        detail_id: detailId,
        product_id: '',
        contract_goods_name: '',
        contract_weight: 0,
        contract_price: 0,
        contract_note: '',
      })
    },
    removeContract(item) {
      
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        this.ContractForm.contract_details.splice(this.ContractForm.contract_details.indexOf(item), 1)
        const orderContracts = []
        this.ContractForm.contract_details.forEach((v, i) => {
          orderContracts[i] = v
          orderContracts[i].detail_id = i + 1
  
        })

      } else {
        console.log('removeContract-----> item does not exist')
      }
    },
    setProductId(item, productId) {
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].product_id = productId
        /* eslint-disable */
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].contract_goods_name =
          this.productMaster[productId]
      } else {
        console.log('setProductId-----> item does not exist')
      }
    },
    setProducName(e, item) {
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        /* eslint-disable */
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].contract_goods_name =
          this.productMaster[e]
      } else {
        console.log('setProductId-----> item does not exist')
      }
    },
    handleWeight(event) {
      event.target.select()
    },
    handleWeightInput(e, item) {
      const formatValue = e.replace(/,/g, '')
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        /* eslint-disable */
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].contract_weight =
          formatValue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        console.log('handlePriceInput-----> item does not exist')
      }
    },
    handlePrice(event) {
      event.target.select()
    },
    handlePriceInput(e, item) {
      const formatValue = e.replace(/,/g, '')
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        /* eslint-disable */
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].contract_price =
          formatValue.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        console.log('handlePriceInput-----> item does not exist')
      }
    },
    sortContracts() {
      const el = this.$refs.Contracts.$el.querySelectorAll('.v-data-table__wrapper > table> tbody')[0]
      Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        sort: true,
        animation: 150,
        group: {
          name: 'Contract',
          pull: false,
          put: false,
        },
        setData(dataTransfer, dragEl) {
          dataTransfer.setData('Text', dragEl.textContent)
        },
        onEnd: evt => {
          console.log(evt.oldIndex, evt.newIndex)
          const item = this.ContractForm.contract_details[evt.oldIndex]
          console.log(item, this.ContractForm.contract_details)
          this.ContractForm.contract_details.splice(evt.oldIndex, 1)
          this.ContractForm.contract_details.splice(evt.newIndex, 0, item)

          const orderContracts = []
          this.ContractForm.contract_details.forEach((v, i) => {
            orderContracts[i] = v
            orderContracts[i].detail_id = i + 1
            console.log(i, v.detail_id, v.detail_id)
          })
        },
      })
    },
    jumpToListPage() {
      this.$router.push({ path: '/contract-pellet-list', query: this.$route.params.query ?? {} })
    },

    submit(ContractForm) {
      if (ContractForm.contract_details.length <= 0) {
        alert('明細行を入力してください。')
        return
      }
  
      var hasDuplicate = false;
      ContractForm.contract_details.map(v => v.product_id).sort().sort((a, b) => {
        if (a === b) hasDuplicate = true
      })
      
      if (hasDuplicate == true ) {
        this.apierror.messages = []
        this.apierror.status = 'error'
        this.apierror.messages.push('ペレットIDが重複です。')
        return
      }

      var hasWeightZero = false;
      ContractForm.contract_details.forEach(c => {
        if(c.contract_weight == 0) hasWeightZero = true 
      })

      if (hasWeightZero == true) {
        this.apierror.status = 'error'
        this.apierror.messages.push('重量は0です。')
        return
      }

      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...ContractForm }
        submitForm.contract_details = submitForm.contract_details.map(c => ({
          detail_id: c.detail_id,
          product_id: c.product_id,
          contract_goods_name: c.contract_goods_name,
          contract_weight: parseInt(c.contract_weight.replaceAll(',', ''), 10),
          contract_price: parseInt(c.contract_price.replaceAll(',', ''), 10),
          contract_note: c.contract_note,
        }))
     
        this.createPelletContract(submitForm)
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
        console.log('error submit!!')
      }
    },
  },
}
</script>
<style scoped>
.v-card {
  border: 1px solid #ccc;
}
</style>
