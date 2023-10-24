<template>
  <v-form>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label color="primary" for="reserveID">予約ID</label>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="reserveID" outlined dense readonly hide-details></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="reserveID">ペレットID</label>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="productID" outlined dense hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="reserveName">商品名</label>
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field v-model="reserveName" outlined dense hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="note">説明</label>
      </v-col>
      <v-col cols="12" md="8">
        <v-textarea v-model="note" outlined dense hide-details readonly></v-textarea>
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="reservedWeight">重量合計</label>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          class="righted-input"
          id="reservedWeight"
          v-model="reservedWeight"
          outlined
          dense
          hide-details
          suffix="Kg"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="reserveID">予約日</label>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="reservedDate" outlined dense readonly hide-details></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="reservedStatus">状態</label>
      </v-col>
      <v-col cols="12" md="2">
        <v-select :items="reservedStatus" dense solo hide-details></v-select>
      </v-col>
      <v-col cols="12" md="5"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="note">備考</label>
      </v-col>
      <v-col cols="12" md="8">
        <v-textarea v-model="memo" outlined dense hide-details></v-textarea>
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
     <v-row>
      <v-col offset-md="5" cols="12">
        <v-btn color="primary"> Submit </v-btn>
        <v-btn type="reset" class="mx-2" outlined :to="{ name: 'reserved-list' }"> Cancel </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    menu: false,
    menu1: false,
    modal: false,
    url: null,
    image: null,
    reserveID: 'abcdeftarrivalID',
    productID: 'ABC=SDFS',
    reserveName: 'ABS樹脂　白　純度高',
    note: '今年の経済学賞の受賞が決まったのは、カリフォルニア大学バークレー校のデイビッド・カード氏、マサチューセッツ工科大学のヨシュア・アングリスト氏、スタンフォード大学のグイド・インベンス氏の経済学者３人です。',
    reservedWeight: 322,
    reservedDate: '2021-10-05',
    reservedStatus: ['', '承認待', '承認済', '契約済', '入金済', '出荷済'],
  }),
  methods: {
    Preview_image() {
      this.url = URL.createObjectURL(this.image)
    },
  },
}
</script>
<style scoped>
.centered-input >>> input {
  text-align: center;
}
.righted-input >>> input {
  text-align: right;
}
</style>
