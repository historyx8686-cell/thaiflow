import { useState } from 'react'

function PhotoGrid({ post }) {
  // Безопасное извлечение фотографий
  const photosArray = post?.photos || post?.images || []
  const photos = Array.isArray(photosArray) ? photosArray : [photosArray]
  const validPhotos = photos.filter(p => p && (typeof p === 'string' || p.url))
  
  if (validPhotos.length === 0) return null
  
  const BACKEND = import.meta.env.VITE_API_URL || ''
  
  return (
    <div className="photos-grid">
      {validPhotos.slice(0, 1).map((p, i) => {
        let src = typeof p === 'string' ? p : p.url
        if (src && src.startsWith('/api')) {
          src = `${BACKEND}${src}`
        }
        return (
          <div key={i} className="photo-wrapper">
            <img src={src} alt="Фото объявления" />
          </div>
        )
      })}
    </div>
  )
}

export default function PostCard({ post, categoryLabel }) {
  const [expanded, setExpanded] = useState(false)
  
  if (!post) return null;

  const text = post.text || ""
  const isLong = text.length > 200

  // Безопасное время
  let timeString = '12:00'
  try {
    if (post.posted_at) {
      timeString = new Date(post.posted_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  } catch(e) {}

  const avatarInitial = (post.source_group && typeof post.source_group === 'string') 
    ? post.source_group[0].toUpperCase() 
    : 'T'

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">{avatarInitial}</div>
          <div>
            <div className="post-username">@{post.source_group || 'thaiflow_channel'}</div>
            <div className="post-time">{timeString}</div>
          </div>
        </div>
        <div className="post-badge">
          {categoryLabel}
        </div>
      </div>

      <PhotoGrid post={post} />

      <div className="post-text">
        {expanded ? text : text.slice(0, 200) + (isLong && !expanded ? '...' : '')}
        {isLong && (
          <div style={{marginTop: '8px'}}>
            <button 
              style={{background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: '14px', fontWeight: '500'}} 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Свернуть' : 'Показать полностью'}
            </button>
          </div>
        )}
      </div>

      <div className="post-actions">
        <a href={post.tg_link || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
          Откликнуться в Telegram ↗
        </a>
      </div>
    </div>
  )
}
