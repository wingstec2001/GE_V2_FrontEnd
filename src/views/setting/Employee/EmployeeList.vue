<template>
  <div id="material-list">
    <v-card>
      <v-card-title> 社員一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="employee_id"
            placeholder="社員ID"
            :items="employeeIds"
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
            v-model="employee_name"
            placeholder="社員名"
            :items="employeeNames"
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
            :to="{ name: 'employee-create' , params: { query: this.$route.query }}"
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
              {{ icon.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="employeeList"
        sort-by="employee_id"
        :search="searchQuery"
        class="elevation-1"
      >
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

import DeleteForm from './EmployeeDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icon: { mdiPencil, mdiDelete, mdiExportVariant },
    employee_id: '',
    employee_name: '',
    employeeList: [],
    searchQuery: '',
    headers: [
      {
        text: '社員ID',
        align: 'left',
        sortable: true,
        value: 'employee_id',
        width: '15%',
      },
      {
        text: '社員姓名', value: 'employee_name', align: 'left', width: '36%',
      },
      {
        text: '性別', value: 'gender', align: 'center', sortable: true, width: '16%',
      },
      {
        text: '役職', value: 'jobtitle', align: 'center', sortable: true, width: '15%',
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
      },
    ],
  }),

  computed: {
    ...mapState('employeeStore', ['employees', 'f_employees', 'employeeIds', 'employeeNames']),
  },
  watch: {
    employee_id(val) {
      this.changeRouteQuery('employee_id', val)
      this.refreshList()
    },
    employee_name(val) {
      this.changeRouteQuery('employee_name', val)
      this.refreshList()
    },
    employees(value) {
      this.employeeList = value
    },
  },

  created() {
    this.loadEmployeeIds()
    this.loadEmployeeNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },

  methods: {
    ...mapActions('employeeStore', ['loadEmployees', 'loadEmployee', 'loadEmployeeIds', 'loadEmployeeNames']),
    ...mapMutations('employeeStore', ['filterEmployees']),
    ...mapMutations('app', ['setOverlayStatus']),

    refreshList() {
      this.setOverlayStatus(true)
      this.loadEmployees(this.$route.query).then(() => {
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
      this.employee_id = this.$route.query.employee_id ?? ''
      this.employee_name = this.$route.query.employee_name ?? ''
    },
    editItem(item) {
      this.$router.push({ name: 'employee-edit', params: { id: item.id, query: this.$route.query } })
    },
    downloadCSV() {
      this.loadEmployees(this.$route.query).then(() => {
      // eslint-disable-next-line no-useless-concat
        let csv = '\ufeff' + '社員ID,社員姓名,性別,役職\n'
        this.employees.forEach(el => {
          const line = `"${el.employee_id}","${el.employee_name}","${el.gender}","${el.jobtitle}"\n`
          csv += line
        })
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '社員一覧.csv'
        link.click()
      })
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
