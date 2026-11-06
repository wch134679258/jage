// ============================================================
//  文章封面：六张樱花二次元插画，按文章 id 稳定轮转
// ------------------------------------------------------------
//  素材说明（public/covers，均为 1200×800 的 JPG，约 250KB/张）
//    shrine.jpg     鸟居参道 · 落樱
//    railway.jpg    樱花铁路 · 站台
//    rooftop.jpg    天台 · 蓝天白云
//    classroom.jpg  春日教室 · 窗边花枝
//    desk.jpg       书桌 · 窗边笔记
//    night.jpg      夜樱 · 河灯
//  PickCard / ArticleRow / ArticleCard 共用，保证同一篇文章
//  在首页不同位置（头条、精选、列表）拿到的是同一张图。
//  后续如果后端补了真实封面字段，只要改一行：
//    return article.cover || COVERS[seed % COVERS.length]
// ============================================================

export const COVERS = [
  '/covers/shrine.jpg',
  '/covers/railway.jpg',
  '/covers/rooftop.jpg',
  '/covers/classroom.jpg',
  '/covers/desk.jpg',
  '/covers/night.jpg'
]

/** 与封面同色系的描边色，用于卡片悬停时的主题化高亮 */
export const COVER_TINT = [
  'rgba(233, 120, 92, .55)',   // 鸟居朱
  'rgba(120, 176, 220, .55)',  // 天空蓝
  'rgba(140, 190, 230, .55)',  // 天台蓝
  'rgba(249, 116, 159, .55)',  // 樱粉
  'rgba(214, 152, 120, .55)',  // 木色暖
  'rgba(126, 108, 190, .55)'   // 夜紫
]

/**
 * @param {number|string} id  文章 id
 * @returns {string} 封面图 URL
 */
export function coverFor (id) {
  const seed = Math.abs(Number(id) || 0)
  return COVERS[seed % COVERS.length]
}

/**
 * 按「版面位置」取图，而不是按文章 id。
 * 首屏只有几个封面位，用槽位取能保证它们互不重复。
 * @param {number} slot 槽位下标，从 0 开始
 */
export function coverAt (slot) {
  const i = Math.abs(Number(slot) || 0) % COVERS.length
  return COVERS[i]
}

/** 取封面同色系描边色 */
export function tintFor (id) {
  const seed = Math.abs(Number(id) || 0)
  return COVER_TINT[seed % COVER_TINT.length]
}
