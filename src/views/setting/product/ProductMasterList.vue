<template>
  <div id="productmaterial-list">
    <v-card>
      <v-card-title> ペレット一覧 </v-card-title>
      <v-row class="px-2 ma-0">
        <v-col
          cols="12"
          sm="3"
        >
          <v-autocomplete
            v-model="product_id"
            placeholder="ペレットID"
            :items="productIds"
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
            v-model="product_name"
            placeholder="ペレット名"
            :items="productNames"
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
            :to="{ name: 'productmaster-create', params: { query: this.$route.query } }"
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
              {{ icons.mdiExportVariant }}
            </v-icon>
            <span>Export</span>
          </v-btn>
        </div>
      </v-card-text>
      <!-- <template v-slot:item.actions="{ item }"> -->
      <v-data-table
        ref="filteredTable"
        :headers="headers"
        :items="productList"
        :search="searchQuery"
        class="elevation-1"
      >
        <template v-slot:[`item.product_img`]="{ item }">
          <div class="p-2">
            <v-img
              :src="item.product_img ? item.product_img : require('@/assets/images/noimage.jpg')"
              max-height="50"
              max-width="50"
              class="me-3"
            ></v-img>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-row>
            <v-col
              style="padding-right: 10px"
              cols="2"
            >
              <v-icon
                class="mr-2"
                small
                @click="editItem(item)"
              >
                {{ icons.mdiPencil }}
              </v-icon>
            </v-col>
            <v-col
              style="padding-right: 10px"
              cols="2"
            >
              <delete-form
                :id="item.id"
                :icon="icons.mdiDelete"
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
import { mapState, mapActions, mapMutations } from 'vuex'

import DeleteForm from './ProductDelete.vue'

export default {
  components: {
    DeleteForm,
  },
  data: () => ({
    icons: { mdiPencil, mdiDelete, mdiExportVariant },
    product_id: '',
    product_name: '',
    searchQuery: '',
    productList: [],
    headers: [
      {
        text: 'No.',
        value: 'id',
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: 'イメージ',
        value: 'product_img',
        filterable: false,
        sortable: false,
        align: 'left',
        width: '10%',
        fixed: true,
      },
      {
        text: 'ペレットID',
        align: 'left',
        value: 'product_id',
        width: '20%',
        fixed: true,
      },
      {
        text: 'ペレット名',
        value: 'product_name',
        sortable: false,
        align: 'left',
        width: '30%',
        fixed: true,
      },
      {
        text: '説明',
        value: 'product_description',
        align: 'left',
        sortable: false,
        width: '20%',
        fixed: true,
      },
      {
        text: '　',
        value: 'actions',
        sortable: false,
        align: 'center',
        width: '8%',
        fixed: true,
      },
    ],
  }),

  computed: {
    ...mapState('productStore', ['products', 'productIds', 'productNames', 'f_products']),
  },
  watch: {
    product_id(val) {
      this.changeRouteQuery('product_id', val)
      this.refreshList()
    },
    product_name(val) {
      this.changeRouteQuery('product_name', val)
      this.refreshList()
    },
    products(value) {
      this.productList = value
    },
  },
  created() {
    this.loadProductIds()
    this.loadProductNames()
    this.changeRouteQuery()
    this.refreshList()
    this.loadQuery()
  },
  methods: {
    ...mapMutations('app', ['setOverlayStatus']),
    ...mapActions('productStore', ['loadProducts', 'loadProduct', 'loadProductIds', 'loadProductNames']),

    refreshList() {
      this.setOverlayStatus(true)
      this.loadProducts(this.$route.query).then(() => {
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
      this.product_id = this.$route.query.product_id ?? ''
      this.product_name = this.$route.query.product_name ?? ''
    },

    editItem(item) {
      this.$router.push({ name: 'productmaster-edit', params: { id: item.id, query: this.$route.query } })
    },

    downloadCSV() {
      const items = this.$refs.filteredTable.$children[0].filteredItems
      const sorted = this.$refs.filteredTable.$children[0].sortItems(items)

      // eslint-disable-next-line no-useless-concat
      let csv = '\ufeff' + 'No,ペレットID,ペレット名,説明\n'
      let no = 0
      sorted.forEach(el => {
        if (el.product_description === null) {
          // eslint-disable-next-line no-param-reassign
          el.product_description = ' '
        }

        no += 1
        const line = `${no},"${el.product_id}","${el.product_name}","${el.product_description}"\n`
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      const nowstr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 19)
      const newstr = nowstr.replace(/(-|:|T)/g, '')
      link.download = 'ペレット一覧'.concat('-', newstr, '.csv')
      link.click()
    },
  },
}
</script>
