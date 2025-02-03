import React, { Children } from 'react'
import Navbar from '../general/Navbar'
import KKPFooter from '../general/Footer'

export default function MainLayout({children}) {
  return (
    <>
      <Navbar/>
      <main >
        {children}
      </main>
      <KKPFooter/>
    </>
  )
}
