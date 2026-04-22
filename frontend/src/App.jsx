import { useState } from 'react'
import Header from './components/Header'
import Feed from './pages/Feed'

export default function App() {
  const [city, setCity] = useState('pattaya')
  const [activeTab, setActiveTab] = useState('feed')

  return (
    <div className="app-container">
      <Header city={city} setCity={setCity} />
      
      {activeTab === 'feed' ? <Feed city={city} /> : <div style={{padding: 20}}>Витрина скоро...</div>}

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
