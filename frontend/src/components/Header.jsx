import { useState, useRef, useEffect } from 'react'

const CITIES = [{ id: 'pattaya', name: 'Паттайя', emoji: '🏖️' }, { id: 'phuket', name: 'Пхукет', emoji: '🌴' }, { id: 'bangkok', name: 'Бангкок', emoji: '🏙️' }]
const MENU = [{ id: 'profile', icon: '👤', label: 'Мой профиль' }, { id: 'about', icon: '📖', label: 'О сервисе' }, { id: 'channels', icon: '📢', label: 'Каналы' }, { id: 'privacy', icon: '🔒', label: 'Конфиденциальность' }, { id: 'terms', icon: '📋', label: 'Условия использования' }, { id: 'support', icon: '❤️', label: 'Поддержать проект' }, { id: 'contacts', icon: '📧', label: 'Контакты' }]

export default function Header({ city, setCity, theme, setTheme }) {
  const [cityOpen, setCityOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const refDrop = useRef(null)
  const refMenu = useRef(null)
  const curCity = CITIES.find(c => c.id === city) || CITIES[0]

  useEffect(() => {
    const click = (e) => {
      if (refDrop.current && !refDrop.current.contains(e.target)) setCityOpen(false)
      if (refMenu.current && !refMenu.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', click)
    return () => document.removeEventListener('mousedown', click)
  }, [])

  return (
    <>
      <header className="header">
        <div className="header-logo">🌴 <span>ThaiFlow</span></div>
        <div className="header-actions">
          
          <div className="city-dropdown" ref={refDrop} style={{position: 'relative'}}>
            <button className="control-pill" onClick={() => setCityOpen(!cityOpen)}>
              {curCity.emoji} {curCity.name} {cityOpen ? '▲' : '▼'}
            </button>
            {cityOpen && (
              <div className="burger-dropdown" style={{position: 'absolute', top: 40, right: 0}}>
                {CITIES.map(c => <div key={c.id} className="burger-item" onClick={() => { setCity(c.id); setCityOpen(false) }}>{c.emoji} {c.name}</div>)}
              </div>
            )}
          </div>

          <button className="control-pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="burger-wrap" ref={refMenu}>
            <button className="control-pill" onClick={() => setMenuOpen(!menuOpen)} style={{ width: 36, padding: 0 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
            {menuOpen && (
              <div className="burger-dropdown" style={{position: 'absolute', top: 40, right: 0}}>
                {MENU.map(m => <div key={m.id} className="burger-item" onClick={() => { setActiveModal(m.id); setMenuOpen(false) }}>{m.icon} {m.label}</div>)}
              </div>
            )}
          </div>

        </div>
      </header>

      {activeModal && (
        <>
          <div className="modal-overlay" onClick={() => setActiveModal(null)} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000}} />
          <div className="modal-sheet" style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: 20, zIndex: 1001, maxHeight: '80vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
              <h2 style={{margin: 0, fontSize: 18}}>{MENU.find(m => m.id === activeModal)?.label}</h2>
              <button onClick={() => setActiveModal(null)} style={{background: 'none', border: 'none', color: 'var(--text-main)', fontSize: 20, cursor: 'pointer'}}>✕</button>
            </div>
            <p style={{color: 'var(--text-muted)'}}>Содержимое раздела в разработке 🛠️</p>
          </div>
        </>
      )}
    </>
  )
}
