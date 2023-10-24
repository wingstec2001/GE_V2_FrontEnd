<template>
  <div>
    <v-text-field
      v-model="displayValue"
      :error-messages="errorMessages"
      :outlined="outlined"
      dense
      :label="label"
      :readonly="readonly"
      :placeholder="placeholder"
      hide-details="auto"
      suffix="kg"
      :class="['weight-input',error?errorClass:'']"
      @click="handleClick($event)"
      @input="handleInput"
      @compositionend="handleCompositionend"
      @compositionstart="handleCompositionstart"
    ></v-text-field>
  </div>
</template>

<script>
import { isNull } from '@/core/utils'

export default {
  model: {
    prop: 'weight',
    event: 'weightChange',
  },
  props: ['weight', 'errorMessages', 'placeholder', 'outlined', 'label', 'readonly'],
  data: () => ({
    inputElement: '',
    curVal: '',
    latestClickTime: new Date(),
    latestValue: '',
    lock: false,
    displayValue: '',
    error: false,
    errorClass: 'weight-input-text-red',
  }),
  watch: {
    weight(val) {
      this.refreshWeightInfo(val)
    },
  },
  mounted() {
    this.refreshWeightInfo(this.weight)
  },
  methods: {
    refreshWeightInfo(val) {
      const str = isNull(val) ? '' : `${val}`

      // 負数
      let negative = false
      if (str.indexOf('-') === 0) {
        negative = true
      }

      const formatter = negative === true ? `-${str.replace(/[,]/g, '').replace(/[^0-9]/g, '')}` : `${str.replace(/[,]/g, '').replace(/[^0-9]/g, '')}`
      if (negative) {
        this.error = true
      } else {
        this.error = false
      }
      this.$emit('weightChange', formatter)
      this.$nextTick(() => {
        this.displayValue = formatter.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
      })
    },
    handleClick(event) {
      event.target.select()
      this.lock = false
    },
    handleCompositionstart() {
      this.lock = true
    },
    handleCompositionend() {
      this.lock = false
      this.refreshWeightInfo(this.displayValue)
    },

    handleInput(val) {
      const clickTime = new Date()

      // const diff = clickTime - this.latestClickTime
      this.latestClickTime = clickTime

      if (this.lock === false) {
        this.refreshWeightInfo(val)
      }
    },
  },
}
</script>
<style scoped>
.weight-input >>> input {
  text-align: right;
}
.weight-input-text-red >>> input {
  color: red !important;
}
</style>
