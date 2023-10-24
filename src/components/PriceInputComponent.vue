<template>
  <div>
    <v-text-field
      v-model="displayValue"
      :error-messages="errorMessages"
      :outlined="outlined"
      dense
      :label="label"
      :placeholder="placeholder"
      hide-details="auto"
      prefix="¥"
      class="price-input"
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
    prop: 'price',
    event: 'priceChange',
  },
  props: ['price', 'errorMessages', 'placeholder', 'outlined', 'label'],
  data: () => ({
    inputElement: '',
    curVal: '',

    displayValue: '',
  }),
  watch: {
    price(val) {
      this.refreshDisplayValue(val)
    },
  },
  mounted() {
    this.refreshDisplayValue(this.price)
  },
  methods: {
    refreshDisplayValue(val) {
      const str = isNull(val) ? '0' : `${val}`
      const formatter = str.replace(/[,]/g, '')
      this.$emit('priceChange', formatter)
      this.displayValue = formatter.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
    handleClick(event) {
      event.target.select()
      this.lock = false
    },
    handleCompositionstart() {
      this.lock = true
    },
    handleCompositionend() {
      // console.log('handleCompositionend', this.displayValue)
      this.lock = false
      this.refreshDisplayValue(this.displayValue)
    },
    handleInput(val) {
      const clickTime = new Date()

      // const diff = clickTime - this.latestClickTime
      this.latestClickTime = clickTime

      if (this.lock === false) { this.refreshDisplayValue(val) }
    },

  },
}
</script>
<style scoped>
    .price-input>>> input {
      text-align: right
    }
</style>
