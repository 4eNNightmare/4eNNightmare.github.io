import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import _throttle from 'lodash/throttle'
import GDContext, { defaultValue } from './context'
import styles from './styles.module.css'

function GDContainer({ children }) {
  const { theme } = useContext(GDContext)

  const themeVariables = useMemo(
    () => Object.assign({}, ...Object.keys(theme).map((key) => ({ [`--gd-${key}`]: theme[key] }))),
    [theme]
  )
  return (
    <div className={styles['gd-container']} style={{ ...themeVariables }}>
      {children}
    </div>
  )
}

export default function GDProvider({ children }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const handleMouseMove = useRef(
    _throttle(({ x, y }) => {
      setMouse({ x, y })
    }, 1000 / 30),
    []
  )

  useEffect(() => {
    const cb = handleMouseMove.current
    window.addEventListener('mousemove', cb)
    return () => window.removeEventListener('mousemove', cb)
  }, [])

  return (
    <GDContext.Provider value={{ ...defaultValue, mouse }}>
      <GDContainer>{children}</GDContainer>
    </GDContext.Provider>
  )
}
