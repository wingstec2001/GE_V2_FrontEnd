<template>
  <div id="material-list">
    <v-card>
      <v-card-title> 材料一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="material_id"
            placeholder="材料ID"
            :items="materialIds"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="material_name"
            :items="materialNames"
            placeholder="材料名"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="3"
        ></v-col>
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
            :to="{ name: 'material-create' }"
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
        :items="materialList"

        :search="searchQuery"
        class="elevation-1"
      >
        > >
        <template v-slot:top>
        </template>
        <!-- <template v-slot:item.actions="{ item }"> -->
        <template v-slot:[`item.material_img`]="{ item }">
          <div class="p-2">
            <v-img
              :src="item.material_img ? `${item.material_img}` : require('@/assets/images/noimage.jpg')"
              max-height="50"
              max-width="50"
              class="me-3"
            >
            </v-img>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-right: 10px"
              cols="2"
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
              style="padding-right: 10px"
              cols="2"
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
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import { mdiPencil, mdiDelete, mdiExportVariant } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'

import DeleteForm from './MaterialDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icons: { mdiPencil, mdiDelete, mdiExportVariant },

    material_id: '',
    material_name: '',
    searchQuery: '',
    materialList: [],
    headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: 'イメージ',
        value: 'material_img',
        filterable: false,
        sortable: false,
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '材料ID',
        align: 'left',
        value: 'material_id',
        width: '20%',
        fixed: true,
      },
      {
        text: '材料名',
        value: 'material_name',
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '説明',
        value: 'material_note',
        align: 'left',
        width: '20%',
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
    ...mapState('materialStore', ['materials', 'materialIds', 'materialNames', 'f_materials']),
  },
  watch: {
    material_id(val) {
      this.changeRouteQuery('material_id', val)
      this.refreshList()
    },

    material_name(val) {
      this.changeRouteQuery('material_name', val)
      this.refreshList()
    },

    materials(value) {
      this.materialList = value
    },
  },

  created() {
    this.loadMaterialIds()
    this.loadMaterialNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('materialStore', ['loadMaterials', 'loadMaterialIds', 'loadMaterialNames']),

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
      this.material_name = this.$route.query.material_name ?? ''
    },
    refreshList() {
      this.setOverlayStatus(true)
      this.loadMaterials(this.$route.query).then(() => {
        this.setOverlayStatus(false)
      })
    },

    editItem(item) {
      this.$router.push({ name: 'material-edit', params: { id: item.id } })
    },

    // 画面で表示されている情報をcsvにダウンロードする
    downloadCSV() {
      const items = this.$refs.filteredTable.$children[0].filteredItems
      const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No,材料ID,材料,説明\n'
      let no = 0

      sorted.forEach(el => {
        /* eslint-disable */
        no = no + 1
        /* eslint-disable */

        let note = el.material_note
        if (el.material_note === null) {
          note = ' '
        }
        const line = `${no},'${el.material_id}','${el.material_name}','${note}'\n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')

      link.download = '材料一覧'.concat('-', newstr, '.csv')
      link.click()
    },
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
