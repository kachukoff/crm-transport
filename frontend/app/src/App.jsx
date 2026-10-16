import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <Layout
      title="Dashboard"
      headerActions={
        <>
          <button className="btn btn--secondary btn--sm">Сегодня</button>
          <button className="btn btn--primary btn--sm">+ Новый заказ</button>
        </>
      }
    >
      <Dashboard />
    </Layout>
  )
}

export default App