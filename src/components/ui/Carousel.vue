<template>
  <div class="overflow-hidden" ref="carouselRef">
    <div class="flex transition-transform duration-300" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    opts: { type: Object, default: () => ({ loop: false }) },
    plugins: { type: Array, default: () => [] }
  },
  data() {
    return {
      currentIndex: 0,
      slideCount: 0
    }
  },
  mounted() {
    if (this.$refs.carouselRef) {
      this.slideCount = this.$refs.carouselRef.children[0].children.length
    }
  },
  methods: {
    scrollTo(index) {
      if (this.slideCount > 0) {
        this.currentIndex = index % this.slideCount
      }
    }
  },
  provide() {
    return {
      carouselApi: {
        selectedScrollSnap: () => this.currentIndex,
        scrollTo: this.scrollTo,
        on: (event, callback) => {
          if (event === 'select') {
            this._selectCallback = callback
          }
        },
        off: () => {}
      }
    }
  }
}
</script>
