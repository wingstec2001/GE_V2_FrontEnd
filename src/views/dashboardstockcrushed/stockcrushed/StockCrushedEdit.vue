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
          <span class="text-h5">材料粉砕済編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="inout_date"
                  label="粉砕日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="StockCrushed.material_id"
                  :items="materialIds"
                  label="原材料ID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="material_name"
                  label="原材料名*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="StockCrushed.crushed_weight"
                  label="粉砕済み重量*"
                  suffix="Kg"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="StockCrushed.inout_direction"
                  :items="inout_direction"
                  label="入出庫"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="submit(StockCrushed)"
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
  props: ['icon', 'item'],
  data: () => ({
    icons: {
      mdiCalendar,
    },

    dialog: false,
    inout_direction: [
      { text: '入庫', value: 0 },
      { text: '出庫', value: 1 },
    ],
    StockCrushed: {
      material_id: '',
      crushed_weight: '',
      inout_direction: '',
    },
  }),
  computed: {
    ...mapState('materialStore', ['materialMaster', 'materialIds']),
    material_name() {
      if (this.materialMaster) {
        const materialKey = this.StockCrushed.material_id

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

    closeForm() {
      this.dialog = false
    },
  },
}
</script>
