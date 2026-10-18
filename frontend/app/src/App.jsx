import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
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

      <Route
        path="/"
        element={
          <Layout
            title="Dashboard"
            headerActions={
              <>
                <button className="btn btn--secondary btn--sm">Сегодня</button>
              </>
            }
          >
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/orders"
        element={
          <Layout
            title="Заказы"
            headerActions={
              <button className="btn btn--secondary btn--sm">Экспорт в xlsx</button>
            }
          >
            <Orders />
          </Layout>
        }
      />

      <Route
        path="/clients"
        element={
          <Layout
            title="Клиенты"
            headerActions={
              <button className="btn btn--secondary btn--sm">Экспорт в xlsx</button>
            }
          >
            <Clients />
          </Layout>
        }
      />

      <Route
        path="/drivers"
        element={
          <Layout
            title="Водители"
            headerActions={
              <button className="btn btn--secondary btn--sm">Экспорт в xlsx</button>
            }
          >
            <Drivers />
          </Layout>
        }
      />

      <Route
        path="/vehicles"
        element={
          <Layout
            title="Машины"
            headerActions={
              <button className="btn btn--secondary btn--sm">Экспорт в xlsx</button>
            }
          >
            <Vehicles />
          </Layout>
        }
      />

      <Route
        path="/pricing"
        element={
          <Layout title="Тарифы" >
            <Pricing />
          </Layout>
        }
      />

      <Route
        path="/users"
        element={
          <Layout
            title="Пользователи"
          >
            <Users />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout title="Профиль">
            <Profile />
          </Layout>
        }
      />

    </Routes>
  )
}

export default App