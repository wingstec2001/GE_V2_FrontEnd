<template>
  <div id="material-list">
    <v-card>
      <v-card-title>都市一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="area_id"
            placeholder="都市ID"
            :items="areaIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="area_name"
            placeholder="都市名"
            :items="areaNames"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3"></v-col>
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
          <v-btn color="primary" class="mb-4 me-3" :to="{ name: 'area-create', params: { query: this.$route.query } }">
            <span>NEW</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table :headers="headers" :items="areaList" :search="searchQuery" sort-by="area_id" class="elevation-1">
        <template v-slot:top> </template>
        <!-- <template v-slot:item.actions="{ item }"> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col style="padding-right: 0px" cols="6">
              <v-icon class="mr-2" small @click="editItem(item)">
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col style="padding-left: 0px" cols="6">
              <delete-form
                :id="item.id"
                :icon="icons.mdiDelete"
                @deleted="refreshList"
                @cancel="refreshList"
              ></delete-form>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'

import DeleteForm from './AreaDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icons: { mdiPencil, mdiDelete, mdiExportVariant },
    area_id: '',
    area_name: '',
    searchQuery: '',
    areaList: [],
    headers: [
      {
        text: '都市ID',
        align: 'left',
        sortable: true,
        value: 'area_id',
        width: '46%',
        fixed: true,
      },
      {
        text: '都市名',
        value: 'area_name',
        align: 'left',
        width: '46%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('areaStore', ['areas', 'areaIds', 'areaNames', 'f_areas']),
  },
  watch: {
    area_id(val) {
      this.changeRouteQuery('area_id', val)
      this.refreshList()
    },
    area_name(val) {
      this.changeRouteQuery('area_name', val)
      this.refreshList()
    },
    areas(value) {
      this.areaList = value
    },
  },

  created() {
    this.loadAreaIds()
    this.loadAreaNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('areaStore', ['loadAreas', 'loadAreaIds', 'loadAreaNames']),
    refreshList() {
      this.setOverlayStatus(true)
      this.loadAreas(this.$route.query).then(() => {
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
      this.area_id = this.$route.query.area_id ?? ''
      this.area_name = this.$route.query.area_name ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'area-edit', params: { id: item.id, query: this.$route.query } })
    },

    // ...mapMutations('areaStore', ['filterAreas']),
  },
}
</script>
<style scoped>
.table-filed {
  white-space: normal;
}
.text-format {
  text-align: right !important;
}
</style>
