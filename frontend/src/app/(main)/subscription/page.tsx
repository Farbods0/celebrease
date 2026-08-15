import { FaqAccordion } from "@/components/main/faq-accordion";
import { ApiHoliday, ApiPlan, baseURL, getHolidays, getPlans, getSiteSettings, ApiSiteSettings } from "@/lib/api";
import Link from "next/link";
import PlansGrid from "./plans-grid";

/* ── FAQ items matching prototype ── */
const FAQS = [
    {
        q: "Can I cancel my subscription anytime?",
        a: "Yes. Cancel from your account dashboard with one click. There are no fees, no contracts, and any unused holiday slots remain available until your billing period ends.",
    },
    {
        q: "What happens if I don't use all my holiday slots?",
        a: "Unused slots roll forward. On annual plans, you can carry up to 100% of unused holidays into the next year. On monthly plans, slots roll over for up to 12 months from the time they were issued.",
    },
    {
        q: "Can I upgrade or downgrade my plan?",
        a: "Anytime. Upgrades take effect immediately and we prorate the difference. Downgrades apply at your next billing cycle. Existing reservations are always honored at the previous tier.",
    },
    {
        q: "Is the deposit per kit or per subscription?",
        a: "Per kit. Each kit you reserve has its own refundable deposit (typically $50). Deposits are released back to your card within 5 business days of the kit being returned in good condition.",
    },
    {
        q: "What kits are included in each tier?",
        a: "Starter kits include 8-12 décor pieces. Premium kits include 15-20 pieces with designer styling cards. Ultimate kits include 25+ pieces, premium materials, and exclusive seasonal drops.",
    },
    {
        q: "Do you ship internationally?",
        a: "Currently, we ship within the contiguous United States. We're expanding to Canada in late 2026 and select international markets in 2027, join our newsletter to be first in line.",
    },
];

const COMPARE_ROWS: Array<{
    label: string;
    starter: string;
    premium: string;
    ultimate: string;
}> = [
    { label: "Holidays per year",       starter: "3",           premium: "6",                  ultimate: "12" },
    { label: "Kit tiers included",      starter: "Starter",     premium: "Starter + Premium",  ultimate: "All tiers" },
    { label: "Free shipping both ways", starter: "✓",           premium: "✓",                  ultimate: "✓" },
    { label: "Priority delivery dates", starter: "-",           premium: "3-day",              ultimate: "Same-week" },
    { label: "Add on discount",         starter: "10% off",     premium: "20% off",            ultimate: "25% off" },
    { label: "Additional kit discount", starter: "-",           premium: "10% off",            ultimate: "15% off" },
    { label: "Professional in-home setup", starter: "-",        premium: "-",                  ultimate: "✓" },
    { label: "Early access to drops",   starter: "-",           premium: "✓",                  ultimate: "✓" },
    { label: "Exclusive limited editions", starter: "-",        premium: "-",                  ultimate: "✓" },
    { label: "Priority support",        starter: "-",           premium: "✓",                  ultimate: "✓" },
    { label: "Deposit protection",      starter: "✓",           premium: "✓",                  ultimate: "✓" },
    { label: "Pause or skip anytime",   starter: "✓",           premium: "✓",                  ultimate: "✓" },
    { label: "Cancel anytime",          starter: "✓",           premium: "✓",                  ultimate: "✓" },
];

function imgSrc(path?: string | null) {
    if (!path) return "";
    if (path.includes("/uploads/")) return path.substring(path.indexOf("/uploads/"));
    if (path.startsWith("http")) return path;
    return path.startsWith("/") ? path : `/${path}`;
}

/* Mosaic card layout, first 2 holidays get span-2 large cards */
function MosaicCard({ holiday, large }: { holiday: ApiHoliday; large?: boolean }) {
    return (
        <div
            className={`mos-card${large ? " mos-card-lg" : ""}`}
            role="listitem"
        >
            <img src={imgSrc(holiday.image)} alt={`${holiday.name} décor`} />
            <div className="scrim" />
            <div className="mos-name">{holiday.name}</div>
        </div>
    );
}

/* Inline styles for page-specific CSS not yet in celebrease.css */
const pageStyles = `
.sub-hero {
  background: radial-gradient(1100px 520px at 50% 0%, #FAEFFF 0%, var(--cb-lavender) 55%, #fff 100%);
  padding: clamp(72px, 8vw, 104px) 24px clamp(56px, 6vw, 80px);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.sub-hero::before {
  content: '';
  position: absolute;
  width: 480px; height: 480px;
  right: -100px; top: -180px;
  background: radial-gradient(circle, rgba(155,47,201,0.14), transparent 70%);
  filter: blur(24px);
  pointer-events: none;
}
.sub-hero::after {
  content: '';
  position: absolute;
  width: 360px; height: 360px;
  left: -80px; bottom: -120px;
  background: radial-gradient(circle, rgba(220,0,117,0.1), transparent 70%);
  filter: blur(20px);
  pointer-events: none;
}
.sub-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--cb-line);
  color: var(--cb-purple);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 7px 16px;
  border-radius: var(--cb-r-pill);
  box-shadow: var(--cb-shadow-xs);
  margin-bottom: 24px;
  position: relative;
}
.sub-hero-eyebrow .dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--cb-magenta);
  box-shadow: 0 0 0 4px rgba(220,0,117,0.15);
}
.sub-hero h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.06;
  font-weight: 800;
  max-width: 760px;
  margin: 0 auto 20px;
  position: relative;
}
.sub-hero p {
  font-size: clamp(16px, 1.4vw, 18px);
  color: var(--cb-ink-muted);
  max-width: 520px;
  margin: 0 auto 12px;
  line-height: 1.65;
  position: relative;
}
.sub-hero-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--cb-ink-muted);
  margin-top: 8px;
  position: relative;
}
.sub-hero-proof .proof-stars { color: var(--cb-gold); letter-spacing: 1px; }

.plans-section {
  padding: clamp(36px,4vw,56px) 24px clamp(56px,6vw,80px);
}
.plans-grid-wrap {
  max-width: 1060px;
  margin: 0 auto;
}
.trust-strip {
  max-width: 1060px;
  margin: 0 auto;
  padding: 20px 24px 8px;
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  font-size: 13.5px;
  color: var(--cb-ink-muted);
  font-weight: 500;
}
.trust-strip span { display: flex; align-items: center; gap: 6px; }
.trust-strip .check { color: var(--cb-purple); font-weight: 700; }

.compare-wrap {
  padding: clamp(48px,5vw,72px) 24px;
  background: var(--cb-lavender);
}
.compare-inner { max-width: 1060px; margin: 0 auto; }
.compare-scroller {
  overflow-x: auto;
  border-radius: var(--cb-r-card);
  box-shadow: var(--cb-shadow-sm);
  background: #fff;
}
.compare-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}
.compare-table thead th {
  padding: 20px 22px;
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--cb-ink);
  background: #fff;
  border-bottom: 2px solid var(--cb-line);
  text-align: left;
  white-space: nowrap;
}
.compare-table thead th:not(:first-child) { text-align: center; }
.compare-table thead th.col-premium {
  background: linear-gradient(180deg, #FAEFFF 0%, #fff 100%);
  color: var(--cb-purple);
  position: relative;
}
.compare-table thead th.col-premium::after {
  content: 'MOST LOVED';
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--cb-magenta);
  margin-top: 3px;
}
.compare-table tbody tr:nth-child(even) td { background: var(--cb-lavender); }
.compare-table tbody td {
  padding: 16px 22px;
  font-size: 14px;
  color: var(--cb-ink-muted);
  border-bottom: 1px solid var(--cb-line);
  text-align: left;
}
.compare-table tbody td:not(:first-child) {
  text-align: center;
  font-weight: 500;
  color: var(--cb-ink);
}
.compare-table tbody td.col-premium { background: #FAEFFF !important; }
.compare-table tbody tr:nth-child(even) td.col-premium { background: #F3E8FF !important; }
.compare-table tbody tr:last-child td { border-bottom: none; }
.compare-table .row-label { color: var(--cb-ink-muted); font-weight: 500; }
.check-yes { color: var(--cb-purple); font-size: 16px; font-weight: 700; }
.check-no  { color: var(--cb-ink-soft); font-size: 20px; line-height: 1; }

.holidays-section {
  padding: clamp(56px,6vw,84px) 24px;
  background: #fff;
}
.holidays-mosaic {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  max-width: 1060px;
  margin: 0 auto;
}
.mos-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 3/4;
  transition: transform .25s, box-shadow .25s;
  box-shadow: var(--cb-shadow-xs);
}
.mos-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: var(--cb-shadow-md); }
.mos-card img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.mos-card:hover img { transform: scale(1.07); }
.mos-card .scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(26,11,46,0.78) 100%); }
.mos-card .mos-name { position: absolute; bottom: 10px; left: 12px; right: 12px; color: #fff; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; line-height: 1.25; }
.mos-card-lg { grid-column: span 2; aspect-ratio: 1/1; }

.faq-sub {
  background: var(--cb-lavender);
  padding: clamp(56px,6vw,84px) 24px;
}

@media (max-width: 980px) {
  .holidays-mosaic { grid-template-columns: repeat(3, 1fr); }
  .mos-card-lg { grid-column: span 1; aspect-ratio: 3/4; }
  .trust-strip { gap: 14px; }
}
@media (max-width: 600px) {
  .trust-strip { flex-direction: column; align-items: flex-start; max-width: 320px; margin-left: auto; margin-right: auto; }
  .holidays-mosaic { grid-template-columns: repeat(2, 1fr); }
  .compare-table thead th, .compare-table tbody td { padding: 12px 14px; font-size: 13px; }
}
`;

function CheckYes() {
    return <span className="check-yes" aria-label="Yes">✓</span>;
}
function CheckNo() {
    return <span className="check-no" aria-label="Not included">, </span>;
}
function CompareCell({ value }: { value: string }) {
    if (value === "✓") return <CheckYes />;
    if (value === ", ") return <CheckNo />;
    return <>{value}</>;
}

export default async function SubscriptionPage() {
    let plansData = { items: [] as ApiPlan[] };
    let holidaysData = { items: [] as ApiHoliday[] };
    let settings: ApiSiteSettings = { yearlyDiscountPercent: 20 } as ApiSiteSettings;
    try {
        const [p, h, s] = await Promise.all([
            getPlans(),
            getHolidays(),
            getSiteSettings(),
        ]);
        plansData = p;
        holidaysData = h;
        settings = s;
    } catch (e) {
        console.error("Failed to fetch subscription data:", e);
    }

    const plans: ApiPlan[] = plansData.items;
    const holidays: ApiHoliday[] = holidaysData.items;

    /* mosaic: first 12 active holidays; first 2 render as span-2 large cards */
    const mosaic = holidays.filter((h) => h.isActive).slice(0, 12);

    /* Plan price display helpers (used in comparison table sub-labels) */
    const starter = plans.find((p) => p.code === "STARTER");
    const premium = plans.find((p) => p.code === "PREMIUM");
    const ultimate = plans.find((p) => p.code === "ULTIMATE");

    const starterPrice = starter ? `$${Number(starter.monthlyPrice).toFixed(0)}/mo` : "$49/mo";
    const premiumPrice = premium ? `$${Number(premium.monthlyPrice).toFixed(0)}/mo` : "$79/mo";
    const ultimatePrice = ultimate ? `$${Number(ultimate.monthlyPrice).toFixed(0)}/mo` : "$119/mo";

    return (
        <div className="cb">
            {/* eslint-disable-next-line react/no-danger */}
            <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

            {/* ── HERO ── */}
            <section className="sub-hero" aria-labelledby="sub-hero-heading" style={{ padding: undefined }}>
                <span className="sub-hero-eyebrow">
                    <span className="dot" />
                    Membership plans
                </span>
                <h1 id="sub-hero-heading">
                    Plans built for the way
                    <br />
                    <span className="gradient-text">you celebrate</span>
                </h1>
                <p>Every plan is an annual membership. Choose to pay monthly, or pay for the full year upfront for a 20% discount.</p>
                <div className="sub-hero-proof">
                    <span>
                        2,400+ families celebrating · 30 day money back guarantee
                    </span>
                </div>
            </section>

            {/* ── PLANS (billing toggle + cards via client component) ── */}
            <section className="plans-section" aria-labelledby="plans-heading">
                <h2 id="plans-heading" className="sr-only">Subscription plans</h2>
                <div className="plans-grid-wrap">
                    <PlansGrid plans={plans} settings={settings} />
                </div>

                {/* Trust strip */}
                <div className="trust-strip" aria-label="Key guarantees">
                    <span><span className="check" aria-hidden="true">✓</span> Deposit fully refundable</span>
                    <span><span className="check" aria-hidden="true">✓</span> Free shipping &amp; returns</span>
                    <span><span className="check" aria-hidden="true">✓</span> Cancel anytime, no fees</span>
                    <span><span className="check" aria-hidden="true">✓</span> 30 day money back guarantee</span>
                </div>
            </section>

            {/* ── COMPARISON TABLE ── */}
            <section className="compare-wrap" aria-labelledby="compare-heading">
                <div className="compare-inner">
                    <div className="sec-head">
                        <span className="eyebrow">Compare</span>
                        <h2 id="compare-heading">Everything side by side</h2>
                        <p>Pick the plan that fits your year, every plan includes free shipping and full deposit protection.</p>
                    </div>
                    <div className="compare-scroller" role="region" aria-label="Plan comparison table" tabIndex={0}>
                        <table className="compare-table">
                            <caption className="sr-only">Feature comparison across Starter, Premium, and Ultimate plans</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Feature</th>
                                    <th scope="col">
                                        Starter
                                        <br />
                                        <span style={{ fontFamily: "var(--font-geist-sans,Inter,sans-serif)", fontSize: 13, fontWeight: 400, color: "var(--cb-ink-muted)" }}>
                                            {starterPrice}
                                        </span>
                                    </th>
                                    <th scope="col" className="col-premium">
                                        Premium
                                        <br />
                                        <span style={{ fontFamily: "var(--font-geist-sans,Inter,sans-serif)", fontSize: 13, fontWeight: 400, color: "var(--cb-purple)" }}>
                                            {premiumPrice}
                                        </span>
                                    </th>
                                    <th scope="col">
                                        Ultimate
                                        <br />
                                        <span style={{ fontFamily: "var(--font-geist-sans,Inter,sans-serif)", fontSize: 13, fontWeight: 400, color: "var(--cb-ink-muted)" }}>
                                            {ultimatePrice}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARE_ROWS.map((row) => (
                                    <tr key={row.label}>
                                        <td className="row-label">{row.label}</td>
                                        <td><CompareCell value={row.starter} /></td>
                                        <td className="col-premium"><CompareCell value={row.premium} /></td>
                                        <td><CompareCell value={row.ultimate} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ textAlign: "center", marginTop: 28 }}>
                        <Link href="/signup?plan=premium" className="btn-primary" style={{ display: "inline-flex", height: 52, fontSize: 15 }}>
                            Start with Premium →
                        </Link>
                    </p>
                </div>
            </section>

            {/* ── HOLIDAYS MOSAIC ── */}
            <section className="holidays-section" aria-labelledby="holidays-heading">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Holidays we cover</span>
                        <h2 id="holidays-heading">One kit for every occasion</h2>
                        <p>
                            From classic traditions to cultural celebrations and milestones, we have a curated kit for the
                            moments that matter most.
                        </p>
                    </div>
                    {mosaic.length > 0 && (
                        <div className="holidays-mosaic" role="list">
                            {mosaic.map((holiday, idx) => (
                                <MosaicCard key={holiday.id} holiday={holiday} large={idx === 0 || idx === 5} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="faq-sub" aria-labelledby="faq-heading">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Good to know</span>
                        <h2 id="faq-heading">Subscription questions, answered</h2>
                        <p>Everything you need to know before you pick a plan.</p>
                    </div>
                    <FaqAccordion items={FAQS} />
                </div>
            </section>
        </div>
    );
}
