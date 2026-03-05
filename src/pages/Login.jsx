import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, GraduationCap } from 'lucide-react'

const Login = () => {
  const { user, adminRecord } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user && adminRecord) {
      navigate('/')
    }
  }, [user, adminRecord, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('Attempting login for:', email)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      console.error('Auth Error:', authError.message)
      setError(authError.message === 'Invalid login credentials'
        ? 'Invalid email or password. Please check your credentials.'
        : authError.message)
      setLoading(false)
    } else if (data?.user) {
      console.log('User authenticated:', data.user.id)
      // Navigation happens via useEffect in AuthContext/Login once adminRecord is fetched
    }
  }

  const handleSignUp = async () => {
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) setError(signUpError.message)
    else alert('Signup successful! Now please run the SQL script to grant yourself Admin access.')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">
            <GraduationCap size={40} color="white" />
          </div>
          <h1>Northex–UpBold</h1>
          <p>LMS Admin Portal</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@northex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <LogIn size={20} />}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
            <p style={{ color: '#64748b' }}>First time? <button type="button" onClick={handleSignUp} style={{ background: 'none', border: 'none', color: '#006dff', fontWeight: 600, cursor: 'pointer' }}>Create Account</button></p>
          </div>
        </form>
      </div>

      <style>{`
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #006dff, #0046a3);
          padding: 1.5rem;
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .login-card {
          background: white;
          padding: 4rem;
          border-radius: 32px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 480px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .logo-circle {
          width: 90px;
          height: 90px;
          background: #006dff;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 15px 30px rgba(0, 109, 255, 0.2);
          transform: rotate(-5deg);
        }

        .login-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.04em;
        }

        .login-header p {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-group label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
          font-size: 1rem;
          font-weight: 500;
        }

        .form-group input:focus {
          border-color: #006dff;
          box-shadow: 0 0 0 4px rgba(0, 109, 255, 0.1);
        }

        .login-btn {
          width: 100%;
          margin-top: 1.5rem;
          height: 3.5rem;
          font-size: 1.125rem;
          font-weight: 800;
          background: #006dff;
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .login-btn:hover { background: #0056cc; transform: translateY(-3px); box-shadow: 0 15px 25px -5px rgba(0, 109, 255, 0.4); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .error-alert {
          background: #fef2f2;
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9375rem;
          margin-bottom: 2rem;
          text-align: center;
          border: 1px solid #fee2e2;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default Login
