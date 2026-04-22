import { useState } from 'react'

function PhotoGrid({ post }) {
  const raw = post.photos || post.images || []
  const photos = Array.isArray(raw) ? raw : [raw]
  if (!photos.length) return null
  
  const BACKEND = import.meta.env.VITE_API_URL || ''
  
  return (
    <div className="photos-grid">
      {photos.slice(0, 1).map((p, i) => {
        const src = typeof p === 'string' && p.startsWith('/api') ? `${BACKEND}${p}` : p;
        return (
          <div key={i} className="photo-wrapper">
            <img src={src} alt="" />
          </div>
        )
      })}
    </div>
  )
}

export default function PostCard({ post, categoryLabel }) {
  const [expanded, setExpanded] = useState(false)
  const text = post.text || ""
  const isLong = text.length > 250

  const timeString = post.posted_at 
    ? new Date(post.posted_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) 
    : '12:00'

  const avatarInitial = (post.source_group || 'A')[0].toUpperCase()

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">{avatarInitial}</div>
          <div>
            <div className="post-username">@{post.source_group || 'arenda_pattaya'}</div>
            <div className="post-time">{timeString}</div>
          </div>
        </div>
        <div className="post-badge">
          {categoryLabel}
        </div>
      </div>

      <PhotoGrid post={post} />

      <div className="post-text">
        {expanded ? text : text.slice(0, 250) + (isLong && !expanded ? '...' : '')}
        {isLong && (
          <div style={{marginTop: '8px'}}>
            <button 
              style={{background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer', padding: 0}} 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Свернуть' : 'Свернуть... (Показать полностью)'}
            </button>
          </div>
        )}
      </div>

      <div className="post-actions">
        <a href={post.tg_link || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary">
          ✈️ Открыть в Telegram ↗
        </a>
        <button className="btn-icon">🔗</button>
        <button className="btn-icon">🏷️</button>
      </div>
    </div>
  )
}
