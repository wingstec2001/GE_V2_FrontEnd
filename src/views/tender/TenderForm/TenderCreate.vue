<template>
  <v-card>
    <v-card-title>入札商品-新規</v-card-title>
    <template>
      <v-spacer></v-spacer>
      <template v-if="apierror.status == 'error'">
        <div v-for="msg of apierror.messages" :key="msg">
          <v-row class="ml-6 mb-3 ma-3">
            <span style="color: red">* {{ msg }} </span>
          </v-row>
        </div>
      </template>
    </template>
    <template>
      <v-spacer></v-spacer>
      <v-form class="ma-6">
        <v-row align="center">
          <v-col cols="12" md="1">
            <label for="reserveID">入札商品ID</label>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              id="reserveID"
              v-model="reserveID"
              outlined
              dense
              placeholder="入札商品ID"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="reserveID">ペレットID</label>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              id="reserveID"
              v-model="reserveID"
              outlined
              dense
              placeholder="ペレットID"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="firstname">入札商品名</label>
          </v-col>

          <v-col cols="12" md="8">
            <v-text-field
              id="reserveID"
              v-model="reserveID"
              outlined
              dense
              placeholder="入札商品名"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3"> </v-col>

          <v-col cols="12" md="1">
            <label for="note">説明</label>
          </v-col>
          <v-col cols="12" md="8">
            <v-textarea name="note" outlined dense placeholder="説明" hide-details></v-textarea>
          </v-col>
          <v-col cols="12" md="3"> </v-col>

          <v-col cols="12" md="1">
            <label for="firstname">公開開始日</label>
          </v-col>

          <v-col cols="12" md="4">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  outlined
                  dense
                  placeholder="公開開始日"
                  hide-details
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="firstname">入札締切日</label>
          </v-col>

          <v-col cols="12" md="4">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date1"
                  outlined
                  dense
                  placeholder="入札締切日"
                  hide-details
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date1" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu1 = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menu1.save(date)"> OK </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="reserveID">最低金額</label>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              id="reserveID"
              v-model="reserveID"
              outlined
              dense
              placeholder="最低金額"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="reserveID">入札上限</label>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              id="reserveID"
              v-model="reserveID"
              outlined
              dense
              placeholder="入札上限"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="7"> </v-col>

          <v-col cols="12" md="1">
            <label for="note">イメージ</label>
          </v-col>
          <v-col cols="12" md="5">
            <v-file-input v-model="image" @change="Preview_image"></v-file-input>
            <!-- prepend-icon="mdi-file-plus-outline" -->
          </v-col>
          <v-col cols="12" md="5">
            <v-img :src="url" width="120px" height="90px" contain></v-img>
          </v-col>
          <v-col offset-md="5" cols="12">
            <v-btn color="primary"> Submit </v-btn>
            <v-btn type="reset" class="mx-2" outlined :to="{ name: 'tender-table' }"> Cancel </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </v-card>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    menu: false,
    menu1: false,
    modal: false,
    url: null,
    image: null,
    apierror: [],
  }),
  methods: {
    Preview_image() {
      this.url = URL.createObjectURL(this.image)
    },
  },
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
