<template>
  <v-card>
    <v-card-title>契約(粉砕済) ― 新規</v-card-title>
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

      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="customer_id">取引先ID<span style="color: red">*</span></label>
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
          <label for="material_id">材料ID<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-autocomplete
            v-model="ContractForm.material_id"
            :items="materialIds"
            clearable
            outlined
            dense
            placeholder="材料ID"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label for="material_id">契約単価</label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <number-input
            v-model="ContractForm.contract_price"
            :outlined="true"
            prefix="¥"
          ></number-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="mt-10"
            for="contract_name"
          >契約名<span style="color: red">*</span></label>
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
            hide-details="auto"
            :counter="100"
          ></v-text-field>
        </v-col>
      </v-row>

      <div style="padding: 12px; margin: 12px 0px; border: 1px solid #ccc">
        <v-row>
          <v-col
            cols="12"
            style="text-align: right; padding: 12px 12px 0px"
          >
            <Detail
              :icon="icons.mdiPlus"
              :material-id="ContractForm.material_id"
              :selected-ids="selectedIds"
              :detail-material-id="detail_material_id"
              @onSelected="refreshTable"
            />
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
              <!-- <template v-slot:[`item.crushed_weight`]="{ item}">
                <weight-input
                  v-model="item.crushed_weight"
                  outlined
                  readonly
                ></weight-input>
              </template> -->

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
              <template v-slot:[`body.append`]>
                <tr>
                  <td
                    class="font-weight-bold"
                    style="background: #fafafa"
                    :colspan="3"
                  >
                    <label>重量合計</label>
                  </td>

                  <td
                    class="font-weight-bold pr-6"
                    style="text-align: right; background: #fafafa"
                  >
                    <label>{{ sumWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
                  </td>
                  <td
                    style="background: #fafafa"
                    :colspan="1"
                  ></td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            style="text-align: right; padding: 0px 12px 12px"
          >
            <Detail
              :icon="icons.mdiPlus"
              :material-id="ContractForm.material_id"
              :detail-material-id="detail_material_id"
              @onSelected="refreshTable"
            />
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
import { mdiPlus, mdiPencil, mdiMinusCircle,mdiPageNextOutline  } from '@mdi/js'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import Sortable from 'sortablejs'
import { v4 } from 'uuid'
import WeightInput from '@/components/WeightInputComponent.vue'
import NumberInput from '@/components/NumberInput.vue'
import { helpers } from '@vuelidate/validators'
import Detail from './Detail.vue'

/* eslint-disable*/
const allowdChar = helpers.regex(/^[0-9a-zA-Z]+[0-9a-zA-Z-_()]*$/)
export default {
  components: {
    WeightInput,
    NumberInput,
    Detail,
  },
  data: () => ({
    id: '',
    selectedIds: [],
    icons: {
      mdiPlus,
      mdiPencil,
      mdiMinusCircle,
      mdiPageNextOutline ,
    },

    changeFlag: false,
    dateMenu: '',
    contracts: [],

    ContractForm: {

      contract_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      customer_id: '',
      contract_name: '',
      contract_price: 0,
      contract_details: [],
      material_id:'',
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
        text: '材料ID',
        value: 'material_id',
        sortable: true,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '入庫ID',
        value: 'id',
        sortable: true,
        align: 'left',
        width: '20%',
        fixed: true,
      },
      // {
      //   text: '契約商品名',
      //   value: 'contract_goods_name',
      //   sortable: false,
      //   align: 'left',
      //   width: '20%',
      //   fixed: true,
      // },
      {
        text: '重量(kg)',
        value: 'crushed_weight',
        sortable: false,
        align: 'right',
        width: '15%',
        fixed: true,
      },

      {
        text: 'FROM',
        value: 'origin',
        sortable: true,
        align: 'left',
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
      contract_details: {
        $each: {
          material_id: {
            required,
          },

          crushed_weight: {
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

    detail_material_id(){

      let ret = ''
      if (this.ContractForm.contract_details.length>0) {
        ret = this.ContractForm.contract_details[0].material_id

      }
      return ret
    },

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

    contractNameErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_name.$dirty) return errors

      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_name.required && errors.push('必須項目')

       // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_name.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },



    // crushedWeightErrors() {
    //   return function (item) {
    //     const errors = []
    //     if (item && item.detail_id) {
    //       const index = item.detail_id - 1
    //       if (!this.$v.ContractForm.contract_details.$each[index].crushed_weight.$dirty) return errors
    //       // eslint-disable-next-line no-unused-expressions
    //       !this.$v.ContractForm.contract_details.$each[index].crushed_weight.required && errors.push('必須項目')
    //       // eslint-disable-next-line no-unused-expressions
    //       !this.$v.ContractForm.contract_details.$each[index].crushed_weight.numeric && errors.push('必須数字')
    //     }

    //     return errors
    //   }
    // },


    sumWeight()
    {
      let sum = 0

      for(let i = 0;i < this.ContractForm.contract_details.length ;i+=1){

        sum = sum + Number(this.ContractForm.contract_details[i].crushed_weight)

      }

      return sum
    }
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
    this.loadMaterialIds()
    this.loadCustomerIds()
  },
  methods: {
    ...mapActions('contractStore', ['createCrushedContract']),
    ...mapActions('materialStore', ['loadMaterialIds']),
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



    refreshTable(selectedList,uuid){

      let sum = 0
      let note=''
      let arrStockedIds =[]
      let stocked_ids =''
      this.ContractForm.contract_details = selectedList
      for(let i=0;i<this.ContractForm.contract_details.length;i++) {
        this.ContractForm.contract_details[i].detail_id = i+ 1
        // this.ContractForm.contract_details[i].contract_weight = selectedList[i].crushed_weight
        // this.ContractForm.contract_details[i].id = selectedList[i].id
        // this.ContractForm.contract_details[i].origin = selectedList[i].origin
        // this.ContractForm.contract_details[i].material_id = selectedList[i].material_id

        note += selectedList[i].crushed_weight.toString() +","
        stocked_ids += selectedList[i].id.toString()+","
        arrStockedIds.push(selectedList[i].id)
      }

      const contract_note = `${selectedList.length}F/` + note
      this.ContractForm.contract_note = contract_note.slice(0,-1)
      this.ContractForm.stocked_ids = stocked_ids.slice(0,-1)
      this.selectedIds = arrStockedIds


    },


    removeContract(item) {
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        this.ContractForm.contract_details.splice(this.ContractForm.contract_details.indexOf(item), 1)
        const orderContracts = []
        this.ContractForm.contract_details.forEach((v, i) => {
          orderContracts[i] = v
          orderContracts[i].detail_id = i + 1

        })

      }

      this.selectedIds=this.ContractForm.contract_details.map(s=>s.id)
    },


    handleWeight(event) {
      event.target.select()
    },
    handleWeightInput(e, item) {
      const formatValue = e.replace(/,/g, '')
      if (this.ContractForm.contract_details.indexOf(item) !== -1) {
        /* eslint-disable */
        this.ContractForm.contract_details[this.ContractForm.contract_details.indexOf(item)].crushed_weight =
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

          const item = this.ContractForm.contract_details[evt.oldIndex]

          this.ContractForm.contract_details.splice(evt.oldIndex, 1)
          this.ContractForm.contract_details.splice(evt.newIndex, 0, item)

          const orderContracts = []
          this.ContractForm.contract_details.forEach((v, i) => {
            orderContracts[i] = v
            orderContracts[i].detail_id = i + 1

          })
        },
      })
    },
    jumpToListPage() {
      this.$router.push({ path: '/contract-crushed-list', query: this.$route.params.query ?? {} })
    },

    submit(ContractForm) {
      this.$v.$touch()
      this.apierror.messages = []
      if (ContractForm.contract_details.length === 0 ){
          this.apierror.status = 'error'
          this.apierror.messages.push('明細行を入力して下さい。')
          return
      }

      var notDuplicate = false;
      ContractForm.contract_details.map(v => v.material_id).sort().sort((a, b) => {
        if (a !== b) notDuplicate = true
      })

      if (notDuplicate == true ) {
        this.apierror.messages = []
        this.apierror.status = 'error'
        this.apierror.messages.push('材料IDが１つにして下さい。')
        return
      }

      var hasWeightZero = false;
      ContractForm.contract_details.forEach(c => {
        if(c.crushed_weight == 0) hasWeightZero = true
      })

      if (hasWeightZero == true) {
        this.apierror.status = 'error'
        this.apierror.messages.push('契約重量は0です。')
        return
      }

      let sum=0
      for(let i=0;i<this.ContractForm.contract_details.length;i+=1){
        sum += Number(this.ContractForm.contract_details[i].crushed_weight)
      }


      if (this.apierror.messages.length === 0 && !this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...ContractForm }
        submitForm.contract_weight = sum

        this.createCrushedContract(submitForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()

          })
          .catch(error => {
            this.submitStatus = false
            this.apierror.status = 'error'
            this.apierror.code = error.response.data.code
            this.apierror.messages.push(error.response.data.message)

            console.log('apierror', this.apierror)
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
