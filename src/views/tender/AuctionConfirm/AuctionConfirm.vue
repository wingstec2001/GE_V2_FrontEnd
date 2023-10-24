<template>
  <v-form>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label color="primary" for="bidID">入札ID</label>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="bidID" outlined dense readonly hide-details></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="bidName">商品名</label>
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field v-model="bidName" outlined dense hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="bidNote">説明</label>
      </v-col>
      <v-col cols="12" md="8">
        <v-textarea v-model="bidNote" outlined dense hide-details readonly></v-textarea>
      </v-col>
      <v-col cols="12" md="3"> </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" md="1">
        <label for="bidWeight">重量</label>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          class="righted-input"
          id="bidWeight"
          v-model="bidWeight"
          outlined
          dense
          hide-details
          suffix="Kg"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="7"> </v-col>
    </v-row>
    <v-container>
      <v-row></v-row>
    </v-container>
    <v-data-table :headers="headers" :items="bidData" hide-default-footer class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>入札情報</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template #[`item.status`]="{ item }">
        <v-chip @click="editItem(item)" small :color="statusColor[item.status]" class="font-weight-medium">
          {{ status[item.status] }}
        </v-chip>
        {{ item.status }}
      </template>
    </v-data-table>
    <v-container pt-10>
      <v-row>
        <v-col offset-md="5" cols="12">
          <v-btn color="primary"> Submit </v-btn>
          <v-btn type="reset" class="mx-2" outlined :to="{ name: 'tenderinput-table' }"> Cancel </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  setup() {
    const statusColor = {
      /* eslint-disable key-spacing */
      1: 'success',
      2: 'primary',
      /* eslint-enable key-spacing */
    }

    return {
      headers: [
        {
          text: '入札日',
          value: 'bidDate',
          align: 'left',
          width: '8%',
        },
        {
          text: '取引先',
          value: 'customer',
          align: 'left',
          width: '20%',
        },
        {
          text: '入札金額',
          value: 'bidprice',
          align: 'right',
          width: '10%',
        },
        {
          text: 'Status　',
          value: 'status',
          sortable: false,
          align: 'center',
          width: '6%',
        },
      ],
      bidData: [
        {
          no: 1,
          bidDate: '2021-10-05',
          customer: 'ダイハツ商事',
          bidprice: '89,000',
          status: 1,
        },
        {
          no: 2,
          bidDate: '2021-10-04',
          customer: '島忠大島商事',
          bidprice: '290,000',
          status: 1,
        },
        {
          no: 3,
          bidDate: '2021-10-05',
          customer: 'ダイハツ商事',
          bidprice: '189,000',
          status: 1,
        },
        {
          no: 4,
          bidDate: '2021-10-07',
          customer: '大島商事',
          bidprice: '290,100',
          status: 1,
        },
        {
          no: 5,
          bidDate: '2021-10-07',
          customer: '儿啊嘎嘎服更合适的话大島商事',
          bidprice: '290,100',
          status: 1,
        },
        {
          no: 6,
          bidDate: '2021-10-07',
          customer: '大島阿德大幅度商事',
          bidprice: '290,100',
          status: 1,
        },
        {
          no: 7,
          bidDate: '2021-10-07',
          customer: '商事大島阿呆发生大幅',
          bidprice: '290,100',
          status: 1,
        },
        {
          no: 8,
          bidDate: '2021-10-07',
          customer: '大島商事1343',
          bidprice: '290,100',
          status: 1,
        },
      ],
      status: {
        1: '入札済', // waiting
        2: '落札', // failed
        3: '失注', // wating
      },
      statusColor,
      bidID: 'A-cc233',
      bidName: 'ABS樹脂　白　500KG 2011年11月出荷予定',
      bidNote: '入札商品です。入札金額、取引実績などを総合考慮して落札者を決めさせていただきます。',
      bidWeight: '500',
    }
  },

  methods: {
    Preview_image() {
      this.url = URL.createObjectURL(this.image)
    },

    editItem(item) {
      let x = 0
      this.bidData.forEach((elem, index) => {
        if (elem.no === item.no) {
          x = index
        }
      })

      let otherstatus = 1
      if (this.bidData[x].status === 1) {
        this.bidData[x].status = 2
        otherstatus = 3
      } else {
        this.bidData[x].status = 1
      }

      this.bidData.forEach((elem, index) => {
        if (index !== x) {
          this.bidData[index].status = otherstatus
        }
      })
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
