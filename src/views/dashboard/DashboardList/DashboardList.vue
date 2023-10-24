<template>
  <div id="dashboard-list">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Dashboard一覧</v-card-title>
          <v-divider class="mt-4"></v-divider>
          <v-card-text
            class="d-flex align-center flex-wrap pb-0"
            style="align-text: right !important"
          >
            <v-spacer></v-spacer>
            <div class="d-flex align-center flex-wrap">
              <v-btn
                color="primary"
                class="mb-4 me-3"
                :to="{ name: 'dashboard-create' }"
              >
                <span>NEW</span>
              </v-btn>
            </div>
          </v-card-text>
          <v-data-table
            ref="Dashboards"
            :headers="headers"
            :items="dashboardList"
            fixed-header
          >
            <template v-slot:[`item.id`]="{ item }">
              <dashboard-preview
                :id="item.id"
                @cancel="loadData"
              ></dashboard-preview>
            </template>
            <template v-slot:[`item.dashboard_image`]="{ item }">
              <div class="p-2">
                <v-img
                  :src="item.dashboard_image ? `${item.dashboard_image}` : require('@/assets/images/noimage.jpg')"
                  max-height="50"
                  max-width="50"
                  class="me-3"
                >
                </v-img>
              </div>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
              <label>{{ createdTime(item) }}</label>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-row>
                <v-col
                  style="padding-right: 0px"
                  cols="6"
                >
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    {{ icons.mdiPencil }}
                  </v-icon>
                </v-col>
                <v-col
                  style="padding-left: 0px"
                  cols="6"
                >
                  <dashboard-delete
                    :id="item.id"
                    :icons="icons"
                    @deleted="loadData"
                    @cancel="loadData"
                  ></dashboard-delete>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { mdiPencil, mdiDelete } from '@mdi/js'
import { mapActions, mapState, mapMutations } from 'vuex'
import DashboardPreview from './DashboardPreview.vue'
import DashboardDelete from './DashboardDelete.vue'

export default {
  components: {
    DashboardPreview,
    DashboardDelete,
  },
  data: () => ({
    dialog: false,
    dashboardList: [],
    icons: {
      mdiPencil,
      mdiDelete,
    },
    headers: [
      {
        text: 'No.',
        align: 'left',
        sortable: false,
        value: 'id',
        width: '10%',
        fixed: true,
      },
      {
        text: 'イメージ',
        align: 'left',
        sortable: false,
        value: 'dashboard_image',
        width: '20%',
        fixed: true,
      },
      {
        text: 'タイトル',
        align: 'left',
        sortable: false,
        value: 'dashboard_title',
        width: '30%',
        fixed: true,
      },
      {
        text: '作成日時',
        align: 'left',
        sortable: false,
        value: 'created_at',
        width: '20%',
        fixed: true,
      },
      {
        text: '  ',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
        fixed: true,
      },
    ],
  }),
  created() {
    this.loadData()
  },
  computed: {
    ...mapState('dashboardStore', ['dashboards']),

  },
  methods: {
    ...mapActions('dashboardStore', ['loadDashboards', 'deleteDashborad']),
    ...mapMutations('app', ['setOverlayStatus']),
    editItem(item) {
      this.$router.push({ name: 'dashboard-edit', params: { id: item.id } })
    },
    loadData() {
      this.setOverlayStatus(true)
      this.loadDashboards().then(() => {
        this.dashboardList = [...this.dashboards]

        this.setOverlayStatus(false)
      })
    },
    createdTime(item) {
      return item.created_at.substring(0, 16).replace('T', ' ')
    },
  },

}
</script>
