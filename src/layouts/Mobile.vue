<template>
  <v-app>
    <vertical-nav-menu
      v-if="navCanShow"
      :is-drawer-open.sync="isDrawerOpen"
    ></vertical-nav-menu>
    <v-app-bar
      app
      flat
      absolute
      color="transparent"
    >
      <div class="boxed-container w-full">
        <div class="d-flex align-center mx-6">
          <v-app-bar-nav-icon
            class="d-block d-lg-none me-2"
            @click="isDrawerOpen = !isDrawerOpen"
          ></v-app-bar-nav-icon>
          <v-toolbar-title>{{ $route.meta.title }} {{ date }} </v-toolbar-title>
          <v-spacer></v-spacer>
          <app-bar-user-menu></app-bar-user-menu>
        </div>
      </div>
    </v-app-bar>
    <!-- padding: 56px 0px 56px 0px; -->
    <v-main style="height:100vh;overflow: hidden;padding-bottom:56px">
      <!-- <slot></slot> -->
      <slot></slot>
    </v-main>
    <footer>
      <bottom-nav
        class="gr-footer "
        :style="footerStyle"
      />
    </footer>
  </v-app>
</template>

<script>

import format from 'date-fns/format'
import { mapState, mapMutations } from 'vuex'
import BottomNav from './components/mobile/BottomNavMenu.vue'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import AppBarUserMenu from './components/AppBarUserMenu.vue'

export default {
  name: 'App',

  components: {
    BottomNav,
    AppBarUserMenu,
    VerticalNavMenu,
  },
  data: () => ({
    //
    navCanShow: true,
    userRole: null,
    isDrawerOpen: null,
    tabs: '',
  }),
  computed: {
    ...mapState('app', ['todayWorkDate']),
    footerStyle() {
      return (this.isDrawerOpen && this.navCanShow) ? `padding-left:${260}px;` : ''
    },
    date() {
      return format(this.todayWorkDate, 'yyyy-MM-dd')
    },
  },
  created() {
    window.addEventListener('resize', this.resize)
    const userData = JSON.parse(localStorage.getItem('userData'))
    const userRole = userData && userData.roles[0] ? userData.roles[0] : null
    if (userRole === 'Staff') {
      this.navCanShow = false
    }
  },
  methods: {
    resize() {
      this.updateClientHeight(document.documentElement.clientHeight)
    },
    ...mapMutations('app', ['updateClientHeight']),
  },
}
</script>
<style scoped lang="scss">
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}

.gr-footer {
    bottom: 0;
    left: 0 !important;
    width: 100%;
    position: fixed;
    z-index: 3;
}
.gr-footer:not(:first-child)::before {
    content: "";
    position: absolute;
    width: 200%;
    left: 0px;
    top: 0;
    transform: scale(.5);
    transform-origin: 0 0;
    -webkit-transform: scale(.5);
    -webkit-transform-origin: 0 0;
    background-color: #b7b7b7;
    height: 1px;
    z-index: 4;
}
</style>
