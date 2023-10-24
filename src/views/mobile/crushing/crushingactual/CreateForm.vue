<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
      @click="open()"
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
          <span class="text-h6">粉砕実績-新規V2</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-col cols="6">
                <label
                  class="text-h7"
                  for="crush_time"
                >粉砕時間</label>
              </v-col>
              <v-col cols="6">
                <label
                  class="text-h7"
                  for="crush_time"
                >{{ crush_time }}</label>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="CrushForm.material_id"
                  :items="createInfos.material_id"
                  label="材料ID*"
                  placeholder="Select..."
                  :error-messages="materialIdErrors"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <WeightInput
                  v-model="CrushForm.actual_weight"
                  label="粉砕重量*"
                  :outlined="false"
                  :error-messages="weightErrors"
                ></WeightInput>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="CrushForm.note"
                  :error-messages="noteErrors"
                  :counter="100"
                  label="備考"
                  outlined
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
            @click="submit(CrushForm)"
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
  props: ['icon'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    submitStatus: false,
    crush_time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),

    // crush_time: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(11, 16),
    dialog: false,
    CrushForm: {
      material_id: '',
      actual_weight: 0,
      note: '',
    },
  }),
  validations: {
    CrushForm: {
      material_id: {
        required,
      },
      actual_weight: {
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
    ...mapState('crushingactualStore', ['createInfos']),
    materialIdErrors() {
      const errors = []
      if (!this.$v.CrushForm.material_id.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushForm.material_id.required && errors.push('必須項目')

      return errors
    },
    weightErrors() {
      const errors = []
      if (!this.$v.CrushForm.actual_weight.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushForm.actual_weight.required && errors.push('必須項目')
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushForm.actual_weight.numeric && errors.push('必須数字')

      return errors
    },

    noteErrors() {
      const errors = []
      if (!this.$v.CrushForm.note.$dirty) return errors
      // eslint-disable-next-line no-unused-expressions
      !this.$v.CrushForm.note.maxLength && errors.push('100文字以内にしてください。')

      return errors
    },
  },
  created() {
    this.loadCreateInfos()
  },

  methods: {
    ...mapActions('crushingactualStore', ['createCrushingActual', 'loadCreateInfos']),

    // ...mapActions('dashboardStore', ['loadCrushingDaySum']),

    submit(CrushForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        const submitForm = { ...CrushForm }
        this.createCrushingActual(submitForm).then(() => {
          this.submitStatus = false
          this.$emit('success')
          this.closeForm()
        })
      } else {
        console.log('error submit!!')
      }
    },
    open() {
      this.crush_time = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(11, 16)
    },
    closeForm() {
      this.dialog = false
      this.CrushForm.actual_weight = 0
      this.$v.CrushForm.$reset()
    },
  },
}
</script>
