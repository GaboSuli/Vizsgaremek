

import './App.css'
import React from 'react'
import Navigation from './components/NavBar.jsx'
import AlkategoriaMonthlyStats from './components/AlkategoriaMonthlyStats.jsx'
import AllAlkategoriasStats from './components/AllAlkategoriasStats.jsx'

function App() {

  return (
    <>
      <Navigation />
      <AlkategoriaMonthlyStats />
      <AllAlkategoriasStats />
    </>
  )
}

export default App
