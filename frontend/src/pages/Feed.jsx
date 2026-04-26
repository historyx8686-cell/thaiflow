import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const CATEGORIES = [
  { id: 'all', label: '🏠 Все' },
  { id: 'rent', label: '🏠 Аренда' },
  { id: 'bike', label: '🏍️ Байки' },
  { id: 'job', label: '👨‍💻 Работа' },
  { id: 'services', label: '🔧 Услуги' }
]

export default function Feed({ city }: { city: string }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        const API = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${API}/api/posts?city=${city}&category=${filter}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(Array.isArray(data) ? data : [])
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
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
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Нет объявлений</p>
      ) : (
        <div className="posts-list">
          {posts.map((post: any, idx) => (
            <PostCard key={idx} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
