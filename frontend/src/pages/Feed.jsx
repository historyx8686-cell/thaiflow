import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PostCard from '../components/PostCard.jsx'
import AdBanner from '../components/AdBanner.jsx'
import DateDivider from '../components/DateDivider.jsx'
import { api } from '../api.js'

const RENT_PRICE_FILTERS = ['До 10,000 ฿', '10-20,000 ฿', '20-40,000 ฿', '40,000+ ฿']
const RENT_ROOMS_FILTERS = ['Студия', '1 спальня', '2 спальни', '3+ спальни']

export default function Feed({ city, tgUser }) {
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [banners, setBanners] = useState([])
  const [savedPosts, setSavedPosts] = useState(new Set())
  const [rentFiltersOpen, setRentFiltersOpen] = useState(false)
  const [rentPrice, setRentPrice] = useState(null)
  const [rentRooms, setRentRooms] = useState(null)
  const [deepPostId, setDeepPostId] = useState(null)
  const [showDeepNotify, setShowDeepNotify] = useState(false)

  const location = useLocation()
  const observerRef = useRef()
  const bottomRef = useRef()

  // Deeplink handling
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const postId = params.get('post')
    if (postId) {
      setDeepPostId(parseInt(postId))
      setShowDeepNotify(true)
    }
  }, [location.search])

  // Load favorites
  useEffect(() => {
    if (tgUser?.id) {
      api.getFavorites(String(tgUser.id))
        .then(favs => setSavedPosts(new Set(favs.map(f => f.post_id))))
        .catch(() => {})
    }
  }, [tgUser])

  const loadPosts = useCallback(async (reset = false) => {
    if (loading) return
    setLoading(true)
    try {
      const newPage = reset ? 1 : page
      const data = await api.getPosts({ city, category, search, page: newPage, limit: 20 })
      if (reset) {
        setPosts(data)
      } else {
        setPosts(prev => [...prev, ...data])
      }
      setHasMore(data.length === 20)
      if (!reset) setPage(p => p + 1)
      else setPage(2)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [city, category, search, page, loading])

  // Reset on filter change
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
  }, [city, category, search])

  useEffect(() => {
    if (posts.length === 0 && !loading) {
      loadPosts(true)
    }
  }, [posts.length, loading, loadPosts])

  // Load banners
  useEffect(() => {
    api.getBanners({ category, city })
      .then(setBanners)
      .catch(() => {})
  }, [category, city])

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadPosts(false)
      }
    }, { threshold: 0.1 })

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, loading, loadPosts])

  // Scroll to deeplinked post
  useEffect(() => {
    if (deepPostId && posts.length > 0) {
      setTimeout(() => {
        const el = document.getElementById(`post-${deepPostId}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [deepPostId, posts])

  const handleSave = async (postId) => {
    if (!tgUser?.id) return
    try {
      await api.addFavorite(String(tgUser.id), postId)
      setSavedPosts(prev => new Set([...prev, postId]))
    } catch (e) {}
  }

  // Group posts by date, applying client-side rent filters
  const PRICE_RANGES = {
    'До 10,000 ฿': [0, 10000],
    '10-20,000 ฿': [10000, 20000],
    '20-40,000 ฿': [20000, 40000],
    '40,000+ ฿': [40000, Infinity],
  }
  const ROOMS_MAP = {
    'Студия': 'студия',
    '1 спальня': '1',
    '2 спальни': '2',
    '3+ спальни': '3',
  }

  const filteredPosts = posts.filter(post => {
    if (category === 'rent') {
      if (rentPrice) {
        const [min, max] = PRICE_RANGES[rentPrice] || [0, Infinity]
        const price = parseFloat(post.price || '0')
        if (!(price >= min && price < max)) return false
      }
      if (rentRooms && post.rooms) {
        const roomsKey = ROOMS_MAP[rentRooms] || ''
        if (roomsKey && !post.rooms.toLowerCase().includes(roomsKey)) return false
      }
    }
    return true
  })

  const groupedPosts = []
  let lastDate = null
  for (const post of filteredPosts) {
    const postDate = post.posted_at ? new Date(post.posted_at).toDateString() : ''
    if (postDate !== lastDate) {
      groupedPosts.push({ type: 'divider', date: post.posted_at })
      lastDate = postDate
    }
    groupedPosts.push({ type: 'post', post })
  }

  return (
    <div className="feed-container">
      {showDeepNotify && (
        <div className="deeplink-notify">
          🔗 Вы перешли к посту
          <button onClick={() => setShowDeepNotify(false)}>✕</button>
        </div>
      )}

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="🔍 Поиск по объявлениям..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="reset-btn" onClick={() => setSearch('')}>Сбросить</button>
        )}
      </div>

      <CategoryFilter active={category} onChange={cat => { setCategory(cat); setSearch('') }} />

      <AdBanner category={category} banners={banners} />

      {category === 'rent' && (
        <div className="rent-filters">
          <div
            className={`rent-filters-toggle ${rentFiltersOpen ? 'open' : ''}`}
            onClick={() => setRentFiltersOpen(!rentFiltersOpen)}
          >
            <span>Фильтры {rentFiltersOpen ? '▲' : '▼'}</span>
          </div>
          {rentFiltersOpen && (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Цена в месяц</div>
              <div className="filter-row" style={{ marginBottom: 8 }}>
                {RENT_PRICE_FILTERS.map(p => (
                  <div
                    key={p}
                    className={`filter-chip ${rentPrice === p ? 'active' : ''}`}
                    onClick={() => setRentPrice(rentPrice === p ? null : p)}
                  >{p}</div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Комнаты</div>
              <div className="filter-row">
                {RENT_ROOMS_FILTERS.map(r => (
                  <div
                    key={r}
                    className={`filter-chip ${rentRooms === r ? 'active' : ''}`}
                    onClick={() => setRentRooms(rentRooms === r ? null : r)}
                  >{r}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {groupedPosts.map((item, i) => {
        if (item.type === 'divider') {
          return <DateDivider key={`divider-${i}`} date={item.date} />
        }
        return (
          <div key={item.post.id} id={`post-${item.post.id}`}>
            <PostCard
              post={item.post}
              highlighted={item.post.id === deepPostId}
              tgUser={tgUser}
              onSave={handleSave}
              saved={savedPosts.has(item.post.id)}
            />
          </div>
        )
      })}

      {filteredPosts.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">Объявления не найдены</div>
        </div>
      )}

      <div ref={bottomRef} className="loading-more">
        {loading && <><span className="spinner"></span>Загрузка...</>}
        {!hasMore && posts.length > 0 && <span style={{ color: 'var(--text-muted)' }}>Всё загружено</span>}
      </div>
    </div>
  )
}
