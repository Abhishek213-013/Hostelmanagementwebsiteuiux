import { onUnmounted } from 'vue'

export function useLazyLoader(options = {}) {
  const { rootMargin = '200px', threshold = 0 } = options
  const queue = new Map()
  let observer = null

  function observe(element, key, callback) {
    if (!element || queue.has(key)) return

    queue.set(key, { callback, loaded: false })

    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const key = entry.target.dataset.lazyKey
            if (key && queue.has(key)) {
              const item = queue.get(key)
              if (!item.loaded) {
                item.loaded = true
                item.callback()
                observer.unobserve(entry.target)
              }
            }
          }
        })
      }, { rootMargin, threshold })
    }

    element.dataset.lazyKey = key
    observer.observe(element)
  }

  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    queue.clear()
  }

  onUnmounted(cleanup)

  return { observe, cleanup }
}
