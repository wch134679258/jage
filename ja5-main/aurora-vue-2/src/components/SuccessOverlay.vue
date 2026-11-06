<template>
  <div class="done" :class="{ show }">
    <div class="inner">
      <svg class="checkmark" viewBox="0 0 52 52" fill="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ff9dbf" />
            <stop offset="1" stop-color="#f9749f" />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r="24" stroke="url(#cg)" stroke-width="2.5" />
        <path d="m15 27 7.5 7.5L37 19" stroke="#e8547f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h3>{{ title }}</h3>
      <p>{{ sub }}</p>
      <button class="link" @click="$emit('reset')">← 返回</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  sub: { type: String, default: '' }
})
defineEmits(['reset'])
</script>
