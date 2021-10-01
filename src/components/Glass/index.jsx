import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import _clamp from 'lodash/clamp'
import gsap from 'gsap'
import GDContext from '../GDProvider/context'
import styles from './styles.module.css'

export default function Glass({ children, width = '64px', height = '64px', maxRotation = 20 }) {
  const glassSurfaceRef = useRef()
  const glassReflectionRef = useRef()
  const glassBordersRef = useRef()
  const { mouse } = useContext(GDContext)
  const [rect, setRect] = useState({})
  const [hover, setHover] = useState()
  const timeline = useRef(gsap.timeline())
  const relatvePositionX = useMemo(() => mouse.x - rect.x - rect.width, [mouse.x, rect.x, rect.width])
  const relatvePositionY = useMemo(() => mouse.y - rect.y - rect.height, [mouse.y, rect.height, rect.y])
  const rotationY = useMemo(
    () => `${_clamp((relatvePositionX + rect.width / 2) / (rect.width / 2), -1, 1) * maxRotation}deg`,
    [relatvePositionX, rect.width, maxRotation]
  )
  const rotationX = useMemo(
    () => `${_clamp((relatvePositionY + rect.height / 2) / (rect.height / 2), -1, 1) * maxRotation}deg`,
    [relatvePositionY, rect.height, maxRotation]
  )

  useEffect(() => {
    if (!timeline.current) timeline.current = gsap.timeline()
    if (hover) {
      const opacity =
        (Math.abs(_clamp((relatvePositionY + rect.height / 2) / (rect.height / 2), -1, 1)) +
          Math.abs(_clamp((relatvePositionX + rect.width / 2) / (rect.width / 2), -1, 1))) /
        2
      const translateY = `${-1 * relatvePositionY - rect.height / 2}px`
      const translateX = `${-1 * relatvePositionX - rect.width / 2}px`
      glassSurfaceRef.current.style.zIndex = 1
      timeline.current
        .to(glassReflectionRef.current, {
          translateY,
          translateX,
          opacity,
          duration: 0.25,
          ease: 'none'
        })
        .to(
          glassBordersRef.current,
          {
            '--border-x': `${relatvePositionX + rect.width}px`,
            '--border-y': `${relatvePositionY + rect.height}px`,
            opacity,
            duration: 0.25,
            ease: 'none'
          },
          0
        )
        .to(
          glassSurfaceRef.current,
          {
            rotationX,
            rotationY,
            translateZ: '80px',
            duration: 0.25,
            ease: 'none'
          },
          0
        )
    } else {
      setTimeout(() => (glassSurfaceRef.current.style.zIndex = 0), 250)
      timeline.current
        .to(glassReflectionRef.current, {
          translateY: 0,
          translateX: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'none'
        })
        .to(
          glassBordersRef.current,
          {
            '--border-x': `${0}px`,
            '--border-y': `${rect.height}px`,
            opacity: 0.5,
            duration: 0.25,
            ease: 'none'
          },
          0
        )
        .to(
          glassSurfaceRef.current,
          {
            rotationX: '0deg',
            rotationY: '0deg',
            translateZ: '0px',
            duration: 0.25,
            ease: 'none'
          },
          0
        )
    }

    return () => {
      if (timeline.current) {
        timeline.current.kill()
        timeline.current = undefined
      }
    }
  }, [hover, mouse, rect, rotationX, rotationY, relatvePositionX, relatvePositionY])

  useEffect(() => {
    const target = glassSurfaceRef.current
    const resizeObserver = new ResizeObserver(() => {
      setRect(glassSurfaceRef.current.getBoundingClientRect())
    })
    resizeObserver.observe(target)
    return () => resizeObserver.unobserve(target)
  })

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={styles['glass-button']}
      style={{
        '--width': width,
        '--height': height
      }}
    >
      <div ref={glassSurfaceRef} className={styles['glass-surface']}>
        <div ref={glassReflectionRef} className={styles['glass-reflection']} />
        <div ref={glassBordersRef} className={styles['glass-borders']} />
        {children}
      </div>
    </button>
  )
}
