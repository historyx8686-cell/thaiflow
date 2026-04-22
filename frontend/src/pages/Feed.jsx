import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'all', label: '🏠 Все' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike_rent', label: '🏍️ Аренда байков' },
  { id: 'job', label: '👨‍💻 Работа' },
  { id: 'services', label: '🔧 Услуги' },
  { id: 'sport', label: '🏃 Спорт' },
  { id: 'health', label: '🏥 Здоровье' },
  { id: 'news', label: '📰 Новости' },
  { id: 'visa', label: '🛂 Виза' }
]

export default function Feed({ city }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || ''
    
    async function load() {
      setLoading(true)
      try {
        // Безопасное формирование ссылки без вызова ошибки Invalid URL
        let url = `${API}/api/posts?city=${city}`
        if (filter !== 'all') url += `&category=${filter}`
        if (searchQuery) url += `&search=${searchQuery}`

        const r = await fetch(url)
        if (r.ok) {
          const d = await r.json()
          // ГЛАВНАЯ ЗАЩИТА ОТ КРАША: проверяем, что сервер вернул массив
          setPosts(Array.isArray(d) ? d : []) 
        } else {
          setPosts([]) // Если сервер выдал 404 или 500
        }
      } catch (e) {
        console.error("Fetch error:", e)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    
    const timer = setTimeout(() => load(), 300)
    return () => clearTimeout(timer)
  }, [city, filter, searchQuery])

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
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка объявлений...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>Ничего не найдено 🏖️</p>
      ) : (
        <div className="posts-list">
          {posts.map(p => (
            <PostCard 
              key={p?.id || Math.random()} 
              post={p} 
              categoryLabel={CATEGORIES.find(c => c.id === p?.category)?.label || 'Объявление'} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
