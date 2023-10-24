<template>
  <div justify="center">
    <v-icon
      class="mr-2"
      small
      @click.stop="openForm"
    >
      {{ icon }}
    </v-icon>
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
          >月末繰越-ペレット編集V2</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="5">
                <label class="text-h6">No.</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="id"
                >{{ item.id }}</label>
              </v-col> -->
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
                <label class="text-h6">ペレットID</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="id"
                >{{ item.product_id }}</label>
              </v-col>
              <v-col cols="12">
                <weight-input
                  v-model="item.total_weight"
                  label="在庫量*"
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
  props: ['icon', 'id'],
  data: () => ({
    submitStatus: false,
    dialog: false,
    item: {
    },
  }),
  validations: {
    item: {
      product_id: {
        required,
      },
      total_weight: {
        required,
        decimal,
      },
    },
  },
  computed: {
    ...mapState('getsujiProductStore', ['selMonthlyProduct']),
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
    ...mapActions('getsujiProductStore', ['loadMonthlyProduct', 'editMonthlyProduct']),
    ...mapMutations('app', ['setOverlayStatus']),
    submit(item) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...item }
        this.editMonthlyProduct(submitForm).then(() => {
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
      this.loadMonthlyProduct(this.id).then(() => {
        this.item = { ...this.selMonthlyProduct }
        this.dialog = true
        this.setOverlayStatus(false)
      })
    },
    closeForm() {
      this.$emit('cancel')
      this.dialog = false
      this.item = {
      }
    },
  },
}
</script>
