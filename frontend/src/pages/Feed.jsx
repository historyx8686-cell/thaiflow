import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PostCard from '../components/PostCard.jsx'
import AdBanner from '../components/AdBanner.jsx'
import DateDivider from '../components/DateDivider.jsx'
import { api } from '../api.js'

const ROOMS_OPTIONS = ['Студия', '1', '2', '3', '4+']

export default function Feed({ city, tgUser }) {
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [banners, setBanners] = useState([])
  const [savedPosts, setSavedPosts] = useState(new Set())
  const [deepPostId, setDeepPostId] = useState(null)
  const [showDeepNotify, setShowDeepNotify] = useState(false)

  // Rent filter input states (pending — not yet applied)
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [currency, setCurrency] = useState('THB')
  const [areaFrom, setAreaFrom] = useState('')
  const [areaTo, setAreaTo] = useState('')
  const [maxTerm, setMaxTerm] = useState('')
  const [selectedRooms, setSelectedRooms] = useState([])

  // Applied filter state (used for actual filtering — set on "Искать" click)
  const [appliedFilters, setAppliedFilters] = useState(null)

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

  const toggleRoom = (room) => {
    setSelectedRooms(prev =>
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    )
  }

  const applyFilters = () => {
    setAppliedFilters({ priceFrom, priceTo, currency, areaFrom, areaTo, maxTerm, selectedRooms })
  }

  // Client-side filtering based on applied filters
  const filteredPosts = posts.filter(post => {
    if (category === 'rent' && appliedFilters) {
      const { priceFrom, priceTo, currency, areaFrom, areaTo, selectedRooms } = appliedFilters

      if (priceFrom || priceTo) {
        let price = parseFloat(post.price || '0')
        if (currency === 'USD' && price > 0) price = price / 34
        if (priceFrom && price < parseFloat(priceFrom)) return false
        if (priceTo && price > parseFloat(priceTo)) return false
      }

      if (areaFrom || areaTo) {
        const area = parseFloat(post.area || '0')
        if (areaFrom && area < parseFloat(areaFrom)) return false
        if (areaTo && area > parseFloat(areaTo)) return false
      }

      if (selectedRooms.length > 0) {
        const roomValue = post.rooms?.toLowerCase() || ''
        const matches = selectedRooms.some(r => {
          if (r === 'Студия') return roomValue.includes('студия') || roomValue.includes('studio')
          if (r === '4+') return parseInt(roomValue) >= 4
          return roomValue.includes(r)
        })
        if (!matches) return false
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
          <div className="rf-row">
            <div className="rf-group" style={{ flex: 1 }}>
              <div className="rf-label">Цена / мес.</div>
              <div className="rf-range">
                <input
                  className="rf-input"
                  type="number"
                  placeholder="от"
                  value={priceFrom}
                  onChange={e => setPriceFrom(e.target.value)}
                />
                <span className="rf-dash">—</span>
                <input
                  className="rf-input"
                  type="number"
                  placeholder="до"
                  value={priceTo}
                  onChange={e => setPriceTo(e.target.value)}
                />
              </div>
            </div>
            <div className="rf-group">
              <div className="rf-label">Валюта</div>
              <div className="rf-currency">
                <button
                  className={`rf-currency-btn ${currency === 'THB' ? 'active' : ''}`}
                  onClick={() => setCurrency('THB')}
                >THB</button>
                <button
                  className={`rf-currency-btn ${currency === 'USD' ? 'active' : ''}`}
                  onClick={() => setCurrency('USD')}
                >USD</button>
              </div>
            </div>
          </div>

          <div className="rf-row" style={{ marginTop: 10 }}>
            <div className="rf-group" style={{ flex: 1 }}>
              <div className="rf-label">Площадь, м²</div>
              <div className="rf-range">
                <input
                  className="rf-input"
                  type="number"
                  placeholder="от"
                  value={areaFrom}
                  onChange={e => setAreaFrom(e.target.value)}
                />
                <span className="rf-dash">—</span>
                <input
                  className="rf-input"
                  type="number"
                  placeholder="до"
                  value={areaTo}
                  onChange={e => setAreaTo(e.target.value)}
                />
              </div>
            </div>
            <div className="rf-group">
              <div className="rf-label">Срок аренды</div>
              <div className="rf-range">
                <input
                  className="rf-input"
                  type="number"
                  placeholder="max"
                  value={maxTerm}
                  onChange={e => setMaxTerm(e.target.value)}
                  style={{ width: 70 }}
                />
                <span className="rf-unit">мес.</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="rf-label">Комнаты</div>
            <div className="rf-rooms">
              {ROOMS_OPTIONS.map(r => (
                <button
                  key={r}
                  className={`rf-room-btn ${selectedRooms.includes(r) ? 'active' : ''}`}
                  onClick={() => toggleRoom(r)}
                >{r}</button>
              ))}
            </div>
          </div>

          <div className="rf-search-row">
            <button className="rf-search-btn" onClick={applyFilters}>Искать</button>
          </div>
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
