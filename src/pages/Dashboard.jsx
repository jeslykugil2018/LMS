import React, { useState, useEffect } from 'react'
import { Landmark, MapPin, ChevronRight, Users, CreditCard, ArrowUpRight, GraduationCap, ArrowLeft, Plus, Globe, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { adminRecord, selectedCampusId, setSelectedCampusId } = useAuth()
  const [campuses, setCampuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [campusStats, setCampusStats] = useState({
    totalStudents: 0,
    todayPayments: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCampuses()
  }, [])

  useEffect(() => {
    if (selectedCampusId) {
      fetchCampusStats(selectedCampusId)
    }
  }, [selectedCampusId])

  const fetchCampuses = async () => {
    setLoading(true)
    const { data } = await supabase.from('campuses').select('*').order('name')
    if (data) setCampuses(data)
    setLoading(false)
  }

  const fetchCampusStats = async (id) => {
    try {
      // 1. Fetch Students count for this campus
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('campus_id', id)

      // 2. Fetch Payments for today for this campus
      const today = new Date().toISOString().split('T')[0]
      const { data: paymentsToday } = await supabase
        .from('payments')
        .select('amount, students!inner(campus_id)')
        .eq('students.campus_id', id)
        .gte('created_at', today)

      const dailyTotal = paymentsToday?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

      setCampusStats({
        totalStudents: studentCount || 0,
        todayPayments: dailyTotal
      })
    } catch (err) {
      console.error('Error fetching campus stats:', err)
    }
  }

  const handleCampusClick = (campusId) => {
    setSelectedCampusId(campusId)
  }

  const activeCampus = campuses.find(c => c.id === selectedCampusId)

  const navHub = [
    { label: 'Students', desc: 'Manage enrollment and records', icon: Users, path: '/students', color: '#006dff' },
    { label: 'Finance', desc: 'Track payments and invoices', icon: CreditCard, path: '/finance', color: '#006dff' }
  ]

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner"></div>
      <p>Synchronizing administrative data...</p>
    </div>
  )

  return (
    <div className="dashboard-hub">
      {/* 1. Welcome Section */}
      <div className="welcome-hero">
        <div className="hero-content">
          <div className="admin-chip">
            <Plus size={14} />
            <span>Authenticated Admin Access</span>
          </div>
          <h1>Welcome back, {adminRecord?.email?.split('@')[0]}</h1>
          <p>LMS Global Administrative Hub</p>
        </div>
      </div>

      <div className="dashboard-content">
        {!selectedCampusId ? (
          /* Selection View */
          <section className="hub-section fade-in">
            <h2 className="section-title">Select Campus to Manage</h2>
            <div className="campus-selection-list">
              {campuses.map(campus => (
                <div
                  key={campus.id}
                  className="campus-entry card"
                  onClick={() => handleCampusClick(campus.id)}
                >
                  <div className="campus-icon">
                    <Landmark size={24} />
                  </div>
                  <div className="campus-info">
                    <h3>{campus.name}</h3>
                    <p><MapPin size={14} /> {campus.location}</p>
                  </div>
                  <div className="campus-action">
                    <span>Manage Campus</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Active Campus View */
          <div className="campus-detail-view fade-in">
            {/* Campus Identity */}
            <div className="active-campus-header">
              <div className="campus-id-block">
                <div className="campus-badge-v2">
                  <GraduationCap size={44} />
                </div>
                <div className="campus-meta">
                  <h2>{activeCampus?.name} Dashboard</h2>
                  <p><MapPin size={16} /> {activeCampus?.location || 'Operational Hub'}</p>
                </div>
              </div>
              <button className="btn-change-campus" onClick={() => setSelectedCampusId(null)}>
                <ArrowLeft size={16} /> Switch Campus
              </button>
            </div>

            {/* Stats Summary */}
            <div className="stats-row">
              <div className="stat-pill-v2">
                <div className="pill-icon blue"><Users size={20} /></div>
                <div className="pill-content">
                  <span className="pill-label">Total Enrollment</span>
                  <span className="pill-value">{campusStats.totalStudents} Students</span>
                </div>
              </div>
              <div className="stat-pill-v2">
                <div className="pill-icon emerald"><Sparkles size={20} /></div>
                <div className="pill-content">
                  <span className="pill-label">Collections (Today)</span>
                  <span className="pill-value">Rs. {campusStats.todayPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Management Hub */}
            <section className="management-hub">
              <h2 className="section-title">Campus Management Hub</h2>
              <div className="nav-grid-v2">
                {navHub.map((item, idx) => (
                  <div key={idx} className="nav-card-v2" onClick={() => navigate(item.path)}>
                    <div className="nav-icon-v2" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                      <item.icon size={24} />
                    </div>
                    <div className="nav-info-v2">
                      <h3>{item.label}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <div className="nav-arrow-v2">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-hub { animation: fadeIn 0.4s ease-out; padding: 2rem 5% 6rem; max-width: 1300px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s forwards; }

        .welcome-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 32px;
          padding: 5rem 4rem;
          color: white;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.2);
        }

        .welcome-hero::after {
          content: '';
          position: absolute;
          top: -20%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
          border-radius: 50%;
        }

        .admin-chip {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
          padding: 0.5rem 1rem; border-radius: 100px;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 2rem; border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-content { position: relative; z-index: 1; }
        .hero-content h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 0.75rem; color: white; letter-spacing: -0.04em; }
        .hero-content p { font-size: 1.15rem; opacity: 0.6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; }

        .section-title {
          font-size: 0.85rem; font-weight: 800; color: #94a3b8; text-transform: uppercase;
          letter-spacing: 0.15em; margin-bottom: 2rem; display: block;
        }

        /* Selection List */
        .campus-selection-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .campus-entry {
          display: flex; align-items: center; gap: 2rem; padding: 2.25rem 2.5rem;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          border: 1px solid #e2e8f0;
          background: white; border-radius: 24px;
        }
        .campus-entry:hover { 
          transform: translateY(-6px); 
          border-color: #006dff; 
          box-shadow: 0 25px 40px rgba(0, 109, 255, 0.1);
        }

        .campus-icon { 
          width: 64px; height: 64px; background: #f0f7ff; color: #006dff; 
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .campus-entry:hover .campus-icon { background: #006dff; color: white; transform: rotate(-5deg); }

        .campus-info h3 { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
        .campus-info p { font-size: 1.05rem; color: #64748b; display: flex; align-items: center; gap: 0.6rem; font-weight: 500; }

        .campus-action { display: flex; align-items: center; gap: 0.75rem; color: #94a3b8; font-weight: 800; font-size: 0.9rem; transition: all 0.3s; text-transform: uppercase; }
        .campus-entry:hover .campus-action { color: #006dff; }

        /* Active Campus Detail View */
        .active-campus-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #e2e8f0;
        }
        .campus-id-block { display: flex; align-items: center; gap: 2rem; }
        .campus-badge-v2 {
          width: 80px; height: 80px; background: #f0f7ff; color: #006dff;
          border-radius: 24px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px rgba(0, 109, 255, 0.1);
        }
        .campus-meta h2 { font-size: 2.5rem; font-weight: 900; margin: 0; letter-spacing: -0.04em; }
        .campus-meta p { color: #64748b; font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; }

        .btn-change-campus {
          padding: 0.75rem 1.5rem; border-radius: 14px; border: 1px solid #e2e8f0;
          background: white; color: #64748b; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;
          cursor: pointer; transition: all 0.3s;
        }
        .btn-change-campus:hover { background: #f8fafc; color: #006dff; border-color: #006dff; transform: translateX(-4px); }

        /* Stats Row */
        .stats-row { display: flex; gap: 2rem; margin-bottom: 5rem; }
        .stat-pill-v2 {
          flex: 1; background: white; border: 1px solid #e2e8f0; padding: 2rem 2.5rem; border-radius: 28px;
          display: flex; align-items: center; gap: 2rem; transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
        }
        .stat-pill-v2:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); }
        .pill-icon {
          width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
        }
        .pill-icon.blue { background: #eff6ff; color: #3b82f6; }
        .pill-icon.emerald { background: #ecfdf5; color: #10b981; }
        .pill-content { display: flex; flex-direction: column; gap: 0.25rem; }
        .pill-label { font-size: 0.85rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
        .pill-value { font-size: 1.75rem; font-weight: 900; color: #0f172a; }

        /* Nav Grid V2 */
        .nav-grid-v2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .nav-card-v2 {
          display: flex; align-items: center; gap: 1.5rem; padding: 2rem;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          border: 1px solid #e2e8f0; border-radius: 24px; background: white;
        }
        .nav-card-v2:hover { 
          transform: translateY(-8px); border-color: #006dff;
          box-shadow: 0 20px 40px rgba(0, 109, 255, 0.06); 
        }
        .nav-icon-v2 { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .nav-info-v2 { flex: 1; }
        .nav-info-v2 h3 { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; }
        .nav-info-v2 p { font-size: 0.95rem; color: #64748b; font-weight: 500; }
        .nav-arrow-v2 { color: #cbd5e1; transition: all 0.3s; }
        .nav-card-v2:hover .nav-arrow-v2 { color: #006dff; transform: translate(4px, -4px); }

        .dashboard-loading { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; color: #64748b; }
        .spinner { width: 56px; height: 56px; border: 6px solid #f1f5f9; border-top-color: #006dff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .stats-row { flex-direction: column; }
          .welcome-hero { padding: 3rem 2rem; }
          .hero-content h1 { font-size: 2.5rem; }
          .active-campus-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
