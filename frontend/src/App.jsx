import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Drivers from './pages/Drivers.jsx'
import Orders from './pages/Orders.jsx'
import Clients from './pages/Clients.jsx'
import Vehicles from './pages/Vehicles.jsx'
import Pricing from './pages/Pricing.jsx'
import Users from './pages/Users.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout title="Dashboard"><Dashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout title="Заказы"><Orders /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/clients" element={
        <ProtectedRoute>
          <Layout title="Клиенты"><Clients /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/drivers" element={
        <ProtectedRoute>
          <Layout title="Водители"><Drivers /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/vehicles" element={
        <ProtectedRoute>
          <Layout title="Машины"><Vehicles /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/pricing" element={
        <ProtectedRoute>
          <Layout title="Тарифы"><Pricing /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <Layout title="Пользователи"><Users /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout title="Профиль"><Profile /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App