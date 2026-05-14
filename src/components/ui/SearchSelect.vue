<template>
  <Listbox as="div" class="relative" v-model="selectedValue">
    <ListboxButton
      class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none font-semibold text-left flex items-center justify-between gap-2 cursor-pointer"
      :class="modelValue ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'"
    >
      <span class="truncate">{{ displayValue }}</span>
      <ChevronDown class="w-4 h-4 shrink-0 text-gray-400" />
    </ListboxButton>
    <ListboxOptions
      class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto focus:outline-none"
    >
      <ListboxOption
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        v-slot="{ active, selected }"
      >
        <div
          :class="[
            active ? 'bg-teal-50 dark:bg-teal-900/20' : '',
            selected ? 'font-bold text-teal-600' : 'text-gray-800 dark:text-gray-200',
            'px-4 py-2.5 cursor-pointer text-sm'
          ]"
        >
          {{ opt.label }}
        </div>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  placeholder: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : props.placeholder
})
</script>
