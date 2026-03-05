import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'

const AdminLayout = () => {
  const { user, adminRecord, selectedCampusId, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div className="loader">Loading...</div>
      <p style={{ color: 'var(--text-muted)' }}>Checking admin permissions...</p>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  if (!adminRecord) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--error)' }}>Access Denied</h1>
      <p>Your account (<strong>{user.email}</strong>) is not registered in the system's admin table.</p>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Please ensure you have run the final <strong>INSERT INTO admins</strong> SQL command <br />
        with your User ID: <code>{user.id}</code>
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-primary"
        style={{ marginTop: '2rem' }}
      >
        Retry Connection
      </button>
    </div>
  )

  // No longer forcing redirect to /select-campus
  // The root Dashboard will now act as the selection hub

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .content {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          max-width: 1200px;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .content {
            margin-left: 0;
            padding: 1rem;
          }
        }

        .loader {
          color: var(--primary);
          font-weight: 600;
          font-size: 1.25rem;
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default AdminLayout
