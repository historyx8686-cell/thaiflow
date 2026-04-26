import { useState, useEffect } from 'react'
import Header from './components/Header'
import Feed from './pages/Feed'

export default function App() {
  const [city, setCity] = useState('pattaya')

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
  }, [])

  return (
    <div className="app-container" data-theme="dark">
      <Header city={city} setCity={setCity} />
      
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        <Feed city={city} />
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">📜</span>
          <span>Лента</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🏛️</span>
          <span>Витрина</span>
        </button>
      </nav>
    </div>
  )
}
