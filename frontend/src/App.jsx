import { useState, useEffect } from 'react'
import Header from './components/Header'
import Feed from './pages/Feed'

export default function App() {
  const [city, setCity] = useState('pattaya')
  const [theme, setTheme] = useState('dark') // Начальная тема ВСЕГДА темная
  const [activeTab, setActiveTab] = useState('feed')

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      // Я убрал привязку к теме Telegram (tg.colorScheme). 
      // Теперь приложение всегда стартует темным.
    }
  }, [])

  return (
    <div className="app-container" data-theme={theme}>
      <Header city={city} setCity={setCity} theme={theme} setTheme={setTheme} />
      
      <main style={{ flex: 1 }}>
        {activeTab === 'feed' ? (
          <Feed city={city} />
        ) : (
          <div style={{padding: 40, textAlign: 'center', color: 'var(--text-muted)'}}>
            Витрина в разработке 🛠️
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <span className="nav-icon">📜</span>
          <span>Лента</span>
        </button>
        <button className={`nav-item ${activeTab === 'showcase' ? 'active' : ''}`} onClick={() => setActiveTab('showcase')}>
          <span className="nav-icon">🏛️</span>
          <span>Витрина</span>
        </button>
      </nav>
    </div>
  )
}
