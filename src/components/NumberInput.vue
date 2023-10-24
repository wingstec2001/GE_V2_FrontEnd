<template>
  <div>
    <v-text-field
      v-model="displayValue"
      color="#fa7a00"
      :error-messages="errorMessages"
      :outlined="outlined"
      :readonly="readonly"
      dense
      :label="label"
      :placeholder="placeholder"
      hide-details="auto"
      :prefix="prefix"
      :suffix="suffix"
      class="number-input"
      @click="handleClick($event)"
      @input="handleInput"
      @compositionend="handleCompositionend"
      @compositionstart="handleCompositionstart"
    ></v-text-field>
  </div>
</template>

<script>
import {
  isNull,
} from '@/core/utils'

export default {
  model: {
    prop: 'number',
    event: 'numberChange',
  },
  props: ['number', 'errorMessages', 'placeholder', 'outlined', 'label', 'readonly', 'prefix', 'suffix'],
  data: () => ({
    curVal: '',
    lock: false,
    displayValue: '',
  }),
  watch: {
    number(val) {
      this.refreshDisplayInfo(val)
    },
  },
  mounted() {
    this.refreshDisplayInfo(this.number)
  },
  methods: {
    refreshDisplayInfo(val) {
      const str = isNull(val) ? '0' : `${val}`

      let formatter = str.replace(/[,]/g, '')
        .replace(/[^0-9]/g, '')
        .replace(/^0+/g, '')
      formatter = formatter === '' ? '0' : formatter
      this.$emit('numberChange', formatter)
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
      this.refreshDisplayInfo(this.displayValue)
    },
    handleInput(val) {
      if (this.lock === false) { this.refreshDisplayInfo(val) }
    },

  },
}
</script>
<style scoped>
    .number-input>>> input {
      text-align: right
    }
</style>
