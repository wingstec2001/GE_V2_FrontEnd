<template>
  <component :is="resolveLayout">
    <router-view></router-view>
    <overlays :is-show="OverlayStatus"></overlays>
  </component>
</template>

<script>
import { computed } from '@vue/composition-api'
import { mapState, mapActions } from 'vuex'
import { useRouter } from '@/utils'
import LayoutBlank from '@/layouts/Blank.vue'
import LayoutContent from '@/layouts/Content.vue'
import LayoutMobile from '@/layouts/Mobile.vue'
import Overlays from '@/components/Overlays.vue'

export default {
  components: {
    LayoutBlank,
    LayoutContent,
    LayoutMobile,
    Overlays,
  },
  computed: {
    ...mapState('app', ['OverlayStatus']),
  },
  created() {
    this.loadSetting()
  },
  methods: {
    ...mapActions('app', ['loadSetting']),
  },
  setup() {
    const { route } = useRouter()

    const resolveLayout = computed(() => {
      // Handles initial route
      if (route.value.name === null) return null
      if (route.value.meta.layout === 'blank') return 'layout-blank'
      if (route.value.meta.layout === 'mobile') return 'layout-mobile'

      return 'layout-content'
    })

    return {
      resolveLayout,
    }
  },
}
</script>
