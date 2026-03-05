import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AdminLayout from './components/Layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Finance from './pages/Finance'
import Campuses from './pages/Campuses'
import CampusSelection from './pages/CampusSelection'
import CampusDashboard from './pages/CampusDashboard'
import Support from './pages/Support'
import Admins from './pages/Admins'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<AdminLayout />}>
            <Route path="/select-campus" element={<CampusSelection />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/campus/:id" element={<CampusDashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/campuses" element={<Campuses />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admins" element={<Admins />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
