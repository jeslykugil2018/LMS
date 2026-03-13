import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpenCheck,
  Sparkles,
  Users,
  Calculator,
  Globe,
  Layers
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-short-premium">
      {/* Dynamic Background */}
      <div className="ambient-background">
        <div className="blob blob-s1"></div>
        <div className="blob blob-s2"></div>
      </div>

      {/* Hero Section - Condensed */}
      <section className={`hero-short ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <div className="trusted-badge-v4">
            <ShieldCheck size={14} />
            <span>Institutional-Grade Management</span>
          </div>
          <h1>
            Empowering <span className="blue-gradient">Academic Excellence</span>
          </h1>
          <p className="hero-subtext">
            The unified administration portal for <strong>Northex & UpBold</strong>.
            Streamlined oversight, automated workflows, and multi-campus governance in one premium interface.
          </p>
          <div className="button-group">
            <button onClick={() => navigate('/login')} className="btn-v4 btn-primary-v4">
              Enter Admin Portal <ArrowRight size={20} />
            </button>
            <button className="btn-v4 btn-glass-v4">
              System Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Core Capabilities - Simplified */}
      <section className="capabilities-short">
        <div className="capabilities-grid-s">
          {capabilityData.map((item, idx) => (
            <div key={idx} className="cap-card-s">
              <div className={`cap-icon-s ${item.color}`}>
                {item.icon}
              </div>
              <div className="cap-info-s">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="footer-short">
        <div className="footer-content-s">
          <div className="brand-minimal">
            <div className="logo-s">L</div>
            <span>LMS Institutional</span>
          </div>
          <div className="footer-links-s">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Admin Support</a>
            <span className="dot"></span>
            <span className="copy">&copy; {new Date().getFullYear()} LMS Core v2.1.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@700;900&display=swap');

        :root {
          --s-primary: #0052ff;
          --s-bg: #ffffff;
          --s-text: #0f172a;
          --s-text-muted: #64748b;
          --s-border: #f1f5f9;
        }

        .landing-short-premium {
          background: var(--s-bg);
          color: var(--s-text);
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient background */
        .ambient-background {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 0; pointer-events: none; opacity: 0.5;
        }
        .blob {
          position: absolute; border-radius: 50%; filter: blur(100px);
          animation: floatS 20s infinite alternate ease-in-out;
        }
        .blob-s1 { width: 600px; height: 600px; background: rgba(0, 82, 255, 0.1); top: -100px; right: -100px; }
        .blob-s2 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.08); bottom: -100px; left: -100px; animation-delay: -5s; }
        
        @keyframes floatS {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 80px) scale(1.1); }
        }

        .fade-in { animation: fadeInS 0.8s forwards; }
        @keyframes fadeInS { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Hero Condensed */
        .hero-short {
          padding: 8rem 5% 4rem;
          text-align: center;
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-content { max-width: 840px; }

        .trusted-badge-v4 {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #f0f7ff; color: var(--s-primary);
          padding: 0.6rem 1.2rem; border-radius: 100px;
          font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; margin-bottom: 2rem;
        }

        .hero-content h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 3rem; font-weight: 900; line-height: 1.1; 
          letter-spacing: -0.04em; margin-bottom: 1.5rem;
        }
        .blue-gradient {
            background: linear-gradient(90deg, #0052ff, #6366f1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.1rem; line-height: 1.6; color: var(--s-text-muted);
          margin-bottom: 3rem;
        }

        /* Buttons */
        .button-group { display: flex; gap: 1.25rem; justify-content: center; }
        .btn-v4 {
          padding: 1.1rem 2.25rem; border-radius: 14px; font-weight: 700;
          font-size: 1.05rem; cursor: pointer; border: none;
          display: flex; align-items: center; gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary-v4 {
          background: var(--s-primary); color: white;
          box-shadow: 0 10px 25px rgba(0, 82, 255, 0.2);
        }
        .btn-primary-v4:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0, 82, 255, 0.3); }
        
        .btn-glass-v4 {
          background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px);
          border: 1px solid var(--s-border); color: var(--s-text);
        }
        .btn-glass-v4:hover { background: white; border-color: var(--s-primary); }

        /* Capabilities Grid Short */
        .capabilities-short {
          padding: 4rem 5%;
          position: relative; z-index: 10;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--s-border);
        }
        .capabilities-grid-s {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .cap-card-s {
          display: flex; gap: 1.5rem; align-items: flex-start;
          padding: 2rem; border-radius: 20px;
          transition: background 0.3s;
        }
        .cap-card-s:hover { background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .cap-icon-s {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cap-icon-s.blue { background: #eff6ff; color: #3b82f6; }
        .cap-icon-s.indigo { background: #eef2ff; color: #6366f1; }
        .cap-icon-s.emerald { background: #ecfdf5; color: #10b981; }
        .cap-icon-s.violet { background: #f5f3ff; color: #8b5cf6; }

        .cap-info-s h3 { font-size: 1.15rem; font-weight: 800; margin-bottom: 0.5rem; }
        .cap-info-s p { font-size: 0.95rem; color: var(--s-text-muted); line-height: 1.5; }

        /* Footer Short */
        .footer-short {
          padding: 3rem 5%;
          position: relative; z-index: 10;
          border-top: 1px solid var(--s-border);
        }
        .footer-content-s {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
        }
        .brand-minimal { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-size: 1rem; }
        .logo-s {
          width: 32px; height: 32px; background: var(--s-primary); color: white;
          display: flex; align-items: center; justify-content: center; border-radius: 8px;
          font-size: 1rem;
        }
        .footer-links-s {
          display: flex; align-items: center; gap: 1.5rem;
          font-size: 0.9rem; font-weight: 600; color: var(--s-text-muted);
        }
        .footer-links-s a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .footer-links-s a:hover { color: var(--s-primary); }
        .dot { width: 4px; height: 4px; border-radius: 50%; background: #cbd5e1; }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.75rem; }
          .button-group { flex-direction: column; }
          .footer-content-s { flex-direction: column; gap: 2rem; text-align: center; }
        }
      `}</style>
    </div>
  );
};

const capabilityData = [
  {
    icon: <Users size={22} />,
    title: 'Student Core',
    desc: '360° visibility into the lifecycle across campuses.',
    color: 'blue'
  },
  {
    icon: <Calculator size={22} />,
    title: 'Financial Ledger',
    desc: 'Automated fee generation and reconciliation.',
    color: 'emerald'
  },
  {
    icon: <Layers size={22} />,
    title: 'Admin Hierarchy',
    desc: 'Granular authority delegation with audit trails.',
    color: 'violet'
  },
  {
    icon: <Globe size={22} />,
    title: 'Hybrid Network',
    desc: 'Bridging physical and digital resources.',
    color: 'indigo'
  }
];

export default Landing;
