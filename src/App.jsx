import React from 'react'
import GDProvider from '@components/GDProvider'
import Glass from '@components/Glass'
import styles from './styles.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <GDProvider>
        <div className={styles.grid}>
          <Glass />
          <Glass />
          <Glass />
          <Glass />
          <Glass />
          <Glass />
          <Glass />
          <Glass />
          <Glass />
        </div>
      </GDProvider>
    </div>
  )
}
