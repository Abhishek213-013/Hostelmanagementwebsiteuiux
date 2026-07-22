<template>
  <div
    ref="sectionRef"
    :class="[
      'transition-all duration-500 ease-out',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      className
    ]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  delay: { type: Number, default: 0 },
  threshold: { type: Number, default: 0.05 }
})

const sectionRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: props.threshold, rootMargin: '50px 0px' }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
