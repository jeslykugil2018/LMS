import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, Mail, Phone, MessageSquare, ExternalLink, ShieldCheck, FileText, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Support = () => {
  const { selectedCampusId } = useAuth()
  const navigate = useNavigate()
  const supportCategories = [
    {
      title: 'Technical Support',
      icon: HelpCircle,
      desc: 'Problems with student records, database sync, or login issues.',
      contact: 'support@northex.com',
      phone: '+1 (555) 012-3456'
    },
    {
      title: 'Billing & Finance',
      icon: ShieldCheck,
      desc: 'Questions regarding payment integrations, CSV exports, or tuition tracking.',
      contact: 'billing@northex.com',
      phone: '+1 (555) 012-7890'
    }
  ]

  const faqs = [
    {
      q: 'How do I add a new campus?',
      a: 'Go to the "Campuses" section in the sidebar. Only Super Admins have permission to add or remove campuses.'
    },
    {
      q: 'Can a Campus Admin see other campuses?',
      a: 'No. The system uses strict Row-Level Security (RLS). Campus Admins are locked to their assigned campus data.'
    },
    {
      q: 'How do I export payment data?',
      a: 'Navigate to the "Finance" section and click the "Export CSV" button at the top right.'
    }
  ]

  return (
    <div className="support-page">
      <div className="support-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">Get assistance with the Northex–UpBold LMS Admin Portal</p>
      </div>

      <div className="support-grid mt-8">
        <div className="support-main">
          <section className="support-section card">
            <h2>Contact System Administrators</h2>
            <div className="contact-cards">
              {supportCategories.map((cat, i) => (
                <div key={i} className="contact-card">
                  <div className="cat-icon">
                    <cat.icon size={24} color="var(--primary)" />
                  </div>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                  <div className="contact-links">
                    <a href={`mailto:${cat.contact}`} className="contact-link">
                      <Mail size={16} /> {cat.contact}
                    </a>
                    <a href={`tel:${cat.phone}`} className="contact-link">
                      <Phone size={16} /> {cat.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="faq-section mt-8 card">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="support-sidebar">
          <div className="quick-info card">
            <h3>Quick Links</h3>
            <ul className="quick-links">
              <li><a href="#"><FileText size={16} /> User Manual</a></li>
              <li><a href="#"><ExternalLink size={16} /> System Status</a></li>
              <li><a href="#"><MessageSquare size={16} /> Community Forum</a></li>
            </ul>
          </div>

          <div className="feedback-card card mt-4">
            <h3>Feedback</h3>
            <p>Help us improve the portal by sharing your thoughts.</p>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
              Send Feedback
            </button>
          </div>
        </aside>
      </div>

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
        .support-page { animation: fadeIn 0.4s ease-out; padding: 2rem 2rem 6rem; max-width: 1100px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .support-header { margin-bottom: 4rem; }
        .page-title { font-size: 3rem; font-weight: 800; color: #1e293b; letter-spacing: -0.04em; margin-bottom: 0.25rem; }
        .page-subtitle { color: #64748b; font-size: 1.125rem; font-weight: 500; }

        .support-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
          margin-top: 3rem;
        }

        .support-section { padding: 3rem; border-radius: 24px; }
        .support-section h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 2rem; letter-spacing: -0.01em; }

        .contact-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .contact-card {
          padding: 2rem;
          background: #f8fafc;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }
        .contact-card:hover { transform: translateY(-4px); border-color: #006dff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }

        .cat-icon {
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          color: #006dff;
        }

        .contact-card h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem; }
        .contact-card p { font-size: 0.9375rem; color: #64748b; font-weight: 500; line-height: 1.6; }

        .contact-links {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #006dff;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s;
        }
        .contact-link:hover { color: #0056cc; transform: translateX(4px); }

        .faq-section { padding: 3rem; border-radius: 24px; }
        .faq-section h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; letter-spacing: -0.01em; }
        
        .faq-list {
          margin-top: 1rem;
        }

        .faq-item {
          padding: 1.75rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .faq-item:last-child { border-bottom: none; }

        .faq-item h4 {
          margin-bottom: 0.75rem;
          color: #1e293b;
          font-size: 1.125rem;
          font-weight: 800;
        }

        .faq-item p {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.6;
        }

        .support-sidebar { display: flex; flex-direction: column; gap: 2rem; }
        
        .quick-info, .feedback-card { padding: 2.25rem; border-radius: 24px; }
        .quick-info h3, .feedback-card h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; letter-spacing: -0.01em; }

        .quick-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .quick-links li {
          margin-bottom: 1rem;
        }

        .quick-links a {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #475569;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 600;
        }

        .quick-links a:hover { color: #006dff; transform: translateX(6px); }

        .feedback-card p { color: #64748b; font-size: 0.9375rem; font-weight: 500; line-height: 1.6; }

        .btn-outline {
          width: 100%;
          margin-top: 1.5rem;
          padding: 1rem;
          background: white;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-outline:hover { background: #f8fafc; border-color: #006dff; color: #006dff; transform: translateY(-3px); }

        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 3rem; }

        @media (max-width: 1024px) {
          .support-grid { grid-template-columns: 1fr; }
          .contact-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default Support
