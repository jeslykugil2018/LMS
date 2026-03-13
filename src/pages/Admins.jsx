import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Shield, Mail, Trash2, Edit2, Check, X, ShieldAlert, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Admins = () => {
    const { adminRecord, selectedCampusId } = useAuth()
    const navigate = useNavigate()
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [campuses, setCampuses] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        role: 'Campus Admin',
        campus_id: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchAdmins()
        fetchCampuses()
    }, [])

    const fetchAdmins = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('admins')
            .select('*, campuses(name)')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching admins:', error)
        else setAdmins(data || [])
        setLoading(false)
    }

    const fetchCampuses = async () => {
        const { data } = await supabase.from('campuses').select('*')
        setCampuses(data || [])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Note: This only creates the record in the 'admins' table.
        // The user still needs to sign up via Auth with this email.
        // Once they sign up, the 'user_id' will remain null until they log in
        // or we can attempt to link it if we had the UID, but here we just
        // pre-register their role by email.

        // Check if admin already exists
        const { data: existing } = await supabase
            .from('admins')
            .select('id')
            .eq('email', formData.email.toLowerCase())
            .single()

        let error
        if (existing) {
            const { error: err } = await supabase
                .from('admins')
                .update({
                    role: formData.role,
                    campus_id: formData.role === 'Super Admin' ? null : formData.campus_id
                })
                .eq('id', existing.id)
            error = err
        } else {
            const { error: err } = await supabase
                .from('admins')
                .insert([{
                    email: formData.email.toLowerCase(),
                    role: formData.role,
                    campus_id: formData.role === 'Super Admin' ? null : formData.campus_id
                }])
            error = err
        }

        if (error) {
            alert('Error: ' + error.message)
        } else {
            setShowModal(false)
            fetchAdmins()
            setFormData({ email: '', role: 'Campus Admin', campus_id: '' })
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (id, email) => {
        if (email === adminRecord?.email) {
            alert("You cannot delete your own admin account!")
            return
        }

        if (window.confirm(`Are you sure you want to remove ${email} from administrators?`)) {
            const { error } = await supabase.from('admins').delete().eq('id', id)
            if (error) alert(error.message)
            else fetchAdmins()
        }
    }

    if (adminRecord?.role !== 'Super Admin') {
        return (
            <div className="empty-state card">
                <ShieldAlert size={48} color="var(--error)" />
                <h2>Access Denied</h2>
                <p>Only Super Admins can manage system administrators.</p>
            </div>
        )
    }

    return (
        <div className="admins-page">
            <div className="header-actions">
                <div>
                    <h1 className="page-title">Admin Management</h1>
                    <p className="page-subtitle">Configure system roles and campus access</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <UserPlus size={20} />
                    Add Administrator
                </button>
            </div>

            <div className="admins-list card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Administrator</th>
                            <th>Role</th>
                            <th>Campus Assignment</th>
                            <th>Status</th>
                            <th className="actions-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center">Loading admins...</td></tr>
                        ) : admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>
                                    <div className="admin-email-cell">
                                        <Mail size={16} color="var(--text-muted)" />
                                        <strong>{admin.email}</strong>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${admin.role === 'Super Admin' ? 'badge-primary' : ''}`}>
                                        {admin.role === 'Super Admin' ? 'Super Admin' : 'Campus Admin'}
                                    </span>
                                </td>
                                <td>{admin.role === 'Super Admin' ? 'All Campuses' : (admin.campuses?.name || 'Unassigned')}</td>
                                <td>
                                    {admin.user_id ? (
                                        <span className="status-badge active">Verified</span>
                                    ) : (
                                        <span className="status-badge" style={{ background: '#fef3c7', color: '#92400e' }}>Pending Signup</span>
                                    )}
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn text-error"
                                        onClick={() => handleDelete(admin.id, admin.email)}
                                        title="Remove Admin"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card card">
                        <h2>Add New Administrator</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>System Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Campus Admin">Campus Admin</option>
                                        <option value="Super Admin">Super Admin</option>
                                    </select>
                                </div>
                                {formData.role === 'Campus Admin' && (
                                    <div className="form-group">
                                        <label>Assign Campus</label>
                                        <select
                                            value={formData.campus_id}
                                            onChange={e => setFormData({ ...formData, campus_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Campus</option>
                                            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="page-footer">
                <button
                    className="btn btn-outline"
                    onClick={() => navigate(selectedCampusId && selectedCampusId !== 'all' ? `/campus/${selectedCampusId}` : '/')}
                >
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
            </div>

            <style>{`
        .page-footer {
          margin-top: 5rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: center;
        }
        .admins-page { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3.5rem;
        }

        .page-title { font-size: 2.25rem; font-weight: 800; color: #1e293b; letter-spacing: -0.04em; margin-bottom: 0.25rem; }
        .page-subtitle { color: #64748b; font-size: 0.95rem; font-weight: 500; }

        .admins-list { 
            border-radius: 24px; 
            overflow: hidden; 
            border: 1px solid #e2e8f0; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            background: white;
        }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
            text-align: left;
            padding: 1.5rem 1.25rem;
            background: #f8fafc;
            color: #475569;
            font-weight: 800;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table td { padding: 1.5rem 1.25rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover { background-color: #fcfdfe; }

        .admin-email-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .badge {
            padding: 0.4rem 1rem;
            background: #f1f5f9;
            color: #475569;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .badge-primary {
          background: #e0f2fe;
          color: #006dff;
        }

        .status-badge {
            padding: 0.4rem 1rem;
            background: #dcfce7;
            color: #166534;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .icon-btn {
          border: none;
          background: transparent;
          padding: 0.75rem;
          border-radius: 10px;
          color: #94a3b8;
          transition: all 0.2s;
        }
        .icon-btn:hover { background: #f1f5f9; color: #006dff; transform: scale(1.1); }
        .icon-btn.text-error:hover { background: #fef2f2; color: #ef4444; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-card {
          width: 100%;
          max-width: 550px;
          padding: 3.5rem;
          background: white;
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .modal-card h2 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 2.5rem; letter-spacing: -0.02em; }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 800; margin-bottom: 0.75rem; color: #475569; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.05em; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 3rem;
        }

        input, select {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s;
            outline: none;
        }
        input:focus, select:focus { border-color: #006dff; box-shadow: 0 0 0 4px rgba(0, 109, 255, 0.1); }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            border-radius: 14px;
            font-weight: 800;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
        .btn-primary { background: #006dff; color: white; }
        .btn-primary:hover { background: #0056cc; transform: translateY(-3px); box-shadow: 0 15px 25px -5px rgba(0, 109, 255, 0.4); }
        .btn-outline { background: white; color: #475569; border: 1px solid #cbd5e1; }
        .btn-outline:hover { background: #f8fafc; border-color: #006dff; color: #006dff; transform: translateY(-2px); }

        .text-center { text-align: center; padding: 5rem; color: #64748b; font-weight: 600; font-size: 1.125rem; }
      `}</style>
        </div>
    )
}

export default Admins
