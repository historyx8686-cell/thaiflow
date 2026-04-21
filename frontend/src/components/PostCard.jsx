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

// 1. Очистка текста
const formatText = (text) => {
  if (!text) return ""
  let clean = text.replace(/\*\*(.*?)\*\*/g, '$1')
  clean = clean.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
  return clean.replace(/\\n/g, '\n')
}

// 2. Галерея (улучшенный поиск данных)
function PhotoGrid({ post }) {
  const rawData = post.photos || post.images || post.photo_urls || [];
  const data = Array.isArray(rawData) ? rawData : [rawData];
  
  // Убираем startsWith('http'), чтобы видеть локальные фото /api/media/
  const validPhotos = data.filter(p => p && (typeof p === 'string' || p.url));

  if (validPhotos.length === 0) return null;

  const count = validPhotos.length;
  let gridClass = 'single';
  if (count === 2) gridClass = 'double';
  else if (count >= 3 && count <= 4) gridClass = 'quad';
  else if (count >= 5 && count <= 6) gridClass = 'six';
  else if (count >= 7) gridClass = 'nine';

  return (
    <div className={`photos-grid ${gridClass}`}>
      {validPhotos.slice(0, 9).map((photo, i) => {
        let src = typeof photo === 'string' ? photo : photo.url;
        
        // Если путь локальный, добавляем адрес твоего сервера (туннеля)
        // ВАЖНО: замени ТВОЙ_URL на адрес из Cloudflare, если картинки не грузятся
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

      {/* Вызываем галерею */}
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
        <button 
          className={`action-btn ${saved ? 'saved' : ''}`}
          onClick={() => onSave && onSave(post.id)}
        >
          🔖
        </button>
      </div>
    </div>
  )
}
