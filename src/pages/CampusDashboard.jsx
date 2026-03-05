import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, CreditCard, ArrowUpRight, GraduationCap, ArrowLeft, Landmark, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const CampusDashboard = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { setSelectedCampusId } = useAuth()
    const [loading, setLoading] = useState(true)
    const [campus, setCampus] = useState(null)
    const [stats, setStats] = useState({
        totalStudents: 0,
        todayPayments: 0
    })

    useEffect(() => {
        if (id) {
            setSelectedCampusId(id)
            fetchCampusData()
        }
    }, [id])

    const fetchCampusData = async () => {
        setLoading(true)
        try {
            // 1. Fetch Campus Info
            const { data: campusData } = await supabase
                .from('campuses')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (campusData) setCampus(campusData)

            // 2. Fetch Stats
            const { count: studentCount } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('campus_id', id)

            const today = new Date().toISOString().split('T')[0]
            const { data: paymentsToday } = await supabase
                .from('payments')
                .select('amount, students!inner(campus_id)')
                .eq('students.campus_id', id)
                .gte('created_at', today)

            const dailyTotal = paymentsToday?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

            setStats({
                totalStudents: studentCount || 0,
                todayPayments: dailyTotal
            })
        } catch (err) {
            console.error('Error fetching campus data:', err)
        } finally {
            setLoading(false)
        }
    }

    const navHub = [
        { label: 'Students', desc: 'Manage enrollment and records', icon: Users, path: '/students', color: '#006dff' },
        { label: 'Finance', desc: 'Track payments and invoices', icon: CreditCard, path: '/finance', color: '#006dff' }
    ]

    if (loading) return (
        <div className="campus-loading">
            <div className="spinner"></div>
            <p>Initializing campus dashboard...</p>
        </div>
    )

    return (
        <div className="campus-dashboard">
            {/* Header / Back Navigation */}
            <div className="campus-header">
                <div className="campus-identity">
                    <GraduationCap size={48} color="#006dff" />
                    <div className="identity-text">
                        <h1>{campus?.name} Dashboard</h1>
                        <p><MapPin size={18} /> {campus?.location || 'Main Campus Hub'}</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid-mini">
                <div className="stat-pill">
                    <span className="pill-label">Total Enrollment</span>
                    <span className="pill-value">{stats.totalStudents} Students</span>
                </div>
                <div className="stat-pill">
                    <span className="pill-label">Collections (Today)</span>
                    <span className="pill-value">Rs. {stats.todayPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Navigation Hub */}
            <section className="hub-section">
                <h2 className="section-title">Campus Management Hub</h2>
                <div className="nav-grid">
                    {navHub.map((item, idx) => (
                        <div key={idx} className="nav-card card" onClick={() => navigate(item.path)}>
                            <div className="nav-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                <item.icon size={28} />
                            </div>
                            <div className="nav-info">
                                <h3>{item.label}</h3>
                                <p>{item.desc}</p>
                            </div>
                            <div className="nav-arrow">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="page-footer">
                <button
                    className="btn-outline-footer"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={18} /> Back to Global Dashboard
                </button>
            </div>

            <style>{`
        .campus-dashboard { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .campus-header { margin-bottom: 4rem; }
        
        .campus-identity { display: flex; align-items: center; gap: 2rem; }
        .campus-identity h1 { font-size: 3rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.04em; }
        .campus-identity p { color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 0.6rem; font-size: 1.25rem; margin-top: 0.25rem; }

        .stats-grid-mini { display: flex; gap: 2rem; margin-bottom: 5rem; }
        .stat-pill { 
          background: white; border: 1px solid #e2e8f0; padding: 1.5rem 2.5rem; border-radius: 24px;
          display: flex; flex-direction: column; min-width: 280px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }
        .stat-pill:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); }
        .pill-label { font-size: 0.8125rem; text-transform: uppercase; font-weight: 800; color: #94a3b8; letter-spacing: 0.12em; margin-bottom: 0.5rem; }
        .pill-value { font-size: 1.75rem; font-weight: 800; color: #1e293b; }

        .section-title {
          font-size: 0.9375rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.14em;
          margin-bottom: 2.5rem; padding-left: 0.5rem;
        }

        .nav-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 2rem; }
        .nav-card {
          display: flex; align-items: center; gap: 2rem; padding: 2.5rem;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: white;
        }
        .nav-card:hover { 
          transform: translateY(-8px); 
          border-color: #006dff; 
          box-shadow: 0 25px 40px rgba(0, 109, 255, 0.08); 
        }

        .nav-icon { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .nav-card:hover .nav-icon { transform: scale(1.1) rotate(-5deg); }
        
        .nav-info { flex: 1; }
        .nav-info h3 { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .nav-info p { font-size: 1.0625rem; color: #64748b; font-weight: 500; }

        .nav-arrow { color: #cbd5e1; transition: all 0.3s; }
        .nav-card:hover .nav-arrow { color: #006dff; transform: translate(6px, -6px); }

        .page-footer {
          margin-top: 6rem;
          padding-top: 2.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: center;
        }
        .btn-outline-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          border-radius: 16px;
          font-weight: 700;
          transition: all 0.3s;
          cursor: pointer;
          border: 1px solid #cbd5e1;
          background: white;
          color: #475569;
        }
        .btn-outline-footer:hover {
          background: #f8fafc;
          border-color: #006dff;
          color: #006dff;
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .campus-loading { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; color: #64748b; }
        .spinner { width: 48px; height: 48px; border: 5px solid #f1f5f9; border-top-color: #006dff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}

export default CampusDashboard
