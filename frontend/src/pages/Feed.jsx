import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PostCard from '../components/PostCard.jsx'
import AdBanner from '../components/AdBanner.jsx'
import DateDivider from '../components/DateDivider.jsx'
import { api } from '../api.js'

const ROOM_OPTIONS = ['Студия', '1', '2', '3', '4+']
const USD_TO_THB = 35

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
  const [deepPostId, setDeepPostId] = useState(null)
  const [showDeepNotify, setShowDeepNotify] = useState(false)

  // Состояния для фильтров аренды
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [currency, setCurrency] = useState('THB')
  const [areaFrom, setAreaFrom] = useState('')
  const [areaTo, setAreaTo] = useState('')
  const [maxTerm, setMaxTerm] = useState('')
  const [selectedRooms, setSelectedRooms] = useState([])

  // Примененные фильтры (срабатывают при клике на "Искать")
  const [appliedFilters, setAppliedFilters] = useState(null)

  const location = useLocation()
  const observerRef = useRef()
  const bottomRef = useRef()

  // Обработка диплинков (прямых ссылок на пост)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const postId = params.get('post')
    if (postId) {
      setDeepPostId(parseInt(postId))
      setShowDeepNotify(true)
    }
  }, [location.search])

  // Загрузка закладок
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

  // Сброс при смене города, категории или поиске
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

  // Загрузка баннеров
  useEffect(() => {
    api.getBanners({ category, city })
      .then(setBanners)
      .catch(() => {})
  }, [category, city])

  // Бесконечный скролл
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

  // Скролл к посту по диплинку
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

  // Фильтрация на стороне клиента
  const filteredPosts = posts.filter(post => {
    if (category === 'rent' && appliedFilters) {
      const { priceFrom, priceTo, currency, areaFrom, areaTo, maxTerm, selectedRooms } = appliedFilters
      const rate = currency === 'USD' ? USD_TO_THB : 1

      // Фильтр цены
      if (priceFrom || priceTo) {
        const price = parseFloat(post.price || '0')
        const minThb = priceFrom ? parseFloat(priceFrom) * rate : 0
        const maxThb = priceTo ? parseFloat(priceTo) * rate : Infinity
        if (price < minThb || price > maxThb) return false
      }

      // Фильтр площади
      if (areaFrom || areaTo) {
        const area = parseFloat(post.area || '0')
        if (areaFrom && area < parseFloat(areaFrom)) return false
        if (areaTo && area > parseFloat(areaTo)) return false
      }

      // Фильтр комнат
      if (selectedRooms.length > 0 && post.rooms) {
        const roomsStr = post.rooms.toLowerCase()
        const numericRooms = parseInt(roomsStr, 10)
        const matches = selectedRooms.some(room => {
          if (room === 'Студия') return roomsStr.includes('студи')
          if (room === '4+') return !isNaN(numericRooms) && numericRooms >= 4
          return roomsStr.includes(room)
        })
        if (!matches) return false
      }
    }
    return true
  })

  // Группировка по датам для разделителей
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
            <span>{rentFiltersOpen ? '🔼 Скрыть фильтры' : '🔽 Показать фильтры'}</span>
          </div>

          {rentFiltersOpen && (
            <div className="rent-filter-form">
              <div className="rent-filter-row">
                <div className="rent-filter-group">
                  <div className="rent-filter-label">Цена / мес.</div>
                  <div className="rent-filter-range">
                    <input
                      className="rent-filter-input"
                      type="number"
                      placeholder="от"
                      value={priceFrom}
                      onChange={e => setPriceFrom(e.target.value)}
                    />
                    <span className="rent-filter-dash">—</span>
                    <input
                      className="rent-filter-input"
                      type="number"
                      placeholder="до"
                      value={priceTo}
                      onChange={e => setPriceTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="rent-filter-group">
                  <div className="rent-filter-label">Валюта</div>
                  <div className="rent-currency-toggle">
                    <button
                      className={`rent-currency-btn ${currency === 'THB' ? 'active' : ''}`}
                      onClick={() => setCurrency('THB')}
                    >THB</button>
                    <button
                      className={`rent-currency-btn ${currency === 'USD' ? 'active' : ''}`}
                      onClick={() => setCurrency('USD')}
                    >USD</button>
                  </div>
                </div>
              </div>

              <div className="rent-filter-row">
                <div className="rent-filter-group">
                  <div className="rent-filter-label">Площадь, м²</div>
                  <div className="rent-filter-range">
                    <input
                      className="rent-filter-input"
                      type="number"
                      placeholder="от"
                      value={areaFrom}
                      onChange={e => setAreaFrom(e.target.value)}
                    />
                    <span className="rent-filter-dash">—</span>
                    <input
                      className="rent-filter-input"
                      type="number"
                      placeholder="до"
                      value={areaTo}
                      onChange={e => setAreaTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="rent-filter-group">
                  <div className="rent-filter-label">Срок аренды</div>
                  <div className="rent-filter-range">
                    <input
                      className="rent-filter-input"
                      type="number"
                      placeholder="max"
                      value={maxTerm}
                      onChange={e => setMaxTerm(e.target.value)}
                    />
                    <span className="rent-filter-unit">мес.</span>
                  </div>
                </div>
              </div>

              <div className="rent-filter-rooms-row">
                <div className="rent-filter-label">Комнаты:</div>
                <div className="rent-rooms-group">
                  {ROOM_OPTIONS.map(r => (
                    <button
                      key={r}
                      className={`rent-room-btn ${selectedRooms.includes(r) ? 'active' : ''}`}
                      onClick={() => toggleRoom(r)}
                    >{r}</button>
                  ))}
                </div>
                <button className="rent-search-btn" onClick={applyFilters}>Искать</button>
              </div>
            </div>
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