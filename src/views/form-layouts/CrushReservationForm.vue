<template>
  <div justify="center">
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
          <span class="text-h5">粉砕予定</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  ref="ScheduledDate"
                  v-model="ScheduledDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="粉砕予定日*"
                      :prepend-icon="icons.mdiCalendar"
                      disabled
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  ref="country"
                  v-model="materialId"
                  :rules="[() => !!materialId || 'This field is required']"
                  :items="materialsId"
                  label="材料  ID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="材料名*"
                  :value="materialName"
                  disabled
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="粉砕予定量*"
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
            color="blue darken-1"
            text
            @click="clear"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiCalendar } from '@mdi/js'

export default {
  props: ['icon', 'item', 'materialsList'],
  data: () => ({
    dialog: false,
    icons: {
      mdiCalendar,
    },
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    ScheduledDate: false,
    materialsId: [],
    materialId: '',
    materialName: '',
  }),
  watch: {
    materialId(newValue) {
      if (newValue) {
        this.materialName = this.materialsList.find(m => m.material_id === newValue).material_name
      } else {
        this.materialName = ''
      }
    },
  },
  mounted() {
    if (this.materialsList) {
      this.materialsId = Array.from(this.materialsList, x => x.material_id)
    }
    if (this.item) {
      this.materialId = this.item.id
    }
  },
  methods: {
    clear() {
      this.dialog = false
    },
  },
}
</script>
