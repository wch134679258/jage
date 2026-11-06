<template>
  <!-- 封面卡：封面在上，标题/摘要/元信息在下。首页「精选」与首屏头条共用 -->
  <article
    class="pick"
    :class="{ 'pick--lead': lead, 'pick--fav': favorited }"
    tabindex="0"
    role="button"
    :aria-label="'阅读文章：' + article.title"
    @click="$emit('open', article.id)"
    @keydown.enter="$emit('open', article.id)"
  >
    <div class="pick__cover" :style="{ backgroundImage: 'url(' + cover + ')' }" aria-hidden="true">
      <span class="pick__veil"></span>
      <span v-if="lead" class="pick__badge">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c1 3 3 3 3 6a3 3 0 0 1-6 0c0-3 2-3 3-6Zm-5.7 4.3c2.6 1.6 2 3.6 4 5.4a3 3 0 0 1-4.2 4.2c-2.1-2.1-.1-3.6-.4-5.7l.6-3.9Zm11.4 0 .6 3.9c-.3 2.1 1.7 3.6-.4 5.7a3 3 0 0 1-4.2-4.2c2-1.8 1.4-3.8 4-5.4Z" />
        </svg>
        本期头条
      </span>
      <button
        v-if="article.category && lead"
        class="pick__cat"
        type="button"
        @click.stop="$emit('open-category', article.categoryId, article.category)"
      >{{ article.category }}</button>
    </div>

    <button
      v-if="showFav"
      class="pick__fav"
      :class="{ 'pick__fav--on': favorited }"
      type="button"
      :title="favorited ? '取消书签' : '加入书签'"
      :aria-label="favorited ? '取消书签' : '加入书签'"
      @click.stop="$emit('toggle-fav', article)"
    >
      <svg viewBox="0 0 24 24" :fill="favorited ? 'currentColor' : 'none'" stroke="currentColor"
           stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z" />
      </svg>
    </button>

    <div class="pick__body">
      <h3 class="pick__title">{{ article.title }}</h3>
      <p class="pick__summary">{{ article.summary }}</p>
      <div class="pick__meta">
        <span v-if="!lead && article.tags && article.tags.length" class="pick__tag">{{ article.tags[0] }}</span>
        <span v-if="lead && article.author" class="pick__dim">{{ article.author }}</span>
        <i v-if="lead && article.author" class="pick__dot"></i>
        <span v-if="article.minutes" class="pick__dim">约 {{ article.minutes }} 分钟</span>
        <i v-if="article.minutes" class="pick__dot"></i>
        <span class="pick__dim">{{ article.views }} 次阅读</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { coverFor } from '../utils/cover'

const props = defineProps({
  article: { type: Object, required: true },
  /** 头条样式：加大标题、显示「本期头条」角标与分类 */
  lead: { type: Boolean, default: false },
  favorited: { type: Boolean, default: false },
  showFav: { type: Boolean, default: false },
  /** 指定封面图；首屏按版位取图时传入，避免多个位置撞同一张素材 */
  coverSrc: { type: String, default: '' }
})
defineEmits(['open', 'open-category', 'toggle-fav'])

const cover = computed(() => props.coverSrc || coverFor(props.article.id))
</script>

<style scoped>
.pick {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: var(--porcelain);
  border: 1px solid var(--porcelain-line);
  cursor: pointer;
  box-shadow: var(--gloss), var(--lift);
  transition: transform .45s var(--ease), border-color .45s var(--ease), box-shadow .45s var(--ease);
  isolation: isolate;
}
.pick:hover {
  transform: translateY(-7px);
  border-color: rgba(238, 168, 192, .8);
  box-shadow: var(--gloss), var(--lift-hover);
}
.pick:focus-visible { outline: 2px solid var(--sakura-500); outline-offset: 3px; }
.pick--fav { border-color: rgba(238, 168, 192, .8); }

/* ---------- 封面 ---------- */
.pick__cover {
  position: relative;
  height: 168px;
  background-color: var(--sakura-100);
  background-size: cover;
  background-position: center;
  transition: transform .7s var(--ease);
}
.pick:hover .pick__cover { transform: scale(1.05); }
.pick__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 245, 250, .06) 40%, rgba(58, 30, 44, .55) 100%);
}
/* 封面底部融进卡片白底，避免图片边缘生硬 */
.pick__cover::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 30px;
  background: linear-gradient(0deg, #fff, transparent);
  opacity: .55;
}
.pick__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: .1em;
  padding: 5px 11px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(115deg, var(--sakura-600), var(--sakura-400));
  box-shadow: 0 8px 18px -8px rgba(200, 40, 90, .9);
}
.pick__badge svg { width: 11px; height: 11px; }
.pick__cat {
  position: absolute;
  bottom: 12px;
  left: 14px;
  z-index: 2;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  padding: 4px 11px;
  border-radius: 999px;
  cursor: pointer;
  background: rgba(255, 255, 255, .22);
  border: 1px solid rgba(255, 255, 255, .55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background .25s;
}
.pick__cat:hover { background: rgba(249, 116, 159, .85); border-color: transparent; }

/* ---------- 收藏 ---------- */
.pick__fav {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  color: rgba(255, 255, 255, .8);
  background: rgba(60, 30, 45, .28);
  border: 1px solid rgba(255, 255, 255, .45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: color .2s, border-color .2s, transform .2s, background .2s;
}
.pick__fav svg { width: 14px; height: 14px; }
.pick__fav:hover { color: #fff; background: rgba(249, 116, 159, .9); border-color: transparent; transform: scale(1.08); }
.pick__fav--on { color: var(--sakura-500); background: #fff; border-color: #fff; }

/* ---------- 文案 ---------- */
.pick__body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.pick__title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.55;
  letter-spacing: .01em;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color .3s;
}
.pick:hover .pick__title { color: var(--sakura-700); }
.pick__summary {
  font-size: 12.5px;
  line-height: 1.75;
  color: var(--muted);
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pick__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: auto;
  padding-top: 14px;
  font-size: 11.5px;
  color: var(--faint);
}
.pick__tag {
  font-size: 10.5px;
  color: var(--sakura-700);
  background: var(--sakura-100);
  border-radius: 7px;
  padding: 2px 7px;
}
.pick__dim { color: var(--faint); }
.pick__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--sakura-300);
  display: inline-block;
}

/* ---------- 头条变体 ---------- */
.pick--lead { border-radius: 26px; }
.pick--lead .pick__cover { height: 300px; }
.pick--lead .pick__body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 60px 22px 20px;
  z-index: 2;
  background: linear-gradient(0deg, rgba(45, 20, 34, .82), rgba(45, 20, 34, .35) 62%, transparent);
}
.pick--lead .pick__title {
  color: #fff;
  font-size: 21px;
  line-height: 1.5;
  -webkit-line-clamp: 2;
  padding-right: 30px;
  text-shadow: 0 2px 14px rgba(40, 10, 25, .6);
}
.pick--lead:hover .pick__title { color: #ffe2ec; }
.pick--lead .pick__summary { display: none; }
.pick--lead .pick__meta { color: rgba(255, 240, 247, .8); padding-top: 12px; }
.pick--lead .pick__dim { color: rgba(255, 240, 247, .78); }
.pick--lead .pick__dot { background: rgba(255, 220, 235, .7); }
.pick--lead .pick__veil {
  background: linear-gradient(180deg, rgba(255, 240, 246, 0) 34%, rgba(45, 20, 34, .3) 66%, rgba(45, 20, 34, .8) 100%);
}
.pick--lead .pick__cover::after { display: none; }
.pick--lead .pick__cover { height: 420px; }

@media (max-width: 1100px) {
  .pick--lead .pick__cover { height: 360px; }
}
@media (max-width: 700px) {
  .pick__cover { height: 150px; }
  .pick--lead .pick__cover { height: 260px; }
  .pick--lead .pick__title { font-size: 18px; }
}
</style>
