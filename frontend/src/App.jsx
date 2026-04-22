import { useState, useEffect } from 'react'
import Header from './components/Header'
import Feed from './pages/Feed'

export default function App() {
  const [city, setCity] = useState('pattaya')
  const [theme, setTheme] = useState('dark')
  const [activeTab, setActiveTab] = useState('feed') // 'feed' или 'showcase'
  const [tgUser, setTgUser] = useState(null)

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      setTgUser(tg.initDataUnsafe?.user || null)
      // Синхронизируем тему с Telegram
      setTheme(tg.colorScheme || 'dark')
    }
  }, [])

  return (
    <div className="app-container" data-theme={theme}>
      <Header 
        city={city} 
        setCity={setCity} 
        theme={theme} 
        setTheme={setTheme}
        tgUser={tgUser}
      />
      
      <main className="main-content">
        {activeTab === 'feed' ? (
          <Feed city={city} tgUser={tgUser} />
        ) : (
          <div className="showcase-placeholder">
            <h2>Витрина в разработке 🏗️</h2>
            <p>Скоро здесь будут лучшие заведения {city === 'pattaya' ? 'Паттайи' : 'Таиланда'}</p>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <span className="nav-icon">📜</span>
          <span>Лента</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'showcase' ? 'active' : ''}`}
          onClick={() => setActiveTab('showcase')}
        >
          <span className="nav-icon">🏛️</span>
          <span>Витрина</span>
        </button>
      </nav>
    </div>
  )
}
