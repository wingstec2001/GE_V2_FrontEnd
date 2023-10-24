<template>
  <div id="material-list">
    <v-card>
      <v-card-title> 国・地域一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="country_id"
            placeholder="国・地域ID"
            :items="countryIds"
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
            v-model="country_name"
            placeholder="国・地域名"
            :items="countryNames"
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
            :to="{ name: 'country-create', params: { query: this.$route.query } }"
          >
            <span>NEW</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="countryList"
        :search="searchQuery"
        sort-by="country_id"
        class="elevation-1"
      >
        <template v-slot:top>
        </template>
        <!-- <template v-slot:item.actions="{ item }"> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-right:0px"
              cols="6"
            >
              <v-icon
                class="mr-2"
                small
                @click="editItem(item)"
              >
                {{ icon.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col
              style="padding-left:0px"
              cols="6"
            >
              <delete-form
                :id="item.id"
                :icon="icon.mdiDelete"
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

import DeleteForm from './CountryDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    showDialog: false,
    icon: { mdiPencil, mdiDelete, mdiExportVariant },
    country_id: '',
    country_name: '',
    countryList: [],
    searchQuery: '',
    headers: [
      {
        text: '国・地域ID',
        align: 'left',
        sortable: true,
        value: 'country_id',
        width: '20%',
        fixed: true,
      },
      {
        text: '国・地域名',
        value: 'country_name',
        sortable: true,
        align: 'left',
        width: '25%',
        fixed: true,
      },
      {
        text: '国・地域名(ENG)',
        value: 'country_name_eng',
        sortable: true,
        align: 'left',
        width: '26%',
        fixed: true,
      },
      {
        text: '国・地域番号',
        value: 'country_code',
        sortable: true,
        align: 'left',
        width: '21%',
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
    ...mapState('countryStore', ['countries', 'countryIds', 'countryNames']),

  },
  watch: {
    country_id(val) {
      this.changeRouteQuery('country_id', val)
      this.refreshList()
    },
    country_name(val) {
      this.changeRouteQuery('country_name', val)
      this.refreshList()
    },
    countries(value) {
      this.countryList = value
    },
  },

  created() {
    this.loadCountryIds()
    this.loadCountryNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },

  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('countryStore', ['loadCountries', 'loadCountryIds', 'loadCountryNames', 'loadCountry']),
    refreshList() {
      this.setOverlayStatus(true)
      this.loadCountries(this.$route.query).then(() => {
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
      this.country_id = this.$route.query.country_id ?? ''
      this.country_name = this.$route.query.country_name ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'country-edit', params: { id: item.id, query: this.$route.query } })
    },

    // ...mapMutations('countryStore', ['filterCountries']),

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
