<template>
  <div justify="center">
    <a
      href="javascript:void(0);"
      @click="openForm"
    >{{ formatData(weight) }}</a>
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
          >前月繰越-未粉砕-編集 ({{ id }})</span>
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
                <label class="text-h6">材料ID</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="id"
                >{{ item.material_id }}</label>
              </v-col>
              <v-col cols="12">
                <weight-input
                  v-model="item.total_weight"
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
  props: ['id', 'material_id', 'month', 'weight'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
  }),
  validations: {
    item: {
      total_weight: {
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
      if (!this.$v.item.total_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.item.total_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.item.total_weight.decimal && errors.push('必須数字')

      return errors
    },
  },
  methods: {
    ...mapActions('getsujiMaterialStore', ['editMonthlyMaterial']),
    ...mapMutations('app', ['setOverlayStatus']),

    submit(item) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...item }
        console.log('submit:', submitForm)
        this.editMonthlyMaterial(submitForm).then(() => {
          this.submitStatus = false
          this.$emit('edited')
          this.dialog = false
        })
      } else {
        console.log('error submit!!')
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
        this.item.material_id = this.material_id
        this.item.total_weight = this.weight
        this.item.yyyymm = lastMonth
        this.item.id = this.id
      }
    },
  },
}
</script>
