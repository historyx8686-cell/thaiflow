import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'job', label: '👨‍💻 Работа' },
  { id: 'services', label: '🔧 Услуги' },
  { id: 'sport', label: '🏃 Спорт' },
  { id: 'health', label: '🏥 Здоровье' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike', label: '🏍️ Байки' }
]

export default function Feed({ city }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('services') // По умолчанию Услуги, как на скрине
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    async function load() {
      setLoading(true)
      try {
        const r = await fetch(`${API}/api/posts?city=${city}&category=${filter}`)
        const d = await r.json()
        setPosts(d || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [city, filter])

  return (
    <div className="feed-container">
      {/* Строка поиска */}
      <div className="search-box">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Поиск по объявлениям..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Фильтры */}
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            className={`filter-chip ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Рекламный блок в точности как на скрине */}
      <div className="ad-banner">
        <div className="ad-label">Реклама</div>
        <div className="ad-title">@thaiflow_ads</div>
        <div className="ad-desc">📢 Разместите рекламу в ThaiFlow — охват 10,000+ ... ↗</div>
      </div>

      <div className="date-separator">Сегодня</div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</p>
      ) : (
        <div className="posts-list">
          {posts.map(p => <PostCard key={p.id} post={p} categoryLabel={CATEGORIES.find(c => c.id === filter)?.label || 'Услуги'} />)}
        </div>
      )}
    </div>
  )
}
