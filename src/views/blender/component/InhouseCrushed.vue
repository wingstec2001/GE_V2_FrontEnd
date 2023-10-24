<template>
  <v-card>
    <!-- <template v-if="apierror.status == 'error'">
      <div
        v-for="msg of apierror.messages"
        :key="msg"
      >
        <v-row class="ml-6 mb-3 ma-3">
          <span style="color: red">* {{ msg }} </span>
        </v-row>
      </div>
    </template> -->

    <v-spacer></v-spacer>
    <v-form class="ma-6">
      <v-row align="center">
        <v-col
          cols="12"
          md="2"
        >
          <label
            class="text-right"
            for="blended_dt"
          >ブレンド日<span style="color: red">*</span></label>
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
                v-model="blender_date"
                :error-messages="blenderDateErrors"
                placeholder="ブレンド日"
                hide-details="auto"
                v-bind="attrs"
                clearable
                outlined
                readonly
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="blender_date"
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
          <label class="text-right">ブレンド時間<span style="color: red">*</span></label>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-autocomplete
            v-model="blender_hour"
            :error-messages="blenderHourErrors"
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
            v-model="blender_minute"
            :error-messages="blenderMinuteErrors"
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
          <label for="material_id">材料ID</label>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            id="material_id"
            v-model="material_id"
            :items="materialIds"
            outlined
            clearable
            dense
            placeholder="材料ID"
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
        <!-- <v-col
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
        </v-col> -->
      </v-row>
      <v-row align="center">
        <v-col cols="12">
          <v-card>
            <v-data-table
              ref="Blenders"
              :headers="headers"
              :items="f_InhouseCrushed"
              fixed-header
            >
              <template v-slot:[`item.crushed_weight`]="{ item }">
                <label>{{ item.crushed_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon
                  class="mr-2"
                  color="primary"
                  @click.once="addSubmit(item)"
                >
                  <v-icon small>
                    {{ icons.mdiPlusThick }}
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import {
  mdiPlusThick, mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd,
} from '@mdi/js'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  data: () => ({
    dateMenu: '',
    timeMenu: '',
    blender_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
    blender_hour: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 13),
    blender_minute: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(14, 16),
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
    material_id: '',
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
      mdiPlusThick,
    },

    // ihouseCrushedList: [],
    materialIds: [],
    headers: [
      {
        text: '在庫No.',
        align: 'left',
        sortable: true,
        value: 'id',
        width: '15%',
        fixed: true,
      },

      {
        text: '粉砕No.',
        align: 'left',
        sortable: false,
        value: 'crushed_id',
        width: '15%',
        fixed: true,
      },
      {
        text: '材料ID',
        align: 'left',
        sortable: true,
        value: 'material_id',
        width: '25%',
        fixed: true,
      },
      {
        text: '重量(kg)',
        value: 'crushed_weight',
        sortable: true,
        align: 'right',
        width: '20%',
        fixed: true,
      },
      {
        text: ' ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
      },
    ],
  }),
  validations: {
    blender_hour: {
      required,
    },
    blender_minute: {
      required,
    },
    blender_date: {
      required,
    },
  },
  computed: {

    // ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('stockCrushingStore', ['f_InhouseCrushed', 'InhouseCrushed']),

    // material_name() {
    //   if (this.materialMaster) {
    //     const materialKey = this.material_id

    //     return this.materialMaster[materialKey]
    //   }

    //   return ''
    // },

    blenderDateErrors() {
      const errors = []
      if (!this.$v.blender_date.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_date.required && errors.push('必須項目')

      return errors
    },
    blenderHourErrors() {
      const errors = []
      if (!this.$v.blender_hour.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_hour.required && errors.push('必須項目')

      return errors
    },
    blenderMinuteErrors() {
      const errors = []
      if (!this.$v.blender_minute.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.blender_minute.required && errors.push('必須項目')

      return errors
    },
  },
  watch: {
    material_id() {
      console.log('watch,material_id:', this.material_id)
      this.filterInhouseCrushed({ material_id: this.material_id })
      console.log('filtered:', this.f_InhouseCrushed)
    },
  },
  mounted() {
    this.refreshList()
  },

  methods: {
    ...mapActions('stockCrushingStore', ['loadInhouseCrushed']),
    ...mapActions('blenderStore', ['createBlender']),

    ...mapMutations('stockCrushingStore', ['filterInhouseCrushed']),

    allowedDates(val) {
      return Date.parse(val) < Date.now()
    },
    refreshList() {
      this.loadInhouseCrushed().then(() => {
        this.filterInhouseCrushed({ material_id: this.material_id })

        if (this.f_InhouseCrushed.length === 0) {
          this.material_id = null
        }
        console.log('refrshed,material_id', this.material_id)
        this.materialIds = this.InhouseCrushed.map(fs => fs.material_id).sort()
      })

      // this.loadBlendedDaySum()
    },

    addSubmit(item) {
      console.log('stock_crushed_id:', item.id)
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        const submitForm = {
          blended_dt: `${this.blender_date} ${this.blender_hour}:${this.blender_minute}:00`,
          material_id: '',
          blended_weight: '',
          stock_crushed_id: item.id,
        }

        console.log('submit data:', submitForm)
        this.createBlender(submitForm)
          .then(() => {
            this.submitStatus = false

            this.$nextTick(() => {
              this.refreshList()
              console.log('Submit Sucess')
            })

            // this.loadInhouseCrushed().then(() => {
            //   this.StockCrushedList = this.StockCrushed
            //   this.filterStockCrushed({ material_id: this.material_id })
            //   this.StockCrushedList = this.f_StockCrushed
            // })
          })
          .catch(error => {
            console.log('submit error:', error)
            this.submitStatus = false

            // this.apierror.status = error.response.data.status
            // this.apierror.code = error.response.data.code
            // this.apierror.messages = error.response.data.message

            // this.loadInhouseCrushed().then(() => {
            //   this.InhouseCrushedList = this.InhouseCrushed
            // })
          })
      } else {
        console.log('error submit!!')
      }
    },

  },
}
</script>
<style scoped>
.v-select__selections input {
  font-size: 14px !important;
}
.v-select__selection v-select__selection--comma {
  font-size: 14px !important;
}
</style>
