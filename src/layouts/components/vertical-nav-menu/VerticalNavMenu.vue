<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          :src="require('@/assets/images/logos/earth.png')"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <v-slide-x-transition>
          <!-- <h2 class="app-title text--primary">GreenEarth</h2> -->
          <h2 class="app-title">
            GreenEarth
          </h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
    >
      <component
        :is="resolveNavItemComponent(item)"
        v-for="item in navMenuItems"
        :key="item.subheader || item.title"
        :item="item"
      />
    </v-list>
    <!-- <a href="https://themeselection.com/products/materio-vuetify-vuejs-admin-template" target="_blank" rel="nofollow">
      <v-img
        :src="require(`@/assets/images/pro/upgrade-banner-${$vuetify.theme.dark ? 'dark' : 'light'}.png`)"
        alt="upgrade-banner"
        transition="scale-transition"
        class="upgrade-banner mx-auto"
        max-width="230"
      ></v-img>
    </a> -->
  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { provide, ref } from '@vue/composition-api'

// import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
// import NavMenuGroup from './components/NavMenuGroup.vue'
// import NavMenuLink from './components/NavMenuLink.vue'
// SFCs
import VerticalNavMenuHeader from './components/vertical-nav-menu-header/VerticalNavMenuHeader.vue'
import VerticalNavMenuSectionTitle from './components/vertical-nav-menu-section-title/VerticalNavMenuSectionTitle.vue'
import VerticalNavMenuGroup from './components/vertical-nav-menu-group/VerticalNavMenuGroup.vue'
import VerticalNavMenuLink from './components/vertical-nav-menu-link/VerticalNavMenuLink.vue'
import navMenuItems from '@/navigation/vertical'

// Composable
import useVerticalNavMenu from '@/core/layouts/composable/vertical-nav/useVerticalNavMenu'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuGroup,
    VerticalNavMenuLink,
    VerticalNavMenuSectionTitle,

    // NavMenuSectionTitle,
    // NavMenuGroup,
    // NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
  },
  setup() {
    const { resolveNavItemComponent, isMouseHovered } = useVerticalNavMenu()
    provide('isMouseHovered', isMouseHovered)
    provide('openGroups', ref([]))

    return {
      resolveNavItemComponent,
      navMenuItems,
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
// .theme--light.app-navigation-menu {
//     background:#1f1d31;
//     color:hsla(0,0%,100%,.76)!important;
// }

// .theme--light.v-application .text--primary{
//   color: #E7E3FC !important;
// }

// // .theme--light.v-icon {
// //   color: #E7E3FC !important;
// // }
// // .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
// //   color: #E7E3FC !important;
// // }
// .app-title{
//   color: #fff !important;
// }
</style>
