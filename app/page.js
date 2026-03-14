"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0D0F1A",
  card: "#151829",
  cardHover: "#1C2038",
  purple: "#6C5CE7",
  emerald: "#00E5A0",
  coral: "#FF6B9D",
  gold: "#FFC845",
  sky: "#45B7FF",
  white: "#F0F0F5",
  muted: "#8B8DA3",
  border: "#252840",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: "opacity 0.7s ease " + delay + "s, transform 0.7s ease " + delay + "s",
    }}>
      {children}
    </div>
  );
}

function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect width="120" height="120" rx="28" fill={C.purple} opacity="0.15" />
      <path d="M30 85 C30 85 42 45 55 45 C68 45 58 65 72 30 C78 16 88 28 88 28" stroke={C.emerald} strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="85" r="6" fill={C.coral} />
      <circle cx="88" cy="28" r="6" fill={C.sky} />
    </svg>
  );
}

function BgParticles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { w: 500, h: 500, x: "-10%", y: "-15%", bg: C.purple, o: 0.06, anim: "float0 25s ease-in-out infinite" },
        { w: 600, h: 600, x: "60%", y: "10%", bg: C.emerald, o: 0.04, anim: "float1 30s ease-in-out infinite" },
        { w: 400, h: 400, x: "70%", y: "60%", bg: C.coral, o: 0.04, anim: "float2 20s ease-in-out infinite" },
        { w: 350, h: 350, x: "10%", y: "70%", bg: C.sky, o: 0.03, anim: "float3 22s ease-in-out infinite" },
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.w, height: p.h, left: p.x, top: p.y,
          borderRadius: "50%", background: p.bg, opacity: p.o,
          filter: "blur(80px)", animation: p.anim,
        }} />
      ))}
    </div>
  );
}

function EquityChart() {
  const pts = [20, 28, 25, 38, 32, 45, 40, 52, 48, 60, 55, 68, 62, 72, 68, 78];
  const w = 400;
  const h = 120;
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - 15) / 70) * h;
    return (i === 0 ? "M" : "L") + " " + x + " " + y;
  }).join(" ");
  const area = path + " L " + w + " " + h + " L 0 " + h + " Z";
  return (
    <svg width="100%" viewBox={"0 0 " + w + " " + h} style={{ display: "block" }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.emerald} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.emerald} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" />
      <path d={path} fill="none" stroke={C.emerald} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function FeatureCard({ icon, title, desc, color, delay = 0, premium }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
        background: hovered ? C.cardHover : C.card,
        border: "1px solid " + (hovered ? color + "44" : C.border),
        borderRadius: 16, padding: "28px 24px", position: "relative",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -20, right: -20, width: 80, height: 80,
          borderRadius: "50%", background: color, opacity: hovered ? 0.12 : 0.06,
          transition: "opacity 0.3s",
        }} />
        {premium && (
          <span style={{
            position: "absolute", top: 12, right: 12, fontSize: 9, fontWeight: 700,
            letterSpacing: 2, color: C.gold, background: C.gold + "18",
            padding: "3px 10px", borderRadius: 20, textTransform: "uppercase",
          }}>Premium</span>
        )}
        <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </Reveal>
  );
}

function PricingCard({ tier, price, period, features, highlight, badge, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
        background: highlight ? "linear-gradient(135deg, " + C.purple + "25 0%, " + C.emerald + "12 100%)" : C.card,
        border: "1px solid " + (highlight ? C.purple + "55" : C.border),
        borderRadius: 20, padding: "36px 28px", position: "relative",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        flex: "1 1 300px", maxWidth: 380,
      }}>
        {badge && (
          <div style={{
            position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, " + C.purple + ", " + C.sky + ")",
            color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 18px",
            borderRadius: 20, letterSpacing: 2, textTransform: "uppercase",
          }}>{badge}</div>
        )}
        <div style={{ fontSize: 13, fontWeight: 600, color: highlight ? C.emerald : C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{tier}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', Georgia, serif" }}>{price}</span>
          {period && <span style={{ fontSize: 16, color: C.muted }}>/{period}</span>}
        </div>
        {highlight && <div style={{ fontSize: 13, color: C.gold, marginBottom: 16 }}>or $59/year (save 30%)</div>}
        {!highlight && <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>forever</div>}
        <div style={{ borderTop: "1px solid " + C.border, paddingTop: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", fontSize: 14, color: highlight ? C.white : C.muted }}>
              <span style={{ color: C.emerald, fontSize: 14, lineHeight: "20px" }}>&#10003;</span>
              <span style={{ lineHeight: "20px" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Nav({ scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(13,15,26,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid " + C.border : "1px solid transparent",
      transition: "all 0.4s ease", padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={36} />
          <span style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', Georgia, serif" }}>Koji</span>
        </div>
        <a href="#waitlist" style={{
          background: C.emerald, color: C.bg, fontSize: 13, fontWeight: 700,
          padding: "8px 20px", borderRadius: 10, textDecoration: "none",
        }}>Join Waitlist</a>
      </div>
    </nav>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  var count = 247;

  useEffect(() => {
    var handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  var handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <>
      <BgParticles />
      <Nav scrolled={scrolled} />

      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "140px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.purple + "18", border: "1px solid " + C.purple + "44",
            borderRadius: 24, padding: "6px 18px", marginBottom: 32,
            fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: 1,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.emerald, animation: "pulse 2s infinite" }} />
            Launching Soon - Join the Waitlist
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 style={{
            fontSize: "clamp(38px, 7vw, 68px)", fontWeight: 900, lineHeight: 1.05,
            fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20,
            background: "linear-gradient(135deg, " + C.white + " 0%, " + C.emerald + " 50%, " + C.sky + " 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto",
          }}>
            Your trading journey,<br />beautifully tracked.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 36px" }}>
            The simple, visual, and affordable trading journal that makes you <em>want</em> to log every trade. Built for beginners, loved by pros.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div id="waitlist" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 480, margin: "0 auto" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, width: "100%", flexWrap: "wrap", justifyContent: "center" }}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{
                  flex: "1 1 240px", padding: "14px 20px", borderRadius: 12,
                  background: C.card, border: "1px solid " + C.border,
                  color: C.white, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif",
                }} />
                <button type="submit" style={{
                  padding: "14px 28px", borderRadius: 12, border: "none",
                  background: C.emerald, color: C.bg, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                }}>Join Free Waitlist</button>
              </form>
            ) : (
              <div style={{
                background: C.emerald + "15", border: "1px solid " + C.emerald + "44",
                borderRadius: 14, padding: "18px 28px", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>&#127881;</span>
                <span style={{ color: C.emerald, fontWeight: 600, fontSize: 16 }}>You are on the list! We will be in touch soon.</span>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 14, opacity: 0.7 }}>
            {count}+ traders already on the waitlist - No spam, ever
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div style={{
            marginTop: 56, background: C.card, borderRadius: 20,
            border: "1px solid " + C.border, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px " + C.border,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "12px 18px",
              borderBottom: "1px solid " + C.border, background: C.cardHover,
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
              </div>
              <div style={{
                marginLeft: 12, padding: "4px 16px", borderRadius: 6,
                background: C.bg, fontSize: 12, color: C.muted, flex: 1, maxWidth: 300,
              }}>koji.app/dashboard</div>
            </div>
            <div style={{ padding: "24px 24px 8px" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  { label: "Total P&L", value: "+$2,847", color: C.emerald },
                  { label: "Win Rate", value: "68%", color: C.sky },
                  { label: "Trades", value: "142", color: C.purple },
                  { label: "Streak", value: "7d", color: C.gold },
                ].map((s) => (
                  <div key={s.label} style={{
                    flex: "1 1 100px", background: C.bg, borderRadius: 12,
                    padding: "14px 16px", textAlign: "center", border: "1px solid " + C.border,
                  }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <EquityChart />
            </div>
          </div>
        </Reveal>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.coral, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>THE PROBLEM</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 48 }}>
            Retail traders are flying blind.
          </h2>
        </Reveal>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { icon: "&#128184;", title: "Too Expensive", desc: "TradeZella, Edgewonk cost $30-60/month - way too much for someone just starting out.", color: C.coral },
            { icon: "&#129327;", title: "Too Complex", desc: "Professional tools have 50+ features. New traders get overwhelmed and stop journaling.", color: C.gold },
            { icon: "&#128201;", title: "Too Ugly", desc: "Spreadsheets work but are not motivating. 80% of traders quit journaling within 2 weeks.", color: C.sky },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                flex: "1 1 240px", background: C.card, borderRadius: 16,
                padding: "28px 24px", border: "1px solid " + C.border,
                borderTop: "3px solid " + p.color,
              }}>
                <div style={{ fontSize: 36, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: p.icon }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.emerald, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>THE SOLUTION</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 12 }}>Meet Koji.</h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 17, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6 }}>
            Everything a trader needs to grow. Nothing they do not need. Beautiful, simple, and under $10/month.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18 }}>
          <FeatureCard icon="&#128202;" title="Smart Trade Logging" desc="Manual entry, CSV import, or broker API sync. Fields adapt per instrument - stocks, crypto, forex, options, futures." color={C.emerald} delay={0} />
          <FeatureCard icon="&#129504;" title="Emotion Tracker" desc="Log your mindset before and after each trade. Discover emotional patterns that cost you money." color={C.gold} delay={0.1} />
          <FeatureCard icon="&#127991;" title="Strategy and Session Tags" desc="Tag every trade: breakout, scalp, reversal. Track which sessions (London, NY, Asia) work best." color={C.purple} delay={0.2} />
          <FeatureCard icon="&#128200;" title="Visual Performance Reports" desc="Weekly and monthly P&L charts, win rate trends, best/worst days, and consistency scores." color={C.sky} delay={0.3} />
          <FeatureCard icon="&#128293;" title="Streaks and Progress" desc="Logging streaks, progress bars, and milestones. Stay motivated like Duolingo - for trading." color={C.coral} delay={0.4} />
          <FeatureCard icon="&#128248;" title="AI Screenshot Parser" desc="Drop a screenshot of your chart or broker fill - AI extracts the ticker, entry, exit, and setup details." color={C.gold} delay={0.5} premium />
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "40px 24px 80px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.sky, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>ALL YOUR INSTRUMENTS IN ONE PLACE</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { name: "Stocks", color: C.purple },
              { name: "Crypto", color: C.gold },
              { name: "Forex", color: C.emerald },
              { name: "Options", color: C.coral },
              { name: "Futures", color: C.sky },
            ].map((inst) => (
              <div key={inst.name} style={{
                background: inst.color + "12", border: "1px solid " + inst.color + "33",
                borderRadius: 14, padding: "14px 24px",
                fontSize: 15, fontWeight: 600, color: inst.color,
              }}>
                {inst.name}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>PRICING</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 12 }}>
            Start free. Grow when ready.
          </h2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 16, maxWidth: 480, margin: "0 auto 48px" }}>
            No credit card required. Upgrade only when you need more power.
          </p>
        </Reveal>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <PricingCard tier="Free" price="$0" features={["Manual trade entry", "Up to 30 trades/month", "Basic dashboard and P&L", "1 instrument type", "7-day performance view"]} delay={0} />
          <PricingCard tier="Premium" price="$7" period="mo" highlight badge="Most Popular" features={["Unlimited trades", "All 5 instruments", "CSV import + broker API sync", "AI screenshot parser", "Full analytics and reports", "Emotion and session tracking", "Streaks and progress bars", "Export data (CSV/PDF)"]} delay={0.15} />
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <Logo size={72} />
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", marginTop: 24, marginBottom: 16 }}>
            Ready to track smarter?
          </h2>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.6, marginBottom: 36 }}>
            Join {count}+ traders already on the waitlist. Be the first to get early access when we launch.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          {!submitted ? (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 480, margin: "0 auto" }}>
              <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{
                flex: "1 1 240px", padding: "14px 20px", borderRadius: 12,
                background: C.card, border: "1px solid " + C.border,
                color: C.white, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif",
              }} />
              <button onClick={handleSubmit} style={{
                padding: "14px 28px", borderRadius: 12, border: "none",
                background: C.emerald, color: C.bg, fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Join Free Waitlist</button>
            </div>
          ) : (
            <div style={{
              background: C.emerald + "15", border: "1px solid " + C.emerald + "44",
              borderRadius: 14, padding: "18px 28px", maxWidth: 480, margin: "0 auto",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>&#127881;</span>
              <span style={{ color: C.emerald, fontWeight: 600, fontSize: 16 }}>You are on the list! We will be in touch.</span>
            </div>
          )}
        </Reveal>
      </section>

      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid " + C.border, padding: "32px 24px", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <Logo size={28} />
          <span style={{ fontSize: 18, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', Georgia, serif" }}>Koji</span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>Your trading journey, beautifully tracked.</p>
        <p style={{ fontSize: 11, color: C.muted, opacity: 0.5, marginTop: 12 }}>2026 Koji. All rights reserved.</p>
      </footer>
    </>
  );
}
