import { useState } from 'react'

const CATEGORY_NAMES = {
  rent: '🏠 Аренда',
  bike_rent: '🛵 Байк',
  bike_sale: '💰 Продажа байка',
  flea_market: '🛒 Барахолка',
  events: '🎉 Афиша',
  car_rent: '🚗 Машина',
  job: '👷 Работа',
  services: '🔧 Услуги',
  sport: '🏃 Спорт',
  health: '🏥 Здоровье',
  news: '📰 Новости',
  visa: '🎫 Виза',
  exchange: '💱 Обмен',
  lost_found: '🔍 Потеряно',
}

// 1. Очистка текста от Markdown (** и ссылок)
const formatText = (text) => {
  if (!text) return ""
  let clean = text.replace(/\*\*(.*?)\*\*/g, '$1') // Убираем жирный текст
  clean = clean.replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Убираем ссылки, оставляем только текст
  clean = clean.replace(/\\n/g, '\n') // Исправляем переносы строк
  return clean
}

// 2. Компонент галереи (теперь ищет фото везде и не показывает рандом)
function PhotoGrid({ post }) {
  // Проверяем все возможные поля, где могут лежать картинки
  const data = post.photos || post.images || []
  
  if (!Array.isArray(data) || data.length === 0) return null

  // Оставляем только те элементы, которые похожи на ссылки
  const validPhotos = data.filter(p => {
    const url = typeof p === 'string' ? p : p?.url
    return url && url.startsWith('http')
  })

  if (validPhotos.length === 0) return null

  const count = validPhotos.length
  let gridClass = 'single'
  if (count === 2) gridClass = 'double'
  else if (count >= 3 && count <= 4) gridClass = 'quad'
  else if (count >= 5 && count <= 6) gridClass = 'six'
  else if (count >= 7) gridClass = 'nine'

  const displayPhotos = count > 9 ? validPhotos.slice(0, 9) : validPhotos

  return (
    <div className={`photos-grid ${gridClass}`}>
      {displayPhotos.map((photo, i) => {
        const src = typeof photo === 'string' ? photo : photo.url
        return (
          <div key={i} className="photo-wrapper">
            <img
              src={src}
              alt=""
              loading="lazy"
              onError={e => { e.target.closest('.photo-wrapper').style.display = 'none' }}
            />
          </div>
        )
      })}
    </div>
  )
}

// 3. Основной компонент карточки
export default function PostCard({ post, highlighted, onSave, saved }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = post.text && post.text.length > 200

  const formattedDate = post.posted_at
    ? new Date(post.posted_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : ''

  const avatarLetter = (post.source_group || 'T')[0].toUpperCase()

  const openInTelegram = () => {
    if (!post.tg_link) return
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(post.tg_link)
    } else {
      window.open(post.tg_link, '_blank')
    }
  }

  const share = () => {
    const shareUrl = `${window.location.origin}?post=${post.id}`
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(`post_${post.id}`)
    } else if (navigator.share) {
      navigator.share({ url: shareUrl, title: 'ThaiFlow' })
    } else {
      navigator.clipboard?.writeText(shareUrl)
    }
  }

  return (
    <div className={`post-card ${highlighted ? 'highlighted' : ''}`}>
      <div className="post-header">
        <div className="post-avatar">{avatarLetter}</div>
        <div className="post-source">
          <div className="post-username">@{post.source_group}</div>
          <div className="post-date">{formattedDate}</div>
        </div>
        <div className="post-category-tag">{CATEGORY_NAMES[post.category] || post.category}</div>
      </div>

      <PhotoGrid post={post} />

      <div className="post-text-wrap">
        <div className={`post-text ${isLong && !expanded ? 'collapsed' : ''}`}>
          {expanded ? formatText(post.text) : formatText(post.text).slice(0, 200) + (isLong ? '...' : '')}
        </div>
        {isLong && (
          <button className="show-more-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Свернуть' : 'Показать полностью'}
          </button>
        )}
      </div>

      <div className="post-actions">
        <button className="tg-btn" onClick={openInTelegram}>
          ✈️ Открыть в Telegram ↗
        </button>
        <button className="action-btn" onClick={share} title="Поделиться">
          🔗
        </button>
        <button
          className={`action-btn ${saved ? 'saved' : ''}`}
          onClick={() => onSave && onSave(post.id)}
          title={saved ? '
