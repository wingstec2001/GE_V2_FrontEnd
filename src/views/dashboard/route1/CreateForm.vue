<template>
  <div>
    <v-btn
      icon
      small
      class="mt-n2 me-n3"
      @click.stop="dialog = true"
    >
      <v-icon size="22">
        {{ icon }}
      </v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">新規</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="date"
                  label="生産開始日*"
                  :prepend-icon="icons.mdiCalendar"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="ProductionForm.route_id"
                  label="ルーターID*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="ProductionForm.product_id"
                  :items="productIds"
                  label="ペレットID*"
                  placeholder="Select..."
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="product_name"
                  label="ペレット名*"
                  disabled
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="ProductionForm.produced_weight"
                  label="生産量*"
                  suffix="Kg"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="submit(ProductionForm)"
          >
            YES
          </v-btn>
          <v-btn
            color="error"
            @click="closeForm()"
          >
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiCalendar } from '@mdi/js'
import { mapActions, mapState } from 'vuex'

export default {
  props: ['icon'],
  data: () => ({
    icons: {
      mdiCalendar,
    },
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dialog: false,
    ProductionForm: {
      route_id: '1',
      product_id: '',
      produced_weight: '',
      produced_dt: '',
    },
  }),
  computed: {
    ...mapState('productStore', ['productMaster', 'productIds']),
    product_name() {
      if (this.productMaster) {
        const productKey = this.ProductionForm.product_id

        return this.productMaster[productKey]
      }

      return ''
    },
  },
  created() {
    this.loadProductIds()
  },

  methods: {
    ...mapActions('productStore', ['loadProductIds']),
    ...mapActions('productionStore', ['createProduction']),
    ...mapActions('dashboardStore', ['loadProductiondetails', 'loadProductionsum']),
    submit(ProductionForm) {
      this.createProduction(ProductionForm).then(() => {
        this.closeForm()
        this.loadProductiondetails(1).then(() => {
        })
        this.loadProductionsum(1).then(() => {
        })
      })
    },
    closeForm() {
      this.dialog = false
      this.ProductionForm = {}
      this.ProductionForm.route_id = 1
    },
  },

}
</script>
