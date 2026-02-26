import React, { createContext, useContext, useEffect, useState } from 'react'
import { getStoredUserInfo, setStoredUserInfo } from '../services/authService.js'

const UserContext = createContext({ user: null, setUser: () => {} })

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getStoredUserInfo())

  useEffect(() => {
    const onUserUpdated = (e) => {
      setUserState(e?.detail || null)
    }
    window.addEventListener('user-updated', onUserUpdated)
    return () => window.removeEventListener('user-updated', onUserUpdated)
  }, [])

  const setUser = (u) => {
    setStoredUserInfo(u)
    setUserState(u)
    // also emit event for other listeners
    try {
      window.dispatchEvent(new CustomEvent('user-updated', { detail: u }))
    } catch (err) {
      // noop
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserContext
