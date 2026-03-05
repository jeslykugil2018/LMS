import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, Users, ShieldCheck, Globe } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">L</div>
          <span>LMS Portal</span>
        </div>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Admin Login
        </button>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">Next-Gen Learning Management</div>
          <h1>Empowering Education for <span className="text-gradient">Northex & UpBold</span></h1>
          <p>
            A unified solution for administrative excellence, financial transparency, and student success.
            Streamlining campus operations with modern technology.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="btn btn-outline btn-lg">View Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-wrapper">
            <img src="/landing-hero.png" alt="LMS Hero" className="hero-img" />
            <div className="floating-card c1">
              <Users size={24} className="icon-blue" />
              <div>
                <h4>5000+</h4>
                <p>Active Students</p>
              </div>
            </div>
            <div className="floating-card c2">
              <ShieldCheck size={24} className="icon-green" />
              <div>
                <h4>Secure</h4>
                <p>Data Protection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>99.9%</h3>
          <p>Uptime</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>2</h3>
          <p>Major Campuses</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Digitalized</p>
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules">
        <div className="section-header">
          <h2>Core Modules</h2>
          <p>Everything you need to manage your institution efficiently</p>
        </div>
        <div className="module-grid">
          <div className="module-card">
            <div className="m-icon icon-blue"><Users /></div>
            <h3>Student Management</h3>
            <p>Comprehensive student profiles, attendance tracking, and performance analytics.</p>
          </div>
          <div className="module-card">
            <div className="m-icon icon-green"><Calculator /></div>
            <h3>Fee & Finance</h3>
            <p>Automated invoicing, fee collection, and detailed financial reporting.</p>
          </div>
          <div className="module-card">
            <div className="m-icon icon-orange"><Globe /></div>
            <h3>Multi-Campus</h3>
            <p>Switch seamlessly between Northex and UpBold campus data in one portal.</p>
          </div>
          <div className="module-card">
            <div className="m-icon icon-purple"><BookOpen /></div>
            <h3>Academic Tools</h3>
            <p>Course management, gradebooks, and curriculum planning made simple.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner">
        <h2>Ready to transform your administration?</h2>
        <p>Join the future of campus management today.</p>
        <button onClick={() => navigate('/login')} className="btn btn-white btn-lg">
          Launch Portal <ArrowRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-icon">L</div>
              <span>LMS Portal</span>
            </div>
            <p>Simplifying education management for the modern era.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Campuses</h4>
              <a href="#">Northex Campus</a>
              <a href="#">UpBold Campus</a>
            </div>
            <div>
              <h4>Solutions</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Admin Panel</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Support Hub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Northex UpBold LMS. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .landing-container {
          background-color: #ffffff;
          color: #1e293b;
          overflow-x: hidden;
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid #f1f5f9;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-icon {
          background: var(--primary);
          color: white;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          padding: 6rem 5%;
          gap: 4rem;
          min-height: 80vh;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .hero h1 {
          font-size: 3.5rem;
          line-height: 1.2;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--primary), #00d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          font-size: 1.125rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          gap: 1.25rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.05rem;
          border-radius: 12px;
        }

        .hero-visual {
          position: relative;
        }

        .visual-wrapper {
          position: relative;
          z-index: 1;
        }

        .hero-img {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .floating-card {
          position: absolute;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          z-index: 2;
        }

        .floating-card h4 { margin: 0; font-size: 1.1rem; }
        .floating-card p { margin: 0; font-size: 0.85rem; }

        .c1 { top: 10%; left: -10%; }
        .c2 { bottom: 15%; right: -5%; }

        .icon-blue { color: var(--primary); }
        .icon-green { color: #10b981; }
        .icon-orange { color: #f59e0b; }
        .icon-purple { color: #8b5cf6; }

        .stats {
          display: flex;
          justify-content: space-between;
          padding: 4rem 10%;
          background: #f8fafc;
        }

        .stat-item { text-align: center; }
        .stat-item h3 { font-size: 2.5rem; font-weight: 800; color: var(--primary); }
        .stat-item p { color: var(--text-muted); font-weight: 500; }
        .stat-divider { width: 1px; background: #e2e8f0; height: 60px; }

        .modules {
          padding: 6rem 5%;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 { font-size: 2.5rem; font-weight: 800; }

        .module-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .module-card {
          padding: 2.5rem;
          background: white;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s;
        }

        .module-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.05);
          border-color: var(--primary-light);
        }

        .m-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          background: #f1f5f9;
        }

        .m-icon svg { width: 24px; height: 24px; }

        .cta-banner {
          margin: 6rem 5%;
          padding: 4rem;
          background: linear-gradient(135deg, var(--primary), #0056cc);
          border-radius: 32px;
          text-align: center;
          color: white;
        }

        .cta-banner h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
        .cta-banner p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2.5rem; }

        .btn-white { background: white; color: var(--primary); }
        .btn-white:hover { background: #f8fafc; transform: scale(1.05); }

        .landing-footer {
          padding: 4rem 5% 2rem;
          background: #0f172a;
          color: white;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4rem;
        }

        .footer-brand p { margin-top: 1rem; color: #94a3b8; max-width: 300px; }

        .footer-links {
          display: flex;
          gap: 4rem;
        }

        .footer-links h4 { margin-bottom: 1.5rem; font-size: 1.1rem; }
        .footer-links a { display: block; color: #94a3b8; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .footer-links a:hover { color: white; }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid #1e293b;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; text-align: center; }
          .hero h1 { font-size: 2.5rem; }
          .hero p { margin: 0 auto 2.5rem; }
          .hero-actions { justify-content: center; }
          .hero-visual { margin-top: 3rem; }
          .c1 { left: 0; }
        }

        @media (max-width: 768px) {
          .stats { flex-direction: column; gap: 2rem; }
          .stat-divider { display: none; }
          .footer-top { flex-direction: column; gap: 3rem; }
          .footer-links { flex-direction: column; gap: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
