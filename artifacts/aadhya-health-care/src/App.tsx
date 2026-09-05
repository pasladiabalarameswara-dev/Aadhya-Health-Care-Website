import { useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Bed,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  HeartPulse,
  Hospital,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UsersRound,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import './index.css';

const queryClient = new QueryClient();

const services = [
  { title: 'General Medicine', copy: 'Thoughtful care for everyday health, chronic conditions, and the questions in between.', icon: Stethoscope },
  { title: 'Cardiology', copy: 'Heart care built around early answers, advanced diagnostics, and lasting confidence.', icon: HeartPulse },
  { title: 'Orthopaedics', copy: 'Move with less pain through expert bone, joint, spine, and rehabilitation care.', icon: Bed },
  { title: 'Paediatrics', copy: 'Gentle, reassuring care for growing bodies, from the first check-up onward.', icon: Baby },
  { title: 'Women’s Health', copy: 'A private, supportive space for complete health across every life stage.', icon: HeartHandshake },
  { title: 'Emergency Care', copy: 'A calm, capable team available around the clock when every minute matters.', icon: Syringe },
];

const doctors = [
  { name: 'Dr. Meera Iyer', speciality: 'Consultant Physician', photo: '/doctor-portrait.png', tags: ['Internal Medicine', 'Diabetes Care'] },
  { name: 'Dr. Arjun Rao', speciality: 'Senior Cardiologist', photo: '/doctor-portrait.png', tags: ['Heart Health', 'Preventive Care'] },
  { name: 'Dr. Kavya Menon', speciality: 'Paediatrician', photo: '/doctor-portrait.png', tags: ['Child Wellness', 'Newborn Care'] },
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
            <a href="mailto:care@aadhyahealthcare.in"><Mail size={13} /> care@aadhyahealthcare.in</a>
          </div>
        </div>
      </div>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand" onClick={closeMenu} aria-label="Aadhya Health Care home">
            <span className="brand-mark">A</span>
            <span className="brand-copy"><strong>AADHYA</strong><small>HEALTH CARE</small></span>
          </Link>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            <a href="/#about" onClick={closeMenu}>About us</a>
            <a href="/#services" onClick={closeMenu}>Specialities</a>
            <a href="/#doctors" onClick={closeMenu}>Our doctors</a>
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
    if (Object.keys(nextErrors).length === 0) setSubmitted(true);
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
      <p className="hero-lede">Aadhya Health Care brings experienced doctors, thoughtful teams, and modern treatment together — so your family can get back to what matters.</p>
      <div className="hero-ctas"><Link href="/appointment" className="btn btn-primary">Find your care team <ArrowRight size={16} /></Link><a href="tel:+917337335096" className="btn btn-outline"><Phone size={16} /> Talk to a coordinator</a></div>
      <div className="hero-note"><ShieldCheck size={16} /> Trusted care for families across Naigaon and beyond</div>
    </div>
    <div className="hero-visual reveal delay-1"><img className="building-image" src="/hospital-building.png" alt="Aadhya Health Care hospital exterior" /><div className="emergency-pill">24/7 <span>Emergency support</span></div><div className="visual-badge"><HeartPulse size={22} /><div><strong>20+</strong><span>specialities under one roof</span></div></div></div>
  </div></section>;
}

function Services() {
  return <section className="section section-tint" id="services"><div className="container"><div className="section-head"><div><div className="section-kicker">Care for every chapter</div><h2>Specialities that listen first.</h2></div><p className="section-intro">From a reassuring first consultation to complex treatment, our teams work together around the person — not just the diagnosis.</p></div><div className="services-grid">{services.map(({ title, copy, icon: Icon }, index) => <article className="service-card reveal" style={{ animationDelay: `${index * 70}ms` }} key={title}><div className="service-icon"><Icon size={22} /></div><h3>{title}</h3><p>{copy}</p><ChevronRight className="arrow" size={17} /></article>)}</div></div></section>;
}

function About() {
  return <section className="section" id="about"><div className="container care-layout"><div className="doctor-collage"><img src="/doctor-portrait.png" className="doctor-photo" alt="Aadhya Health Care doctor smiling in a hospital corridor" /><div className="experience-card"><strong>15 yrs</strong><span>of showing up for families</span></div></div><div className="care-copy"><div className="section-kicker">The Aadhya difference</div><h2>Clinical clarity. Human warmth.</h2><p>Hospitals can feel overwhelming. We designed Aadhya to feel different: bright spaces, clear communication, and a team that makes room for your questions.</p><ul className="check-list"><li><Check size={16} /> Senior doctors who take the time to understand</li><li><Check size={16} /> Diagnostics and treatment connected in one place</li><li><Check size={16} /> Transparent guidance before, during, and after care</li></ul><Link className="btn btn-teal" href="/appointment">Meet your care team <ArrowRight size={15} /></Link><div className="stat-row"><div className="stat"><strong>20k+</strong><span>families cared for</span></div><div className="stat"><strong>4.8/5</strong><span>patient experience</span></div><div className="stat"><strong>24/7</strong><span>emergency response</span></div></div></div></div></section>;
}

function Doctors() {
  return <section className="section section-tint" id="doctors"><div className="container"><div className="section-head"><div><div className="section-kicker">The people behind the care</div><h2>Our care team.</h2></div><p className="section-intro">Experienced specialists, thoughtful nurses, and a front desk that knows your name — here to make the next step feel easier.</p></div><div className="doctors-grid">{doctors.map((doctor, index) => <article className={`doctor-card ${index === 0 ? 'featured' : ''}`} key={doctor.name}><img src={doctor.photo} alt={doctor.name} /><div className="doctor-info"><h3>{doctor.name}</h3><p>{doctor.speciality}</p><div className="doctor-tags">{doctor.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div></article>)}</div></div></section>;
}

function Stories() {
  const stories = [{ quote: 'The doctors explained everything without rushing us. It made a difficult week feel manageable.', name: 'Nandita P.', detail: 'Patient family · Cardiology' }, { quote: 'From the first phone call to going home, every person we met was kind, clear, and genuinely present.', name: 'Rohan S.', detail: 'Patient · General Medicine' }];
  return <section className="section" id="stories"><div className="container"><div className="section-head"><div><div className="section-kicker">In their own words</div><h2>Care you can feel.</h2></div><p className="section-intro">Trust is built in small moments — a clear answer, an extra minute, a hand held when it matters.</p></div><div className="testimonials">{stories.map((story) => <article className="quote-card" key={story.name}><div className="stars">★★★★★</div><p>“{story.quote}”</p><footer><span className="quote-avatar">{story.name[0]}</span><div><strong>{story.name}</strong><small>{story.detail}</small></div></footer></article>)}</div></div></section>;
}

function AppointmentBand() {
  return <section className="appointment-band"><div className="container appointment-layout"><div className="appointment-copy"><div className="section-kicker">A simpler next step</div><h2>Let’s find the right care for you.</h2><p>Tell us what you need and our care coordinator will help you choose a department, doctor, and time that works for your family.</p><div className="support-card"><span className="support-icon"><Phone size={19} /></span><div><strong>Prefer to speak with someone?</strong><a href="tel:+917337335096">+91 73373 35096</a></div></div></div><div className="booking-card"><h3>Request an appointment</h3><p>A short form. A real person on the other side.</p><BookingForm compact /></div></div></section>;
}

function Contact() {
  return <section className="section" id="contact"><div className="container"><div className="contact-panel"><div><div className="section-kicker">We’re easy to find</div><h2>Come in. We’ll take it from here.</h2><p>Visit us at 8-2-277, Airsft Colony, Naigaon — or call for directions, appointment help, and emergency support.</p></div><div className="contact-actions"><a className="btn btn-primary" href="tel:+917337335096"><Phone size={16} /> Call the hospital</a><a className="btn btn-outline" href="mailto:care@aadhyahealthcare.in"><Mail size={16} /> Email us</a></div></div></div></section>;
}

function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-grid"><div><Link href="/" className="brand"><span className="brand-mark">A</span><span className="brand-copy"><strong>AADHYA</strong><small>HEALTH CARE</small></span></Link><p>Modern multi-specialty care with a human heart, close to home.</p></div><div><h4>Explore</h4><ul><li><a href="/#about">About Aadhya</a></li><li><a href="/#services">Specialities</a></li><li><a href="/#doctors">Our doctors</a></li><li><a href="/#stories">Patient stories</a></li></ul></div><div><h4>Patients</h4><ul><li><Link href="/appointment">Book an appointment</Link></li><li><a href="tel:+917337335096">Emergency support</a></li><li><a href="/#contact">Find us</a></li></ul></div><div><h4>Get in touch</h4><div className="footer-contact"><MapPin size={15} />8-2-277, Airsft Colony,<br />Naigaon - 500891</div><div className="footer-contact"><Phone size={15} /><a href="tel:+917337335096">+91 73373 35096</a></div><div className="footer-contact"><Mail size={15} /><a href="mailto:care@aadhyahealthcare.in">care@aadhyahealthcare.in</a></div></div></div><div className="footer-bottom"><span>© 2025 Aadhya Health Care. Care, close to home.</span><span>Privacy · Terms</span></div></div></footer>;
}

function Home() {
  return <div className="site-shell"><Header /><main><Hero /><TrustStrip /><Services /><About /><Doctors /><Stories /><AppointmentBand /><Contact /></main><Footer /></div>;
}

function AppointmentPage() {
  return <div className="appointment-page"><Header /><main className="appointment-hero"><div className="container"><Link href="/" className="appointment-back"><ArrowLeft size={15} /> Back to Aadhya Health Care</Link><div className="section-head"><div><div className="section-kicker">Your care, your pace</div><h2>Start with a conversation.</h2></div><p className="section-intro">Share a few details and our care coordinator will call you to confirm the best appointment for your needs.</p></div><div className="booking-card"><h3>Book your appointment</h3><p>We usually respond within 30 minutes during hospital hours.</p><BookingForm /></div></div></main><Footer /></div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/appointment" component={AppointmentPage} /><Route><NotFound /></Route></Switch></ErrorBoundary>;
}

function NotFound() {
  const [, navigate] = useLocation();
  return <div className="appointment-page"><Header /><main className="appointment-hero"><div className="container" style={{ textAlign: 'center' }}><div className="section-kicker">Page not found</div><h2>Let’s get you back to care.</h2><button className="btn btn-teal" onClick={() => navigate('/')}>Return home <ArrowRight size={15} /></button></div></main></div>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;