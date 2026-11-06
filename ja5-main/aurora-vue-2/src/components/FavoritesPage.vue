<template>
  <div class="page">
    <SiteNav :user="user" active="favorites" @go="$emit('navigate', $event)" @logout="$emit('logout')" />

    <main class="subpage main">
      <header class="subhead">
        <span class="subhead__tag">Favorites</span>
        <h1>我的书签</h1>
        <p v-if="user">夹在书页里的樱瓣，按收藏时间倒序排列，点开就能接着读。</p>
      </header>

      <!-- 未登录：引导去登录 -->
      <div v-if="!user" class="sub-empty">
        <div class="sub-empty__ico">✿</div>
        <p>登录后就能把喜欢的文章，一片片夹进书里</p>
        <button class="sub-empty__btn" type="button" @click="$emit('need-login')">去登录</button>
      </div>

      <!-- 加载中 -->
      <div v-else-if="loading" class="skeleton">
        <div v-for="n in 3" :key="n" class="sk-card">
          <div class="sk-line sk-line--title"></div>
          <div class="sk-line sk-line--sub"></div>
          <div class="sk-line sk-line--sub sk-line--short"></div>
        </div>
      </div>

      <!-- 加载失败 -->
      <div v-else-if="error" class="sub-empty state--error">
        <div class="sub-empty__ico">!</div>
        <p>{{ error }}</p>
        <button class="sub-empty__btn" type="button" @click="load(1)">重试</button>
      </div>

      <!-- 空收藏 -->
      <div v-else-if="!list.length" class="sub-empty">
        <div class="sub-empty__ico">✿</div>
        <p>书签还是空的 —— 去花径上找几篇喜欢的吧</p>
        <button class="sub-empty__btn" type="button" @click="$emit('navigate', 'home')">回首页</button>
      </div>

      <!-- 收藏列表 -->
      <template v-else>
        <div class="results__head">
          <span class="results__count">共 <b>{{ total }}</b> 篇收藏</span>
          <span class="results__hint">点击卡片继续阅读</span>
        </div>

        <div class="rlist">
          <ArticleCard
            v-for="a in list"
            :key="a.id"
            :article="a"
            :favorited="true"
            :show-fav="true"
            @open="$emit('open-article', $event)"
            @open-category="$emit('open-category', $event)"
            @open-tag="$emit('open-tag', $event)"
            @toggle-fav="unfavorite"
          />
        </div>

        <!-- 分页 -->
        <div v-if="pages > 1" class="pager">
          <button class="pager__btn" type="button" :disabled="page <= 1" @click="go(page - 1)">
            上一页
          </button>
          <span class="pager__info">{{ page }} / {{ pages }}</span>
          <button class="pager__btn" type="button" :disabled="page >= pages" @click="go(page + 1)">
            下一页
          </button>
        </div>
      </template>

      <SiteFooter @go="$emit('navigate', $event)" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SiteNav from './SiteNav.vue'
import SiteFooter from './SiteFooter.vue'
import ArticleCard from './ArticleCard.vue'
import { fetchFavorites, removeFavorite } from '../api/favorites'
import { toast } from '../composables/useToast'

const props = defineProps({
  user: { type: Object, default: null }
})
defineEmits(['navigate', 'open-article', 'open-category', 'open-tag', 'logout', 'need-login'])

const PAGE_SIZE = 10
const list = ref([])
const total = ref(0)
const pages = ref(0)
const page = ref(1)
const loading = ref(false)
const error = ref('')

async function load (p = 1) {
  loading.value = true
  error.value = ''
  page.value = p
  try {
    const res = await fetchFavorites({ page: p, size: PAGE_SIZE })
    list.value = (res && res.list) || []
    total.value = (res && res.total) || 0
    pages.value = (res && res.pages) || 0
    page.value = (res && res.page) || p
  } catch (e) {
    list.value = []
    total.value = 0
    pages.value = 0
    error.value = (e && e.message) || '加载收藏失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

function go (p) {
  if (p < 1 || (pages.value && p > pages.value)) return
  load(p)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 在收藏页直接取消收藏：删除后刷新当前页（删空则回退一页） */
async function unfavorite (article) {
  try {
    await removeFavorite(article.id)
    toast.success('已取消收藏')
  } catch (e) {
    toast.error((e && e.message) || '取消收藏失败，请稍后再试')
    return
  }
  const target = list.value.length === 1 && page.value > 1 ? page.value - 1 : page.value
  load(target)
}

onMounted(() => {
  if (props.user) load(1)
})
</script>

<style scoped>
.page {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
}
.main {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

/* 结果头 */
.results__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}
.results__count {
  font-size: 13px;
  color: var(--muted);
}
.results__count b {
  font-family: var(--font-serif);
  font-size: 17px;
  color: var(--sakura-600);
  margin: 0 2px;
}
.results__hint {
  font-size: 11px;
  letter-spacing: .14em;
  color: var(--faint);
}

/* 列表 */
.rlist {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 分页 */
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 10px 0 4px;
}
.pager__btn {
  border: 1px solid var(--sakura-200);
  background: #fff;
  color: var(--sakura-600);
  font: inherit;
  font-size: 13px;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: background .25s, transform .25s var(--ease), opacity .25s, box-shadow .25s;
}
.pager__btn:hover:not(:disabled) {
  background: var(--sakura-50);
  transform: translateY(-1px);
  box-shadow: 0 12px 22px -20px rgba(197, 58, 100, .9);
}
.pager__btn:disabled {
  opacity: .4;
  cursor: not-allowed;
}
.pager__info {
  font-size: 12.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
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
.sk-line--short { width: 45%; }
@keyframes shimmer {
  from { background-position: 120% 0; }
  to   { background-position: -120% 0; }
}

.state--error .sub-empty__ico {
  background: var(--sakura-100);
  color: var(--sakura-600);
  font-weight: 700;
}
</style>
