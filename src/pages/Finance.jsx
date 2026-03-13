import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Calendar, Search, CreditCard, Receipt, Plus, Download, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import { generateReceipt } from '../utils/ReceiptGenerator'

const Finance = () => {
    const { adminRecord, selectedCampusId } = useAuth()
    const [payments, setPayments] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newPayment, setNewPayment] = useState({ student_id: '', amount: '', method: 'Cash', note: '' })
    const [students, setStudents] = useState([])

    useEffect(() => {
        fetchPayments()
        fetchStudents()
    }, [adminRecord, selectedCampusId])

    const fetchPayments = async () => {
        if (!adminRecord) return
        setLoading(true)

        let query = supabase
            .from('payments')
            .select('*, students!inner(full_name, email, phone, district, campus_id, campuses(name))')
            .order('created_at', { ascending: false })

        if (selectedCampusId !== 'all') {
            query = query.eq('students.campus_id', selectedCampusId)
        } else if (adminRecord.role !== 'Super Admin') {
            query = query.eq('students.campus_id', adminRecord.campus_id)
        }

        const { data } = await query
        setPayments(data || [])
        setLoading(false)
    }

    const fetchStudents = async () => {
        let query = supabase.from('students').select('id, full_name, campus_id')

        if (selectedCampusId !== 'all') {
            query = query.eq('campus_id', selectedCampusId)
        } else if (adminRecord.role !== 'Super Admin') {
            query = query.eq('campus_id', adminRecord.campus_id)
        }

        const { data } = await query
        setStudents(data || [])
    }

    const handleAddPayment = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await supabase
            .from('payments')
            .insert([newPayment])
            .select('*, students!inner(full_name, email, phone, district, campus_id, campuses(name))')
            .single()

        if (error) {
            alert('Error saving payment: ' + error.message)
        } else {
            setShowModal(false)
            fetchPayments()
            setNewPayment({ student_id: '', amount: '', method: 'Cash', note: '' })

            // Auto-generate receipt
            if (data) {
                generateReceipt(data)
            }
        }
        setLoading(false)
    }

    const exportToCSV = () => {
        const headers = ['Date', 'Student', 'Campus', 'Method', 'Amount']
        const rows = payments.map(p => [
            format(new Date(p.created_at), 'yyyy-MM-dd'),
            p.students?.full_name,
            p.students?.campuses?.name,
            p.method,
            p.amount
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers, ...rows].map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "payments_export.csv")
        document.body.appendChild(link)
        link.click()
    }

    return (
        <div className="finance-page">
            <div className="header-actions">
                <div>
                    <h1 className="page-title">Finance & Payments</h1>
                    <p className="page-subtitle">Track student invoices and transaction history</p>
                </div>
                <div className="action-btns">
                    <button className="btn btn-outline" onClick={exportToCSV}>
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        Record Payment
                    </button>
                </div>
            </div>

            <div className="finance-summary stats-grid">
                <div className="stat-card card">
                    <div className="stat-content">
                        <span className="stat-label">Total Collected</span>
                        <h2 className="stat-value text-success">
                            LKR {payments.reduce((sum, p) => sum + Number(p.amount), 0).toFixed(2)}
                        </h2>
                    </div>
                    <DollarSign size={32} className="stat-icon-bg" />
                </div>
                <div className="stat-card card">
                    <div className="stat-content">
                        <span className="stat-label">Transactions</span>
                        <h2 className="stat-value">{payments.length}</h2>
                    </div>
                    <Receipt size={32} className="stat-icon-bg" />
                </div>
            </div>

            <div className="payments-list card">
                <div className="card-header">
                    <h3>Payment History</h3>
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Filter by student..." />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student</th>
                            <th>Campus</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center">Loading payments...</td></tr>
                        ) : payments.map((p) => (
                            <tr key={p.id}>
                                <td>{format(new Date(p.created_at), 'MMM dd, yyyy HH:mm')}</td>
                                <td><strong>{p.students?.full_name}</strong></td>
                                <td>{p.students?.campuses?.name}</td>
                                <td>
                                    <span className="method-tag">
                                        <CreditCard size={12} /> {p.method}
                                    </span>
                                </td>
                                <td><strong className="text-success">LKR {Number(p.amount).toFixed(2)}</strong></td>
                                <td><span className="status-badge active">Cleared</span></td>
                                <td>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => generateReceipt(p)}
                                    >
                                        <Receipt size={14} /> Receipt
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
                        <h2>Record New Payment</h2>
                        <form onSubmit={handleAddPayment}>
                            <div className="form-group">
                                <label>Select Student</label>
                                <select
                                    value={newPayment.student_id}
                                    onChange={(e) => setNewPayment({ ...newPayment, student_id: e.target.value })}
                                    required
                                >
                                    <option value="">Choose student...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount (LKR)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newPayment.amount}
                                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Method</label>
                                    <select
                                        value={newPayment.method}
                                        onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                                    >
                                        <option>Cash</option>
                                        <option>Bank Transfer</option>
                                        <option>Card</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Note (Optional)</label>
                                <textarea
                                    value={newPayment.note}
                                    onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                                    placeholder="Payment for March tuition..."
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="page-footer">
                <button
                    className="btn btn-outline"
                    onClick={() => navigate('/dashboard')}
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
        .finance-page { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3.5rem;
        }

        .page-title { font-size: 3rem; font-weight: 800; color: #006dff; letter-spacing: -0.04em; margin-bottom: 0.25rem; }
        .page-subtitle { color: #64748b; font-size: 1.125rem; font-weight: 500; }
        
        .action-btns { display: flex; gap: 1.5rem; }
        
        .finance-summary { margin-bottom: 3.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        
        .stat-card { 
            position: relative; 
            padding: 2.25rem; 
            border-radius: 24px; 
            border: 1px solid #e2e8f0; 
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); }
        
        .stat-label { font-size: 0.8125rem; text-transform: uppercase; font-weight: 800; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 0.5rem; display: block; }
        .stat-value { font-size: 2.5rem; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; }
        
        .stat-icon-bg {
          color: #10b981;
          position: absolute;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.08;
          width: 56px !important;
          height: 56px !important;
        }

        .payments-list { 
            border-radius: 24px; 
            overflow: hidden; 
            border: 1px solid #e2e8f0; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            background: white;
        }

        .card-header {
            padding: 2rem 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
        }
        .card-header h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; letter-spacing: -0.01em; }

        .search-box { position: relative; width: 300px; }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-box input {
            width: 100%;
            padding: 0.875rem 1rem 0.875rem 3rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 0.9375rem;
            outline: none;
            transition: all 0.2s;
        }
        .search-box input:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08); }

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

        .method-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.5rem 0.875rem;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #475569;
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

        .text-success { color: #10b981; }

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

        input, select, textarea {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s;
            outline: none;
        }
        input:focus, select:focus, textarea:focus { border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        
        textarea { min-height: 100px; resize: vertical; }

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
        .btn-primary { background: #10b981; color: white; }
        .btn-primary:hover { background: #059669; transform: translateY(-3px); box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4); }
        .btn-outline { background: white; color: #475569; border: 1px solid #cbd5e1; }
        .btn-outline:hover { background: #f8fafc; border-color: #10b981; color: #10b981; transform: translateY(-2px); }
        .btn-sm { padding: 0.75rem 1.25rem; font-size: 0.875rem; border-radius: 10px; }

        .text-center { text-align: center; padding: 5rem; color: #64748b; font-weight: 600; font-size: 1.125rem; }
      `}</style>
        </div>
    )
}

export default Finance
