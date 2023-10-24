<template>
  <div id="ge-nav">
    <nav>
      <!-- <router-link
        v-slot="{ navigate ,isActive}"
        :to="{ name: 'mobile-dashboard' }"
        custom
      >
        <dl
          :class="[isActive && 'router-link-active']"
          @click="navigate"
        >
          <dt>
            <v-icon>
              {{ icons.mdiCube }}
            </v-icon>
          </dt>
          <dd>Dashboard</dd>
        </dl>
      </router-link> -->
      <Button
        :to="{ name: 'mobile-dashboard' }"
        :icon="icons.mdiCube"
        text="Dash.."
      ></Button>

      <Button
        :to="{ name: 'mobile-arrivaldetails' }"
        :icon="icons.mdiClipboardCheckMultipleOutline"
        text="入荷"
      ></Button>
      <Button
        :to="{ name: 'mobile-crushing' }"
        :icon="icons.mdiShredder"
        text="粉 砕"
      ></Button>
      <Button
        :to="{ name: 'mobile-blender' }"
        :icon="icons.mdiFilter"
        text="ブレン.."
      ></Button>
      <Button
        :to="{ name: 'mobile-router', params: { num: '1' } }"
        :icon="icons.mdiNumeric1Box"
        text="Router"
      ></Button>
      <Button
        :to="{ name: 'mobile-router', params: { num: '2' } }"
        :icon="icons.mdiNumeric2Box"
        text="Router"
      ></Button>
      <Button
        :to="{ name: 'mobile-router', params: { num: '3' } }"
        :icon="icons.mdiNumeric3Box"
        text="Router"
      ></Button>
    </nav>
  </div>
</template>

<script>
import {
  mdiHead,
  mdiCube,
  mdiNumeric1Box,
  mdiNumeric2Box,
  mdiNumeric3Box,
  mdiClipboardCheckMultipleOutline,
  mdiShredder,
  mdiFilter,
} from '@mdi/js'
import Button from './component/NavButton.vue'

export default {
  name: 'BottomNav',
  components: {
    Button,
  },
  setup() {
    return {
      icons: {
        mdiCube,
        mdiHead,
        mdiNumeric1Box,
        mdiNumeric2Box,
        mdiNumeric3Box,
        mdiClipboardCheckMultipleOutline,
        mdiShredder,
        mdiFilter,
      },
    }
  },
  data: () => ({}),
}
</script>
<style lang="scss">
#ge-nav {
  nav {
    // -ms- 兼容IE浏览器
    // -moz- 兼容firefox
    // -o- 兼容opera
    // -webkit- 兼容chrome 和 safari
    display: -webkit-box;
    display: -ms-flexbox;
    // 将nav设置为flex容器
    display: flex;
    width: 100%;
    overflow: hidden;
    height: 50px;
    padding-top: 8px;
    background: #f9f9f9;
    font-size: 12px;
  }
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
        color: #9155fd;
        .v-icon {
          color: #9155fd;
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
}
</style>
