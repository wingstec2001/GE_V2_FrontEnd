<template>
  <v-card>
    <v-card-title>ブレンドー新規V3</v-card-title>
    <!-- <template>
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
          <label class="text-right">ブレンド時<span style="color: red">*</span></label>
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
      </v-row> -->

    <v-tabs
      v-model="crushedTabs"
    >
      <v-tab href="#1">
        自社紛済
      </v-tab>
      <v-tab href="#2">
        入荷紛済
      </v-tab>
      <v-tabs-items
        v-model="crushedTabs"
        touchless
      >
        <v-tab-item value="1">
          <InhouseCrushed
            @addSubmit="addBlenderByID"
          ></InhouseCrushed>
        </v-tab-item>
        <v-tab-item value="2">
          <BeforeBlending />
        </v-tab-item>
        <v-tab-item value="3">
          <DaySum />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-row>
      <v-col
        offset-md="5"
        cols="12"
      >
        <v-btn
          color="primary"
          class="mx-2"
          outlined
          @click="cancelClick"
        >
          OK
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mdiPlusThick } from '@mdi/js'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState, mapMutations } from 'vuex'
import BeforeBlending from './component/BeforeBlending.vue'
import InhouseCrushed from './component/InhouseCrushed.vue'

export default {
  components: {
    InhouseCrushed,
    BeforeBlending,
  },
  data: () => ({
    crushedTabs: '',
    icons: {
      mdiPlusThick,
    },
    InhouseCrushedList: [],
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
    BlenderForm: {
      blended_dt: '',
      material_id: '',
      blended_weight: '',
      stock_crushed_id: '',
    },
    material_id: '',
    changeFlag: false,

    // apierror: {
    //   code: '',
    //   status: '',
    //   messages: [],
    // },

    submitStatus: false,
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
        text: '入荷No.',
        align: 'left',
        sortable: false,
        value: 'aad_id',
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
        text: '　',
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
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    ...mapState('stockCrushingStore', ['f_InhouseCrushed', 'InhouseCrushed']),

    material_name() {
      if (this.materialMaster) {
        const materialKey = this.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },
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
      this.filterStockCrushed({ material_id: this.material_id })
      this.InhouseCrushedList = this.f_InhouseCrushed
    },
    blender_date: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    blender_hour: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
    blender_minute: {
      handler() {
        this.changeFlag = true
      },
      deep: true,
    },
  },
  created() {
    // this.material_id = this.$route.params.query.material_id
    // this.loadMaterialIds()
    // this.loadStockCrushed({ processed: 0 }).then(() => {
    //   this.StockCrushedList = this.StockCrushed
    //   this.filterStockCrushed({ material_id: this.material_id })
    //   this.StockCrushedList = this.f_StockCrushed
    // })
  },

  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('stockCrushingStore', ['loadInhouseCrushed']),
    ...mapMutations('stockCrushingStore', ['filterInhouseCrushed']),
    ...mapActions('blenderStore', ['createBlender']),

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
      this.$router.push({ path: '/blender-list', query: this.$route.params.query ?? {} })
    },

    refreshList() {
      this.loadInhouseCrushed().then(() => {
        this.filterInhouseCrushed({ material_id: this.material_id })
        this.submitStatus = false

        // this.materialIds = this.InhouseCrushed.map(fs => fs.material_id).sort()
      })
    },
    addBlenderByID(id) {
      console.log('addBlenderByID:', id)
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true

        const submitForm = {
          blended_dt: `${this.blender_date} ${this.blender_hour}:${this.blender_minute}:00`,
          material_id: '',
          blended_weight: '',
          stock_crushed_id: id,
        }

        this.createBlender(submitForm)
          .then(() => {
            this.submitStatus = false

            // this.refreshList()

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

            this.loadInhouseCrushed().then(() => {
              this.InhouseCrushedList = this.InhouseCrushed
            })
          })
      } else {
        console.log('error submit!!')
      }
    },
  },
}
</script>
