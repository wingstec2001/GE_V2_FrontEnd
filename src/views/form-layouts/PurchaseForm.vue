<template>
  <div justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon small class="mt-n2 me-n3" v-bind="attrs" v-on="on">
          <v-icon size="22">
            {{ icons.mdiPencil }}
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">入荷計画</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="入荷  ID**" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  ref="material"
                  v-model="material"
                  :rules="[() => !!material || 'This field is required']"
                  :items="materials"
                  label="材料ID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field label="材料名*" required disabled></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  ref="material"
                  v-model="material"
                  :rules="[() => !!material || 'This field is required']"
                  :items="materials"
                  label="取引先  ID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field label="取引先名*" required disabled></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="予定入荷日"
                      :prepend-icon="icons.mdiCalendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field label="予定重量*" suffix="Kg" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiPlus, mdiCalendar, mdiPencil } from '@mdi/js'

export default {
  data: () => ({
    dialog: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    menu: false,
    materials: ['C-992-IV1', 'C-992-IV2', 'C-992-IV3', 'C-992-IV4', 'C-993-IV1', 'C-993-IV2', 'C-993-IV3', 'C-993-IV4'],
    material: null,
  }),
  setup() {
    return {
      icons: {
        mdiPlus,
        mdiCalendar,
        mdiPencil,
      },
    }
  },
}
</script>
