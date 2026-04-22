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
  const [filter, setFilter] = useState('all') // Возвращаем 'all', чтобы лента не была пустой
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Ждем полсекунды после того как пользователь перестал печатать, чтобы не спамить сервер
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || ''
    async function load() {
      setLoading(true)
      try {
        // Формируем умный запрос к бэкенду
        const url = new URL(`${API}/api/posts`)
        url.searchParams.append('city', city)
        if (filter !== 'all') url.searchParams.append('category', filter)
        if (debouncedSearch) url.searchParams.append('search', debouncedSearch)

        const r = await fetch(url.toString())
        if (r.ok) {
          const d = await r.json()
          setPosts(d || [])
        }
      } catch (e) { console.error("Ошибка загрузки постов:", e) }
      finally { setLoading(false) }
    }
    load()
  }, [city, filter, debouncedSearch]) // Перезагружаем при смене города, фильтра или поиска

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

      {/* Фильтры категорий */}
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

      {/* Рекламный блок */}
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
              key={p.id} 
              post={p} 
              categoryLabel={CATEGORIES.find(c => c.id === p.category)?.label || 'Объявление'} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
