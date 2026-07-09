import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Legal from './pages/Legal'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/catalogue"        element={<Catalogue />} />
        <Route path="/produit/:id"      element={<ProductDetail />} />
        <Route path="/a-propos"         element={<About />} />
        <Route path="/contact"          element={<Contact />} />
        <Route path="/mentions-legales" element={<Legal />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </>
  )
}