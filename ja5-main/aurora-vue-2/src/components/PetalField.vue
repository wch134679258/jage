<template>
  <!-- 全站樱花花瓣层：固定在最上层，鼠标穿透，不拦截任何交互 -->
  <canvas ref="canvas" id="petals" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createPetalField } from '../composables/usePetals'

const props = defineProps({
  /** 花瓣密度系数，1 = 默认；登录页可略高一点更有氛围 */
  density: { type: Number, default: 1 },
  /** 整体不透明度。页面内容多时调低，避免花瓣压在文字上影响阅读 */
  opacity: { type: Number, default: 1 }
})

const canvas = ref(null)
let field = null

onMounted(() => {
  if (canvas.value) canvas.value.style.opacity = String(props.opacity)
  const mobile = window.matchMedia('(max-width: 720px)').matches
  field = createPetalField(canvas.value, {
    density: (mobile ? 0.00006 : 0.000085) * props.density,
    max: Math.round((mobile ? 80 : 150) * props.density)
  })
  field.mount()
})

onBeforeUnmount(() => {
  if (field) field.destroy()
})
</script>
