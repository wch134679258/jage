<template>
  <!-- 文章卡片：首页 / 收藏页 / 发现页 共用。整卡可点击进入详情 -->
  <article
    class="rcard"
    :class="{ 'rcard--fav': favorited, 'rcard--feat': featured }"
    tabindex="0"
    role="button"
    :aria-label="'阅读文章：' + article.title"
    @click="$emit('open', article.id)"
    @keydown.enter="$emit('open', article.id)"
  >
    <!-- 精选卡片的封面：用星空图按文章 id 轮转，纯装饰不承载信息 -->
    <div
      v-if="featured"
      class="rcard__cover"
      :style="{ backgroundImage: 'url(' + cover + ')' }"
      aria-hidden="true"
    >
      <span class="rcard__cover-veil"></span>
      <span class="rcard__pick">落樱推荐</span>
      <button
        v-if="article.category"
        class="rcard__cat rcard__cat--cover"
        type="button"
        @click.stop="$emit('open-category', article.categoryId, article.category)"
      >{{ article.category }}</button>
    </div>

    <div class="rcard__main">
      <h3 class="rcard__title">{{ article.title }}</h3>
      <p class="rcard__summary">{{ article.summary }}</p>
      <div class="rcard__foot">
        <div class="rcard__info">
          <button
            v-if="article.category && !featured"
            class="rcard__cat"
            type="button"
            @click.stop="$emit('open-category', article.categoryId, article.category)"
          >{{ article.category }}</button>
          <span v-if="article.category && !featured" class="rcard__dot"></span>
          <span>{{ article.author }}</span>
          <span class="rcard__dot"></span>
          <span>{{ article.createdAt }}</span>
          <span class="rcard__dot"></span>
          <span>{{ article.views }} 次阅读</span>
          <template v-if="article.minutes">
            <span class="rcard__dot"></span>
            <span>约 {{ article.minutes }} 分钟</span>
          </template>
        </div>
        <div class="rcard__tags">
          <button
            v-for="t in (article.tags || [])"
            :key="t"
            class="rtag"
            type="button"
            @click.stop="$emit('open-tag', t)"
          >{{ t }}</button>
        </div>
      </div>
    </div>

    <!-- 收藏按钮（登录后才显示；点击不进入详情） -->
    <button
      v-if="showFav"
      class="rcard__fav"
      :class="{ 'rcard__fav--on': favorited }"
      type="button"
      :title="favorited ? '取消书签' : '加入书签'"
      :aria-label="favorited ? '取消书签' : '加入书签'"
      @click.stop="$emit('toggle-fav', article)"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z" />
      </svg>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { coverFor } from '../utils/cover'

const props = defineProps({
  article: { type: Object, required: true },
  /** 当前用户是否已收藏该文章 */
  favorited: { type: Boolean, default: false },
  /** 是否显示收藏按钮（收藏页自身就是收藏列表，不显示） */
  showFav: { type: Boolean, default: false },
  /** 精选样式：首页推荐位第一条用带封面的大卡片 */
  featured: { type: Boolean, default: false }
})
defineEmits(['open', 'open-category', 'open-tag', 'toggle-fav'])

/** 封面统一走 utils/cover.js，同一篇文章在任何位置都是同一张 */
const cover = computed(() => coverFor(props.article.id))
</script>

<style scoped>
/* ============ 结果卡片：白瓷 + 樱粉描边 ============ */
.rcard {
  position: relative;
  padding: 22px 24px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, .86);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(255, 222, 234, .9);
  cursor: pointer;
  box-shadow: 0 14px 34px -28px rgba(147, 81, 108, .6);
  transition: transform .35s var(--ease), border-color .35s, box-shadow .35s;
}
.rcard:hover {
  transform: translateY(-4px);
  border-color: var(--sakura-300);
  box-shadow: 0 28px 54px -28px rgba(232, 84, 127, .55);
}
.rcard:focus-visible { outline: 2px solid var(--sakura-500); outline-offset: 3px; }
.rcard--fav { border-color: var(--sakura-300); }

/* ---------- 精选卡片 ---------- */
.rcard--feat {
  padding: 0;
  overflow: hidden;
}
.rcard--feat:hover {
  transform: translateY(-5px);
  box-shadow: 0 34px 64px -30px rgba(232, 84, 127, .6);
}
.rcard__cover {
  position: relative;
  height: 186px;
  background-color: var(--sakura-100);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px;
  transition: transform .7s var(--ease);
}
.rcard--feat:hover .rcard__cover { transform: scale(1.04); }
.rcard__cover-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 244, 249, .16) 0%, rgba(255, 244, 249, .02) 44%, rgba(255, 255, 255, .96) 100%);
}
.rcard__pick {
  position: relative;
  z-index: 2;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: .14em;
  padding: 5px 12px;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(115deg, var(--sakura-600), var(--sakura-400));
  box-shadow: 0 8px 18px -8px rgba(200, 40, 90, .9);
}
.rcard__cat--cover {
  position: relative;
  z-index: 2;
  color: #fff;
  background: rgba(60, 30, 45, .3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, .55);
}
.rcard--feat .rcard__main {
  position: relative;
  z-index: 2;
  margin-top: -34px;
  padding: 0 22px 18px;
}
.rcard--feat .rcard__title {
  font-size: 20px;
  line-height: 1.45;
  letter-spacing: .01em;
  padding-right: 44px;
}
.rcard--feat .rcard__summary { -webkit-line-clamp: 3; font-size: 13.5px; }
.rcard--feat .rcard__fav {
  top: 12px;
  right: 12px;
  background: rgba(60, 30, 45, .3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, .5);
  color: rgba(255, 255, 255, .85);
}

.rcard__title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.55;
  letter-spacing: .01em;
  padding-right: 40px;
  color: var(--ink);
  transition: color .25s;
}
.rcard:hover .rcard__title { color: var(--sakura-700); }
.rcard__summary {
  margin-top: 9px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
  font-weight: 300;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rcard__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}
.rcard__info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--faint);
  font-weight: 300;
}
.rcard__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--sakura-300);
  flex: none;
}
.rcard__cat {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--sakura-700);
  background: var(--sakura-100);
  border: 1px solid var(--sakura-200);
  border-radius: 999px;
  padding: 2px 10px;
  cursor: pointer;
  font-family: inherit;
  transition: color .25s, border-color .25s, background .25s;
}
.rcard__cat:hover { color: #fff; background: var(--sakura-500); border-color: transparent; }
.rcard__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.rtag {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--muted);
  font: inherit;
  font-size: 11.5px;
  padding: 3px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: color .25s, background .25s, border-color .25s, transform .25s var(--ease);
}
.rtag:hover {
  color: var(--sky-600);
  background: #f4fbff;
  border-color: var(--sky-400);
  transform: translateY(-1px);
}

/* 右上角书签按钮 */
.rcard__fav {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 4;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
  color: var(--faint);
  background: rgba(255, 255, 255, .8);
  transition: color .25s, background .25s, border-color .25s, transform .25s var(--ease);
}
.rcard__fav svg { width: 15px; height: 15px; }
.rcard__fav:hover {
  color: var(--sakura-500);
  border-color: var(--sakura-300);
  transform: translateY(-1px) scale(1.06);
}
.rcard__fav--on {
  color: var(--sakura-500);
  background: var(--sakura-100);
  border-color: var(--sakura-300);
}

@media (max-width: 640px) {
  .rcard { padding: 18px 18px 16px; border-radius: 18px; }
  .rcard__foot { flex-direction: column; align-items: flex-start; gap: 10px; }
  .rcard--feat { padding: 0; }
  .rcard--feat .rcard__cover { height: 150px; }
  .rcard--feat .rcard__main { padding: 0 17px 16px; margin-top: -26px; }
  .rcard--feat .rcard__title { font-size: 17.5px; }
}
</style>
