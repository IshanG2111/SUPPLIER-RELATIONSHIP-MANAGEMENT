import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Network, BarChart2 } from 'lucide-react';
import { GlobeGraphic } from './AnimatedAuthSVGs';
import './LoginPage.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError(''); setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setIsSent(true); }, 1000);
  }

  return (
    <div className="auth-page">
      <div className="auth-frame">

        {/* LEFT PANEL — Globe */}
        <div className="auth-hero">
          <div className="auth-hero__glow-bottom" />
          <GlobeGraphic />
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-panel">

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 400, margin: '0 auto', width: '100%' }}>
            <div className="auth-step-wrapper auth-step-wrapper--visible">

              {/* Back link */}
              <Link to="/login" style={{
                display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:600,
                color:'#94a3b8', textDecoration:'none', marginBottom:'28px', textTransform:'uppercase',
                letterSpacing:'0.08em', transition:'color .2s', width: 'fit-content'
              }}
                onMouseEnter={e=>e.currentTarget.style.color='#0f172a'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                <ArrowLeft size={14} /> Back to login
              </Link>

              {!isSent ? (<>
                <h2 className="auth-panel__heading">Reset password</h2>
                <p className="auth-panel__sub">Enter your email and we'll send reset instructions.</p>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:'#475569', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Email</label>
                    <div className="auth-input-wrap" style={{ borderColor: error ? '#ef4444' : '' }}>
                      <Mail size={16} className="auth-input-wrap__icon" />
                      <input type="email" className="auth-input" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
                    </div>
                    {error && <span className="auth-field__error">{error}</span>}
                  </div>
                  <button type="submit" className="auth-submit" disabled={isLoading}>
                    {isLoading ? <span className="auth-spinner"/> : <>Send instructions <ArrowRight size={15}/></>}
                  </button>
                </form>
              </>) : (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(37,99,235,0.06)', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                    <Mail size={24} />
                  </div>
                  <h2 className="auth-panel__heading" style={{ textAlign:'center' }}>Check your email</h2>
                  <p className="auth-panel__sub" style={{ textAlign:'center' }}>We've sent reset instructions to <strong>{email}</strong>.</p>
                  <button type="button" className="auth-submit" onClick={()=>setIsSent(false)} style={{ marginTop:20, background:'#fff', color:'#0f172a', border:'1px solid #e2e8f0', boxShadow:'0 1px 2px rgba(0,0,0,0.04)' }}>
                    Resend email
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Features */}
          <div className="auth-footer-features">
            <div className="auth-footer-feature"><ShieldCheck /><div className="auth-footer-feature__text"><strong>Secure & Compliant</strong><span>Enterprise grade</span></div></div>
            <div className="auth-footer-feature"><Network /><div className="auth-footer-feature__text"><strong>Connected Globally</strong><span>Partners worldwide</span></div></div>
            <div className="auth-footer-feature"><BarChart2 /><div className="auth-footer-feature__text"><strong>Data Driven</strong><span>Smart decisions</span></div></div>
          </div>

        </div>
      </div>
    </div>
  );
}
