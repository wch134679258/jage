<template>
  <SakuraBackground :night="night" />
  <div class="grain"></div>
  <PetalField :density="night ? 1 : 0.85" :opacity="night ? 1 : 0.88" />

  <!-- 全局轻提示 -->
  <ToastHost />

  <!-- 登录 / 注册页 -->
  <main v-if="view === 'auth'" class="stage">
    <header class="stage__brand">
      <span class="stage__mark"></span>
      <span class="stage__name">樱见</span>
      <span class="stage__en">SAKURA NOTE</span>
    </header>

    <section class="card" ref="card" @pointermove="onMove" @pointerleave="onLeave">
      <div class="card__spin"></div>
      <div class="card__fill"></div>
      <div class="card__spot" ref="spot"></div>

      <div class="card__inner">
        <BrandPanel />
        <AuthPanel ref="authPanel" @success="onSuccess" />
      </div>

      <SuccessOverlay :show="showDone" :title="doneTitle" :sub="doneSub" @reset="onReset" />
    </section>

    <p class="stage__foot">
      春风穿过鸟居，樱瓣落在书页上 —— 欢迎回到这里。
    </p>
  </main>

  <!-- ============ 登录后的页面 ============ -->
  <HomePage
    v-else-if="view === 'home'"
    :user="user"
    :initial-filter="homeFilter"
    @navigate="onNavigate"
    @open-article="openArticle"
    @logout="doLogout"
    @need-login="goAuth"
  />

  <ArticleDetail
    v-else-if="view === 'article'"
    :article-id="articleId"
    :user="user"
    @back="goHome()"
    @open-article="openArticle"
    @open-category="onOpenCategory"
    @open-tag="onOpenTag"
    @navigate="onNavigate"
    @logout="doLogout"
    @need-login="goAuth"
  />

  <FavoritesPage
    v-else-if="view === 'favorites'"
    :user="user"
    @navigate="onNavigate"
    @open-article="openArticle"
    @open-category="onOpenCategory"
    @open-tag="onOpenTag"
    @logout="doLogout"
    @need-login="goAuth"
  />

  <DiscoverPage
    v-else-if="view === 'discover'"
    :user="user"
    @navigate="onNavigate"
    @open-article="openArticle"
    @open-category="onOpenCategory"
    @open-tag="onOpenTag"
    @open-home="goHome"
    @logout="doLogout"
  />

  <AboutPage
    v-else-if="view === 'about'"
    :user="user"
    @navigate="onNavigate"
    @logout="doLogout"
  />

  <SpaceSnake
    v-else-if="view === 'game'"
    :user="user"
    @navigate="onNavigate"
    @open-article="openArticle"
    @open-category="onOpenCategory"
    @open-tag="onOpenTag"
    @open-home="goHome"
    @logout="doLogout"
  />

  <ProfilePage
    v-else-if="view === 'profile'"
    :user="user"
    @navigate="onNavigate"
    @open-article="openArticle"
    @logout="doLogout"
  />

  <!-- 全站页脚（登录页与全屏游戏页不显示） -->
  <div v-if="showFooter" class="footwrap">
    <SiteFooter @go="onNavigate" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import SakuraBackground from './components/SakuraBackground.vue'
import PetalField from './components/PetalField.vue'
import ToastHost from './components/ToastHost.vue'
import SiteFooter from './components/SiteFooter.vue'
import ProfilePage from './components/ProfilePage.vue'
import BrandPanel from './components/BrandPanel.vue'
import AuthPanel from './components/AuthPanel.vue'
import SuccessOverlay from './components/SuccessOverlay.vue'
import HomePage from './components/HomePage.vue'
import ArticleDetail from './components/ArticleDetail.vue'
import FavoritesPage from './components/FavoritesPage.vue'
import DiscoverPage from './components/DiscoverPage.vue'
import AboutPage from './components/AboutPage.vue'
import SpaceSnake from './components/SpaceSnake.vue'
import { useTilt } from './composables/useTilt'
import { getMe, logout, getToken } from './api/auth'

const { card, spot, onMove, onLeave } = useTilt()

const authPanel = ref(null)
const showDone = ref(false)
const doneTitle = ref('')
const doneSub = ref('')

/**
 * 视图状态机（无 vue-router）：
 *   auth 登录 / home 首页 / article 详情 / favorites 收藏
 *   discover 发现 / profile 我的 / about 关于 / game 小游戏
 */
const view = ref('auth')
const user = ref(null)
const articleId = ref(null)

/** 登录页用夜色，保证表单可读性 */
const night = computed(() => view.value === 'auth')

const showFooter = computed(() => view.value !== 'auth' && view.value !== 'game')

const homeFilter = ref(null)

watch(view, (v) => {
  document.body.classList.toggle('view-home', v !== 'auth')
  window.scrollTo({ top: 0 })
})

/* ---------- 登录流程 ---------- */
async function onSuccess (mode) {
  doneTitle.value = mode === 'signup' ? '账号创建成功' : '欢迎回来'
  doneSub.value = '樱花已为你铺好小路，正在打开首页…'
  showDone.value = true

  if (mode === 'signup' || mode === 'login') {
    try {
      user.value = await getMe()
      goHome()
      showDone.value = false
    } catch (e) {
      doneSub.value = (e && e.message) || '获取用户信息失败'
    }
  }
}

function onReset () {
  showDone.value = false
  if (authPanel.value) authPanel.value.resetToLogin()
}

function doLogout () {
  logout()
  user.value = null
  goAuth()
}

function goAuth () {
  view.value = 'auth'
  showDone.value = false
  if (authPanel.value) authPanel.value.resetToLogin()
}

/* ---------- 页面导航 ---------- */
function onNavigate (key) {
  view.value = key
}

function openArticle (id) {
  articleId.value = id
  view.value = 'article'
}

function goHome (filter = null) {
  homeFilter.value = filter ? { ...filter, _t: Date.now() } : null
  view.value = 'home'
}

function onOpenCategory (categoryId) {
  goHome({ categoryId: categoryId || null })
}

function onOpenTag (name) {
  goHome({ tagName: name })
}

onMounted(async () => {
  if (!getToken()) return
  try {
    user.value = await getMe()
    view.value = 'home'
  } catch (e) {
    user.value = null
    view.value = 'auth'
  }
})
</script>

<style scoped>
.footwrap {
  position: relative;
  z-index: 2;
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 0 24px 34px;
}

/* ---------- 登录页顶部品牌（悬浮在卡外） ---------- */
.stage { min-height: 100dvh; align-content: center; gap: 18px; }
.stage__brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  color: var(--night-ink);
}
.stage__mark {
  width: 22px;
  height: 22px;
  border-radius: 50% 0 50% 50%;
  background: linear-gradient(140deg, #fff, var(--sakura-300));
  transform: rotate(45deg) translateY(2px);
  box-shadow: 0 0 22px rgba(249, 116, 159, .9);
}
.stage__name {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 900;
  letter-spacing: .34em;
}
.stage__en {
  font-size: 10px;
  letter-spacing: .32em;
  color: rgba(255, 236, 245, .55);
}
.stage__foot {
  font-size: 12.5px;
  letter-spacing: .12em;
  color: rgba(255, 238, 246, .62);
  text-shadow: 0 2px 12px rgba(60, 20, 40, .5);
}

@media (max-width: 900px) {
  .stage { gap: 12px; }
  .stage__foot { display: none; }
}
</style>
