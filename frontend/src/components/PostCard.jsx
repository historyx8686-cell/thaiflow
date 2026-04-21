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

function PhotoGrid({ photos }) {
  // Если фото нет или это пустой массив — ничего не рисуем
  if (!photos || !Array.isArray(photos) || photos.length === 0) return null

  // Фильтруем только нормальные ссылки
  const validPhotos = photos.filter(p => typeof p === 'string' && p.startsWith('http'))
  if (validPhotos.length === 0) return null

  const count = validPhotos.length
  let gridClass = 'single'
  if (count === 2) gridClass = 'double'
  else if (count === 3 || count === 4) gridClass = 'quad'
  else if (count >= 5 && count <= 6) gridClass = 'six'
  else if (count >= 7) gridClass = 'nine'

  const displayPhotos = count > 9 ? validPhotos.slice(0, 9) : validPhotos

  return (
    <div className={`photos-grid ${gridClass}`}>
      {displayPhotos.map((photo, i) => (
        <div key={i} className="photo-wrapper">
          <img
            src={photo}
            alt=""
            loading="lazy"
            onError={e => { e.target.closest('.photo-wrapper').style.display = 'none' }}
          />
        </div>
      ))}
    </div>
  )
}

  return (
    <div className={`photos-grid ${gridClass}`}>
      {displayPhotos.map((photo, i) => (
        <div key={i} className="photo-wrapper">
          <img
            src={typeof photo === 'string' && photo.startsWith('http') ? photo : `https://picsum.photos/seed/${photo}/400/300`}
            alt=""
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      ))}
    </div>
  )
}
const formatText = (text) => {
  if (!text) return ""
  
  // 1. Убираем жирный текст (звездочки)
  let clean = text.replace(/\*\*(.*?)\*\*/g, '$1')
  
  // 2. Убираем ссылки Markdown [текст](ссылка), оставляя только текст
  clean = clean.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
  
  // 3. Убираем лишние системные символы, если остались
  clean = clean.replace(/\\n/g, '\n')
  
  return clean
}

export default function PostCard({ post, highlighted, tgUser, onSave, saved }) {
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

      <PhotoGrid photos={post.photos} />

      <div className="post-text-wrap">
        <div className={`post-text ${isLong && !expanded ? 'collapsed' : ''}`}>
          {post.text}
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
          title={saved ? 'Убрать из закладок' : 'В закладки'}
        >
          🔖
        </button>
      </div>
    </div>
  )
}
