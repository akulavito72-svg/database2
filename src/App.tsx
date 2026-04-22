import { LoginPage } from './pages/LoginPage'
import { ProductsPage } from './pages/ProductsPage'
import { useAuthStore } from './store/authStore'
import './App.css'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <main className="tech-shell">
      <ProductsPage />
    </main>
  )
}

export default App
