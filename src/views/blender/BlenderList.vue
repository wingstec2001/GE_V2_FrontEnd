<template>
  <div id="blended-list">
    <v-card>
      <v-card-title> ブレンド実績一覧 </v-card-title>
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
          <v-autocomplete
            v-model="origin"
            :items="supplierIds"
            placeholder="粉砕済仕入先"
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
            :to="{ name: 'blender-create', params: { query: this.$route.query } }"
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
        :items="blenderList"
        :search="searchQuery"
        sort-by
        class="elevation-1"
      >
        <template v-slot:[`item.blended_weight`]="{ item }">
          <label>{{ item.blended_weight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-left: 0px"
              cols="6"
            >
              <delete-form
                :id="item.id"
                :icon="icons.mdiDelete"
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
              <label>{{ sumWeight.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') }}</label>
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
/*eslint-disable*/
import { mdiCalendar, mdiMagnify, mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import DeleteForm from './BlenderDelete.vue'
/*eslint-disable*/
export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    startDate: '',
    endDate: '',
    dateEndMenu: false,
    dateStartMenu: false,
    route_id: '',
    material_id: '',
    origin:'',
    blenderList: [],


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
        value: 'id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: 'ブレンド日時',
        align: 'left',
        sortable: true,
        value: 'blended_dt',
        width: '15%',
        fixed: true,
      },
      {
        text: '材料ID',
        value: 'material_id',
        align: 'left',
        width: '15%',
        fixed: true,
      },
      // {
      //   text: '材料名',
      //   value: 'material_name',
      //   align: 'left',
      //   width: '15%',
      //   fixed: true,
      // },
      {
        text: 'ブレンド重量(kg)',
        value: 'blended_weight',
        align: 'right',
        width: '20%',
        fixed: true,
      },
      {
        text: '粉砕済仕入先',
        value: 'origin',
        align: 'left',
        width: '25%',
        fixed: true,
      },



      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '4%',
        fixed: true,
      },
    ],
  }),
  computed: {
    ...mapState('blenderStore', ['blenders']),
    ...mapState('materialStore', ['materialIds']),
    ...mapState('customerStore', ['supplierIds']),
    sumWeight() {
      let sum = 0

      this.blenderList.forEach(k => {
        // eslint-disable-next-line no-const-assign
        sum += k.blended_weight
      })

      return sum
    },
  },
  watch: {
    material_id(val) {
      this.changeRouteQuery('material_id', val)
      this.refreshList()
    },
    origin(val) {

      this.changeRouteQuery('origin', val)
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

  },

  created() {
    this.loadMaterialIds()
    this.loadSupplierIds()
    this.changeRouteQuery()
    this.loadQuery()
    this.refreshList()
  },

  methods: {
    ...mapActions('materialStore', ['loadMaterialIds']),
    ...mapActions('blenderStore', ['loadBlenders']),
    ...mapMutations('app', ['setOverlayStatus']),
     ...mapActions('customerStore', ['loadSupplierIds']),

    refreshList() {
      this.setOverlayStatus(true)
      this.loadBlenders(this.$route.query).then(() => {

        this.blenderList = this.blenders

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
      this.loadBlenders(this.$route.query).then(() => {
        const items = this.$refs.filteredTable.$children[0].filteredItems
        const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

        let csv = '\ufeff' + 'No.,ブレンドID,ブレンド日時,材料ID,ブレンド重量(kg),FROM\n'
        sorted.forEach((el,index) => {
          const line = `${index+1},"${el.id}","${el.blended_dt}","${el.material_id}","${el.blended_weight
            .toString()
            .replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}","${el.origin}"\n`
          csv += line
        })
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
        const newstr = nowstr.replace(/(-|:|T)/g, '')
        link.download =`ブレンド実績一覧-${newstr}.csv`
        link.click()
      })
    },
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
