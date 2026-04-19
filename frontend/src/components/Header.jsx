import { useState, useRef, useEffect } from 'react'

const CITIES = [
  { id: 'pattaya', name: 'Паттайя', emoji: '🏖️' },
  { id: 'phuket', name: 'Пхукет', emoji: '🌴' },
  { id: 'bangkok', name: 'Бангкок', emoji: '🏙️' },
]

export default function Header({ city, setCity, theme, setTheme }) {
  const [cityOpen, setCityOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentCity = CITIES.find(c => c.id === city) || CITIES[0]

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">🌴</div>
        <div className="logo-text">Thai<span>Flow</span></div>
      </div>

      <div className="header-actions">
        <div className="city-dropdown" ref={dropdownRef}>
          <button className="city-btn" onClick={() => setCityOpen(!cityOpen)}>
            {currentCity.emoji} {currentCity.name} ▾
          </button>
          {cityOpen && (
            <div className="city-menu">
              {CITIES.map(c => (
                <div
                  key={c.id}
                  className={`city-menu-item ${c.id === city ? 'active' : ''}`}
                  onClick={() => { setCity(c.id); setCityOpen(false) }}
                >
                  <span>{c.emoji} {c.name}</span>
                  {c.id === city && <span>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Сменить тему">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
