import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Users,
  ShieldCheck,
  Globe,
  ChevronRight,
  Zap,
  Award,
  Layers
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-v2">
      {/* Dynamic Background */}
      <div className="ambient-background">
        <div className="blob blob-p1"></div>
        <div className="blob blob-p2"></div>
        <div className="blob blob-p3"></div>
      </div>

      {/* Floating Navigation */}
      <nav className={`nav-v2 ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">L</div>
            <span className="brand-text">LMS Portal</span>
          </div>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#campuses">Campuses</a>
            <a href="#about">Support</a>
          </div>

          <button onClick={() => navigate('/login')} className="btn-v2 btn-glow">
            <span>Admin Login</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </nav>

      {/* Hero V2 */}
      <section className="hero-v2">
        <div className="hero-grid">
          <div className="hero-content-v2">
            <div className="badge-v2">
              <Zap size={14} />
              <span>Version 2.0 Now Live</span>
            </div>
            <h1>
              Unified Management for <br />
              <span className="gradient-text">Northex & UpBold</span>
            </h1>
            <p>
              Experience the future of campus administration. A powerful, secure,
              and user-friendly platform designed to streamline academic excellence
              and institutional growth.
            </p>
            <div className="hero-btns">
              <button onClick={() => navigate('/login')} className="btn-v2 btn-primary-v2 btn-xl">
                Launch Portal <ArrowRight size={20} />
              </button>
              <button className="btn-v2 btn-glass btn-xl">Explore Features</button>
            </div>
          </div>

          <div className="hero-graphic">
            <div className="glass-frame">
              <img src="/landing-hero.png" alt="LMS Interface" className="main-graphic" />
              <div className="glass-card g1">
                <div className="g-icon blue"><Users size={20} /></div>
                <div>
                  <div className="g-label">Total Enrollment</div>
                  <div className="g-value">4,892</div>
                </div>
              </div>
              <div className="glass-card g2">
                <div className="g-icon green"><Award size={20} /></div>
                <div>
                  <div className="g-label">Success Rate</div>
                  <div className="g-value">98.4%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-v2">
        <div className="section-head">
          <h2>Engineered for Excellence</h2>
          <p>Everything you need to manage your campus, reimagined with glassmorphism.</p>
        </div>

        <div className="card-grid-v2">
          {featureData.map((feature, idx) => (
            <div key={idx} className="glass-feature-card">
              <div className={`f-icon-v2 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className="f-hover-hint">Learn more <ChevronRight size={14} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Switcher Preview */}
      <section id="campuses" className="campus-v2">
        <div className="campus-split">
          <div className="campus-box northex">
            <div className="box-content">
              <h3>Northex Campus</h3>
              <p>Primary Academic Hub</p>
              <button className="btn-v2 btn-simple">View Stats</button>
            </div>
          </div>
          <div className="campus-box upbold">
            <div className="box-content">
              <h3>UpBold Campus</h3>
              <p>Creative & Technical Center</p>
              <button className="btn-v2 btn-simple">View Stats</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-glass">
          <h2>Ready to get started?</h2>
          <p>Join hundreds of administrators managing Northex and UpBold.</p>
          <button onClick={() => navigate('/login')} className="btn-v2 btn-white-v2 btn-xl">
            Get Admin Access <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer V2 */}
      <footer className="footer-v2">
        <div className="foot-main">
          <div className="foot-brand">
            <div className="brand-logo">L</div>
            <span className="brand-text">LMS Portal</span>
            <p>Empowering the next generation of campus leaders.</p>
          </div>
          <div className="foot-links-grid">
            <div className="link-col">
              <h4>Platform</h4>
              <a href="#">Security</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
            <div className="link-col">
              <h4>Support</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Help Center</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <p>&copy; {new Date().getFullYear()} Northex UpBold LMS. Built for excellence.</p>
        </div>
      </footer>

      <style>{`
        :root {
          --v2-primary: #006aff;
          --v2-primary-glow: rgba(0, 106, 255, 0.4);
          --v2-text: #0f172a;
          --v2-text-muted: #64748b;
          --v2-glass: rgba(255, 255, 255, 0.7);
          --v2-border: rgba(255, 255, 255, 0.5);
        }

        .landing-v2 {
          background: #f8fafc;
          color: var(--v2-text);
          position: relative;
          min-height: 100vh;
          font-family: 'Montserrat', sans-serif;
          overflow-x: hidden;
        }

        /* Ambient Blobs */
        .ambient-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .blob {
          position: absolute;
          filter: blur(100px);
          opacity: 0.15;
          border-radius: 50%;
          animation: float 20s infinite alternate;
        }
        .blob-p1 { width: 600px; height: 600px; background: #006aff; top: -100px; right: -100px; }
        .blob-p2 { width: 500px; height: 500px; background: #8b5cf6; bottom: -100px; left: -100px; animation-delay: -5s; }
        .blob-p3 { width: 400px; height: 400px; background: #00d2ff; top: 40%; left: 30%; animation-delay: -10s; }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(50px, 100px) rotate(10deg); }
        }

        /* Nav V2 */
        .nav-v2 {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1200px;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0.75rem 1.5rem;
          border-radius: 20px;
        }
        .nav-scrolled {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border: 1px solid var(--v2-border);
          top: 1rem;
        }
        .nav-container { display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { display: flex; align-items: center; gap: 0.75rem; }
        .brand-logo { 
          background: var(--v2-primary); color: white; width: 36px; height: 36px; 
          display: flex; align-items: center; justify-content: center; border-radius: 10px; font-weight: 800;
          box-shadow: 0 4px 10px var(--v2-primary-glow);
        }
        .brand-text { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; }
        
        .nav-links { display: flex; gap: 2.5rem; }
        .nav-links a { font-weight: 600; color: var(--v2-text-muted); transition: color 0.2s; font-size: 0.95rem; }
        .nav-links a:hover { color: var(--v2-primary); }

        /* Buttons V2 */
        .btn-v2 {
          padding: 0.8rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
        }
        .btn-glow { background: var(--v2-primary); color: white; box-shadow: 0 8px 20px var(--v2-primary-glow); }
        .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 12px 25px var(--v2-primary-glow); }
        
        .btn-primary-v2 { background: var(--v2-primary); color: white; }
        .btn-glass { background: rgba(0, 106, 255, 0.05); color: var(--v2-primary); border: 1.5px solid rgba(0, 106, 255, 0.1); }
        .btn-glass:hover { background: rgba(0, 106, 255, 0.1); }
        
        .btn-xl { padding: 1.25rem 2.5rem; font-size: 1.1rem; border-radius: 18px; }
        .btn-white-v2 { background: white; color: var(--v2-primary); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        
        .btn-simple { background: white; border: 1px solid #e2e8f0; color: #64748b; font-size: 0.85rem; padding: 0.5rem 1rem; }

        /* Hero V2 */
        .hero-v2 { position: relative; z-index: 1; padding: 12rem 5% 6rem; }
        .hero-grid { 
          display: grid; grid-template-columns: 1fr 1fr; align-items: center; 
          gap: 4rem; max-width: 1400px; margin: 0 auto; 
        }
        
        .badge-v2 {
          display: inline-flex; align-items: center; gap: 0.5rem; 
          background: white; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; 
          border-radius: 100px; font-weight: 700; font-size: 0.8rem; color: var(--v2-primary);
          margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        
        .hero-content-v2 h1 { font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.04em; }
        .gradient-text { background: linear-gradient(90deg, #006aff, #00d2ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-content-v2 p { font-size: 1.2rem; line-height: 1.6; color: var(--v2-text-muted); margin-bottom: 3rem; max-width: 550px; font-weight: 500; }
        .hero-btns { display: flex; gap: 1.5rem; }

        .hero-graphic { position: relative; }
        .glass-frame {
          background: var(--v2-glass); backdrop-filter: blur(20px); border: 2px solid var(--v2-border);
          border-radius: 32px; padding: 1rem; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1);
        }
        .main-graphic { width: 100%; border-radius: 20px; display: block; }
        
        .glass-card {
          position: absolute; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
          border: 1px solid var(--v2-border); padding: 1.25rem; border-radius: 20px;
          display: flex; align-items: center; gap: 1rem; box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          z-index: 2; animation: floatY 4s infinite alternate ease-in-out;
        }
        @keyframes floatY { from { transform: translateY(0); } to { transform: translateY(-15px); } }
        
        .g-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .g-icon.blue { background: rgba(0, 106, 255, 0.1); color: #006aff; }
        .g-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .g-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .g-value { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        
        .g1 { top: 20%; left: -10%; animation-delay: -1s; }
        .g2 { bottom: 15%; right: -5%; animation-delay: -3s; }

        /* Features V2 */
        .features-v2 { padding: 8rem 5%; position: relative; z-index: 1; }
        .section-head { text-align: center; margin-bottom: 5rem; }
        .section-head h2 { font-size: 3rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 1rem; }
        .section-head p { font-size: 1.15rem; color: var(--v2-text-muted); font-weight: 500; }
        
        .card-grid-v2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; max-width: 1400px; margin: 0 auto; }
        .glass-feature-card {
          background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); border: 1.5px solid var(--v2-border);
          padding: 3.5rem 2.5rem; border-radius: 28px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative; overflow: hidden;
        }
        .glass-feature-card:hover {
          background: white; border-color: var(--v2-primary); transform: translateY(-10px);
          box-shadow: 0 30px 60px -15px rgba(0, 106, 255, 0.08);
        }
        .f-icon-v2 { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .f-icon-v2 svg { width: 28px; height: 28px; }
        .f-icon-v2.blue { background: rgba(0, 106, 255, 0.1); color: #006aff; }
        .f-icon-v2.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .f-icon-v2.orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .f-icon-v2.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        
        .glass-feature-card h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; }
        .glass-feature-card p { color: var(--v2-text-muted); line-height: 1.6; font-weight: 500; margin-bottom: 2rem; }
        .f-hover-hint { display: flex; align-items: center; gap: 0.4rem; color: var(--v2-primary); font-weight: 700; font-size: 0.9rem; opacity: 0; transform: translateX(-10px); transition: all 0.3s; }
        .glass-feature-card:hover .f-hover-hint { opacity: 1; transform: translateX(0); }

        /* Campus V2 */
        .campus-v2 { padding: 4rem 5%; }
        .campus-split { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; max-width: 1400px; margin: 0 auto; }
        .campus-box { 
          height: 400px; border-radius: 32px; padding: 3rem; display: flex; align-items: flex-end;
          background-size: cover; background-position: center; position: relative; overflow: hidden;
          transition: transform 0.4s;
        }
        .campus-box:hover { transform: scale(1.02); }
        .campus-box::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(15,23,42,0.8), transparent); }
        .northex { background-image: url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000'); }
        .upbold { background-image: url('https://images.unsplash.com/photo-1523050853063-bd8012fec0c8?auto=format&fit=crop&q=80&w=1000'); }
        .box-content { position: relative; z-index: 2; color: white; }
        .box-content h3 { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; }
        .box-content p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 1.5rem; }

        /* CTA V2 */
        .final-cta { padding: 8rem 5%; text-align: center; }
        .cta-glass {
          background: linear-gradient(135deg, rgba(0, 106, 255, 0.9), rgba(0, 210, 255, 0.9));
          backdrop-filter: blur(10px); color: white; border-radius: 40px; padding: 5rem 2rem;
          max-width: 1000px; margin: 0 auto; box-shadow: 0 40px 80px -20px var(--v2-primary-glow);
        }
        .cta-glass h2 { font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.03em; }
        .cta-glass p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 3rem; font-weight: 500; }

        /* Footer V2 */
        .footer-v2 { background: #0f172a; color: white; padding: 6rem 5% 3rem; position: relative; z-index: 1; }
        .foot-main { display: flex; justify-content: space-between; max-width: 1400px; margin: 0 auto 5rem; }
        .foot-brand p { margin-top: 1.5rem; color: #94a3b8; max-width: 320px; font-weight: 500; }
        .foot-links-grid { display: flex; gap: 6rem; }
        .link-col h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
        .link-col a { display: block; color: #94a3b8; margin-bottom: 0.8rem; font-weight: 500; transition: color 0.2s; }
        .link-col a:hover { color: white; }
        .foot-bottom { border-top: 1px solid #1e293b; padding-top: 2rem; text-align: center; color: #475569; font-size: 0.9rem; font-weight: 600; }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; text-align: center; }
          .hero-content-v2 h1 { font-size: 3.25rem; }
          .hero-content-v2 p { margin: 0 auto 3rem; }
          .hero-btns { justify-content: center; }
          .hero-graphic { margin-top: 4rem; }
          .g1 { left: 0; }
          .campus-split { grid-template-columns: 1fr; }
          .foot-main { flex-direction: column; gap: 4rem; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero-v2 { padding-top: 8rem; }
          .hero-content-v2 h1 { font-size: 2.75rem; }
          .cta-glass h2 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

const featureData = [
  {
    icon: <Users />,
    title: 'Student Core',
    desc: '360-degree views of student life, from enrollment to graduation with real-time analytics.',
    color: 'blue'
  },
  {
    icon: <Calculator />,
    title: 'Financial Cloud',
    desc: 'Automate complex fee structures, generate smart invoices, and monitor campus health.',
    color: 'green'
  },
  {
    icon: <Globe />,
    title: 'Hybrid Presence',
    desc: 'Manage physical and digital campus assets across Northex and UpBold in one unified dashboard.',
    color: 'orange'
  },
  {
    icon: <Layers />,
    title: 'Smart Admin',
    desc: 'Delegated authority with multi-level permissions and automated compliance tracking.',
    color: 'purple'
  }
];

export default Landing;
