<template>
  <v-card id="lateral">
    <v-toolbar
      tabs
      flat
    >
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
        >
          <v-tab href="#one">
            出荷
          </v-tab>
          <v-tab href="#two">
            1号
          </v-tab>
          <v-tab href="#three">
            2号
          </v-tab>
          <v-tab href="#four">
            粉砕
          </v-tab>
          <v-tabs-slider color="pink"></v-tabs-slider>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-card-text>
      <v-tabs-items
        v-model="tabs"
        touchless
      >
        <v-tab-item
          v-for="content in ['one', 'two', 'three','four']"
          :key="content"
          :value="content"
        >
          <!-- <v-card
            height="400px"
            flat
          >
            {{ content }}
          </v-card> -->
          <slot></slot>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-fab-transition>
      <v-btn
        :key="activeFab.icon"
        :color="activeFab.color"
        fab
        large
        dark
        bottom
        left
        class="v-btn--example"
      >
        <v-icon>{{ activeFab.icon }}</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-card>
</template>
<script>

export default {
  components: {

  },
  data: () => ({
    fab: false,
    hidden: false,
    tabs: null,
  }),

  computed: {
    activeFab() {
      switch (this.tabs) {
        case 'one': return { color: 'success', icon: 'mdi-share-variant' }
        case 'two': return { color: 'red', icon: 'mdi-pencil' }
        case 'three': return { color: 'green', icon: 'mdi-chevron-up' }
        default: return {}
      }
    },
  },
}
</script>
<style>
  /* This is for documentation purposes and will not be needed in your application */
  /* #lateral .v-btn--example {
    bottom: 0;
    position: absolute;
    margin: 0 0 16px 16px;
  } */
</style>
