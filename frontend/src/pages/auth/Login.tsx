import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

// ─── CAPTCHA helpers ─────────────────────────────────────────────────────────
type CaptchaChallenge = { question: string; answer: number };

const ops = [
  { sym: '+', fn: (a: number, b: number) => a + b },
  { sym: '−', fn: (a: number, b: number) => a - b },
  { sym: '×', fn: (a: number, b: number) => a * b },
];

function newChallenge(): CaptchaChallenge {
  const op  = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 9) + 1;   // 1–9
  let b = Math.floor(Math.random() * 9) + 1;   // 1–9
  if (op.sym === '−' && b > a) [a, b] = [b, a]; // keep positive
  return { question: `${a} ${op.sym} ${b}`, answer: op.fn(a, b) };
}

// ─── Tiny canvas CAPTCHA renderer ────────────────────────────────────────────
function CaptchaCanvas({ challenge }: { challenge: CaptchaChallenge }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.lineTo(Math.random() * W, Math.random() * H);
      ctx.strokeStyle = `rgba(${60 + Math.random() * 80},${80 + Math.random() * 80},${180 + Math.random() * 60},0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,120,220,${0.2 + Math.random() * 0.3})`;
      ctx.fill();
    }

    // Render each character with slight skew
    const text = challenge.question;
    ctx.textBaseline = 'middle';
    const charW = (W - 20) / text.length;
    text.split('').forEach((ch, i) => {
      ctx.save();
      const x = 10 + i * charW + charW / 2;
      const y = H / 2 + (Math.random() * 6 - 3);
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.font = `bold ${18 + Math.random() * 4}px 'Courier New', monospace`;
      ctx.fillStyle = `hsl(${200 + Math.random() * 40}, 80%, ${70 + Math.random() * 20}%)`;
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [challenge]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={48}
      className="rounded-xl select-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// ─── Features for left panel ──────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: 'Ticket Management',
    desc:  'Create, track and resolve support tickets in real time.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Team Collaboration',
    desc:  'Assign tickets, add comments and work together seamlessly.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Insights & Analytics',
    desc:  'Monitor performance and resolution rates at a glance.',
  },
];

// ─── Google SVG logo ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const Login = () => {
  const { login } = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember,     setRemember]     = useState(false);

  // CAPTCHA state
  const [challenge,    setChallenge]    = useState<CaptchaChallenge>(newChallenge);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaOk,    setCaptchaOk]    = useState(false);

  // Google state
  const [googleLoading, setGoogleLoading] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setChallenge(newChallenge());
    setCaptchaInput('');
    setCaptchaError(false);
    setCaptchaOk(false);
  }, []);

  // Live-validate captcha
  const handleCaptchaChange = (val: string) => {
    setCaptchaInput(val);
    setCaptchaError(false);
    if (val !== '' && Number(val) === challenge.answer) {
      setCaptchaOk(true);
    } else {
      setCaptchaOk(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate captcha
    if (Number(captchaInput) !== challenge.answer) {
      setCaptchaError(true);
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid email or password. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    // Mock: auto-login as admin via Google
    // TODO: Replace with real Google OAuth redirect → backend /auth/google
    await new Promise(r => setTimeout(r, 1200));
    try {
      await login('admin@eullafied.com', 'Admin@123');
    } catch {
      setError('Google sign-in is not configured yet. Use email & password.');
      setGoogleLoading(false);
    }
  };

  const quickFill = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError('');
    setCaptchaError(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col lg:flex-row">

      {/* ══════════════════ LEFT PANEL ══════════════════ */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b4b] via-[#0f2d7a] to-[#1a3fa8]" />
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),
                              linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-blue-500/20  rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] bg-indigo-500/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-cyan-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Eullafied</span>
          </div>

          {/* Hero */}
          <div className="mt-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">Help Desk Platform</span>
            </div>
            <h1 className="text-white font-extrabold leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Streamline your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                IT support workflow
              </span>
            </h1>
            <p className="text-blue-100/70 leading-relaxed max-w-sm"
              style={{ fontSize: 'clamp(.9rem, 1.2vw, 1.05rem)' }}>
              One platform for your team to track, manage and resolve every support request — faster than ever.
            </p>
            <div className="mt-10 space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-blue-200 flex-shrink-0 backdrop-blur-sm">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{f.title}</p>
                    <p className="text-blue-200/60 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-8">
            {[['156+', 'Tickets Tracked'], ['12', 'Departments'], ['98%', 'Resolution Rate']].map(([v, l]) => (
              <div key={l}>
                <p className="text-white font-bold text-xl">{v}</p>
                <p className="text-blue-200/60 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════ RIGHT PANEL ══════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-base tracking-tight">Eullafied</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white/60 text-xs">Help Desk</span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[420px]">

            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2">Sign in to your account to continue</p>
            </div>

            {/* ── Google sign-in ── */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-800 text-sm font-semibold rounded-2xl transition-all duration-200 shadow-sm mb-5 group"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,.3), 0 0 0 1px rgba(0,0,0,.08)' }}
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-gray-600 font-medium px-1 uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Email address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    autoComplete="email" placeholder="you@eullafied.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40 transition-all text-sm" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    autoComplete="current-password" placeholder="••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ── CAPTCHA ── */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Security check
                </label>

                <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                  captchaError
                    ? 'bg-red-500/5 border-red-500/30'
                    : captchaOk
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-white/3 border-white/10'
                }`}>
                  {/* Canvas */}
                  <div className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10">
                    <CaptchaCanvas challenge={challenge} />
                  </div>

                  {/* Refresh */}
                  <button type="button" onClick={refreshCaptcha}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-all"
                    title="New challenge">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  {/* Input + status */}
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={captchaInput}
                      onChange={e => handleCaptchaChange(e.target.value)}
                      placeholder="= ?"
                      className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        captchaError
                          ? 'border-red-500/50 focus:ring-red-500/40'
                          : captchaOk
                          ? 'border-emerald-500/50 focus:ring-emerald-500/40'
                          : 'border-white/10 focus:ring-blue-500/60'
                      }`}
                    />
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
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Incorrect answer — a new challenge has been generated.
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={() => setRemember(!remember)} role="checkbox"
                  aria-checked={remember}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    remember ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-600 hover:border-gray-400'
                  }`}>
                  {remember && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-gray-400 select-none cursor-pointer" onClick={() => setRemember(!remember)}>
                  Keep me signed in
                </span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || googleLoading}
                className="relative w-full py-3.5 mt-1 rounded-2xl font-semibold text-sm text-white overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                style={{ background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 50%,#1e40af 100%)' }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px -5px rgba(37,99,235,.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 60%)' }} />
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
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
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-gray-600 font-medium px-1 uppercase tracking-wider">Demo credentials</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin',   email: 'admin@eullafied.com',      pass: 'Admin@123',   color: 'text-purple-400 border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/12' },
                { label: 'Manager', email: 'jane.smith@eullafied.com', pass: 'Manager@123', color: 'text-blue-400   border-blue-500/25   bg-blue-500/5   hover:bg-blue-500/12'   },
                { label: 'Staff',   email: 'john.doe@eullafied.com',   pass: 'Staff@123',   color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/12' },
              ].map(c => (
                <button key={c.label} type="button"
                  onClick={() => quickFill(c.email, c.pass)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${c.color}`}>
                  <span>{c.label}</span>
                  <span className="font-normal opacity-60 truncate w-full text-center">{c.email.split('@')[0]}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 text-center lg:text-left lg:px-12 xl:px-16">
          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} Eullafied Tech Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
