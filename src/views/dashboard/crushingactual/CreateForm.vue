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
          <span class="text-h5">新規</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="date"
                  label="粉砕開始日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="CrushForm.material_id"
                  :items="materialIds"
                  label="材料ID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="material_name"
                  label="材料名*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="CrushForm.actual_weight"
                  label="粉砕重量*"
                  suffix="Kg"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
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
import { mapActions, mapState } from 'vuex'

export default {
  props: ['icon'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    dialog: false,
    CrushForm: {
      material_id: '',
      actual_weight: '',
      actual_date: '',
    },
  }),
  computed: {
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    material_name() {
      if (this.materialMaster) {
        const materialKey = this.CrushForm.material_id

        return this.materialMaster[materialKey]
      }

      return ''
    },
  },
  created() {
    this.loadMaterialIds()
  },

  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('crushingactualStore', ['createCrushingActual']),
    ...mapActions('dashboardStore', ['loadCrushingActualdetails']),
    submit(CrushForm) {
      this.createCrushingActual(CrushForm).then(() => {
        this.closeForm()
        this.loadCrushingActualdetails()
      })
    },
    closeForm() {
      this.dialog = false
      this.CrushForm = {}
    },
  },
}
</script>
