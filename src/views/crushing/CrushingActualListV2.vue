<template>
  <div id="crushingactual-list">
    <v-card>
      <v-card-title>粉砕実績一覧V2</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          md="3"
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
        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            v-model="dateStartMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                placeholder="From"
                dense
                hide-details
                outlined
                readonly
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="dateStartMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-menu
            v-model="dateEndMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                placeholder="To"
                dense
                outlined
                hide-details
                readonly
                v-bind="attrs"
                :prepend-icon="icons.mdiCalendar"
                clearable
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @input="dateEndMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
      <v-card-text class="d-flex align-center flex-wrap pb-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          outlined
          hide-details
          dense
          class="user-search me-3 mb-4"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <div class="d-flex align-center flex-wrap">
          <v-btn
            color="primary"
            class="mb-4 me-3"
            :to="{ name: 'crushingactual-create', params: { query: this.$route.query } }"
          >
            <span>NEW</span>
          </v-btn>
          <v-btn
            color="secondary"
            outlined
            class="mb-4"
            @click="downloadCSV"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        ref="filteredTable"
        :headers="headers"
        :items="crushingactualList"
        :search="searchQuery"
        sort-by
        class="elevation-1"
      >
        <template v-slot:[`item.actual_weight`]="{ item }">
          <label>{{ item.actual_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row v-if="!item.processed">
            <v-col
              style="padding-right: 0px"
              cols="6"
            >
              <v-icon
                class="mr-2"
                small
                @click="editItem(item)"
              >
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col
              style="padding-left: 0px"
              cols="6"
            >
              <delete-form
                :icon="icons.mdiDelete"
                :crushed-id="item.crushed_id"
                @deleted="refreshList"
                @cancel="refreshList"
              ></delete-form>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`body.append`]>
          <tr v-if="material_id">
            <td
              class="font-weight-bold"
              style="background: #fafafa"
              :colspan="2"
            >
              <label>{{ material_id }}の合計</label>
            </td>
            <td
              style="background: #fafafa"
              :colspan="1"
            ></td>
            <td
              class="font-weight-bold"
              style="text-align: right; background: #fafafa"
            >
              <label>{{ sumWeight }}</label>
            </td>
            <td
              style="background: #fafafa"
              :colspan="1"
            ></td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import { mdiCalendar, mdiMagnify, mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import DeleteForm from './CrushingActualDelete.vue'
/* eslint-disable */

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    startDate: '',
    endDate: '',
    dateEndMenu: '',
    dateStartMenu: '',
    material_id: '',
    crushingactualList: [],
    icons: {
      mdiCalendar,
      mdiMagnify,
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
    },
    searchQuery: '',
    headers: [
      {
        text: 'No.',
        value: 'crushed_id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '粉砕日時',
        align: 'left',
        sortable: true,
        value: 'actual_date',
        width: '15%',
        fixed: true,
      },
      {
        text: '材料ID',
        value: 'material_id',
        width: '15%',
        align: 'left',
        sortable: true,
        fixed: true,
      },
      
      {
        text: '重量(kg)',
        value: 'actual_weight',
        width: '10%',
        align: 'right',
        sortable: true,
        fixed: true,
      },
      {
        text: '備考',
        value: 'note',
        width: '10%',
        align: 'left',
        sortable: false,
        fixed: false,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        width: '5%',
        align: 'center',
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('crushingactualStore', ['crushingactuals']),
    ...mapState('materialStore', ['materialIds']),

    sumWeight() {
      let sum = 0
  
      this.crushingactualList.forEach(k => {
        sum += k.actual_weight
      })

      return sum.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
  },
  watch: {
    material_id(val) {
      this.changeRouteQuery('material_id', val)
      this.refreshList()
    },
    startDate(val) {
      this.changeRouteQuery('start_date', val)
      this.refreshList()
    },
    endDate(val) {
      this.changeRouteQuery('end_date', val)
      this.refreshList()
    },
    crushingactuals(value) {

      this.crushingactualList = value
    },
  },

  created() {
    this.loadQuery()
    this.changeRouteQuery()
    this.refreshList()
    this.loadMaterialIds()
  },

  methods: {
    editItem(item) {
      this.$router.push({ name: 'crushingactual-edit', params: { id: item.crushed_id, query: this.$route.query } })
    },
    refreshList() {
      this.setOverlayStatus(true)
      this.loadCrushingActuals(this.$route.query).then(() => {
        this.setOverlayStatus(false)
      })
    },
    changeRouteQuery(key, val) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      if (val) {
        query[key] = val
      } else {
        delete query[key]
      }
      this.$router.push({ path: this.$route.path, query })
    },
    loadQuery() {
      this.material_id = this.$route.query.material_id ?? ''
      this.startDate = this.$route.query.start_date ?? ''
      this.endDate = this.$route.query.end_date ?? this.endDate
    },
    downloadCSV() {
      this.loadCrushingActuals(this.$route.query).then(() => {
        const items = this.$refs.filteredTable.$children[0].filteredItems
        const sorted = this.$refs.filteredTable.$children[0].sortItems(items)
       
        let csv = '\ufeff' + 'No,粉砕ID,粉砕日時,材料ID,材料名,重量(Kg),備考\n'
        sorted.forEach((el,index) => {
          const note = el.note ?? ''
          const line = `${index+1},"${el.crushed_id}","${el.actual_date}","${el.material_id}","${
            el.material_name
          }","${el.actual_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}","${note}"\n`
          csv += line
        })
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
        const newstr = nowstr.replace(/(-|:|T)/g, '')
        link.download =`粉砕実績一覧-${newstr}.csv`
        link.click()
      })
    },

    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('crushingactualStore', ['loadCrushingActuals']),
    ...mapMutations('app', ['setOverlayStatus']),
  },
}
</script>
<style>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
.v-input__prepend-outer {
  margin: auto !important;
}
.text-field-dense-append-prepend-margin {
  margin: auto;
}
.v-input__append-inner {
  margin: auto !important;
}
</style>
