<template>
  <router-link
    v-slot="{ navigate ,isActive}"
    :to=" to "
    custom
  >
    <dl
      :class="[isActive && 'router-link-active']"
      @click="navigate"
    >
      <dt>
        <v-icon>
          {{ icon }}
        </v-icon>
      </dt>
      <dd>{{ text }}</dd>
    </dl>
  </router-link>
</template>

<script>
import {
  mdiHead,
  mdiCube,
  mdiNumeric1Box,
  mdiNumeric2Box,
  mdiClipboardCheckMultipleOutline,
  mdiShredder,
} from '@mdi/js'

export default {
  name: 'BottomNav',
  setup() {
    return {
      icons: {
        mdiCube,
        mdiHead,
        mdiNumeric1Box,
        mdiNumeric2Box,
        mdiClipboardCheckMultipleOutline,
        mdiShredder,
      },
    }
  },
  props: ['icon', 'to', 'text'],
  data: () => ({}),
}
</script>
<style lang="scss">
dl {
    cursor: pointer;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    text-align: center;
    line-height: 1;
    &.router-link-active {
      dd,
      dt {
        color: #a9b914;
        .v-icon {
          color: #fdb455;
        }
      }
    }
  }
  //text
  //description, definition
  dd {
    color: #929292;
    // CSStransform属性允许你旋转，缩放，倾斜或平移给定元素。
    // transform-origin: x-axis y-axis z-axis;
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }
  //icon
  dt {
    position: relative;
    margin: 0 auto;
    width: 28px;
    height: 28px;
    color: #797979;
    margin-bottom: 2px;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    font-size: 28px;
  }
</style>
