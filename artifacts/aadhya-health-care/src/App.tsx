import { useEffect, useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bed,
  Check,
  Clock3,
  HeartHandshake,
  HeartPulse,
  Hospital,
  LockKeyhole,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
 import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import './index.css';

const queryClient = new QueryClient();
const APPOINTMENTS_KEY = 'aadhya-healthcare-appointments';
const ADMIN_SESSION_KEY = 'aadhya-healthcare-admin-session';
const ADMIN_ID = 'admin@aadhyahospital.in';
const ADMIN_PASSWORD = 'Aadhya@2025!';

type AppointmentRecord = {
  id: string;
  name: string;
  phone: string;
  department: string;
  date: string;
  message: string;
  submittedAt: string;
};

const services = [
  { slug: 'general-medicine', title: 'General Medicine', copy: 'Thoughtful care for everyday health, chronic conditions, and the questions in between.', icon: Stethoscope, detail: 'Personalised primary care for everyday concerns, long-term conditions, preventive screenings, and the questions that do not always fit neatly into one diagnosis.', highlights: ['Routine health checks', 'Diabetes and blood pressure care', 'Preventive screening guidance'] },
  { slug: 'cardiology', title: 'Cardiology', copy: 'Heart care built around early answers, advanced diagnostics, and lasting confidence.', icon: HeartPulse, detail: 'A calm, coordinated approach to heart health with experienced specialists, clear explanations, and diagnostics that help you make decisions with confidence.', highlights: ['Heart health assessments', 'ECG and diagnostic support', 'Preventive cardiac care'] },
  { slug: 'orthopaedics', title: 'Orthopaedics', copy: 'Move with less pain through expert bone, joint, spine, and rehabilitation care.', icon: Bed, detail: 'From an everyday injury to ongoing joint or spine discomfort, our orthopaedic team helps you move forward with thoughtful evaluation and practical recovery plans.', highlights: ['Bone and joint consultations', 'Spine and sports injury care', 'Rehabilitation guidance'] },
  { slug: 'paediatrics', title: 'Paediatrics', copy: 'Gentle, reassuring care for growing bodies, from the first check-up onward.', icon: Baby, detail: 'Warm, age-appropriate care for children and growing families, with room for every question from first check-ups through adolescence.', highlights: ['Child wellness visits', 'Newborn and infant care', 'Growth and development support'] },
  { slug: 'womens-health', title: 'Women’s Health', copy: 'A private, supportive space for complete health across every life stage.', icon: HeartHandshake, detail: 'Respectful, private support for women through changing health needs, with clear guidance and a team that listens without rushing.', highlights: ['Women’s wellness consultations', 'Preventive screenings', 'Life-stage health guidance'] },
  { slug: 'emergency-care', title: 'Emergency Care', copy: 'A calm, capable team available around the clock when every minute matters.', icon: Syringe, detail: 'Round-the-clock emergency support for urgent needs, with a calm first response and connected hospital care when every minute matters.', highlights: ['24/7 emergency response', 'Urgent assessment and triage', 'Connected diagnostics and care'] },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><MapPin size={13} /> 8-2-277, Airsft Colony, Naigaon</span>
          <div className="topbar-right">
            <a href="tel:+917337335096"><Phone size={13} /> +91 73373 35096</a>
          </div>
        </div>
      </div>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand" onClick={closeMenu} aria-label="Aadhya Health Care and Greenlands Hospital home">
            <span className="brand-mark">A</span>
            <span className="brand-copy"><strong>AADHYA HEALTH CARE</strong><small>GREENLANDS HOSPITAL</small></span>
          </Link>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            <a href="/#about" onClick={closeMenu}>About us</a>
            <a href="/#services" onClick={closeMenu}>Specialities</a>
            <a href="/#stories" onClick={closeMenu}>Patient stories</a>
            <a href="/#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-outline" href="tel:+917337335096"><Phone size={15} /> Call us</a>
            <Link className="btn btn-primary" href="/appointment" onClick={closeMenu}>Book appointment <ArrowRight size={15} /></Link>
            <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function TrustStrip() {
  const items = [
    { icon: Clock3, title: '24/7 emergency care', copy: 'Here when you need us' },
    { icon: UsersRound, title: 'Senior specialists', copy: 'Experienced clinical teams' },
    { icon: ShieldCheck, title: 'Insurance support', copy: 'Cashless care made simple' },
    { icon: Hospital, title: 'One connected hospital', copy: 'Everything under one roof' },
  ];
  return <section className="trust-strip"><div className="container trust-grid">{items.map(({ icon: Icon, title, copy }) => <div className="trust-item" key={title}><Icon size={23} /><div><strong>{title}</strong><span>{copy}</span></div></div>)}</div></section>;
}

function BookingForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', phone: '', department: '', date: '', message: '' });
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) nextErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!form.department) nextErrors.department = 'Choose a department';
    if (!form.date) nextErrors.date = 'Choose a preferred date';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      const newRecord: AppointmentRecord = {
        id: `REQ-${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
        department: form.department,
        date: form.date,
        message: form.message.trim(),
        submittedAt: new Date().toISOString(),
      };
      const saved = localStorage.getItem(APPOINTMENTS_KEY);
      const existing: AppointmentRecord[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([newRecord, ...existing]));
      setSubmitted(true);
    }
  };
  if (submitted) {
    return <div className="confirmation"><div className="confirmation-mark"><Check size={31} strokeWidth={3} /></div><h3>Request received</h3><p>Thank you, {form.name.split(' ')[0] || 'there'}. Our care coordinator will call you on <strong>{form.phone}</strong> shortly to confirm your visit.</p><button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', department: '', date: '', message: '' }); }}>Book another visit</button></div>;
  }
  return <form className="booking-form" onSubmit={submit} noValidate>
    <div className="field"><label htmlFor={compact ? 'compact-name' : 'name'}>Your full name</label><input id={compact ? 'compact-name' : 'name'} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ananya Sharma" />{errors.name && <span className="field-error">{errors.name}</span>}</div>
    <div className="field"><label htmlFor={compact ? 'compact-phone' : 'phone'}>Mobile number</label><input id={compact ? 'compact-phone' : 'phone'} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
    <div className="field"><label htmlFor={compact ? 'compact-department' : 'department'}>Care department</label><select id={compact ? 'compact-department' : 'department'} value={form.department} onChange={(e) => update('department', e.target.value)}><option value="">Select a department</option>{services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select>{errors.department && <span className="field-error">{errors.department}</span>}</div>
    <div className="field"><label htmlFor={compact ? 'compact-date' : 'date'}>Preferred date</label><input id={compact ? 'compact-date' : 'date'} type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => update('date', e.target.value)} />{errors.date && <span className="field-error">{errors.date}</span>}</div>
    {!compact && <div className="field full"><label htmlFor="message">Anything we should know? <span>(optional)</span></label><textarea id="message" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Share a little about what brings you in..." /></div>}
    <button className="btn btn-teal booking-submit" type="submit">Request my appointment <ArrowRight size={16} /></button>
    <p className="form-footnote">Your details are private and only used to arrange your care.</p>
  </form>;
}

function Hero() {
  return <section className="hero"><div className="container hero-grid">
    <div className="reveal">
      <span className="eyebrow">Care that comes closer</span>
      <h1>Good health begins with <em>feeling cared for.</em></h1>
       <p className="hero-lede">Aadhya Health Care and Greenlands Hospital brings experienced doctors, thoughtful teams, and modern treatment together — so your family can get back to what matters.</p>
       <div className="hero-ctas"><Link href="/appointment" className="btn btn-primary">Book a consultation <ArrowRight size={16} /></Link><a href="tel:+917337335096" className="btn btn-outline"><Phone size={16} /> Talk to a coordinator</a></div>
      <div className="hero-note"><ShieldCheck size={16} /> Trusted care for families across Naigaon and beyond</div>
    </div>
     <div className="hero-visual reveal delay-1"><img className="building-image" src="/aadhya-hospital-upload.jpg" alt="Aadhya Health Care and Greenlands Hospital exterior" /><div className="emergency-pill">24/7 <span>Emergency support</span></div><div className="visual-badge"><HeartPulse size={22} /><div><strong>20+</strong><span>specialities under one roof</span></div></div></div>
  </div></section>;
}

function Services() {
  return <section className="section section-tint" id="services"><div className="container"><div className="section-head"><div><div className="section-kicker">Care for every chapter</div><h2>Specialities that listen first.</h2></div><div><p className="section-intro">Explore the care areas available at Aadhya, then learn more about the support each team provides.</p><Link className="text-link" href="/specialities">Learn more <ArrowRight size={15} /></Link></div></div><div className="services-grid">{services.map(({ title, icon: Icon }, index) => <article className="service-card reveal" style={{ animationDelay: `${index * 70}ms` }} key={title}><div className="service-icon"><Icon size={22} /></div><h3>{title}</h3></article>)}</div></div></section>;
}

function InsurancePartners() {
  return <section className="insurance-image-section" id="insurance"><div className="container"><img src="/cashless-insurance-partners.jpg" alt="Cashless insurance partners" /></div></section>;
}

function Stories() {
  const stories = [{ quote: 'The doctors explained everything without rushing us. It made a difficult week feel manageable.', name: 'Nandita P.', detail: 'Patient family · Cardiology' }, { quote: 'From the first phone call to going home, every person we met was kind, clear, and genuinely present.', name: 'Rohan S.', detail: 'Patient · General Medicine' }];
  return <section className="section" id="stories"><div className="container"><div className="section-head"><div><div className="section-kicker">In their own words</div><h2>Care you can feel.</h2></div><p className="section-intro">Trust is built in small moments — a clear answer, an extra minute, a hand held when it matters.</p></div><div className="testimonials">{stories.map((story) => <article className="quote-card" key={story.name}><div className="stars">★★★★★</div><p>“{story.quote}”</p><footer><span className="quote-avatar">{story.name[0]}</span><div><strong>{story.name}</strong><small>{story.detail}</small></div></footer></article>)}</div></div></section>;
}

function SpecialitiesPage() {
  return <div className="appointment-page"><Header /><main className="specialty-page"><div className="container"><Link href="/" className="appointment-back"><ArrowLeft size={15} /> Back to Aadhya Health Care</Link><div className="section-head"><div><div className="section-kicker">Aadhya Health Care and Greenlands Hospital</div><h1>Our specialities.</h1></div><p className="section-intro">Find the right department for your next step.</p></div><div className="specialty-list">{services.map(({ title, detail, highlights, icon: Icon }) => <article className="specialty-detail-card" key={title}><div className="service-icon"><Icon size={22} /></div><div><h2>{title}</h2><p>{detail}</p><ul>{highlights.map((highlight) => <li key={highlight}><Check size={15} />{highlight}</li>)}</ul></div><Link className="btn btn-primary specialty-book" href="/appointment">Book appointment <ArrowRight size={15} /></Link></article>)}</div></div></main><Footer /></div>;
}

function AppointmentBand() {
  return <section className="appointment-band"><div className="container appointment-layout"><div className="appointment-copy"><div className="section-kicker">A simpler next step</div><h2>Let’s find the right care for you.</h2><p>Tell us what you need and our care coordinator will help you choose a department, doctor, and time that works for your family.</p><div className="support-card"><span className="support-icon"><Phone size={19} /></span><div><strong>Prefer to speak with someone?</strong><a href="tel:+917337335096">+91 73373 35096</a></div></div></div><div className="booking-card"><h3>Request an appointment</h3><p>A short form. A real person on the other side.</p><BookingForm compact /></div></div></section>;
}

function Contact() {
  return <section className="section" id="contact"><div className="container"><div className="contact-panel"><div><div className="section-kicker">We’re easy to find</div><h2>Come in. We’ll take it from here.</h2><p>Visit us at 8-2-277, Airsft Colony, Naigaon — or call for directions, appointment help, and emergency support.</p></div><div className="contact-actions"><a className="btn btn-primary" href="tel:+917337335096"><Phone size={16} /> Call the hospital</a></div></div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-grid"><div><Link href="/" className="brand"><span className="brand-mark">A</span><span className="brand-copy"><strong>AADHYA HEALTH CARE</strong><small>GREENLANDS HOSPITAL</small></span></Link><p>Modern multi-specialty care close to home.</p></div><div><h4>Explore</h4><ul><li><Link href="/specialities">Specialities</Link></li><li><a href="/#insurance">Insurance partners</a></li><li><a href="/#stories">Patient stories</a></li></ul></div><div><h4>Patients</h4><ul><li><Link href="/appointment">Book an appointment</Link></li><li><a href="tel:+917337335096">Emergency support</a></li><li><a href="/#contact">Find us</a></li></ul></div><div><h4>Get in touch</h4><div className="footer-contact"><MapPin size={15} />8-2-277, Airsft Colony,<br />Naigaon - 500891</div><div className="footer-contact"><Phone size={15} /><a href="tel:+917337335096">+91 73373 35096</a></div><div className="footer-admin-link"><LockKeyhole size={15} /><Link href="/admin">Admin portal</Link></div></div></div><div className="footer-bottom"><span>© 2025 Aadhya Health Care and Greenlands Hospital.</span><span>Privacy · Terms</span></div></div></footer>;
}

function Home() {
  return <div className="site-shell"><Header /><main><Hero /><TrustStrip /><Services /><InsurancePartners /><Stories /><AppointmentBand /><Contact /></main><Footer /></div>;
}

function AppointmentPage() {
  return <div className="appointment-page"><Header /><main className="appointment-hero"><div className="container"><Link href="/" className="appointment-back"><ArrowLeft size={15} /> Back to Aadhya Health Care</Link><div className="section-head"><div><div className="section-kicker">Your care, your pace</div><h2>Start with a conversation.</h2></div><p className="section-intro">Share a few details and our care coordinator will call you to confirm the best appointment for your needs.</p></div><div className="booking-card"><h3>Book your appointment</h3><p>We usually respond within 30 minutes during hospital hours.</p><BookingForm /></div></div></main><Footer /></div>;
}

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [requests, setRequests] = useState<AppointmentRecord[]>([]);

  const loadRequests = () => {
    const saved = localStorage.getItem(APPOINTMENTS_KEY);
    setRequests(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    if (loggedIn) loadRequests();
  }, [loggedIn]);

  const login = (event: FormEvent) => {
    event.preventDefault();
    if (adminId.trim() === ADMIN_ID && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setLoggedIn(true);
      setLoginError('');
      setPassword('');
      return;
    }
    setLoginError('The admin ID or password is incorrect.');
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setLoggedIn(false);
    setAdminId('');
  };

  return <div className="appointment-page"><Header /><main className="admin-page"><div className="container"><Link href="/" className="appointment-back"><ArrowLeft size={15} /> Back to Aadhya Health Care</Link>{loggedIn ? <><div className="admin-heading"><div><div className="section-kicker">Private admin area</div><h1>Appointment requests.</h1><p>Review visitors who have requested a call from the hospital.</p></div><div className="admin-actions"><button className="btn btn-outline" onClick={loadRequests}><ArrowRight size={15} /> Refresh</button><button className="btn btn-teal" onClick={logout}>Log out</button></div></div><div className="admin-summary"><Users size={20} /><strong>{requests.length}</strong><span>{requests.length === 1 ? 'request received' : 'requests received'}</span></div>{requests.length === 0 ? <div className="admin-empty"><LockKeyhole size={25} /><h2>No requests yet.</h2><p>New appointment requests will appear here.</p></div> : <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}><div><span className="request-id">{request.id}</span><h2>{request.name}</h2><p>{request.department} · Preferred date: {request.date}</p>{request.message && <blockquote>{request.message}</blockquote>}</div><div className="request-contact"><a href={`tel:${request.phone}`}>{request.phone}</a><small>{new Date(request.submittedAt).toLocaleString()}</small></div></article>)}</div>}</> : <div className="admin-login-layout"><div className="admin-login-copy"><div className="section-kicker">Restricted access</div><h1>Admin portal.</h1><p>Sign in to view appointment requests sent through the website.</p></div><form className="admin-login-card" onSubmit={login}><div className="admin-login-icon"><LockKeyhole size={22} /></div><h2>Sign in</h2><label htmlFor="admin-id">Admin ID</label><input id="admin-id" autoComplete="username" value={adminId} onChange={(event) => setAdminId(event.target.value)} placeholder="Enter admin ID" /><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />{loginError && <span className="field-error">{loginError}</span>}<button className="btn btn-teal" type="submit">Enter admin portal <ArrowRight size={15} /></button></form></div>}</div></main><Footer /></div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/appointment" component={AppointmentPage} /><Route path="/specialities" component={SpecialitiesPage} /><Route path="/admin" component={AdminPage} /><Route><NotFound /></Route></Switch></ErrorBoundary>;
}

function NotFound() {
  const [, navigate] = useLocation();
  return <div className="appointment-page"><Header /><main className="appointment-hero"><div className="container" style={{ textAlign: 'center' }}><div className="section-kicker">Page not found</div><h2>Let’s get you back to care.</h2><button className="btn btn-teal" onClick={() => navigate('/')}>Return home <ArrowRight size={15} /></button></div></main></div>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;