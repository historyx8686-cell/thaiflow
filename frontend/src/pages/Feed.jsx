import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'all', label: '📋 Все' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike_rent', label: '🛵 Аренда байков' },
  { id: 'job', label: '👷 Работа' },
  { id: 'services', label: '🔧 Услуги' },
  { id: 'sport', label: '🏃 Спорт' },
  { id: 'news', label: '📰 Новости' }
]

export default function Feed({ city }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        const API = import.meta.env.VITE_API_URL || ''
        let url = `${API}/api/posts?city=${city}`
        if (filter !== 'all') url += `&category=${filter}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          // Строгая проверка, чтобы React не падал
          setPosts(Array.isArray(data) ? data : (data?.items || []))
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error("Ошибка:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    
    // Небольшая задержка перед загрузкой
    const timer = setTimeout(() => loadPosts(), 100)
    return () => clearTimeout(timer)
  }, [city, filter])

  return (
    <div className="feed-container">
      <div className="search-box">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Поиск по объявлениям..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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

      <div className="ad-banner">
        <div className="ad-label">Реклама</div>
        <div className="ad-title">@thaiflow_ads</div>
        <div className="ad-desc">📢 Разместите рекламу в ThaiFlow — охват 10,000+</div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>Загрузка...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>Объявлений пока нет 🏖️</p>
      ) : (
        <div className="posts-list">
          {posts.map((post, idx) => (
            <PostCard 
              key={post?.id || idx} 
              post={post} 
              categoryLabel={CATEGORIES.find(c => c.id === post?.category)?.label || 'Объявление'} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
