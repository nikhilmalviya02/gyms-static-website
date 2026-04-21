import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './App.css';

/* ── Animated counter ── */
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

/* ── Stat card ── */
function StatCard({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, count } = useCounter(value);
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

const services = [
  {
    image: '/gym_hero.png',
    emoji: '🏋️',
    title: 'Weight Training',
    desc: 'Modern equipment for strength training and muscle building',
  },
  {
    image: '/gym_cardio.png',
    emoji: '🚴',
    title: 'Cardio Zone',
    desc: 'Treadmills, cycles, rowing machines and elliptical trainers',
  },
  {
    image: '/gym_yoga.png',
    emoji: '🧘',
    title: 'Group Classes',
    desc: 'Yoga, Zumba, HIIT and energising group workouts daily',
  },
  {
    image: '/gym_trainer.png',
    emoji: '🏆',
    title: 'Personal Training',
    desc: 'One-on-one coaching with expert certified trainers',
  },
];

const facilities = [
  { icon: '🏋️', text: 'Spacious Workout Area' },
  { icon: '🧖', text: 'Steam & Sauna Rooms' },
  { icon: '🥗', text: 'Nutrition Cafe' },
  { icon: '🔐', text: 'Locker Rooms' },
  { icon: '🚗', text: 'Parking Available' },
  { icon: '📷', text: '24/7 Security' },
  { icon: '🚿', text: 'Modern Showers' },
  { icon: '📶', text: 'Free Wi-Fi' },
];

const galleryImages = [
  { src: '/gym_hero.png', alt: 'Weight Training Area' },
  { src: '/gym_cardio.png', alt: 'Cardio Zone' },
  { src: '/gym_yoga.png', alt: 'Yoga Studio' },
  { src: '/gym_sauna.png', alt: 'Steam & Sauna' },
  { src: '/gym_trainer.png', alt: 'Personal Training' },
];

/* ── Floating orb ── */
function Orb({ style }: { style: React.CSSProperties }) {
  return <div className="orb" style={style} />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['Home', 'Services', 'Gallery', 'Facilities', 'Pricing', 'Contact'];

  return (
    <div className="App">
      {/* Floating background orbs */}
      <Orb style={{ top: '10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
      <Orb style={{ top: '55%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <Orb style={{ bottom: '10%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }} />

      {/* ── Navbar ── */}
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="nav-container">
          <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="logo-icon">⚡</div>
            <span>FitZone <span className="logo-accent">Udaipur</span></span>
          </motion.div>

          <div className="nav-menu">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`}>
                {link}
              </a>
            ))}
            <motion.a
              href="#contact"
              className="nav-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.a>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section id="home" className="hero" ref={heroRef}>
        <motion.div
          className="hero-bg"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img src="/gym_hero.png" alt="FitZone Udaipur gym interior" className="hero-bg-img" />
          <div className="hero-overlay" />
        </motion.div>

        {/* Animated particles */}
        <div className="particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
            }} />
          ))}
        </div>

        <div className="hero-content-wrap">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="badge-dot" /> Premium Fitness · Udaipur
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: 'easeOut' }}
          >
            Transform Your <br />
            <span className="hero-accent">Body &amp; Mind</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Premier fitness destination in the heart of Udaipur. State-of-the-art equipment,
            expert trainers, and a community that motivates you every day.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.a href="#contact" className="btn-primary" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              🚀 Start Free Trial
            </motion.a>
            <motion.a href="#gallery" className="btn-ghost" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              📸 See Our Gym
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="scroll-wheel" />
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-inner">
          <StatCard value={2000} label="Happy Members" suffix="+" />
          <StatCard value={15} label="Expert Trainers" suffix="+" />
          <StatCard value={50} label="Weekly Classes" suffix="+" />
          <StatCard value={8} label="Years of Excellence" suffix="+" />
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="services-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">What We Offer</span>
          <h2>Our <span className="highlight">Services</span></h2>
          <p>Comprehensive fitness solutions for every goal</p>
        </motion.div>

        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="service-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, scale: 1.02 }}
            >
              <div className="card-img-wrap">
                <img src={s.image} alt={s.title} className="card-img" />
                <div className="card-img-overlay" />
                <div className="card-emoji">{s.emoji}</div>
              </div>
              <div className="card-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="card-link">Learn more →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" className="gallery-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Inside FitZone</span>
          <h2>Our <span className="highlight">Gallery</span></h2>
          <p>State-of-the-art facilities designed for your success</p>
        </motion.div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className={`gallery-item ${i === 0 ? 'gallery-featured' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setGalleryIdx(i)}
            >
              <img src={img.src} alt={img.alt} />
              <div className="gallery-hover">
                <span>🔍 View</span>
                <p>{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {galleryIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGalleryIdx(null)}
          >
            <motion.img
              src={galleryImages[galleryIdx].src}
              alt={galleryImages[galleryIdx].alt}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lightbox-close" onClick={() => setGalleryIdx(null)}>✕</button>
            <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + galleryImages.length) % galleryImages.length); }}>‹</button>
            <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % galleryImages.length); }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Facilities ── */}
      <section id="facilities" className="facilities-section">
        <div className="facilities-inner">
          <motion.div
            className="facilities-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="section-tag">World Class</span>
            <h2>Premium <span className="highlight">Facilities</span></h2>
            <p>Everything you need for an elite fitness experience — all under one roof in Udaipur.</p>

            <div className="facilities-grid">
              {facilities.map((f, i) => (
                <motion.div
                  key={i}
                  className="facility-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 6 }}
                >
                  <span className="facility-icon">{f.icon}</span>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="facilities-img-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="facilities-img-stack">
              <motion.img
                src="/gym_sauna.png"
                alt="Steam & Sauna"
                className="fac-img fac-img-top"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              />
              <motion.img
                src="/gym_cardio.png"
                alt="Cardio Zone"
                className="fac-img fac-img-bot"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="pricing-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Membership Plans</span>
          <h2>Simple &amp; <span className="highlight">Affordable</span></h2>
          <p>Choose the plan that fits your lifestyle and fitness goals</p>
        </motion.div>

        <div className="pricing-grid">
          {[
            { name: 'Basic', price: '₹1,999', period: 'per month', features: ['Gym Access', 'Basic Equipment', 'Peak Hours Only', 'Locker Room'], popular: false },
            { name: 'Premium', price: '₹3,499', period: 'per month', features: ['All Day Access', 'All Equipment', 'Group Classes', 'Steam & Sauna', 'Nutrition Guidance'], popular: true },
            { name: 'VIP', price: '₹5,999', period: 'per month', features: ['24/7 Access', 'Personal Trainer', 'All Facilities', 'Custom Nutrition Plan', 'Recovery Sessions'], popular: false },
          ].map((plan, i) => (
            <motion.div
              key={i}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
            >
              {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <div className="plan-icon">{['🥉', '🥇', '👑'][i]}</div>
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="amount">{plan.price}</span>
                <span className="period"> / {plan.period}</span>
              </div>
              <ul>
                {plan.features.map((f, j) => (
                  <li key={j}><span className="check-icon">✓</span> {f}</li>
                ))}
              </ul>
              <motion.button
                className={`btn-pricing ${plan.popular ? 'btn-pricing-popular' : ''}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trainer Banner ── */}
      <section className="trainer-banner">
        <motion.div
          className="trainer-banner-inner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="trainer-text">
            <span className="section-tag">Expert Guidance</span>
            <h2>Train with <span className="hero-accent">India's Best</span> Coaches</h2>
            <p>Our certified trainers bring years of experience across strength, cardio, yoga and nutrition coaching to help you reach your goals faster.</p>
            <motion.a href="#contact" className="btn-primary" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              Book a Session
            </motion.a>
          </div>
          <motion.div
            className="trainer-img-wrap"
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            <img src="/gym_trainer.png" alt="Expert Personal Trainer at FitZone Udaipur" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Find Us</span>
          <h2>Visit Us <span className="highlight">Today</span></h2>
          <p>Located in the heart of Udaipur — walk in or book your free trial online</p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {[
              { icon: '📍', label: 'Location', value: 'Fatehpura Circle, Udaipur, Rajasthan 313001' },
              { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
              { icon: '✉️', label: 'Email', value: 'info@fitzoneudaipur.com' },
              { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 5 AM – 10 PM | Sun: 6 AM – 8 PM' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 6 }}
              >
                <div className="contact-icon">{item.icon}</div>
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="contact-form"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h3>Start Your Free Trial</h3>
            <form>
              <input type="text" placeholder="Your Name" />
              <input type="tel" placeholder="Phone Number" />
              <input type="email" placeholder="Email Address" />
              <select>
                <option>Select Your Goal</option>
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>General Fitness</option>
                <option>Flexibility / Yoga</option>
              </select>
              <motion.button
                type="submit"
                className="btn-submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                🚀 Claim Free Trial
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">⚡ FitZone <span className="logo-accent">Udaipur</span></div>
            <p>Your premier fitness destination in the heart of Udaipur, Rajasthan.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-links">
            <h4>Follow Us</h4>
            <div className="social-links">
              {/* Instagram */}
              <motion.a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn social-instagram" aria-label="Instagram" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.92 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>
              {/* X / Twitter */}
              <motion.a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-btn social-x" aria-label="X" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.92 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </motion.a>
              {/* Facebook */}
              <motion.a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn social-facebook" aria-label="Facebook" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.92 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
              {/* YouTube */}
              <motion.a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube" aria-label="YouTube" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.92 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 FitZone Udaipur. All rights reserved. Built with 💪 in Udaipur.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
