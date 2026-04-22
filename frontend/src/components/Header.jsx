import { useState, useRef, useEffect } from 'react'

const CITIES = [
  { id: 'pattaya', name: 'Паттайя', emoji: '🏖️' },
  { id: 'phuket', name: 'Пхукет', emoji: '🌴' },
  { id: 'bangkok', name: 'Бангкок', emoji: '🏙️' },
]

export default function Header({ city, setCity, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const currentCity = CITIES.find(c => c.id === city) || CITIES[0]

  // Закрытие меню по клику вне
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="header">
      <div className="header-logo">
        🌴 <span>ThaiFlow</span>
      </div>
      
      <div className="header-actions">
        {/* Кнопка города */}
        <div className="control-pill city-selector">
          {currentCity.emoji} {currentCity.name} ▾
        </div>

        {/* Переключатель темы */}
        <button 
          className="control-pill theme-toggle" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Бургер меню */}
        <div className="burger-wrap" ref={menuRef}>
          <button className="control-pill" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          
          {menuOpen && (
            <div className="burger-dropdown">
              <div className="burger-item">👤 Мой профиль</div>
              <div className="burger-item">📢 Каналы</div>
              <div className="burger-item">❤️ Поддержать</div>
              <div className="burger-item">📧 Контакты</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
