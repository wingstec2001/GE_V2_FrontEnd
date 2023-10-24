<template>
  <v-card>
    <v-row class="px-2 ma-0">
      <v-col cols="4">
        <v-select
          v-model="$v.material_id.$model"
          :items="materialIds"
          placeholder="材料ID"
          outlined
          clearable
          dense
          hide-details="auto"
          class="subtitle-1"
          :error-messages="materialIdErrors()"
        ></v-select>
      </v-col>

      <v-col cols="4">
        <WeightInput
          v-model="blended_weight"
          label="ブレンド重量*"
          :outlined="true"
          hide-details="auto"
        ></WeightInput>
      </v-col>
      <v-col cols="4">
        <v-btn
          color="primary"
          outlined
          @click="Submit()"
        >
          <v-icon class="me-1">
            {{ icons.mdiPlus }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12">
        <v-card>
          <v-data-table
            ref="Blenders"
            :headers="headers"
            :items="f_ArrivalCrushed"
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
  </v-card>
</template>

<script>
import {
  mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd, mdiPlus, mdiPlusThick,
} from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import WeightInput from '@/components/WeightInputComponent.vue'

export default {

  components: {

    WeightInput,
  },
  props: {},
  data: () => ({
    material_id: '',
    blended_weight: 0,
    time: '',
    icons: {
      mdiDotsVertical,
      mdiTrendingUp,
      mdiCurrencyUsd,
      mdiPlus,
      mdiPlusThick,
    },
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
        text: '入荷No.',
        align: 'left',
        sortable: false,
        value: 'aad_id',
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
    material_id: {
      required,
    },

    // blended_weight: {
    //   required,
    //   minValue: minValue(1),
    //   maxValue: maxValue(100),
    // },
  },

  computed: {

    ...mapState('app', ['clientHeight']),
    ...mapState('stockCrushingStore', ['f_ArrivalCrushed', 'ArrivalCrushed']),
  },
  watch: {
    material_id() {
      this.filterArrivalCrushed({ material_id: this.material_id })
    },
  },
  mounted() {
    this.refreshList()
  },

  methods: {
    ...mapActions('stockCrushingStore', ['loadArrivalCrushed', 'addByWeight']),
    ...mapActions('dashboardStore', ['loadBlendedDaySum']),
    ...mapMutations('stockCrushingStore', ['filterArrivalCrushed']),

    refreshList() {
      this.loadArrivalCrushed().then(() => {
        this.filterArrivalCrushed({ material_id: this.material_id })

        this.materialIds = this.ArrivalCrushed.map(fs => fs.material_id).sort()
      })
      this.loadBlendedDaySum()
    },

    // sliderClicked(val) {
    //   if (val.target === 'confirm') {
    //     agent.Perform.Blending([{ id: val.id }]).then(() => {
    //       this.refreshList()

    //       val.node.resetSlider()
    //     })
    //   }
    // },

    materialIdErrors() {
      const errors = []
      if (!this.$v.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.material_id.required && errors.push('必須項目')

      return errors
    },

    // weightErrors() {
    //   console.log('weighterrors:', this.blended_weight)
    //   const errors = []
    //   if (!this.$v.material_id.$dirty) return errors
    //   // eslint-disable-next-line no-unused-expressions
    //   if (this.$v.blended_weight.minValue) {
    //     console.log('<1')
    //     errors.push('１以上を入力')
    //   }

    //   return errors
    // },

    // 数量によるブレンド
    Submit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        console.log('filted:', this.f_ArrivalCrushed)

        // if (this.blended_weight <= 0) {
        // // eslint-disable-next-line no-restricted-globals
        //   if (!confirm('重量は0です。続行しますか?')) {
        //     return
        //   }
        //   console.log('0 です。')
        // }
        // let bigger = false
        // this.f_ArrivalCrushed.forEach(element => {
        //   if (element.crushed_weight < this.blended_weight) {
        //     bigger = true
        //   }
        // })
        // if (bigger) {
        //   alert('重量を分割して下さい!')

        //   return
        // }
        let isBigger = true

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < this.f_ArrivalCrushed.length; i++) {
          if (this.blended_weight <= this.f_ArrivalCrushed[i].crushed_weight) {
            isBigger = false
            console.log(this.blended_weight, this.f_ArrivalCrushed[i].crushed_weight, isBigger)
            break
          }
        }

        if (isBigger) {
          /* eslint no-alert: */
          alert('ブレンド重量を分割して下さい!')

          return
        }

        this.info.material_id = this.material_id
        this.info.blended_weight = this.blended_weight
        console.log('submit:', this.info)
        this.addByWeight(this.info).then(() => {
          this.refreshList()
          this.blended_weight = 0
        })
      } else {
        console.log('weight:', this.blended_weight)
        console.log('material_id dirty:', this.$v.material_id.$dirty)
        console.log('error submit!!', this.$v)
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
