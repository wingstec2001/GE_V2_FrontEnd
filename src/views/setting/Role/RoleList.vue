<template>
  <div id="material-list">
    <v-card>
      <v-card-title>権限一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="name"
            placeholder="権限"
            :items="Roles.map(role => role.name)"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
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
          class="Role-search me-3 mb-4"
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <div class="d-flex align-center flex-wrap">
          <v-btn color="primary" class="mb-4 me-3" :to="{ name: 'role-create', params: { query: this.$route.query } }">
            <span>NEW</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table :headers="headers" :items="RoleList" :search="searchQuery" sort-by="name" class="elevation-1">
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col style="padding-right: 0px" cols="4">
              <v-icon class="mr-2" small @click="editItem(item)">
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col style="padding-left: 0px" cols="6">
              <delete-dialog
                :id="item.id"
                :icon="icons.mdiDelete"
                @deleted="refreshList"
                @cancel="refreshList"
              ></delete-dialog>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
/* eslint-disable */
import { mdiPencil, mdiDelete, mdiExportVariant, mdiKey } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import DeleteDialog from './RoleDelete.vue'
/* eslint-disable */

export default {
  components: {
    DeleteDialog,
  },
  data: () => ({
    icons: {
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
      mdiKey,
    },
    name: '',
    RoleRoles: '',
    searchQuery: '',
    RoleList: [],
    Check: true,
    Uncheck: false,
    headers: [
      {
        text: '権限id',
        value: 'id',
        align: 'left',
        width: '21%',
        fixed: true,
      },
      {
        text: '権限',
        value: 'name',
        align: 'left',
        width: '41%',
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
    ...mapState('roleStore', ['Roles', 'Rolenames']),
  },

  watch: {
    name(val) {
      this.changeRouteQuery('name', val)
      this.refreshList()
    },
    Roles(value) {
      this.RoleList = value
    },
  },

  created() {
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
    this.loadRoleNames()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    refreshList() {
      this.setOverlayStatus(true)
      this.loadRoles(this.$route.query).then(() => {
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
      this.name = this.$route.query.name ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'role-edit', params: { id: item.id, query: this.$route.query } })
    },
    ...mapActions('roleStore', ['loadRoles', 'loadUpdateRoleInfo', 'loadRoleNames', 'deleteRole']),

    // ...mapMutations('roleStore', ['filterRoles']),
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
