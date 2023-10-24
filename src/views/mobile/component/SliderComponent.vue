<template>
  <div class="delete">
    <div
      class="slider"
      :style="imgStyle"
    >
      <div
        class="content"
        :style="deleteSlider"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <!-- 插槽中放具体项目中需要内容         -->
        <slot></slot>
      </div>
      <div
        ref="remove"
        :style="removeStyle"
        class="remove"
        @click="handleChildClick('remove')"
      >
        -
      </div>
      <div
        ref="confirm"
        :style="removeStyle"
        class="confirm"
        @click="handleChildClick('confirm')"
      >
        +
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      default: 'delete',
      type: String,
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['confirm', 'delete', 'both'].indexOf(value) !== -1
      },
    },
    id: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      startX: 0, // 触摸位置
      endX: 0, // 结束位置
      moveX: 0, // 滑动时的位置
      disX: 0, // 移动距离
      deleteSlider: '', // 滑动时的效果,使用v-bind:style="deleteSlider"
      width: 0,
      height: 0,
      swipeLeft: true,
      swipeRight: false,
    }
  },
  computed: {
    imgStyle() {
      // `this` 指向 vm 实例
      return {
        height: `${this.height}px`,
      }
    },
    removeStyle() {
      // `this` 指向 vm 实例
      return {
        width: `${(this.width * 1) / 3}px`,
        height: `${this.height}px`,
        'line-height': `${this.height}px`,
        'font-size': `${this.height / 2}px`,
      }
    },
  },
  watch: {
    type(val) {
      /* eslint default-case: "error" */

      switch (val) {
        case 'confirm':
          this.swipeLeft = false
          this.swipeRight = true
          break
        case 'delete':
          this.swipeLeft = true
          this.swipeRight = false
          break
        case 'both':
          this.swipeLeft = true
          this.swipeRight = true
          break

        // No Default
      }
    },
  },
  mounted() {
    const left = this
    left.$nextTick(() => {
      this.width = this.$slots.default[0].elm.clientWidth
      this.height = this.$slots.default[0].elm.clientHeight

      // init swiple mode
      left.swipleModeChange(left.type)
    })
  },

  methods: {
    swipleModeChange(val) {
      /* eslint default-case: "error" */

      switch (val) {
        case 'confirm':
          this.swipeLeft = false
          this.swipeRight = true
          break
        case 'delete':
          this.swipeLeft = true
          this.swipeRight = false
          break
        case 'both':
          this.swipeLeft = true
          this.swipeRight = true
          break

        // No Default
      }
    },
    resetSlider() {
      const left = this
      left.$nextTick(() => {
        this.deleteSlider = 'transform:translateX(0px)'
      })
    },
    sendChange(message) {
      this.$emit('change', { message, node: this, id: this.id })
    },
    handleChildClick(val) {
      this.$emit('click', { target: val, node: this, id: this.id })
    },
    touchStart(ev) {
      // ev = ev || event

      // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕

      if (ev.touches.length === 1) {
        // 记录开始位置
        this.startX = ev.touches[0].clientX
      }
    },
    touchMove(ev) {
      // ev = ev || event

      // 获取删除按钮的宽度，此宽度为滑块左滑的最大距离
      const wd = this.$refs.remove.offsetWidth
      if (ev.touches.length === 1) {
        // 滑动时距离浏览器左侧实时距离
        this.moveX = ev.touches[0].clientX

        // 起始位置减去 实时的滑动的距离，得到手指实时偏移距离
        this.disX = this.startX - this.moveX

        // 如果是向右滑动或者不滑动，不改变滑块的位置
        if (this.disX < 0 || this.disX === 0) {
          if (!this.swipeRight) this.deleteSlider = 'transform:translateX(0px)'
          else {
            this.deleteSlider = `transform:translateX(${this.disX * -1}px)`

            // 最大也只能等于删除按钮宽度
            if (this.disX * -1 >= wd) {
              this.deleteSlider = `transform:translateX(${wd}px)`
            }
          }

          // 大于0，表示左滑了，此时滑块开始滑动
        } else if (this.disX > 0) {
          if (this.swipeLeft) {
            // 具体滑动距离我取的是 手指偏移距离*5。
            this.deleteSlider = `transform:translateX(-${this.disX}px)`

            // 最大也只能等于删除按钮宽度
            if (this.disX >= wd) {
              this.deleteSlider = `transform:translateX(-${wd}px)`
            }
          } else {
            this.deleteSlider = 'transform:translateX(0px)'
          }
        }
      }
    },
    touchEnd(ev) {
      // ev = ev || event
      const wd = this.$refs.remove.offsetWidth

      // let wd=this.width
      if (ev.changedTouches.length === 1) {
        const endX = ev.changedTouches[0].clientX

        this.disX = this.startX - endX

        // 如果距离小于删除按钮一半,强行回到起点
        if (this.disX <= 0 && this.swipeRight) {
          if (this.disX * -1 < wd) {
            // console.log('小于删除按钮一半')
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            // 大于一半 滑动到最大值
            this.sendChange('confirm')

            this.deleteSlider = `transform:translateX(${wd}px)`
          }
        } else if (this.swipeLeft) {
          if (this.disX < wd) {
            // console.log('小于删除按钮一半')
            this.deleteSlider = 'transform:translateX(0px)'
          } else {
            // 大于一半 滑动到最大值
            this.sendChange('delete')

            this.deleteSlider = `transform:translateX(-${wd}px)`
          }
        }
      }
    },
  },
}
</script>
<style scoped lang="scss">
.delete {
  overflow-x: auto;
}
.slider {
  overflow-x: hidden;

  position: relative;
  user-select: none;
  .content {
    overflow-y: hidden;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 100;
    //    设置过渡动画
    transition: 0.3s;
  }
  .remove {
    position: absolute;
    background: var(--v-error-base);
    right: 0;
    top: 0;
    color: #fff;
    text-align: center;
    font-size: 50px;
    line-height: 200px;
    border-radius: 5px;
  }
  .confirm {
    position: absolute;
    background: var(--v-success-base);
    left: 0;
    top: 0;
    color: #fff;
    text-align: center;
    font-size: 50px;
    line-height: 200px;
    border-radius: 5px;
  }
}
</style>
