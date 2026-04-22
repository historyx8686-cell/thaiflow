import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'all', label: '🏠 Все' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike_rent', label: '🏍️ Байки' },
  { id: 'news', label: '📰 Новости' },
  { id: 'visa', label: '🛂 Виза' }
]

export default function Feed({ city }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
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

      <div style={{ background: '#1c2127', padding: '12px', borderRadius: '12px', margin: '10px 0', fontSize: '12px', border: '1px solid #2c343d' }}>
        <div style={{ color: '#8e8e93', fontSize: '10px', marginBottom: '4px' }}>реклама</div>
        <div style={{ color: '#248b9f', fontWeight: 'bold' }}>@thaiflow_ads</div>
        <div style={{ marginTop: '4px' }}>📢 Реклама в ThaiFlow — 10,000+ подписчиков</div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 40, color: '#8e8e93' }}>Загрузка объявлений...</p>
      ) : (
        <div className="posts-list">
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  )
}
