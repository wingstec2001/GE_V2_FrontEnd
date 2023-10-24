<template>
  <div justify="center">
    <a
      href="javascript:void(0);"
      @click="openForm"
    >{{ id }}</a>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            class="text-h5"
          >
            {{ item.dashboard_title }}
          </span>
          <template>
            <v-spacer></v-spacer>
            <template v-if="apierror.status=='error'">
              <div
                v-for="msg of apierror.messages"
                :key="msg"
              >
                <v-row class="ml-6 mb-3 ma-3">
                  <span style="color: red">* {{ msg }} </span>
                </v-row>
              </div>
            </template>
          </template>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <div
            v-if="item.dashboard_image"
            class="p-2"
          >
            <v-img
              :src="item.dashboard_image"
              max-height="100%"
              max-width="100%"
              class="me-3"
            >
            </v-img>
          </div>
          <!-- <p :class="[fontsize[item.fontsize], fontcolor[item.fontcolor]]">{{ item.text }}</p> -->
          <pre
            :class="[fontsize[item.fontsize], fontcolor[item.fontcolor]]"
            style="width:100%"
          >
            {{ item.text }}
          </pre>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text
            @click="closeForm"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  props: ['id'],
  data: () => ({
    dialog: false,
    apierror: {
      code: '',
      status: '',
      messages: [],
    },
    item: {},
    fontsize: ['subtitle-1', 'text-h6', 'text-h5'],
    fontcolor: ['black--text', 'red--text', 'blue--text', 'green--text', 'yellow--text', 'cyan--text'],
  }),
  computed: {
    ...mapState('dashboardStore', ['selectedDashboard']),
  },
  methods: {
    ...mapActions('dashboardStore', ['loadDashboard']),
    ...mapMutations('app', ['setOverlayStatus']),
    openForm() {
      this.setOverlayStatus(true)
      this.loadDashboard(this.id).then(() => {
        this.item = { ...this.selectedDashboard }
        this.setOverlayStatus(false)
        this.dialog = true
      }).catch(error => {
        this.apierror.status = error.response.data.status
        this.apierror.code = error.response.data.code
        this.apierror.messages.push(error.response.data.message)
        this.setOverlayStatus(false)
        this.dialog = true
      })
    },
    closeForm() {
      this.$emit('cancel')
      this.dialog = false
      this.item = {}
    },
  },

}
</script>
<style lang="scss" >
pre {
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* InternetExplorer5.5+ */
  white-space: -moz-pre-wrap; /* Mozilla,since1999 */
  white-space: -pre-wrap; /* Opera4-6 */
  white-space: -o-pre-wrap; /* Opera7 */
}
</style>
