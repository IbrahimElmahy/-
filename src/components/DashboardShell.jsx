import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Dashboard from '../pages/Dashboard'

const DashboardShell = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <TopBar />
        <Dashboard />
      </main>
    </div>
  )
}

export default DashboardShell
