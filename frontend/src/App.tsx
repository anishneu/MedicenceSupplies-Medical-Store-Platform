import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminMedicationsPage from './pages/AdminMedicationsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminStockPage from './pages/AdminStockPage'
import AdminSupportPage from './pages/AdminSupportPage'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import HelpPage from './pages/HelpPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MyOrdersPage from './pages/MyOrdersPage'
import ProductDetailPage from './pages/ProductDetailPage'
import RegisterPage from './pages/RegisterPage'
import SupplierCatalogPage from './pages/SupplierCatalogPage'
import SupplierDashboardPage from './pages/SupplierDashboardPage'
import SupplierRequestsPage from './pages/SupplierRequestsPage'
import theme from './theme'

const queryClient = new QueryClient()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/shop" element={<Navigate to="/catalog" replace />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Navigate to="/account/profile" replace />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/account/settings" element={<SettingsPage />} />

                <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<MyOrdersPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/medications" element={<AdminMedicationsPage />} />
                  <Route path="/admin/orders" element={<AdminOrdersPage />} />
                  <Route path="/admin/stock" element={<AdminStockPage />} />
                  <Route path="/admin/support" element={<AdminSupportPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['SUPPLIER']} />}>
                  <Route path="/supplier" element={<SupplierDashboardPage />} />
                  <Route path="/supplier/catalog" element={<SupplierCatalogPage />} />
                  <Route path="/supplier/requests" element={<SupplierRequestsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
