<template>
  <aside class="brand">
    <div class="logo">
      <div class="logo__mark"><i></i><b></b></div>
      <span>SAKURA NOTE</span>
    </div>

    <!-- 一枚缓慢旋转的樱花印章，作为品牌侧的视觉锚点 -->
    <div class="seal" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <g class="seal__petals">
          <path
            v-for="i in 5"
            :key="i"
            d="M60 50 C45 43 41 26 49 13 C53 6 58 2.5 60 0 C62 2.5 67 6 71 13 C79 26 75 43 60 50 Z"
            :transform="`rotate(${(i - 1) * 72} 60 60)`"
          />
        </g>
        <circle cx="60" cy="60" r="6.5" class="seal__core" />
      </svg>
    </div>

    <div class="brand__body">
      <h1>把每一天，<br><em>夹进樱花书签里</em></h1>
      <p>技术笔记、小说片段、一闪而过的念头 —— 春风吹过的角落里，总有一页在等你翻开。</p>
      <div class="stats">
        <div><b>{{ fmt(stats.articles) }}</b><span>篇手记</span></div>
        <div><b>{{ fmt(stats.tags) }}</b><span>枚标签</span></div>
        <div><b>∞</b><span>场春风</span></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
/**
 * 品牌侧栏（樱花印章由模板按 72° 递增旋转生成五瓣）。
 * 底部统计从 /api/stats/overview 取真实值，取不到时退回占位符，
 * 避免像以前那样把「13 篇 / 28 枚」写死在模板里、加了内容却还显示旧数字。
 */
import { onMounted, reactive } from 'vue'
import { fetchOverview } from '../api/stats'

const stats = reactive({ articles: '—', tags: '—' })

function fmt (n) {
  if (n === '—' || n == null) return '—'
  return n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, '') + '万' : String(n)
}

onMounted(async () => {
  try {
    const o = await fetchOverview()
    if (o) {
      stats.articles = o.articles
      stats.tags = o.tags
    }
  } catch (e) {
    /* 静默降级：展示占位符即可，不打断登录流程 */
  }
})
</script>

<style scoped>
.brand { gap: 20px; }

.seal {
  position: absolute;
  right: 30px;
  bottom: 150px;
  width: 128px;
  height: 128px;
  opacity: .8;
  animation: turn 64s linear infinite;
  z-index: 2;
}
@keyframes turn { to { transform: rotate(360deg); } }
.seal svg { width: 100%; height: 100%; }
.seal__petals path {
  fill: rgba(255, 233, 242, .14);
  stroke: rgba(255, 236, 245, .48);
  stroke-width: 1.1;
}
.seal__core { fill: rgba(255, 236, 245, .5); }

.brand__body { position: relative; z-index: 2; }
.brand h1 { margin-top: 0; }

@media (max-width: 900px) {
  .seal { display: none; }
}
</style>
