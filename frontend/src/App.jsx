import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Feed from './pages/Feed.jsx'
import Showcase from './pages/Showcase.jsx'

function AppInner() {
  const [tgUser, setTgUser] = useState(null)
  const [city, setCity] = useState('pattaya')
  const [theme, setTheme] = useState('dark')
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user)
      }
    }

    // Handle deeplinks
    const params = new URLSearchParams(window.location.search)
    const postId = params.get('post')
    if (postId) {
      navigate(`/?post=${postId}`)
    }
  }, [navigate])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app" data-theme={theme}>
      <Header city={city} setCity={setCity} theme={theme} setTheme={setTheme} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Feed city={city} tgUser={tgUser} />} />
          <Route path="/showcase" element={<Showcase city={city} tgUser={tgUser} />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
