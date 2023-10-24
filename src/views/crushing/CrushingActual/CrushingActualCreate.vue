<template>
  <v-card>
    <v-card-title>粉砕実績-新規</v-card-title>
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
                v-model="$v.CrushingActualForm.material_id.$model"
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
                v-model="$v.CrushingActualForm.actual_weight.$model"
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
                v-model="CrushingActualForm.note"
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
                @click="submit(CrushingActualForm)"
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
import { required, decimal, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  data: () => ({
    dateMenu: false,
    changeFlag: false,
    CrushingActualForm: {
      material_id: '',
      actual_weight: '0',
      actual_date: '',
      note: '',
    },
    submitStatus: false,
    actual_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    actual_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
    actual_dt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
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
    CrushingActualForm: {
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
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    material_name() {
      if (this.materialMaster) {
        const materialKey = this.CrushingActualForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },

    materialIdErrors() {
      const errors = []
      if (!this.$v.CrushingActualForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualForm.material_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.CrushingActualForm.actual_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualForm.actual_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualForm.actual_weight.decimal && errors.push('必須数字')

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
      if (!this.$v.CrushingActualForm.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushingActualForm.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
  },
  watch: {
    CrushingActualForm: {
      handler(after) {
        if ((after.note !== '')
            || (after.actual_weight !== '0')
            || (after.material_id !== undefined)) {
          this.changeFlag = true
        }
      },
      deep: true,
    },

  },
  created() {
    this.loadMaterialIds()
    this.CrushingActualForm.material_id = this.$route.params.query.material_id
  },
  methods: {
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
    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },
    jumpToListPage() {
      this.$router.push({ path: '/crushingactual-list', query: this.$route.params.query ?? {} })
    },
    submit(CrushingActualForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (this.CrushingActualForm.actual_weight === '0') {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('粉砕重量は 0 です！よろしいでしょうか？')) {
            this.submitStatus = true
            this.CrushingActualForm.actual_date = `${this.actual_dt} ${this.actual_hour}:${this.actual_minute}:00`

            this.createCrushingActual(CrushingActualForm)
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
          }
        } else {
          this.submitStatus = true
          this.CrushingActualForm.actual_date = `${this.actual_dt} ${this.actual_hour}:${this.actual_minute}:00`

          this.createCrushingActual(CrushingActualForm)
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

    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('crushingactualStore', ['createCrushingActual']),
  },
}
</script>
