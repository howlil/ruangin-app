import React, { Children } from 'react'
import Navbar from '../general/Navbar'

export default function MainLayout({children}) {
  return (
    <>
      <Navbar/>
      <main >
        {children}
      </main>
    </>
  )
}
