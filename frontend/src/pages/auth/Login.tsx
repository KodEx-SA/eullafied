import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

// ─── CAPTCHA helpers ──────────────────────────────────────────────────────────
type CaptchaChallenge = { question: string; answer: number };
const ops = [
  { sym: '+', fn: (a: number, b: number) => a + b },
  { sym: '−', fn: (a: number, b: number) => a - b },
  { sym: '×', fn: (a: number, b: number) => a * b },
];
function newChallenge(): CaptchaChallenge {
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 9) + 1;
  let b = Math.floor(Math.random() * 9) + 1;
  if (op.sym === '−' && b > a) [a, b] = [b, a];
  return { question: `${a} ${op.sym} ${b}`, answer: op.fn(a, b) };
}

function CaptchaCanvas({ challenge }: { challenge: CaptchaChallenge }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.lineTo(Math.random() * W, Math.random() * H);
      ctx.strokeStyle = `rgba(29,111,164,${0.3 + Math.random() * 0.3})`;
      ctx.lineWidth = 1; ctx.stroke();
    }
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(29,111,164,${0.2 + Math.random() * 0.3})`; ctx.fill();
    }
    const text = challenge.question;
    ctx.textBaseline = 'middle';
    const charW = (W - 20) / text.length;
    text.split('').forEach((ch, i) => {
      ctx.save();
      ctx.translate(10 + i * charW + charW / 2, H / 2 + (Math.random() * 6 - 3));
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.font = `bold ${18 + Math.random() * 4}px 'Courier New', monospace`;
      ctx.fillStyle = `hsl(${200 + Math.random() * 30}, 70%, ${70 + Math.random() * 20}%)`;
      ctx.fillText(ch, 0, 0); ctx.restore();
    });
  }, [challenge]);
  return <canvas ref={canvasRef} width={160} height={48} className="rounded-xl select-none" />;
}

// ─── ETS services shown on left panel ────────────────────────────────────────
const services = [
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
    title: 'ETS Repairs Division',
    desc: 'OS installs, virus removal, networking & hardware support.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    title: 'CSDI Programme',
    desc: 'Computer literacy for grade 4–12 learners across North West schools.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    title: 'Digital Marketing',
    desc: 'Website development, social media & digital presence for clients.',
  },
];

export const Login = () => {
  const { login } = useAuth();
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [challenge,    setChallenge]    = useState<CaptchaChallenge>(newChallenge);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaOk,    setCaptchaOk]    = useState(false);

  const refreshCaptcha = useCallback(() => {
    setChallenge(newChallenge()); setCaptchaInput(''); setCaptchaError(false); setCaptchaOk(false);
  }, []);

  const handleCaptchaChange = (val: string) => {
    setCaptchaInput(val); setCaptchaError(false);
    setCaptchaOk(val !== '' && Number(val) === challenge.answer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (Number(captchaInput) !== challenge.answer) { setCaptchaError(true); refreshCaptcha(); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid credentials. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (em: string, pw: string) => {
    setEmail(em); setPassword(pw); setError(''); setCaptchaError(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#070e1a' }}>

      {/* ══ LEFT PANEL ═══════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2044 40%, #0e3060 100%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),
                              linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'rgba(29,111,164,0.2)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ background: 'rgba(14,77,122,0.25)' }} />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* ETS Logomark */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/15"
              style={{ background: 'rgba(29,111,164,0.3)', backdropFilter: 'blur(8px)' }}>
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div>
              <span className="text-white font-extrabold text-lg tracking-tight leading-none">Eullafied</span>
              <p className="text-blue-300/60 text-xs font-medium">Tech Solutions</p>
            </div>
          </div>

          {/* Hero */}
          <div className="mt-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/10"
              style={{ background: 'rgba(29,111,164,0.2)', backdropFilter: 'blur(8px)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">Intern Workspace</span>
            </div>
            <h1 className="text-white font-extrabold leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Your ETS<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #60b4e8, #38bdf8)' }}>
                work hub
              </span>
            </h1>
            <p className="leading-relaxed max-w-sm" style={{ color: 'rgba(147,197,232,0.7)', fontSize: 'clamp(.9rem, 1.2vw, 1.05rem)' }}>
              One platform for ETS interns to log tasks, manage support tickets and track work across all divisions.
            </p>
            <div className="mt-10 space-y-4">
              {services.map((s) => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10"
                    style={{ background: 'rgba(29,111,164,0.2)', color: '#60b4e8' }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{s.title}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(147,197,232,0.5)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-3 border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {[['2015', 'Founded'], ['NW', 'Province'], ['Schools', 'Served']].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-bold text-xl">{v}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,232,0.5)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(29,111,164,0.4)' }}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <span className="text-white font-bold text-base">Eullafied Tech</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Intern Workspace</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-sm sm:text-base mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Sign in to your ETS Intern Workspace
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-red-500/20"
                style={{ background: 'rgba(239,68,68,0.08)' }}>
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Email address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    autoComplete="email" placeholder="you@eullafiedtechsolutions.co.za"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', '--tw-ring-color': 'rgba(29,111,164,0.5)' } as any} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    autoComplete="current-password" placeholder="••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security check
                </label>
                <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                  captchaError ? 'border-red-500/30' : captchaOk ? 'border-emerald-500/30' : 'border-white/10'
                }`} style={{ background: captchaError ? 'rgba(239,68,68,0.05)' : captchaOk ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)' }}>
                  <div className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10"><CaptchaCanvas challenge={challenge} /></div>
                  <button type="button" onClick={refreshCaptcha}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input type="number" inputMode="numeric" value={captchaInput}
                      onChange={e => handleCaptchaChange(e.target.value)} placeholder="= ?"
                      className={`w-full px-3 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${
                        captchaError ? 'border-red-500/50' : captchaOk ? 'border-emerald-500/50' : 'border-white/10'
                      }`}
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${captchaError ? 'rgba(239,68,68,0.5)' : captchaOk ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'}` }} />
                    {captchaOk && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {captchaError && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5 pl-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Incorrect — a new challenge has been generated.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="relative w-full py-3.5 mt-2 rounded-2xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                style={{ background: 'linear-gradient(135deg, #1d6fa4 0%, #0e4d7a 100%)' }}>
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</>
                  ) : (
                    <>Sign In
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Demo credentials */}
            <div className="flex items-center gap-3 mt-6 mb-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs font-medium px-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>ETS credentials</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Mr Maile',    sub: 'CEO / Admin',   email: 'htmaile@eullafiedtechsolutions.co.za',        pass: 'ETS@Admin2025',   style: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
                { label: 'Mr Kole',     sub: 'COO / Manager', email: 'neo.kole@eullafiedtechsolutions.co.za',       pass: 'ETS@Manager2025', style: 'rgba(29,111,164,0.08)',  border: 'rgba(29,111,164,0.3)',  text: '#60b4e8' },
                { label: 'Ashley',      sub: 'Intern / Dev',  email: 'ashley.koketso@eullafiedtechsolutions.co.za', pass: 'ETS@Intern2025',  style: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
              ].map(c => (
                <button key={c.label} type="button"
                  onClick={() => quickFill(c.email, c.pass)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: c.style, borderColor: c.border, color: c.text }}>
                  <span>{c.label}</span>
                  <span className="font-normal opacity-60 truncate w-full text-center text-[10px]">{c.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 text-center lg:text-left lg:px-12 xl:px-16">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Eullafied Tech Solutions (Pty) Ltd · Mosenthal Village, North West
          </p>
        </div>
      </div>
    </div>
  );
};
