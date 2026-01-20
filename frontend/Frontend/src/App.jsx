
import './App.css'
import React, { useState } from 'react'
import Navigation from './components/NavBar.jsx'
import LandingPage from './components/LandingPage.jsx'
import AlkategoriaMonthlyStats from './components/AlkategoriaMonthlyStats.jsx'
import AllAlkategoriasStats from './components/AllAlkategoriasStats.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'stats':
        return (
          <div className="page-wrapper">
            <AlkategoriaMonthlyStats />
            <AllAlkategoriasStats />
          </div>
        )
      case 'home':
      default:
        return <LandingPage />
    }
  }

  return (
    <>
      <Navigation onNavigate={setCurrentPage} />
      {renderPage()}
    </>
  )
}

export default App
