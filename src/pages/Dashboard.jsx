import React, { useState, useEffect } from 'react'
import { Landmark, MapPin, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { adminRecord, setSelectedCampusId } = useAuth()
  const [campuses, setCampuses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCampuses()
  }, [])

  const fetchCampuses = async () => {
    setLoading(true)
    const { data } = await supabase.from('campuses').select('*').order('name')
    if (data) setCampuses(data)
    setLoading(false)
  }

  const handleCampusClick = (campusId) => {
    setSelectedCampusId(campusId)
    navigate(`/campus/${campusId}`)
  }

  return (
    <div className="dashboard-hub">
      {/* 1. Welcome Section */}
      <div className="welcome-hero">
        <div className="hero-content">
          <h1>Welcome back, {adminRecord?.email?.split('@')[0]}!</h1>
          <p>LMS Global Administrative Hub</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* 2. Selected Campus Section (Campus List) */}
        <section className="hub-section">
          <h2 className="section-title">Select Campus to Manage</h2>
          {loading ? (
            <div className="loading-card card">
              <p>Loading campuses...</p>
            </div>
          ) : (
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
                    <span>Open Dashboard</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .dashboard-hub { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .welcome-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 24px;
          padding: 4rem;
          color: white;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
        }

        .welcome-hero::after {
          content: '';
          position: absolute;
          top: -20%;
          right: -5%;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        .hero-content { position: relative; z-index: 1; }
        .hero-content h1 { font-size: 3rem; font-weight: 800; margin-bottom: 0.75rem; color: white; letter-spacing: -0.03em; }
        .hero-content p { font-size: 1.125rem; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; }

        .section-title {
          font-size: 0.875rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-left: 0.5rem;
        }

        .campus-selection-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .campus-entry {
          display: flex; align-items: center; gap: 2rem; padding: 2rem 2.5rem;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 20px;
        }
        .campus-entry:hover { 
          transform: translateY(-6px); 
          border-color: #006dff; 
          box-shadow: 0 20px 30px rgba(0, 109, 255, 0.08);
          background: #f8fafc;
        }

        .campus-icon { 
          width: 64px; height: 64px; background: #f0f7ff; color: #006dff; 
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .campus-entry:hover .campus-icon { background: #006dff; color: white; transform: rotate(-5deg); }

        .campus-info { flex: 1; }
        .campus-info h3 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
        .campus-info p { font-size: 1rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }

        .campus-action { display: flex; align-items: center; gap: 1rem; color: #94a3b8; font-weight: 700; font-size: 0.9375rem; transition: all 0.3s; }
        .campus-entry:hover .campus-action { color: #006dff; }

        .loading-card { padding: 5rem; text-align: center; color: #64748b; font-weight: 600; }
      `}</style>
    </div>
  )
}

export default Dashboard
