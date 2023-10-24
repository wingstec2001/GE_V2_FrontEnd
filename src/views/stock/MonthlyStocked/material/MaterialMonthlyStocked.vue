<template>
  <v-row
    class="px-2 mt-2"
    align="center"
  >
    <v-col
      cols="12"
      md="3"
      class="py-4"
    >
      <v-autocomplete
        v-model="material_id"
        :items="materialIds"
        placeholder="材料ID"
        outlined
        clearable
        dense
        hide-details
      ></v-autocomplete>
    </v-col>
    <v-spacer></v-spacer>
    <v-col
      cols="12"
      class="pa-0"
    >
      <v-data-table
        ref="MthlyMatStockSt"
        :headers="headers"
        :items="f_MonthlyMaterials"
        item-key="material_id"
        :items-per-page="-1"
      >
        <template v-slot:[`item.total_weight`]="{ item }">
          <label :style="item.total_weight < 0 ? 'color:#F44336' : ''">{{ item.total_weight ? item.total_weight.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,') : '0' }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col cols="12">
              <material-monthly-st-edit
                :id="item.id"
                :icon="icons.mdiPencil"
                @edited="reload"
                @cancel="reload"
              ></material-monthly-st-edit>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mdiPencil } from '@mdi/js'
import { mapState, mapMutations, mapActions } from 'vuex'
import MaterialMonthlyStEdit from './MaterialMonthlyStEdit.vue'

export default {
  components: {
    MaterialMonthlyStEdit,
  },
  data: () => ({
    dialogDelete: false,
    icons: { mdiPencil },
    materialIds: [],
    material_id: '',
    exportStatus: false,
    headers: [
      {
        text: '材料ID',
        align: 'left',
        value: 'material_id',
        width: '45%',
        fixed: true,
      },
      {
        text: '在庫量(kg)',
        value: 'total_weight',
        align: 'right',
        width: '50%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '5%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('getsujiMaterialStore', ['MonthlyMaterials', 'f_MonthlyMaterials']),
  },

  watch: {
    material_id() {
      this.filterIdMonthlyMaterials(this.material_id)
    },
  },

  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('getsujiMaterialStore', ['loadMonthlyMaterials']),
    ...mapMutations('getsujiMaterialStore', ['filterIdMonthlyMaterials']),
    ...mapMutations('app', ['setOverlayStatus']),
    reload() {
      this.$emit('reload')
    },
    loadData(selMonth) {
      this.loadMonthlyMaterials(selMonth).then(() => {
        this.filterIdMonthlyMaterials(this.material_id)

        this.materialIds = this.MonthlyMaterials.map(fs => fs.material_id)
        this.setOverlayStatus(false)
      })
    },
  },
}
</script>
