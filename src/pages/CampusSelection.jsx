import React, { useState, useEffect } from 'react'
import { Landmark, GraduationCap, ChevronRight, Users, CreditCard, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const CampusSelection = () => {
    const { setSelectedCampusId } = useAuth()
    const [campuses, setCampuses] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCampuses()
    }, [])

    const fetchCampuses = async () => {
        const { data } = await supabase.from('campuses').select('*').order('name')
        if (data) setCampuses(data)
        setLoading(false)
    }

    const handleSelect = (id) => {
        setSelectedCampusId(id)
        navigate('/dashboard')
    }

    if (loading) return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Gathering campus data...</p>
        </div>
    )

    return (
        <div className="selection-page">
            <div className="selection-container">
                <div className="selection-header">
                    <div className="header-icon">
                        <GraduationCap size={44} />
                    </div>
                    <h1>Select Campus</h1>
                    <p>Welcome back, Super Admin. Please choose a campus to manage.</p>
                </div>

                <div className="campus-grid">
                    {campuses.map(campus => (
                        <div
                            key={campus.id}
                            className="campus-card"
                            onClick={() => handleSelect(campus.id)}
                        >
                            <div className="campus-badge">
                                <Landmark size={24} />
                            </div>
                            <div className="campus-info">
                                <h3>{campus.name}</h3>
                                <p>Manage students, finance, and settings</p>
                            </div>
                            <div className="chevron-icon">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))}

                </div>

                <div className="selection-footer">
                    <p>Northex-UpBold LMS Management Portal</p>
                </div>
            </div>

            <style>{`
                .selection-page {
                    min-height: 100vh;
                    background: radial-gradient(circle at top right, #f8fafc, #e2e8f0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    animation: fadeIn 0.6s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .selection-container {
                    width: 100%;
                    max-width: 620px;
                }

                .selection-header {
                    text-align: center;
                    margin-bottom: 4.5rem;
                }

                .header-icon {
                    width: 90px;
                    height: 90px;
                    background: white;
                    color: #006dff;
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    box-shadow: 0 15px 35px rgba(0, 109, 255, 0.15);
                    border: 1px solid rgba(0, 109, 255, 0.1);
                    transform: rotate(-5deg);
                }

                .back-btn-selection {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: none;
                    border: none;
                    color: #64748b;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    margin-bottom: 2rem;
                    transition: color 0.2s;
                    width: fit-content;
                }
                .back-btn-selection:hover { color: #006dff; }

                .selection-header h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 1rem;
                    letter-spacing: -0.04em;
                }

                .selection-header p {
                    color: #64748b;
                    font-size: 1.25rem;
                    font-weight: 500;
                }

                .campus-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .campus-card {
                    background: white;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 2.25rem 2.5rem;
                    border-radius: 28px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #e2e8f0;
                    position: relative;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }

                .campus-card:hover {
                    transform: translateY(-8px);
                    border-color: #006dff;
                    box-shadow: 0 25px 40px rgba(0, 109, 255, 0.1);
                }

                .campus-badge {
                    width: 64px;
                    height: 64px;
                    background: #f0f7ff;
                    color: #006dff;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .campus-card:hover .campus-badge {
                    background: #006dff;
                    color: white;
                    transform: rotate(-10deg);
                }

                .campus-info { flex: 1; }
                .campus-info h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                    letter-spacing: -0.02em;
                }

                .campus-info p {
                    font-size: 1rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .chevron-icon { color: #cbd5e1; transition: all 0.3s; }
                .campus-card:hover .chevron-icon {
                    color: #006dff;
                    transform: translateX(8px);
                }

                .selection-footer {
                    margin-top: 5rem;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 0.8125rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }

                .loading-state {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    color: #64748b;
                }

                .spinner {
                    width: 48px;
                    height: 48px;
                    border: 5px solid #f1f5f9;
                    border-top: 5px solid #006dff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default CampusSelection
