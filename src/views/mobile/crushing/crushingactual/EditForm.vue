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
          <span class="text-h6">粉砕実績-編集V2</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- <v-row align="center">
              <v-col cols="5">
                <label class="subtitle-1">No.</label>
              </v-col>
              <v-col cols="7">
                <label class="subtitle-1" for="crush_date">{{ item.crushed_id }}</label>
              </v-col>
            </v-row> -->
            <v-row align="center">
              <!-- <v-col cols="5">
                <label class="text-h6" for="crush_date">粉砕日</label>
              </v-col>
              <v-col cols="7">
                <label class="text-h6" for="crush_date">{{ item.actual_date }}</label>
              </v-col> -->
              <v-col cols="5">
                <label class="text-h6">No.</label>
              </v-col>
              <v-col cols="7">
                <label
                  class="text-h6"
                  for="crushed_id"
                >{{ item.crushed_id }}</label>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="CrushForm.material_id"
                  :error-messages="materialIdErrors"
                  :items="createInfos.material_id"
                  label="材料ID*"
                  placeholder="Select..."
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
import { mapState, mapMutations, mapActions } from 'vuex'
import WeightInput from '@/components/WeightInputComponent.vue'

export default {
  components: {
    WeightInput,
  },
  props: ['icon', 'item'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    submitStatus: false,
    dialog: false,
    CrushForm: {
      material_id: '',
      actual_weight: '',
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
    ...mapState('crushingactualStore', ['selectedCrushingActual', 'createInfos']),

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

    material_name() {
      if (this.materialMaster) {
        const materialKey = this.CrushForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },
  },
  created() {
    this.setOverlayStatus(true)
    this.loadCreateInfos()
    this.loadCrushingActual(this.item.crushed_id).then(() => {
      this.CrushForm = this.selectedCrushingActual
      this.setOverlayStatus(false)
    })
  },

  methods: {
    ...mapActions('crushingactualStore', ['editCrushingActual', 'loadCrushingActual', 'loadCreateInfos']),
    ...mapMutations('app', ['setOverlayStatus']),

    submit(CrushForm) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitStatus = true
        this.editCrushingActual(CrushForm).then(() => {
          this.submitStatus = false
          this.$emit('success')
          this.dialog = false
        })
      }
    },
    closeForm() {
      this.dialog = false
      this.$v.CrushForm.$reset()

      this.loadCrushingActual(this.item.crushed_id).then(() => {
        this.CrushForm = this.selectedCrushingActual
      })
    },
  },
}
</script>
