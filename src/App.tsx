import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ToastContainer } from '@/components/ui/Toast'
import { HomePage } from '@/pages/Home'
import { FavoritesPage } from '@/pages/Favorites'
import { CityDetailPage } from '@/pages/CityDetail'

/**
 * Main App Component
 * Sets up routing and global providers
 */
function App() {
  return (
    <>
      {/* Toast notifications */}
      <ToastContainer />
      
      {/* Main layout with routes */}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/city/:name" element={<CityDetailPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
