import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

export default function Feed({ city, tgUser }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        // Запрос к твоему бэкенду на Hetzner
        const resp = await fetch(`${API_URL}/api/posts?city=${city}&category=${filter}`)
        const data = await resp.json()
        setPosts(data)
      } catch (err) {
        console.error("Ошибка загрузки:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [city, filter, API_URL])

  return (
    <div className="feed-container">
      {/* Горизонтальный фильтр категорий */}
      <div className="filter-bar">
        {['all', 'rent', 'bike_rent', 'news'].map(cat => (
          <button 
            key={cat}
            className={`filter-chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? '🏠 Все' : cat === 'rent' ? 'Аренда' : cat === 'bike_rent' ? 'Байки' : 'Новости'}
          </button>
        ))}
      </div>

      <div className="ads-banner">
        <div className="ads-label">реклама</div>
        <div className="ads-text">@thaiflow_ads</div>
        <div className="ads-title">📢 Реклама в ThaiFlow — 10,000+ подписчиков</div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Ищем лучшие предложения...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="posts-list">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Ничего не нашли. Попробуйте сменить фильтр или город 🏖️</p>
        </div>
      )}
    </div>
  )
}
