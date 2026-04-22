import { useState } from 'react'

const CATEGORY_NAMES = {
  rent: '🏠 Аренда',
  bike_rent: '🏍️ Байки',
  news: '📰 Новости',
  visa: '🛂 Виза',
  other: '✨ Прочее'
}

function PhotoGrid({ post }) {
  const rawData = post.photos || post.images || post.photo_urls || [];
  const data = Array.isArray(rawData) ? rawData : [rawData];
  const validPhotos = data.filter(p => p && (typeof p === 'string' || p.url));

  if (validPhotos.length === 0) return null;

  const count = validPhotos.length;
  let gridClass = 'single';
  if (count === 2) gridClass = 'double';
  else if (count >= 3 && count <= 4) gridClass = 'quad';
  else if (count >= 5 && count <= 6) gridClass = 'six';
  else if (count >= 7) gridClass = 'nine';

  const BACKEND_URL = import.meta.env.VITE_API_URL || '';

  return (
    <div className={`photos-grid ${gridClass}`}>
      {validPhotos.slice(0, 9).map((photo, i) => {
        let src = typeof photo === 'string' ? photo : photo.url;
        if (src.startsWith('/api/')) {
          src = `${BACKEND_URL}${src}`;
        }
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
  const [expanded, setExpanded] = useState(false);
  const text = post.text || "";
  const isLong = text.length > 250;

  const formattedDate = post.posted_at
    ? new Date(post.posted_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : '';

  const avatarLetter = (post.source_group || 'T')[0].toUpperCase();

  const openInTelegram = () => {
    if (!post.tg_link) return;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(post.tg_link);
    } else {
      window.open(post.tg_link, '_blank');
    }
  };

  return (
    <div className={`post-card ${highlighted ? 'highlighted' : ''}`}>
      <div className="post-header">
        <div className="post-avatar">{avatarLetter}</div>
        <div className="post-source">
          <div className="post-username">@{post.source_group || 'channel'}</div>
          <div className="post-date">{formattedDate}</div>
        </div>
        <div className="post-category-tag">
          {CATEGORY_NAMES[post.category] || post.category}
        </div>
      </div>

      <PhotoGrid post={post} />

      <div className="post-text-wrap">
        <div className="post-text">
          {expanded ? text : text.slice(0, 250) + (isLong && !expanded ? '...' : '')}
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
          {saved ? '🔖' : '📑'}
        </button>
      </div>
    </div>
  );
}
