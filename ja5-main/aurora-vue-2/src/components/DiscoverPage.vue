<template>
  <div class="page">
    <SiteNav :user="user" active="discover" @go="$emit('navigate', $event)" @logout="$emit('logout')" />

    <main class="subpage">
      <header class="subhead">
        <span class="subhead__tag">Discover</span>
        <h1>漫游花径</h1>
        <p>最新落笔、本周最热，以及全部内容分类 —— 顺着花枝走，总能遇见一篇想读的。</p>
      </header>

      <!-- 分类入口 -->
      <section v-if="categories.length" class="cats paper-card">
        <div class="sec__head">
          <h2 class="sec__title">逛分类</h2>
          <button class="sec__more" type="button" @click="$emit('open-home', {})">全部内容 →</button>
        </div>
        <div class="cats__grid">
          <button
            v-for="(c, i) in categories"
            :key="c.id"
            class="catcard"
            type="button"
            @click="$emit('open-home', { categoryId: c.id })"
          >
            <span class="catcard__idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="catcard__body">
              <span class="catcard__name">{{ c.name }}</span>
              <span class="catcard__bar"><i :style="{ width: catWidth(c.articleCount) }"></i></span>
            </span>
            <span class="catcard__num">{{ c.articleCount }}</span>
          </button>
        </div>
      </section>

      <!-- 最新文章 -->
      <section class="sec">
        <div class="sec__head">
          <h2 class="sec__title">新叶初生<span>最新发布</span></h2>
          <button class="sec__more" type="button" @click="$emit('open-home', { sort: 'new' })">更多 →</button>
        </div>
        <div v-if="loading" class="skeleton">
          <div v-for="n in 3" :key="'n' + n" class="sk-card">
            <div class="sk-line sk-line--title"></div>
            <div class="sk-line sk-line--sub"></div>
          </div>
        </div>
        <div v-else-if="error" class="sub-empty state--error">
          <div class="sub-empty__ico">!</div>
          <p>{{ error }}</p>
          <button class="sub-empty__btn" type="button" @click="load">重试</button>
        </div>
        <div v-else-if="!latest.length" class="sub-empty">
          <div class="sub-empty__ico">✿</div>
          <p>还没有新的手记落笔</p>
        </div>
        <div v-else class="rlist">
          <ArticleCard
            v-for="a in latest"
            :key="a.id"
            :article="a"
            :favorited="favIds.has(a.id)"
            :show-fav="!!user"
            @open="$emit('open-article', $event)"
            @open-category="$emit('open-category', $event)"
            @open-tag="$emit('open-tag', $event)"
            @toggle-fav="toggleFav"
          />
        </div>
      </section>

      <!-- 热门文章 -->
      <section class="sec">
        <div class="sec__head">
          <h2 class="sec__title">花下人最多<span>热门推荐</span></h2>
          <button class="sec__more" type="button" @click="$emit('open-home', { sort: 'hot' })">更多 →</button>
        </div>
        <div v-if="loading" class="skeleton">
          <div v-for="n in 3" :key="'h' + n" class="sk-card">
            <div class="sk-line sk-line--title"></div>
            <div class="sk-line sk-line--sub"></div>
          </div>
        </div>
        <div v-else-if="!hot.length" class="sub-empty">
          <div class="sub-empty__ico">✿</div>
          <p>暂时还没有热门的文章</p>
        </div>
        <div v-else class="rlist">
          <ArticleCard
            v-for="a in hot"
            :key="a.id"
            :article="a"
            :favorited="favIds.has(a.id)"
            :show-fav="!!user"
            @open="$emit('open-article', $event)"
            @open-category="$emit('open-category', $event)"
            @open-tag="$emit('open-tag', $event)"
            @toggle-fav="toggleFav"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SiteNav from './SiteNav.vue'
import ArticleCard from './ArticleCard.vue'
import { searchArticles, fetchCategories } from '../api/search'
import { fetchFavoriteIds, addFavorite, removeFavorite } from '../api/favorites'
import { toast } from '../composables/useToast'

const props = defineProps({
  user: { type: Object, default: null }
})
defineEmits(['navigate', 'open-article', 'open-category', 'open-tag', 'open-home', 'logout'])

const LIST_SIZE = 6

const categories = ref([])
const latest = ref([])
const hot = ref([])
const favIds = ref(new Set())
const loading = ref(false)
const error = ref('')

const hasContent = computed(() => latest.value.length || hot.value.length)

/** 分类占比条：以最大分类为 100%，最小也有 8% 以免看不见 */
const catMax = computed(() =>
  categories.value.reduce((m, c) => Math.max(m, c.articleCount || 0), 0) || 1)
function catWidth (n) {
  return Math.max(8, Math.round(((n || 0) / catMax.value) * 100)) + '%'
}

async function load () {
  loading.value = true
  error.value = ''
  try {
    // 最新 / 热门并行拉取；分类树与收藏态失败不阻塞列表
    const [newest, hottest, cats] = await Promise.all([
      searchArticles('', { sort: 'new', page: 1, size: LIST_SIZE }),
      searchArticles('', { sort: 'hot', page: 1, size: LIST_SIZE }),
      fetchCategories().catch(() => [])
    ])
    latest.value = (newest && newest.list) || []
    hot.value = (hottest && hottest.list) || []
    categories.value = cats || []

    // 登录用户：拉取收藏 id 集合，用于卡片收藏态
    if (props.user) {
      try {
        const ids = await fetchFavoriteIds()
        favIds.value = new Set(ids)
      } catch (_) { /* 收藏态加载失败不阻塞浏览 */ }
    }
  } catch (e) {
    latest.value = []
    hot.value = []
    error.value = (e && e.message) || '加载失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

/** 卡片收藏 / 取消收藏：直接更新本地集合，无需整页刷新 */
async function toggleFav (article) {
  const on = favIds.value.has(article.id)
  try {
    if (on) await removeFavorite(article.id)
    else await addFavorite(article.id)
    toast.success(on ? '已取消收藏' : '已收藏')
  } catch (e) {
    toast.error((e && e.message) || '操作失败，请稍后再试')
    return
  }
  const next = new Set(favIds.value)
  if (on) next.delete(article.id)
  else next.add(article.id)
  favIds.value = next
}

onMounted(load)
</script>

<style scoped>
.page {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
}

/* 区块 */
.sec {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
}
.sec__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}
.sec__title {
  position: relative;
  margin: 0;
  padding-left: 14px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .04em;
  color: var(--ink);
}
.sec__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--sakura-400), var(--sakura-600));
}
.sec__title span {
  margin-left: 10px;
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: .16em;
  color: var(--faint);
}
.sec__more {
  border: 0;
  background: none;
  color: var(--sakura-500);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
  padding: 0;
  transition: color .25s, transform .25s;
}
.sec__more:hover { color: var(--sakura-700); transform: translateX(2px); }

/* 分类 chips */
.cats {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px 22px;
  animation: rise .55s var(--ease) both;
}
/* 分类卡：三列栅格，序号 + 名称 + 占比细条 + 篇数 */
.cats__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.catcard {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px 12px;
  min-width: 0;
  padding: 13px 15px;
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  background: linear-gradient(160deg, #fff, rgba(253, 247, 248, .8));
  box-shadow: inset 0 1px 0 #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color .28s var(--ease), background .28s var(--ease),
              transform .28s var(--ease), box-shadow .28s var(--ease);
}
.catcard__idx {
  display: none;
}
.catcard__body {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px 10px;
  flex: 1;
  min-width: 0;
}
.catcard__name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.catcard__num {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  color: var(--sakura-600);
  font-variant-numeric: tabular-nums;
}
.catcard__bar {
  grid-column: 1 / -1;
  display: block;
  height: 3px;
  border-radius: 2px;
  background: var(--paper-3);
  overflow: hidden;
}
.catcard__bar i {
  display: block;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--sakura-300), var(--sakura-500));
  transition: width .5s var(--ease);
}
.catcard:hover {
  border-color: var(--sakura-200);
  background: #fff;
  transform: translateY(-2px);
  box-shadow: var(--gloss), 0 14px 24px -22px rgba(197, 58, 100, .85);
}

/* 列表 */
.rlist {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 骨架 */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sk-card {
  padding: 22px 24px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, .7);
  border: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sk-line {
  height: 13px;
  border-radius: 7px;
  background: linear-gradient(100deg, var(--sakura-50) 20%, var(--sakura-100) 40%, var(--sakura-50) 60%);
  background-size: 220% 100%;
  animation: shimmer 1.5s linear infinite;
}
.sk-line--title { width: 62%; height: 17px; }
.sk-line--sub { width: 88%; }
@keyframes shimmer {
  from { background-position: 120% 0; }
  to   { background-position: -120% 0; }
}

.state--error .sub-empty__ico {
  background: var(--sakura-100);
  color: var(--sakura-600);
  font-weight: 700;
}

@media (max-width: 900px) {
  .cats__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .sec { margin-top: 30px; }
  .cats { padding: 16px; }
  .cats__grid { grid-template-columns: 1fr; gap: 8px; }
}
</style>
