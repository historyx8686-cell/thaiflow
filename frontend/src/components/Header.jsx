import { useState } from 'react'

const CITIES = [
  { id: 'pattaya', name: 'Паттайя', emoji: '🏖️' },
  { id: 'phuket', name: 'Пхукет', emoji: '🌴' },
  { id: 'bangkok', name: 'Бангкок', emoji: '🏙️' },
]

const MENU_ITEMS = [
  { id: 'profile', icon: '👤', label: 'Мой профиль' },
  { id: 'about', icon: '📖', label: 'О сервисе' },
  { id: 'channels', icon: '📢', label: 'Каналы' },
  { id: 'contacts', icon: '📧', label: 'Контакты' },
]

export default function Header({ city, setCity }) {
  const [cityOpen, setCityOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  const currentCity = CITIES.find(c => c.id === city) || CITIES[0]

  return (
    <header className="header">
      <div className="header-logo">
        🌴 <span>ThaiFlow</span>
      </div>
      
      <div className="header-actions">
        <div className="city-dropdown" style={{ position: 'relative' }}>
          <button className="control-pill" onClick={() => setCityOpen(!cityOpen)}>
            {currentCity.emoji} {currentCity.name} {cityOpen ? '▲' : '▼'}
          </button>
          {cityOpen && (
            <div className="burger-dropdown" style={{ position: 'absolute', top: '40px', right: 0 }}>
              {CITIES.map(c => (
                <div key={c.id} className="burger-item" onClick={() => { setCity(c.id); setCityOpen(false) }}>
                  {c.emoji} {c.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="burger-wrap" style={{ position: 'relative' }}>
          <button className="control-pill" onClick={() => setMenuOpen(!menuOpen)} style={{ width: '36px' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
          {menuOpen && (
            <div className="burger-dropdown" style={{ position: 'absolute', top: '40px', right: 0 }}>
              {MENU_ITEMS.map(item => (
                <div key={item.id} className="burger-item" onClick={() => setMenuOpen(false)}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
