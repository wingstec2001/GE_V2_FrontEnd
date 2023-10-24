<template>
  <v-card>
    <v-list-item
      v-for="dashboard in dashboards"
      :id="dashboard.id"
      :key="dashboard.id"
    >
      <v-list-item-content>
        <p>No. {{ dashboard.id }}</p>
        <p class="text-h5 font-weight-semibold black--text">
          {{ dashboard.dashboard_title }}
        </p>
        <v-img
          v-if="dashboard.dashboard_image"
          :src="dashboard.dashboard_image"
          width="100%"
          :height="`${clientHeight/3}+px`"
        ></v-img>
        <!-- <v-textarea
          :class="[fontsize[dashboard.fontsize], fontcolor[dashboard.fontcolor]]"
          style="color:#000 !important"
          outlined
          auto-grow
          :value="dashboard.text"
        ></v-textarea> -->
        <pre
          :class="[fontsize[dashboard.fontsize], fontcolor[dashboard.fontcolor]]"
          style="width:100%"
        >{{ dashboard.text }}</pre>
        <v-divider></v-divider>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'DashboardTab',
  data: () => ({
    fontsize: ['subtitle-1', 'text-h6', 'text-h5'],
    fontcolor: ['black--text', 'red--text', 'blue--text', 'green--text', 'yellow--text', 'cyan--text'],
  }),
  computed: {
    ...mapState('app', ['clientHeight']),
    ...mapState('dashboardStore', ['dashboards']),
  },
  watch: {
  },
  mounted() {
    this.$emit('has-mounted')
  },

  methods: {
    ...mapActions('dashboardStore', ['loadDashboards']),
    ...mapMutations('app', ['setOverlayStatus']),
    loadData() {
      this.loadDashboards().then(() => {
        this.setOverlayStatus(false)
      })
    },
  },
}
</script>
<style lang="scss" >
.v-slide-group__prev.v-slide-group__prev--disabled{
  display: none!important;
}
pre {
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* InternetExplorer5.5+ */
  white-space: -moz-pre-wrap; /* Mozilla,since1999 */
  white-space: -pre-wrap; /* Opera4-6 */
  white-space: -o-pre-wrap; /* Opera7 */
}
</style>
