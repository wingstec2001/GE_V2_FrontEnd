<template>
  <v-card>
    <v-card-title>粉砕実績-編集V2</v-card-title>
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
              <label for="crushed_id">粉砕ID<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="crushed_id"
                v-model="CrushingActualEditForm.crushed_id"
                outlined
                dense
                placeholder="粉砕ID"
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
              <label for="actual_date">粉砕日<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
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
                    v-model="actual_dt"
                    :error-messages="dateErrors"
                    placeholder="粉砕日"
                    hide-details
                    v-bind="attrs"
                    clearable
                    outlined
                    readonly
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="actual_dt"
                  :allowed-dates="allowedDates"
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
              <label
                class="text-right"
                for="actual_time"
              >粉砕時間<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="actual_hour"
                :error-messages="hourErrors"
                :items="hours"
                outlined
                placeholder="時"
                hide-details="auto"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="2"
            >
              <v-autocomplete
                v-model="actual_minute"
                :error-messages="minuteErrors"
                :items="minutes"
                outlined
                placeholder="分"
                hide-details="auto"
                dense
              ></v-autocomplete>
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
              md="4"
            >
              <v-autocomplete
                id="material_id"
                v-model="$v.CrushingActualEditForm.material_id.$model"
                :items="materialIds"
                outlined
                clearable
                dense
                :error-messages="materialIdErrors"
                placeholder="材料ID"
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                id="material_name"
                v-model="material_name"
                dense
                disabled
                placeholder="材料名"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              cols="12"
              md="2"
            >
              <label for="actual_weight">粉砕重量<span style="color: red">*</span></label>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <WeightInput
                v-model="$v.CrushingActualEditForm.actual_weight.$model"
                placeholder="粉砕重量"
                :outlined="true"
                :error-messages="weightErrors"
              ></WeightInput>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <label for="arrival_note">備考</label>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-textarea
                v-model="CrushingActualEditForm.note"
                name="note"
                hide-details="auto"
                outlined
                :counter="100"
                :error-messages="noteErrors"
                dense
                rows="3"
                placeholder="備考"
              ></v-textarea>
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
                @click="submit(CrushingActualEditForm)"
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
import { required, decimal } from 'vuelidate/lib/validators'
import { mapActions, mapMutations, mapState } from 'vuex'
import maxLength from 'vuelidate/lib/validators/maxLength'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    submitStatus: false,
    dateMenu: false,
    CrushingActualEditForm: {
      material_id: '',
      actual_weight: '',
      actual_date: '',
      note: '',
    },
    actual_hour: '',
    actual_minute: '',
    actual_dt: '',
    hours: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '00',
    ],
    minutes: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
    ],
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    OriginalForm: {},
  }),
  validations: {
    actual_hour: {
      required,
    },
    actual_minute: {
      required,
    },
    actual_dt: {
      required,
    },
    CrushingActualEditForm: {
      material_id: {
        required,
      },
      actual_weight: {
        decimal,
        required,
      },
      note: {
        maxLength: maxLength(100),
      },
    },
  },
  computed: {
    // ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('crushingactualStore', ['selectedCrushingActual']),
    material_name() {
      if (this.materialMaster) {
        const materialKey = this.CrushingActualEditForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },

    materialIdErrors() {
      const errors = []
      if (!this.$v.CrushingActualEditForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualEditForm.material_id.required && errors.push('必須項目')

      return errors
    },

    weightErrors() {
      const errors = []
      if (!this.$v.CrushingActualEditForm.actual_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualEditForm.actual_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualEditForm.actual_weight.decimal && errors.push('必須数字')

      // // eslint-disable-next-line no-unused-expressions
      // !this.$v.CrushingActualEditForm.actual_weight.minValue && errors.push('0より大きい数値を入力してください')

      return errors
    },

    dateErrors() {
      const errors = []
      if (!this.$v.actual_dt.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_dt.required && errors.push('必須項目')

      return errors
    },
    hourErrors() {
      const errors = []
      if (!this.$v.actual_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_hour.required && errors.push('必須項目')

      return errors
    },
    minuteErrors() {
      const errors = []
      if (!this.$v.actual_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.actual_minute.required && errors.push('必須項目')

      return errors
    },

    noteErrors() {
      const errors = []
      if (!this.$v.CrushingActualEditForm.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualEditForm.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
  },
  watch: {
    actual_minute(val) {
      if (val && this.actual_hour && this.actual_dt) {
        this.CrushingActualEditForm.actual_date = `${this.actual_dt} ${this.actual_hour}:${val}`
      }
    },
    actual_hour(val) {
      if (val && this.actual_minute && this.actual_dt) {
        this.CrushingActualEditForm.actual_date = `${this.actual_dt} ${val}:${this.actual_minute}`
      }
    },
    actual_dt(val) {
      if (val && this.actual_minute && this.actual_hour) {
        this.CrushingActualEditForm.actual_date = `${val} ${this.actual_hour}:${this.actual_minute}`
      }
    },
  },
  created() {
    this.loadMaterialIds()
    this.loadData()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.setOverlayStatus(true)
      this.loadCrushingActual(this.$route.params.id)
        .then(() => {
          this.CrushingActualEditForm = { ...this.selectedCrushingActual }
          this.actual_dt = this.CrushingActualEditForm.actual_date.substring(0, 10)
          this.actual_hour = this.CrushingActualEditForm.actual_date.substring(11, 13)
          this.actual_minute = this.CrushingActualEditForm.actual_date.substring(14, 16)
          this.CrushingActualEditForm.actual_weight = `${this.CrushingActualEditForm.actual_weight}`
          this.OriginalForm = JSON.stringify(this.CrushingActualEditForm)
          this.setOverlayStatus(false)
        })
        .catch(error => {
          this.submitStatus = false
          this.apierror.status = error.response.data.status
          this.apierror.code = error.response.data.code
          this.apierror.messages.push(error.response.data.message)
          this.setOverlayStatus(false)
        })
    },
    cancelClick() {
      if (this.OriginalForm !== JSON.stringify(this.CrushingActualEditForm)) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('他ページに遷移します。よろしいでしょうか？')) {
          this.jumpToListPage()
        }

        return
      }

      this.jumpToListPage()
    },
    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },
    jumpToListPage() {
      this.$router.push({ path: '/crushingactual-list', query: this.$route.params.query ?? {} })
    },
    submit(CrushingActualEditForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (this.CrushingActualEditForm.actual_weight === '0') {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('粉砕重量は 0 です！よろしいでしょうか？')) {
            this.submitStatus = true
            this.CrushingActualEditForm.actual_date = `${this.actual_dt} ${this.actual_hour}:${this.actual_minute}:00`

            this.editCrushingActual(CrushingActualEditForm)
              .then(() => {
                this.submitStatus = false
                this.jumpToListPage()
              })
              .catch(error => {
                this.submitStatus = false
                this.apierror.status = error.response.data.status
                this.apierror.code = error.response.data.code
                this.apierror.messages = error.response.data.message
              })
          }
        } else {
          this.submitStatus = true
          this.CrushingActualEditForm.actual_date = `${this.actual_dt} ${this.actual_hour}:${this.actual_minute}:00`

          this.editCrushingActual(CrushingActualEditForm)
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
        }
      } else {
        console.log('error submit!!')
      }
    },

    // ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('crushingactualStore', ['editCrushingActual', 'loadCrushingActual']),
  },
}
</script>
