<template>
  <div justify="center">
    <a
      href="javascript:void(0);"
      @click="openForm"
    >{{ formatData(wgtout_lmSum) }}</a>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
            style="color: red"
          >出庫繰越-ぺレット編集V2</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="5">
                <label class="text-h6">対象年月</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="id"
                >{{ item.yyyymm }}</label>
              </v-col>
              <v-col cols="5">
                <label class="text-h6">ぺレットID</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="id"
                >{{ item.product_id }}</label>
              </v-col>
              <v-col cols="12">
                <weight-input
                  v-model="item.wgtout_lmSum"
                  label="重量*"
                  :outlined="false"
                  :error-messages="weightErrors"
                ></weight-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="submitStatus"
            @click="submit(item)"
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
import { mapActions, mapState, mapMutations } from 'vuex'
import { required, decimal } from 'vuelidate/lib/validators'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  props: ['product_id', 'month', 'wgtout_lmSum'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
  }),
  validations: {
    item: {
      wgtout_lmSum: {
        required,
        decimal,
      },
    },
  },
  computed: {
    ...mapState('getsujiMaterialStore', ['selMonthlyMaterial']),
    formatData() {
      return function (data) {
        if (typeof data === 'number') {
          return data.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }
        if (typeof data === 'string') {
          return data.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
        }

        return data
      }
    },
    weightErrors() {
      const errors = []
      if (!this.$v.item.wgtout_lmSum.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.item.wgtout_lmSum.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.item.wgtout_lmSum.decimal && errors.push('必須数字')

      return errors
    },
  },
  methods: {
    ...mapActions('getsujiMaterialStore', ['loadMonthlyMaterial', 'editMonthlyMaterial']),
    ...mapMutations('app', ['setOverlayStatus']),
    submit() {
      this.$emit('edited')
      this.dialog = false
      this.item = {
      }
    },
    openForm() {
      this.setOverlayStatus(true)
      this.setOverlayStatus(false)
      this.dialog = true
    },
    closeForm() {
      this.$emit('cancel')
      this.dialog = false
      this.item = {
      }
    },
  },
  watch: {
    dialog(val) {
      if (val === true) {
        const date = new Date(`${this.month.substring(0, 4)}-${this.month.substring(4, 6)}`)
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1)).toISOString().substring(0, 7).replace('-', '')
        this.item.product_id = this.product_id
        this.item.wgtout_lmSum = this.wgtout_lmSum
        this.item.yyyymm = lastMonth
      }
    },
  },
}
</script>
