import Layout from './components/Layout.jsx'
import Drivers from './pages/Drivers.jsx'

function App() {
  return (
    <Layout
      title="Водители"
      headerActions={
        <button className="btn btn--secondary btn--sm">Экспорт</button>
      }
    >
      <Drivers />
    </Layout>
  )
}

export default App