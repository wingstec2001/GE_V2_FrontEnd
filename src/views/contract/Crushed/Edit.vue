<template>
  <v-card>
    <v-card-title>契約(粉砕済)―編集</v-card-title>
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
          <label for="material_id">契約ID<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <span>CF-{{ ContractForm.did }}</span>
        </v-col>
      </v-row>
      <v-row>
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
          <!-- <v-autocomplete
            v-model="ContractForm.material_id"
            :items="materialIds"
            clearable
            outlined
            dense
            placeholder="材料ID"
            hide-details="auto"
          ></v-autocomplete> -->
          <span>{{ ContractForm.material_id }}</span>
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
            md="2"
          >
            <span>契約済分</span>
          </v-col>
          <v-col
            cols="12"
            md="10"
            style="text-align: right; padding: 12px 12px 0px"
          >
            <v-btn
              color="orange"

              @click="reload"
            >
              Reload
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="12">
            <v-data-table
              ref="Contracts"
              class="class-on-data-table elevation-1"
              :headers="contractHeaders"
              :items="ContractForm.contracted_details"
              fixed-header
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-row>
                  <v-col style="padding: 0px">
                    <v-icon
                      class="mr-2"
                      color="red"
                      @click="removeContracted(item)"
                    >
                      {{ icons.mdiCloseCircle }}
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
                    <label>{{ sumContractedWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
      </div>
      <v-row></v-row>
      <div style="padding: 12px; margin: 12px 0px; border: 1px solid #ccc">
        <v-row>
          <v-col
            cols="12"
            md="2"
          >
            <span>契約追加分</span>
          </v-col>
          <v-col
            cols="12"
            md="10"
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
              :items="contract_details"
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
                    class="font-weight-bold"
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
import {
  mdiPlus, mdiPencil, mdiMinusCircle, mdiPageNextOutline, mdiCloseCircle,
} from '@mdi/js'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapMutations, mapState } from 'vuex'
import Sortable from 'sortablejs'

// import WeightInput from '@/components/WeightInputComponent.vue'
import NumberInput from '@/components/NumberInput.vue'
import Detail from './Detail.vue'

export default {
  components: {
    // WeightInput,
    NumberInput,
    Detail,
  },
  data: () => ({
    icons: {
      mdiPlus,
      mdiPencil,
      mdiMinusCircle,
      mdiPageNextOutline,
      mdiCloseCircle,
    },
    sumWeight: 0,
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
    material_id: '',
    selectedIds: [],
    OriginalForm: {},
    contracts: [],
    dateMenu: '',
    org_contracted_details: [], // 原始分

    contract_details: [], // 追加変更分

    ContractForm: {
      contract_id: '',
      contract_date: '',
      customer_id: '',
      contract_name: '',
      contract_price: '',
      material_id: '',
      contract_status: '',
      contracted_details: [], // 契約済み分
    },
    editStatus: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    contractHeaders: [
      {
        text: 'No',
        value: 'detail_id',
        sortable: false,
        align: 'left',
        width: '10%',
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
        text: '入庫ID',
        value: 'id',
        sortable: true,
        align: 'left',
        width: '10%',
        fixed: true,
      },

      {
        text: '契約重量(Kg)',
        value: 'crushed_weight',
        sortable: false,
        align: 'right',
        width: '20%',
        fixed: true,
      },

      {
        text: 'FROM',
        value: 'origin',
        sortable: false,
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
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
      // },
      contract_date: {
        required,
      },
      contract_name: {
        required,
        maxLength: maxLength(100),
      },

    },
  },

  computed: {
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('customerStore', ['customerMaster', 'customerIds']),
    ...mapState('contractStore', ['selectedCrushedContract']),

    // 契約済分、重量合計
    sumContractedWeight() {
      let sum = 0

      for (let i = 0; i < this.ContractForm.contracted_details.length; i += 1) {
        sum += Number(this.ContractForm.contracted_details[i].crushed_weight)
      }

      return sum
    },

    detail_material_id() {
      return this.ContractForm.material_id
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
    contractStatusErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_status.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_status.required && errors.push('必須項目')

      return errors
    },
    contractIdErrors() {
      const errors = []
      if (!this.$v.ContractForm.contract_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_id.maxLength && errors.push('長すぎます！')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.ContractForm.contract_id.required && errors.push('必須項目')

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

  },

  created() {
    this.setOverlayStatus(true)
    this.loadMaterialIds()
    this.loadCustomerIds()
  },

  mounted() {
    this.loadCrushedContract(this.$route.params.id)
      .then(() => {
        this.ContractForm = { ...this.selectedCrushedContract }

        for (let i = 0; i < this.ContractForm.contracted_details.length; i += 1) {
          this.ContractForm.contracted_details[i].detail_id = i + 1
        }

        this.org_contracted_details = JSON.parse(JSON.stringify(this.ContractForm.contracted_details))

        this.OriginalForm = JSON.stringify(this.ContractForm)
        this.setOverlayStatus(false)
      })
      .catch(error => {
        console.log('error:', error)
        this.apierror.status = 'error'

        // this.apierror.code = error.response.data.code
        this.apierror.messages = error.response.data.message
        this.setOverlayStatus(false)
      })

    // this.sortContracts()
  },

  methods: {
    ...mapActions('contractStore', ['loadCrushedContract', 'editCrushedContract']),
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('customerStore', ['loadCustomerIds']),
    ...mapMutations('app', ['setOverlayStatus']),

    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.ContractForm)) {
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
    },

    reload() {
      this.ContractForm.contracted_details = JSON.parse(JSON.stringify(this.org_contracted_details))
    },

    // 契約済み分を削除する
    removeContracted(item) {
      if (this.ContractForm.contracted_details.indexOf(item) !== -1) {
        this.ContractForm.contracted_details.splice(this.ContractForm.contracted_details.indexOf(item), 1)
        const orderContracts = []
        this.ContractForm.contracted_details.forEach((v, i) => {
          orderContracts[i] = v
          orderContracts[i].detail_id = i + 1
        })
      }
    },

    removeContract(item) {
      let sum = 0

      if (this.contract_details.indexOf(item) !== -1) {
        this.contract_details.splice(this.contract_details.indexOf(item), 1)
        const orderContracts = []
        this.contract_details.forEach((v, i) => {
          orderContracts[i] = v
          orderContracts[i].detail_id = i + 1
          sum += v.crushed_weight
        })
      }

      this.selectedIds = this.contract_details.map(s => s.id)
      this.sumWeight = sum
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
          const item = this.contract_details[evt.oldIndex]
          console.log(item, this.ContractForm.contract_details)
          this.contract_details.splice(evt.oldIndex, 1)
          this.contract_details.splice(evt.newIndex, 0, item)

          const orderContracts = []
          this.contract_details.forEach((v, i) => {
            orderContracts[i] = v
            orderContracts[i].detail_id = i + 1
          })
        },
      })
    },

    refreshTable(selectedList) {
      /* eslint-disable camelcase */
      // let note = ''
      let sum = 0

      // const arrStockedIds = []

      // let stocked_ids = ''
      this.contract_details = selectedList
      for (let i = 0; i < this.contract_details.length; i += 1) {
        this.contract_details[i].detail_id = i + 1

        sum += selectedList[i].crushed_weight

        // this.ContractForm.contract_details[i].id = selectedList[i].id
        // this.ContractForm.contract_details[i].origin = selectedList[i].origin
        // this.ContractForm.contract_details[i].material_id = selectedList[i].material_id

        // note += `${selectedList[i].crushed_weight.toString()},`
        // stocked_ids += `${selectedList[i].id.toString()},`
        // arrStockedIds.push(selectedList[i].id)
      }

      // const contract_note = `${selectedList.length}F/${note}`
      // this.ContractForm.contract_note = contract_note.slice(0, -1)
      // this.ContractForm.stocked_ids = stocked_ids.slice(0, -1)
      // this.selectedIds = arrStockedIds
      this.sumWeight = sum
    },

    jumpToListPage() {
      this.$router.push({ path: '/contract-crushed-list', query: this.$route.params.query ?? {} })
    },

    // Submit
    submit(ContractForm) {
      const conatracted_cnt = this.ContractForm.contracted_details.length

      const contract_cnt = this.contract_details.length

      const sum = conatracted_cnt + contract_cnt
      this.apierror.messages = []
      if (sum === 0) {
        this.apierror.status = 'error'
        this.apierror.messages = ['明細行を入力してください。']

        return
      }

      /* eslint-disable */
      // let hasDuplicate = false
      // ContractForm.contract_details.map(v => v.material_id).sort().sort((a, b) => {
      //   if (a === b) hasDuplicate = true
      // })

      // if (hasDuplicate === true) {
      //   this.apierror.messages = []
      //   this.apierror.status = 'error'
      //   this.apierror.messages = ['材料IDが重複です。']

      //   return
      // }

      // let hasWeightZero = false
      // ContractForm.contract_details.forEach(c => {
      //   if (c.contract_weight === 0) hasWeightZero = true
      // })

      // if (hasWeightZero === true) {
      //   this.apierror.status = 'error'
      //   this.apierror.messages = ['契約重量は0です。']

      //   return
      // }

      let note = ''

      const arrStockedIds = []
      let stocked_ids = ''
      let cnt = 0
      let totalWeight = 0
      for (let i = 0; i < this.contract_details.length; i += 1) {
        note += `${this.contract_details[i].crushed_weight.toString()},`
        stocked_ids += `${this.contract_details[i].id.toString()},`

        totalWeight  += this.contract_details[i].crushed_weight
        cnt += 1

      }

      for (let i = 0; i < this.ContractForm.contracted_details.length; i += 1) {
        note += `${this.ContractForm.contracted_details[i].crushed_weight.toString()},`
        stocked_ids += `${this.ContractForm.contracted_details[i].id.toString()},`

        totalWeight  += this.ContractForm.contracted_details[i].crushed_weight
        cnt += 1

      }

      const contract_note = `${cnt}F/${note}`
      this.ContractForm.contract_note = contract_note.slice(0, -1)
      this.ContractForm.stocked_ids = stocked_ids.slice(0, -1)

      this.$v.$touch()
      if (this.apierror.messages.length === 0 && !this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...ContractForm }
        submitForm.contract_weight = totalWeight

        console.log("submitForm:",submitForm)
        this.editCrushedContract(submitForm)
          .then(() => {
            this.submitStatus = false
            this.jumpToListPage()
          })
          .catch(error => {
            this.submitStatus = false
            this.apierror.status = 'error'
            this.apierror.code = error.response.data.code
            this.apierror.messages = error.response.data.message

            console.log('apierror', this.apierror)
          })
      } else {
        console.log('crushed error submit!!')
      }
    },
  },

}
</script>
