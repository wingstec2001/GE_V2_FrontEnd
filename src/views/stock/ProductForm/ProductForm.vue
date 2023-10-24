<template>
  <v-form>
    <v-row align="center">
      <v-col
        cols="12"
        md="1"
      >
        <label for="productID">ペレットID</label>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="productID"
          :items="productid"
          clearable
          outlined
          dense
          placeholder="ペレットID"
          hide-details
        ></v-autocomplete>
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
      </v-col>

      <v-col
        cols="12"
        md="1"
      >
      </v-col>

      <v-col
        cols="12"
        md="8"
      >
        <v-text-field
          id="firstname"
          v-model="firstname"
          disabled
          dense
          placeholder="ペレット名"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
      </v-col>

      <v-col
        cols="12"
        md="1"
      >
        <label for="employeeNameJp">在庫量</label>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          id="employeeNameJp"
          v-model="employeeNameJp"
          outlined
          dense
          placeholder="在庫量"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="7"
      >
      </v-col>

      <v-col
        offset-md="5"
        cols="12"
      >
        <v-btn color="primary">
          Submit
        </v-btn>
        <v-btn
          type="reset"
          class="mx-2"
          outlined
          :to="{ name: 'productlist-table' }"
        >
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  data: () => ({
    productid: ['E12-555', 'E21-666', 'E34-4444', 'E45-999'],
  }),
  setup() {
    const arrivalID = ref('')
    const email = ref('')
    const mobile = ref()
    const password = ref()
    const checkbox = ref(false)

    return {
      arrivalID,
      email,
      mobile,
      password,
      checkbox,
    }
  },
}
</script>
