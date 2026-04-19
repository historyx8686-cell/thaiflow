import { useState, useEffect } from 'react'
import ShowcaseCard from '../components/ShowcaseCard.jsx'
import { api } from '../api.js'

export default function Showcase({ city, tgUser }) {
  const [businesses, setBusinesses] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getShowcase({ city, search })
      .then(setBusinesses)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, search])

  const openAddForm = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink('https://t.me/thaiflow_ads')
    }
  }

  return (
    <div className="showcase-container">
      <div className="showcase-toolbar">
        <input
          className="showcase-search"
          placeholder="🔍 Поиск по витрине..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="showcase-actions">
        <button className="showcase-action-btn">📦 Категории</button>
        <button className="showcase-action-btn">ℹ️ Инфо</button>
        <button className="showcase-action-btn" onClick={openAddForm}>➕ Добавить</button>
      </div>

      {loading ? (
        <div className="loading-more"><span className="spinner"></span>Загрузка...</div>
      ) : businesses.length > 0 ? (
        <div className="showcase-grid">
          {businesses.map(b => <ShowcaseCard key={b.id} business={b} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <div className="empty-state-text">Витрина пуста</div>
        </div>
      )}
    </div>
  )
}
