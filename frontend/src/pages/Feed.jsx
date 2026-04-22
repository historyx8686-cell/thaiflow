import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'all', label: '🏠 Все' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike_rent', label: '🏍️ Байки' },
  { id: 'news', label: '📰 Новости' }
]

export default function Feed({ city }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL
    async function load() {
      setLoading(true)
      try {
        const r = await fetch(`${API_URL}/api/posts?city=${city}&category=${filter}`)
        const d = await r.json()
        setPosts(d)
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

      {loading ? (
        <p style={{textAlign: 'center', marginTop: 40, color: '#8e8e93'}}>Загрузка объявлений...</p>
      ) : (
        <div className="posts-list">
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  )
}
