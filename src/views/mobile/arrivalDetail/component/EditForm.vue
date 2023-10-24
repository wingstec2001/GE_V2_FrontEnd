<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
    >
      <v-icon size="22">
        {{ icon }}
      </v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">入荷実績-編集V24</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5">
                <label class="text-h7">No.</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h7"
                  for="aad_id"
                >{{ item.aad_id }}</label>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="Details.customer_id"
                  :items="supplierIds"
                  label="仕入先ID"

                  required
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="Details.material_id"
                  :items="materialIds"
                  label="材料ID*"
                  placeholder="Select..."
                  :error-messages="materialIdErrors"
                  required
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="Details.crushing_status"
                  :error-messages="crushingStatusErrors"
                  label="粉砕状態*"
                  :items="crushing_status"
                  hide-details="auto"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <weight-input
                  v-model="Details.arrival_weight"
                  :label="weightLabel"
                  :outlined="false"
                  :error-messages="weightErrors"
                ></weight-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="Details.note"
                  :error-messages="noteErrors"
                  :counter="100"
                  height="100px"
                  outlined
                  label="備考"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="submitStatus"
            @click="submit(Details)"
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
import { mdiCalendar } from '@mdi/js'
import { required, numeric, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  model: {
    prop: 'item',
    event: 'changeItem',
  },
  props: ['icon', 'item'],
  data: () => ({
    weightLabel: '重量*',
    icons: {
      mdiCalendar,
    },
    dialog: false,
    crushing_status: [
      { text: '未粉砕', value: 0 },
      { text: '粉砕済', value: 1 },
    ],
    Details: {
      material_id: '',
      customer_id: '',
      arrival_weight: '',
      crushing_status: 0,
      note: '',
    },
    submitStatus: false,
  }),
  validations: {
    Details: {
      material_id: {
        required,
      },
      crushing_status: {
        required,
      },
      arrival_weight: {
        required,
        numeric,
      },
      note: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {

    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('arrivalactualStore', ['selectedArrivalDetail']),
    ...mapState('customerStore', ['supplierMaster', 'supplierIds']),

    materialIdErrors() {
      const errors = []
      if (!this.$v.Details.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.Details.material_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.Details.arrival_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.Details.arrival_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.Details.arrival_weight.numeric && errors.push('必須数字')

      return errors
    },
    crushingStatusErrors() {
      const errors = []
      if (!this.$v.Details.crushing_status.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.Details.crushing_status.required && errors.push('必須項目')

      return errors
    },

    noteErrors() {
      const errors = []
      if (!this.$v.Details.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.Details.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
  },
  watch: {
    item(val) {
      this.Details = { ...val }
    },
  },

  created() {
    this.loadMaterialIds()
    this.loadSupplierIds()

    this.loadArrivalDetail(this.item.aad_id).then(() => {
      console.log('mobile,arrival:', this.selectedArrivalDetail)
      this.Details = {
        aad_id: this.selectedArrivalDetail.aad_id,
        material_id: this.selectedArrivalDetail.material_id,
        customer_id: this.selectedArrivalDetail.customer_id,
        arrival_date: this.selectedArrivalDetail.arrival_date,
        arrival_weight: this.selectedArrivalDetail.arrival_weight,
        crushing_status: this.selectedArrivalDetail.crushing_status,
        note: this.selectedArrivalDetail.note,
      }
    })
  },

  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('arrivalactualStore', ['editTodayArrivalDetail', 'loadArrivalDetail']),
    ...mapActions('customerStore', ['loadSupplierIds']),

    // ...mapActions('dashboardStore', ['loadArrivalDetailDaySum']),

    submit(Details) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...Details }
        this.editTodayArrivalDetail(submitForm).then(() => {
          this.submitStatus = false
          this.$emit('success')
          this.dialog = false
        })
      } else {
        console.log('error submit!!')
      }
    },

    closeForm() {
      this.Details = { ...this.item }

      this.dialog = false
      this.$v.Details.$reset()
    },
  },
}
</script>
