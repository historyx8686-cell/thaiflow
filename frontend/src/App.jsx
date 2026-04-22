import { useState } from 'react'
import Header from './components/Header'
import Feed from './pages/Feed'

export default function App() {
  const [city, setCity] = useState('pattaya')
  const [activeTab, setActiveTab] = useState('feed')

  return (
    <div className="app-container">
      <Header city={city} setCity={setCity} />
      
      <main style={{ flex: 1 }}>
        {activeTab === 'feed' ? (
          <Feed city={city} />
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: '#8e8e93' }}>
            <h2 style={{ color: '#fff' }}>Витрина 🏛️</h2>
            <p>Скоро здесь будут лучшие заведения Паттайи</p>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <span style={{ fontSize: '20px' }}>📜</span>
          <span>Лента</span>
        </button>
        <button className={`nav-item ${activeTab === 'showcase' ? 'active' : ''}`} onClick={() => setActiveTab('showcase')}>
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <span>Витрина</span>
        </button>
      </nav>
    </div>
  )
}
