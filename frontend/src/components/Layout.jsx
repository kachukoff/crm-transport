import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

function Layout({ title, headerActions, children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header title={title} actions={headerActions} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout