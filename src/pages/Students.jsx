import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Mail, Phone, MapPin, Edit2, Trash2, ChevronRight, Download, Users, Landmark, CreditCard, DollarSign, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const ITEMS_PER_PAGE = 10

const Students = () => {
  const { adminRecord, selectedCampusId } = useAuth()
  const [students, setStudents] = useState([])
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [campuses, setCampuses] = useState([])
  const [loading, setLoading] = useState(true)

  // filtering & pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [districtFilter, setDistrictFilter] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [batchFilter, setBatchFilter] = useState('All')
  const [viewMode, setViewMode] = useState('explorer') // 'registry' or 'explorer'
  const [currentPage, setCurrentPage] = useState(1)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    district: '',
    age: '',
    campus_id: '',
    course: '',
    batch: '',
    total_payment: 0
  })

  const isSuperAdmin = adminRecord?.role === 'Super Admin'

  useEffect(() => {
    if (adminRecord) {
      fetchData()
    }
  }, [adminRecord, selectedCampusId])

  const fetchData = async () => {
    setLoading(true)

    let studentQuery = supabase.from('students').select('*, campuses(name)')

    if (selectedCampusId !== 'all') {
      studentQuery = studentQuery.eq('campus_id', selectedCampusId)
    } else if (adminRecord?.role !== 'Super Admin') {
      studentQuery = studentQuery.eq('campus_id', adminRecord?.campus_id)
    }

    const [studentsRes, paymentsRes, campusesRes] = await Promise.all([
      studentQuery.order('created_at', { ascending: false }),
      supabase.from('payments').select('*'),
      supabase.from('campuses').select('*')
    ])

    setStudents(studentsRes.data || [])
    setPayments(paymentsRes.data || [])
    setCampuses(campusesRes.data || [])
    setLoading(false)
  }

  // Derived data: calculate paid and outstanding per student
  const studentsWithPayments = useMemo(() => {
    return students.map(student => {
      const studentPayments = payments.filter(p => p.student_id === student.id)
      const paid = studentPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      const total = Number(student.total_payment || 0)
      return {
        ...student,
        paid,
        outstanding: Math.max(0, total - paid)
      }
    })
  }, [students, payments])

  // Group by Course and Batch for Explorer
  const batchStats = useMemo(() => {
    const groups = {}
    studentsWithPayments.forEach(s => {
      if (!s.course) return
      const key = `${s.course}-${s.batch || 'Unassigned'}`
      if (!groups[key]) {
        groups[key] = {
          course: s.course,
          batch: s.batch || 'Unassigned',
          count: 0,
          total: 0,
          paid: 0,
          outstanding: 0,
          campus: s.campuses?.name
        }
      }
      groups[key].count++
      groups[key].total += Number(s.total_payment || 0)
      groups[key].paid += Number(s.paid || 0)
      groups[key].outstanding += Number(s.outstanding || 0)
    })
    return Object.values(groups).sort((a, b) => a.course.localeCompare(b.course))
  }, [studentsWithPayments])

  const filteredStudents = useMemo(() => {
    return studentsWithPayments.filter(s => {
      const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDistrict = districtFilter === 'All' || s.district === districtFilter
      const matchesCourse = courseFilter === 'All' || s.course === courseFilter
      const matchesBatch = batchFilter === 'All' || s.batch === batchFilter
      return matchesSearch && matchesDistrict && matchesCourse && matchesBatch
    })
  }, [studentsWithPayments, searchTerm, districtFilter, courseFilter, batchFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredStudents, currentPage])

  const districts = ['All', ...new Set(students.map(s => s.district).filter(Boolean))]
  const courses = ['All', ...new Set(students.map(s => s.course).filter(Boolean))]
  const batchesList = ['All', 'Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5']

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        full_name: student.full_name,
        email: student.email || '',
        phone: student.phone || '',
        district: student.district || '',
        age: student.age || '',
        campus_id: student.campus_id,
        course: student.course || '',
        batch: student.batch || '',
        total_payment: student.total_payment || 0
      })
    } else {
      setEditingStudent(null)
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        district: '',
        age: '',
        campus_id: adminRecord?.campus_id || '',
        course: '',
        batch: '',
        total_payment: 0
      })
    }
    setShowModal(true)
  }

  const handleViewProfile = (student) => {
    setSelectedStudent(student)
    setShowViewModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      total_payment: parseFloat(formData.total_payment)
    }

    let error
    if (editingStudent) {
      const { error: err } = await supabase
        .from('students')
        .update(payload)
        .eq('id', editingStudent.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from('students')
        .insert([payload])
      error = err
    }

    if (error) {
      alert('Error saving student: ' + error.message)
    } else {
      setShowModal(false)
      fetchData()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      const { error } = await supabase.from('students').delete().eq('id', id)
      if (error) alert(error.message)
      else fetchData()
    }
  }

  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'District', 'Age', 'Total', 'Paid', 'Outstanding']
    const rows = filteredStudents.map(s => [
      s.full_name, s.email, s.phone, s.district, s.age, s.total_payment, s.paid, s.outstanding
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.download = "students_data.csv"
    link.click()
  }


  return (
    <div className="students-page">
      <div className="header-actions">
        <div>
          <h1 className="page-title">Students Registry</h1>
          <p className="page-subtitle">Manage campus enrollments and tuition tracking</p>
        </div>
        <div className="view-toggle-container">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'registry' ? 'active' : ''}`}
              onClick={() => setViewMode('registry')}
            >
              Registry
            </button>
            <button
              className={`toggle-btn ${viewMode === 'explorer' ? 'active' : ''}`}
              onClick={() => setViewMode('explorer')}
            >
              Batch Explorer
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} /> Enroll Student
          </button>
        </div>
      </div>


      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon-s blue"><Users size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Enrollments</span>
            <h2 className="stat-value">{filteredStudents.length}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-s emerald"><Check size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Fully Paid</span>
            <h2 className="stat-value">{filteredStudents.filter(s => s.outstanding <= 0).length}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-s violet"><DollarSign size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Revenue</span>
            <h2 className="stat-value" style={{ color: '#ef4444' }}>
              LKR {filteredStudents.reduce((sum, s) => sum + s.outstanding, 0).toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {viewMode === 'registry' ? (
        <>
          <div className="utility-bar card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="utility-actions">
              <div className="filter-group">
                <Filter size={16} />
                <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="All">All Courses</option>
                  {courses.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <Filter size={16} />
                <select value={batchFilter} onChange={(e) => { setBatchFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="All">All Batches</option>
                  {batchesList.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <Filter size={16} />
                <select value={districtFilter} onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="All">All Districts</option>
                  {districts.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button className="btn btn-outline btn-sm" onClick={exportToCSV}>
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          <div className="students-list card">
            {loading ? (
              <div className="empty-state">Gathering data...</div>
            ) : paginatedStudents.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Contact Details</th>
                      <th>District</th>
                      <th>Age</th>
                      <th className="text-right">Total (LKR)</th>
                      <th className="text-right">Paid (LKR)</th>
                      <th className="text-right">Outstanding (LKR)</th>
                      <th className="actions-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-name-cell" onClick={() => handleViewProfile(student)} style={{ cursor: 'pointer' }}>
                            <div className="avatar">{student.full_name.charAt(0)}</div>
                            <div className="name-wrap">
                              <span className="name-text">{student.full_name}</span>
                              <div className="student-tags">
                                <span className="campus-tag">{student.campuses?.name}</span>
                                {student.course && <span className="course-tag">{student.course} - {student.batch}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <span className="email-link"><Mail size={12} /> {student.email || 'N/A'}</span>
                            <span><Phone size={12} /> {student.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td>{student.district}</td>
                        <td>{student.age}</td>
                        <td className="text-right font-mono">LKR {Number(student.total_payment).toLocaleString()}</td>
                        <td className="text-right font-mono text-success">LKR {Number(student.paid).toLocaleString()}</td>
                        <td className="text-right font-mono text-error">LKR {Number(student.outstanding).toLocaleString()}</td>
                        <td className="actions-cell">
                          <div className="action-row">
                            <button className="icon-btn" onClick={() => handleOpenModal(student)} title="Edit"><Edit2 size={16} /></button>
                            <button className="icon-btn text-error" onClick={() => handleDelete(student.id)} title="Delete"><Trash2 size={16} /></button>
                            <button className="icon-btn" onClick={() => handleViewProfile(student)} title="View Summary"><ChevronRight size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <Users size={48} opacity={0.3} />
                <p>No student records match your filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >Previous</button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >Next</button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="batch-explorer-grid">
          {batchStats.length > 0 ? (
            batchStats.map((batch, idx) => (
              <div
                key={idx}
                className="batch-card card"
                onClick={() => {
                  setCourseFilter(batch.course);
                  setBatchFilter(batch.batch);
                  setViewMode('registry');
                }}
              >
                <div className="batch-card-header">
                  <div className="batch-meta">
                    <span className="campus-label">{batch.campus}</span>
                    <h3 className="course-name">{batch.course}</h3>
                    <span className="batch-number">{batch.batch}</span>
                  </div>
                  <div className="student-count">
                    <Users size={16} />
                    <span>{batch.count} Students</span>
                  </div>
                </div>
                <div className="batch-card-stats">
                  <div className="mini-stat">
                    <span className="label">Collected</span>
                    <span className="value">LKR {batch.paid.toLocaleString()}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="label">Outstanding</span>
                    <span className="value text-error">LKR {batch.outstanding.toLocaleString()}</span>
                  </div>
                </div>
                <div className="batch-card-footer">
                  <span className="view-students-link">View Batch Students <ChevronRight size={14} /></span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state full-width">
              <Landmark size={48} opacity={0.2} />
              <p>No batches found. Enroll students with course and batch details to see them here.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card card">
            <h2>{editingStudent ? 'Modify Student Record' : 'Enroll New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Video Editing"
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Batch No.</label>
                  <select
                    value={formData.batch}
                    onChange={e => setFormData({ ...formData, batch: e.target.value })}
                    required
                  >
                    <option value="">Select Batch</option>
                    <option value="Batch 1">Batch 1</option>
                    <option value="Batch 2">Batch 2</option>
                    <option value="Batch 3">Batch 3</option>
                    <option value="Batch 4">Batch 4</option>
                    <option value="Batch 5">Batch 5</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Campus</label>
                  <select
                    value={formData.campus_id}
                    onChange={e => setFormData({ ...formData, campus_id: e.target.value })}
                    disabled={!isSuperAdmin && editingStudent}
                    required
                  >
                    <option value="">Select Campus</option>
                    {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Total Tuition (LKR)</label>
                  <input
                    type="number"
                    value={formData.total_payment}
                    onChange={e => setFormData({ ...formData, total_payment: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (editingStudent ? 'Update Student' : 'Enroll Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {showViewModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-card card profile-modal">
            <div className="profile-header">
              <div className="avatar large">{selectedStudent.full_name.charAt(0)}</div>
              <div>
                <h2>{selectedStudent.full_name}</h2>
                <span className="badge">{selectedStudent.campuses?.name} Campus</span>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-section">
                <h3><Users size={16} /> Personal Information</h3>
                <div className="info-list">
                  <div className="info-item"><span>Email:</span> {selectedStudent.email || 'N/A'}</div>
                  <div className="info-item"><span>Phone:</span> {selectedStudent.phone || 'N/A'}</div>
                  <div className="info-item"><span>District:</span> {selectedStudent.district || 'N/A'}</div>
                  <div className="info-item"><span>Age:</span> {selectedStudent.age || 'N/A'}</div>
                </div>
              </div>
              <div className="profile-section">
                <h3><DollarSign size={16} /> Payment Summary</h3>
                <div className="payment-stack">
                  <div className="pay-row"><span>Total Tuition:</span> <strong>LKR {selectedStudent.total_payment?.toLocaleString()}</strong></div>
                  <div className="pay-row text-success"><span>Total Paid:</span> <strong>LKR {selectedStudent.paid?.toLocaleString()}</strong></div>
                  <div className="pay-row divider"></div>
                  <div className="pay-row text-error"><span>Outstanding:</span> <strong>LKR {selectedStudent.outstanding?.toLocaleString()}</strong></div>
                </div>
              </div>

              <div className="profile-section full-width">
                <h3><CreditCard size={16} /> Payment History</h3>
                <div className="payment-history-list">
                  {payments.filter(p => p.student_id === selectedStudent.id).length > 0 ? (
                    <table className="mini-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Method</th>
                          <th className="text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.filter(p => p.student_id === selectedStudent.id)
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .map(p => (
                            <tr key={p.id}>
                              <td>{new Date(p.created_at).toLocaleDateString()}</td>
                              <td>{p.method}</td>
                              <td className="text-right">LKR {Number(p.amount).toLocaleString()}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-payments">No payments recorded yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setShowViewModal(false)}>Close Profile</button>
            </div>
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
        .students-page { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3.5rem;
        }

        .view-toggle-container {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .view-toggle {
          display: flex;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: white;
          color: #006dff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .batch-explorer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .batch-card {
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .batch-card:hover { 
          transform: translateY(-5px); 
          border-color: #006aff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); 
        }

        .batch-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .campus-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.25rem;
        }

        .course-name {
          font-size: 1.25rem;
          font-weight: 850;
          color: #1e293b;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .batch-number {
          font-size: 0.85rem;
          font-weight: 700;
          color: #006aff;
          background: #eff6ff;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        .student-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          background: #f8fafc;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
        }

        .batch-card-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 16px;
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mini-stat .label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mini-stat .value {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
        }

        .batch-card-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
        }

        .view-students-link {
          font-size: 0.85rem;
          font-weight: 800;
          color: #006aff;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .empty-state.full-width { grid-column: 1 / -1; min-height: 300px; }

        .page-title { font-size: 2.25rem; font-weight: 800; color: #1e293b; letter-spacing: -0.04em; margin-bottom: 0.25rem; }
        .page-subtitle { color: #64748b; font-size: 0.95rem; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif; }
        .action-btns { display: flex; gap: 1.5rem; }

        .filters-bar { display: none; } /* Replaced by utility-bar */

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.3s;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }

        .stat-icon-s {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-s.blue { background: #eff6ff; color: #3b82f6; }
        .stat-icon-s.emerald { background: #ecfdf5; color: #10b981; }
        .stat-icon-s.violet { background: #f5f3ff; color: #8b5cf6; }

        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.5rem; font-weight: 900; color: #1e293b; }

        .utility-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .utility-actions { display: flex; align-items: center; gap: 1.5rem; }

        .search-box { flex: 1; position: relative; max-width: 400px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          transition: all 0.2s;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .search-box input:focus { border-color: #006aff; box-shadow: 0 0 0 3px rgba(0, 106, 255, 0.05); }

        .filter-group { display: flex; align-items: center; gap: 0.75rem; color: #64748b; }
        .filter-group select {
          padding: 0.6rem 2.5rem 0.6rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
        }


        .students-list { 
            border-radius: 24px; 
            overflow: hidden; 
            border: 1px solid #e2e8f0; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
        }
        .table-container { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; background: white; }
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
        .student-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.875rem; }
        .student-table th { padding: 1.25rem 1.5rem; background: #f8fafc; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        .student-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .text-right { text-align: right; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover { background-color: #fcfdfe; }

        .student-name-cell { display: flex; align-items: center; gap: 1.25rem; }
        .name-wrap { display: flex; flex-direction: column; gap: 0.15rem; }
        .name-text { font-weight: 800; color: #1e293b; font-size: 1.0625rem; }
        .student-tags { display: flex; align-items: center; gap: 0.5rem; }
        .campus-tag { font-size: 0.65rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; }
        .course-tag { font-size: 0.65rem; color: #006dff; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: #e0f2fe; padding: 0.2rem 0.5rem; border-radius: 4px; }

        .avatar {
          width: 44px;
          height: 44px;
          background: #f0f7ff;
          color: #006dff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.125rem;
        }
        .avatar.large { width: 80px; height: 80px; font-size: 2rem; border-radius: 24px; }

        .contact-info { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem; color: #64748b; font-weight: 500; }
        .contact-info span { display: flex; align-items: center; gap: 0.6rem; }
        
        .font-mono { font-family: ui-monospace, monospace; font-weight: 700; }
        .text-right { text-align: right; }
        .text-success { color: #10b981; }
        .text-error { color: #ef4444; }

        .actions-cell { text-align: right; }
        .action-row { display: flex; justify-content: flex-end; gap: 0.5rem; }

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

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            padding: 2rem;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        .page-info { font-weight: 800; color: #64748b; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.05em; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .modal-card {
          width: 100%;
          max-width: 700px;
          background: white;
          padding: 3.5rem;
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .profile-modal { max-width: 600px; }
        .profile-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #f1f5f9; }
        .profile-header h2 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; }
        
        .profile-grid { display: grid; gap: 3rem; }
        .profile-section h3 { display: flex; align-items: center; gap: 0.75rem; font-size: 1.125rem; font-weight: 800; margin-bottom: 1.5rem; color: #006dff; text-transform: uppercase; letter-spacing: 0.05em; }
        .info-list { display: grid; gap: 1rem; }
        .info-item { font-size: 1rem; color: #475569; font-weight: 500; }
        .info-item span { font-weight: 800; color: #94a3b8; width: 100px; display: inline-block; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.02em; }
        
        .payment-stack { background: #f8fafc; padding: 1.5rem; border-radius: 20px; border: 1px solid #e2e8f0; }
        .pay-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .pay-row:last-child { margin-bottom: 0; }
        .pay-row.divider { border-top: 1px dashed #cbd5e1; padding-top: 0.75rem; margin-top: 0.75rem; }

        .profile-section.full-width { grid-column: 1 / -1; }
        .payment-history-list { margin-top: 1rem; }
        .mini-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .mini-table th { text-align: left; color: #64748b; padding: 0.5rem; border-bottom: 1px solid #e2e8f0; }
        .mini-table td { padding: 0.75rem 0.5rem; border-bottom: 1px solid #f1f5f9; }
        .no-payments { text-align: center; padding: 2rem; color: #94a3b8; font-style: italic; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 800; margin-bottom: 0.75rem; color: #475569; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
        input, select {
            width: 100%;
            padding: 1rem 1.25rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        input:focus, select:focus { outline: none; border-color: #006dff; box-shadow: 0 0 0 4px rgba(0, 109, 255, 0.1); }

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
        .btn-sm { padding: 0.75rem 1.25rem; font-size: 0.875rem; border-radius: 10px; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .badge {
            padding: 0.4rem 1rem;
            background: #e0f2fe;
            color: #006dff;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}

export default Students
