<template>
  <div class="page">
    <SiteNav :user="user" active="about" @go="$emit('navigate', $event)" @logout="$emit('logout')" />

    <main class="subpage main">
      <header class="subhead">
        <span class="subhead__tag">About</span>
        <h1>关于樱见</h1>
        <p>SAKURA NOTE · 一个把春日写进代码里的全栈内容站</p>
      </header>

      <section class="card">
        <h2 class="card__title">这个站点是什么</h2>
        <p class="card__text">
          樱见是一个全栈内容检索站点：前端用 Vue 3 + Vite 手绘了一片会落花的春日场景，
          后端用 Spring Boot 3 + MyBatis-Plus 提供认证与检索能力，数据落在 MySQL 里。
        </p>
        <p class="card__text">
          站内既有技术手记，也有小说与随笔（如《凡人修仙传》专题），支持关键词搜索、两级分类筛选、
          排序切换、分页浏览、文章阅读与书签管理，还藏了一颗彩蛋——花瓣贪吃蛇。
        </p>
      </section>

      <section class="grid">
        <div class="feature" data-no="01">
          <div class="feature__ico feature__ico--a">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.6-3.6" />
            </svg>
          </div>
          <h3 class="feature__title">分级分类检索</h3>
          <p class="feature__text">一级分类 + 二级标签交叉筛选，关键词命中标题优先的相关度排序，支持搜索建议与历史记录。</p>
        </div>

        <div class="feature" data-no="02">
          <div class="feature__ico feature__ico--b">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <h3 class="feature__title">安静的阅读</h3>
          <p class="feature__text">详情页带衬线正文排版、标签跳转、相关文章推荐与浏览量统计，书签功能需登录后使用。</p>
        </div>

        <div class="feature" data-no="03">
          <div class="feature__ico feature__ico--c">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 class="feature__title">JWT 认证</h3>
          <p class="feature__text">昵称 + 密码注册登录，图形验证码防护，BCrypt 加密存储，令牌本地持久化，刷新页面保持登录态。</p>
        </div>

        <div class="feature" data-no="04">
          <div class="feature__ico feature__ico--d">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h3 class="feature__title">会落花的界面</h3>
          <p class="feature__text">Canvas 手绘五瓣樱花，带翻面、摆动与景深；鸟居、远山、花枝全部由 CSS 与 SVG 画出，桌面与移动端自适应。</p>
        </div>

        <div class="feature" data-no="05">
          <div class="feature__ico feature__ico--e">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(-18 12 12)" />
            </svg>
          </div>
          <h3 class="feature__title">花瓣贪吃蛇</h3>
          <p class="feature__text">收集樱瓣的小游戏，速度渐增，成绩实时入库，排行榜全站可见。</p>
        </div>
      </section>

      <section class="card">
        <h2 class="card__title">技术栈</h2>
        <div class="stack">
          <span v-for="s in stack" :key="s" class="stack__chip">{{ s }}</span>
        </div>
      </section>

      <section class="card">
        <h2 class="card__title">功能一览</h2>
        <ul class="flist">
          <li v-for="f in features" :key="f.name">
            <b>{{ f.name }}</b>
            <span>{{ f.desc }}</span>
          </li>
        </ul>
      </section>

      <section class="card">
        <h2 class="card__title">项目结构</h2>
        <pre class="tree">{{ tree }}</pre>
      </section>

      <section class="card card--tip">
        <h2 class="card__title">演示账号</h2>
        <p class="card__text">
          昵称 <code>verify用户</code> · 密码 <code>abc12345</code>
          （已入库，可直接登录验证书签功能；也可以自行注册新账号）
        </p>
      </section>

      <footer class="foot">
        <span>樱见 · SAKURA NOTE</span>
        <span class="foot__dot"></span>
        <span>Vue 3 · Spring Boot 3 · MySQL</span>
      </footer>
    </main>
  </div>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null }
})
defineEmits(['navigate', 'logout'])

const stack = [
  'Vue 3', 'Vite', '视图状态机（未引入 vue-router）', 'Spring Boot 3', 'MyBatis-Plus',
  'MySQL 8', 'JWT', 'BCrypt', 'REST API', 'Canvas 小游戏'
]

/** 站点功能一览（后端接口 + 前端页面对应关系） */
const features = [
  { name: '搜索与筛选', desc: '关键词命中标题 / 摘要 / 正文 / 作者 / 标签，支持一级分类 + 二级标签交叉筛选、热度与最新排序、分页' },
  { name: '搜索辅助', desc: '输入即出的搜索建议（标题 + 标签）、本地搜索历史、键盘上下选择与高亮' },
  { name: '文章阅读', desc: '详情页按空行分段渲染，展示浏览量、点赞数、预计阅读时长，底部推荐相关文章' },
  { name: '收藏', desc: '卡片与详情页均可收藏 / 取消收藏，收藏页支持分页与直接取消' },
  { name: '点赞', desc: '文章点赞与取消，详情页显示实时点赞数，列表页可标记点赞态' },
  { name: '浏览历史', desc: '登录后自动记录阅读足迹，个人中心可分页查看、单条删除或一键清空' },
  { name: '个人中心', desc: '汇总昵称、加入时间、收藏 / 浏览 / 点赞统计与游戏成绩' },
  { name: '星空贪吃蛇', desc: 'Canvas 实现的小游戏，成绩联网提交并参与全站排行榜' }
]

const tree = `ja5-main/
├─ aurora-vue-2/          前端 Vue 3 + Vite（端口 5173）
│  ├─ src/api/            http 统一请求层 + auth/search/article/favorites/likes/history/profile
│  ├─ src/components/     页面与组件（首页 / 详情 / 发现 / 收藏 / 个人中心 / 关于 / 游戏）
│  ├─ src/composables/    useTilt、useAuthForm、useToast
│  └─ vite.config.js      /api 代理到 8081
└─ springBootTest/        后端 Spring Boot 3（端口 8081）
   ├─ controller/service/mapper/entity/dto   分层结构
   ├─ config/             JwtUtil、AuthSupport、CorsConfig
   ├─ resources/mapper/   复杂查询 SQL
   └─ *.sql               建库与幂等迁移脚本`
</script>

<style scoped>
.page {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
}
.main {
  max-width: 880px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ============ 内容卡片 ============ */
.card {
  position: relative;
  padding: 26px 30px;
  border-radius: 22px;
  background: rgba(255, 255, 255, .76);
  border: 1px solid var(--line-soft);
  box-shadow: 0 20px 44px -36px rgba(120, 60, 84, .7);
  backdrop-filter: blur(10px);
  animation: rise .55s var(--ease) both;
}
.card--tip {
  border-color: var(--sakura-200);
  background: linear-gradient(150deg, #fff, var(--sakura-50));
}
.card__title {
  position: relative;
  margin: 0 0 14px;
  padding-left: 14px;
  font-family: var(--font-serif);
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: .04em;
  color: var(--ink);
}
.card__title::before {
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
.card__text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.95;
  color: var(--ink-soft);
}
.card__text + .card__text {
  margin-top: 10px;
}
.card__text code {
  font-family: inherit;
  font-size: 12.5px;
  color: var(--sakura-700);
  background: var(--sakura-100);
  border-radius: 6px;
  padding: 1px 8px;
}

/* 功能一览 */
.flist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.flist li {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 12px;
  align-items: baseline;
  padding: 10px 13px;
  border-radius: 12px;
  background: rgba(255, 247, 250, .7);
  border: 1px solid var(--line-soft);
}
.flist b {
  font-size: 13px;
  font-weight: 600;
  color: var(--sakura-700);
}
.flist span {
  font-size: 12.8px;
  line-height: 1.75;
  color: var(--muted);
}

/* 项目结构树 */
.tree {
  margin: 0;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fdf5f8;
  border: 1px solid var(--sakura-100);
  font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.8;
  color: var(--ink-soft);
  overflow-x: auto;
}

/* 技术栈 chips */
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stack__chip {
  font-size: 12.5px;
  color: var(--ink-soft);
  background: #fff;
  border: 1px solid var(--sakura-100);
  border-radius: 999px;
  padding: 5px 14px;
  transition: border-color .25s, color .25s, transform .25s;
}
.stack__chip:hover {
  border-color: var(--sakura-300);
  color: var(--sakura-600);
  transform: translateY(-1px);
}

/* ============ 特性网格 ============ */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.feature {
  position: relative;
  padding: 24px 24px 26px;
  border-radius: 18px;
  background: var(--porcelain);
  border: 1px solid var(--porcelain-line);
  box-shadow: var(--gloss), var(--lift);
  overflow: hidden;
  transition: transform .34s var(--ease), border-color .34s var(--ease), box-shadow .34s var(--ease);
}
.feature::after {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 221, 233, .55), transparent 70%);
  opacity: 0;
  transition: opacity .4s var(--ease);
}
.feature:hover {
  transform: translateY(-4px);
  border-color: var(--sakura-200);
  box-shadow: var(--gloss), var(--lift-hover);
}
.feature:hover::after { opacity: 1; }

/* 图标统一为「樱色线描印」：不再用五种彩色渐变，避免破坏整体色系 */
.feature__ico {
  position: relative;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  margin-bottom: 15px;
  color: var(--sakura-600);
  background: linear-gradient(150deg, #fff, var(--sakura-50));
  box-shadow: inset 0 0 0 1px var(--sakura-200), 0 8px 16px -14px rgba(197, 58, 100, .7);
}
.feature__ico svg {
  width: 19px;
  height: 19px;
}
/* 序号角标：贴在卡片右上，轻量不抢戏 */
.feature__ico {
  position: static;
}
.feature__ico::before { content: none; }
.feature::before {
  content: attr(data-no);
  position: absolute;
  top: 22px;
  right: 22px;
  font-family: var(--font-serif);
  font-size: 11px;
  letter-spacing: .14em;
  color: var(--sakura-200);
  transition: color .34s var(--ease);
}
.feature:hover::before { color: var(--sakura-400); }
.feature__ico--a,
.feature__ico--b,
.feature__ico--c,
.feature__ico--d,
.feature__ico--e { background: linear-gradient(150deg, #fff, var(--sakura-50)); }
.feature__title {
  margin: 0 0 8px;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}
.feature__text {
  margin: 0;
  font-size: 12.8px;
  line-height: 1.8;
  color: var(--muted);
}

/* 页脚 */
.foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 0 2px;
  font-size: 12px;
  color: var(--faint);
  letter-spacing: .04em;
}
.foot__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--sakura-300);
}

@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .card { padding: 20px; }
  .flist li { grid-template-columns: 1fr; gap: 4px; }
}
</style>
