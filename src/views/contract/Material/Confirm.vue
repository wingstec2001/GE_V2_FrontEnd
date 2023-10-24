<template>
  <v-card>
    <v-card-title>契約(粉砕済) ― 編集Confirm</v-card-title>
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
            for="contractID"
          >契約ID<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            id="contract_id"
            v-model="ContractEditForm.id"
            outlined
            dense
            placeholder="契約ID"
            disabled
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
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
                v-model="$v.ContractEditForm.contract_date.$model"
                :error-messages="contractDateErrors"
                placeholder="契約日"
                hide-details="auto"
                v-bind="attrs"
                outlined
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="ContractEditForm.contract_date"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
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
            v-model="$v.ContractEditForm.contract_name.$model"
            outlined
            dense
            placeholder="契約名"
            :error-messages="contractNameErrors"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <!-- <label for="customer_id">取引先ID<span style="color:red">*</span></label> -->
          <label for="customer_id">取引先ID</label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="ContractEditForm.customer_id"
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
          <label for="contract_status">契約状態<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="$v.ContractEditForm.contract_status.$model"
            :items="contractStatuses"
            outlined
            dense
            :error-messages="contractStatusErrors"
            hide-details="auto"
          ></v-autocomplete>
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
              :items="ContractEditForm.contract_details"
              fixed-header
            >
              <template v-slot:[`item.material_id`]="{ item }">
                <v-autocomplete
                  v-model="item.material_id"
                  :items="materialIds"
                  :error-messages="materialIdErrors(item)"
                  hide-details="auto"
                  outlined
                  dense
                  @focus="setEditStatus"
                  @update:search-input="setMaterialName($event, item)"
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
                <v-textarea
                  v-model="item.contract_note"
                  name="contract_note"
                  height="40px"
                  outlined
                  dense
                  placeholder="備考"
                  hide-details="auto"
                ></v-textarea>
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
            @click="submit(ContractEditForm)"
          >
            Submit
          </v-btn>
          <v-btn
            class="mx-2"
            outlinedcancel-click
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
import { mdiPlus, mdiPencil, mdiMinusCircle } from '@mdi/js'

import { required, maxLength, numeric } from 'vuelidate/lib/validators'

import { mapActions, mapMutations, mapState } from 'vuex'
import Sortable from 'sortablejs'
import { v4 } from 'uuid'
import WeightInput from '@/components/WeightInputComponent.vue'
import PriceInput from '@/components/PriceInputComponent.vue'

export default {
  components: {
    WeightInput,
    PriceInput,
  },
  data: () => ({
    icons: {
      mdiPlus,
      mdiPencil,
      mdiMinusCircle,
    },

    // contractStatuses: ['仮契約', '契約済', '取消'],
    contractStatuses: [
      { text: '仮契約', value: '1' },
      { text: '契約済', value: '2' },
      { text: '取消', value: '9' },
    ],
    status: {
      1: '仮契約',
      2: '契約済',
      3: '出荷可',
      4: '出荷済',
      9: '取消',
    },
    OriginalForm: {},
    contracts: [],
    dateMenu: '',
    ContractEditForm: {
      contract_id: '',
      contract_date: '',
      customer_id: '',
      contract_name: '',
      contract_status: '',
      contract_details: [],
    },
    editStatus: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    contractHeaders: [
      {
        text: '順',
        value: 'detail_id',
        sortable: false,
        align: 'left',
        width: '3%',
        fixed: true,
      },
      {
        text: '材料ID',
        value: 'material_id',
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
        text: '契約重量',
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
    ContractEditForm: {
      // contract_id: {
      //   required,
      //   maxLength: maxLength(20),
      // },
      contract_date: {
        required,
      },
      contract_name: {
        required,
        maxLength: maxLength(100),
      },

      // customer_id: {
      //   required,
      // },
      contract_status: {
        required,
      },
      contract_details: {
        $each: {
          material_id: {
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
        },
      },
    },
  },
  computed: {
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('customerStore', ['customerMaster', 'customerIds']),
    ...mapState('contractStore', ['selectedCrushedContract']),
    customer_name() {
      if (this.customerMaster) {
        const customerKey = this.ContractEditForm.customer_id

        return this.customerMaster[customerKey]
      }

      return ''
    },
    contractDateErrors() {
      const errors = []
      if (!this.$v.ContractEditForm.contract_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_date.required && errors.push('必須項目')

      return errors
    },
    contractStatusErrors() {
      const errors = []
      if (!this.$v.ContractEditForm.contract_status.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_status.required && errors.push('必須項目')

      return errors
    },
    contractIdErrors() {
      const errors = []
      if (!this.$v.ContractEditForm.contract_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_id.required && errors.push('必須項目')

      return errors
    },
    contractNameErrors() {
      const errors = []
      if (!this.$v.ContractEditForm.contract_name.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_name.maxLength && errors.push('Name must be at most 100 characters long')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractEditForm.contract_name.required && errors.push('必須項目')

      return errors
    },

    // customerIdErrors() {
    //   const errors = []
    //   if (!this.$v.ContractEditForm.customer_id.$dirty) return errors
    //   // eslint-disable-next-line no-unused-expressions
    //   !this.$v.ContractEditForm.customer_id.required && errors.push('必須項目')

    //   return errors
    // },
    materialIdErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractEditForm.contract_details.$each[index].material_id.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractEditForm.contract_details.$each[index].material_id.required && errors.push('必須項目')
        }

        return errors
      }
    },
    contractGoodsNameErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          /* eslint-disable*/
          !this.$v.ContractEditForm.contract_details.$each[index].contract_goods_name.required &&
            errors.push('必須項目')
          /* eslint-disable*/
        }

        return errors
      }
    },

    contractWeightErrors() {
      return function (item) {

        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
        
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractEditForm.contract_details.$each[index].contract_weight.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractEditForm.contract_details.$each[index].contract_weight.numeric && errors.push('必須数字')
        }

        return errors 
      }  
    },
    contractPriceErrors() {
      return function (item) {
        const errors = []
        if (item && item.detail_id) {
          const index = item.detail_id - 1
          if (!this.$v.ContractEditForm.contract_details.$each[index].contract_price.$dirty) return errors
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractEditForm.contract_details.$each[index].contract_price.required && errors.push('必須項目')
          // eslint-disable-next-line no-unused-expressions
          !this.$v.ContractEditForm.contract_details.$each[index].contract_price.numeric && errors.push('必須数字')
        }

        return errors
      }
    },
  },
  methods: {
    ...mapActions('contractStore', ['loadCrushedContract', 'editCrushedContract']),
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapMutations('app', ['setOverlayStatus']),

    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.ContractEditForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    setEditStatus() {
      this.editStatus = true
      console.log('setEditStatus ', this.editStatus)
    },
    addContract() {
      const detailId = this.ContractEditForm.contract_details.length + 1
      this.ContractEditForm.contract_details.push({
        id: v4(),
        detail_id: detailId,
        material_id: '',
        contract_goods_name: '',
        contract_weight: '',
        contract_price: '',
        contract_note: '',
      })
    },
    removeContract(item) {
      console.log(this.ContractEditForm.contract_details.indexOf(item))
      if (this.ContractEditForm.contract_details.indexOf(item) !== -1) {
        this.ContractEditForm.contract_details.splice(this.ContractEditForm.contract_details.indexOf(item), 1)
        const orderContracts = []
        this.ContractEditForm.contract_details.forEach((v, i) => {
          orderContracts[i] = v
          orderContracts[i].detail_id = i + 1
          console.log(i, v.detail_id, v.detail_id)
        })
        console.log(this.ContractEditForm.contract_details)
      } else {
        console.log('removeContract-----> item does not exist')
      }
    },
    setMaterialName(e, item) {
  
      if (this.editStatus && this.ContractEditForm.contract_details.indexOf(item) !== -1) {
        this.ContractEditForm.contract_details[
          this.ContractEditForm.contract_details.indexOf(item)
        ].contract_goods_name = this.materialMaster[e]
      } 
      // else {
      //   console.log('setMaterialName-----> item does not exist')
      // }
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
          const item = this.ContractEditForm.contract_details[evt.oldIndex]
          console.log(item, this.ContractEditForm.contract_details)
          this.ContractEditForm.contract_details.splice(evt.oldIndex, 1)
          this.ContractEditForm.contract_details.splice(evt.newIndex, 0, item)

          const orderContracts = []
          this.ContractEditForm.contract_details.forEach((v, i) => {
            orderContracts[i] = v
            orderContracts[i].detail_id = i + 1
            console.log(i, v.detail_id, v.detail_id)
          })
        },
      })
    },
    jumpToListPage() {
      this.$router.push({ path: '/contract-crushed-list', query: this.$route.params.query ?? {} })
    },
    submit(ContractEditForm) {
      this.apierror.messages = []
      this.$v.$touch()


      if (ContractEditForm.contract_details.length === 0 ){
          this.apierror.status = 'error'
          this.apierror.messages = ['明細行を入力してください。']
      }
      else {
        ContractEditForm.contract_details.forEach(c => {
          const filterLength = ContractEditForm.contract_details.filter(cd => cd.material_id === c.material_id).length
          if (filterLength !== 1) {
            this.apierror.status = 'error'
            this.apierror.messages = ['材料IDが重複です。']
          }
        })
      }
 
      if (this.apierror.messages.length === 0 && !this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...ContractEditForm }
   
        this.editCrushedContract(submitForm)
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
        console.log('crushed error submit!!')
      }
    },
  },
  mounted() {
    this.setOverlayStatus(true)
    this.loadMaterialIds()
    this.loadCustomerIds()
    this.loadCrushedContract(this.$route.params.id)
      .then(() => {
        this.ContractEditForm = { ...this.selectedCrushedContract }

        this.ContractEditForm.contract_status = this.ContractEditForm.contract_status.toString()
        this.OriginalForm = JSON.stringify(this.ContractEditForm)
        this.setOverlayStatus(false)
      })
      .catch(error => {
        this.apierror.status = error.response.data.status
        this.apierror.code = error.response.data.code
        this.apierror.messages = error.response.data.message
        this.setOverlayStatus(false)
      })
    this.sortContracts()
  },
}
</script>
