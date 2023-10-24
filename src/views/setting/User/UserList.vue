<template>
  <div id="material-list">
    <v-card>
      <v-card-title>ユーザー一覧</v-card-title>
      <v-row class="px-2 ma-0">
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="name"
            placeholder="ユーザー名"
            :items="usernames"
            outlined
            clearable
            dense
            hide-details
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3">
          <v-autocomplete
            v-model="userRoles"
            placeholder="権限"
            :items="Roles.map(role => role.name)"
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
          <v-btn color="primary" class="mb-4 me-3" :to="{ name: 'user-create', params: { query: this.$route.query } }">
            <span>NEW</span>
          </v-btn>
          <!-- <v-btn
            color="secondary"
            outlined
            class="mb-4"
          >
            <v-icon
              size="17"
              class="me-1"
            >
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn> -->
        </div>
      </v-card-text>
      <v-data-table :headers="headers" :items="userList" :search="searchQuery" sort-by="name" class="elevation-1">
        <template v-slot:top> </template>
        <template v-slot:[`item.invalid`]="{ item }">
          <v-checkbox v-if="item.invalid == 0" v-model="Uncheck" readonly class="pa-0 ma-0" hide-details> </v-checkbox>
          <v-checkbox v-if="item.invalid == 1" v-model="Check" readonly class="pa-0 ma-0" hide-details> </v-checkbox>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col cols="4">
              <v-icon class="mr-2" small @click="editItem(item)">
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col cols="4">
              <v-icon class="mr-2" small @click="editPassword(item)">
                {{ icons.mdiKey }}
              </v-icon>
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
import { mapState, mapActions, mapMutations } from 'vuex'
/* eslint-disable */

export default {
  data: () => ({
    icons: {
      mdiPencil,
      mdiDelete,
      mdiExportVariant,
      mdiKey,
    },

    // items: ['Stuff', 'Admin', 'Super-Admin'],
    name: '',
    userRoles: '',
    searchQuery: '',
    userList: [],
    Check: true,
    Uncheck: false,
    headers: [
      {
        text: 'ユーザー名',
        value: 'name',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: 'メールアドレス',
        value: 'email',
        align: 'left',
        width: '40%',
        fixed: true,
      },
      {
        text: '権限',
        value: 'userRoles',
        align: 'left',
        width: '20%',
        fixed: true,
      },
      {
        text: '無効',
        value: 'invalid',
        filterable: false,
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '10%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('roleStore', ['Roles']),
    ...mapState('userStore', ['users', 'usernames']),
  },

  watch: {
    name(val) {
      this.changeRouteQuery('name', val)
      this.refreshList()
    },
    userRoles(val) {
      this.changeRouteQuery('userRoles', val)
      this.refreshList()
    },
    users(value) {
      this.userList = value
    },
  },

  created() {
    this.loadUserNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
    this.loadRoles()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('userStore', ['loadUsers', 'loadUser', 'loadUserNames']),
    ...mapActions('roleStore', ['loadRoles']),
    refreshList() {
      this.setOverlayStatus(true)
      this.loadUsers(this.$route.query).then(() => {
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
      this.userRoles = this.$route.query.userRoles ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'user-edit', params: { id: item.id, query: this.$route.query } })
    },
    editPassword(item) {
      this.$router.push({ name: 'user-edit-pwd', params: { id: item.id, query: this.$route.query } })
    },

    // ...mapMutations('userStore', ['filterUsers']),
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
