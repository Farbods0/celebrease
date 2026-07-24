import { FaqAccordion } from "@/components/main/faq-accordion";
import { ApiHoliday, baseURL, getHolidaysByLoves } from "@/lib/api";
import Link from "next/link";

const CATEGORY = {
    TRADITIONAL: { label: "Traditional", cls: "" },
    CULTURAL: { label: "Cultural", cls: "cultural" },
    EVENT_BASED: { label: "Event", cls: "event" },
} as const;

const HOME_FAQS = [
    { q: "What if I don't like the kit when it arrives?", a: "If you don't love your kit, contact us within 48 hours of delivery. We'll send a replacement, swap it for another holiday, or credit your account — no questions asked." },
    { q: "What if something breaks?", a: "Accidents happen. Minor wear is covered automatically. For major damage, our deposit protection covers up to 90% of replacement cost — you'll never owe more than your deposit." },
    { q: "How does the deposit work?", a: "Your deposit (typically $50) is held when you reserve a kit and refunded in full within five business days of returning it in good condition. Shipping is free both ways." },
    { q: "Can I skip a holiday?", a: "Absolutely. Skip any holiday from your account dashboard up to 14 days before the rental starts. Skipped holidays roll forward to next year — no slot is ever lost." },
];

function lowestPrice(kits: ApiHoliday["kits"]): number | null {
    if (!kits || kits.length === 0) return null;
    return Math.min(...kits.map((k) => Number(k.price30Day)));
}

const img = (path?: string) => (path ? `${baseURL}${path}` : "");

export default async function HomePage() {
    const data = await getHolidaysByLoves();
    const holidays = data.items;
    const featured = holidays.slice(0, 6);
    const hero0 = holidays[0];
    const hero1 = holidays[1] ?? holidays[0];

    return (
        <div className="cb">
            {/* HERO */}
            <section className="cb-hero" style={{ padding: 0 }}>
                <div className="cb-hero-grid">
                    <div className="cb-hero-copy">
                        <span className="cb-hero-eyebrow"><span className="dot" /> Holiday décor, by subscription</span>
                        <h1>Your home, <span className="gradient-text">dressed</span> for every holiday.</h1>
                        <p className="cb-hero-sub">
                            Designer-curated decoration kits delivered to your door — then picked up when the season ends.
                            Decorate beautifully. Store nothing. Get your deposit back, every time.
                        </p>
                        <div className="cb-hero-ctas">
                            <Link href="/catalog" className="btn-primary">Start Celebrating →</Link>
                            <Link href="/how-it-works" className="btn-secondary">See how it works</Link>
                        </div>
                        <div className="cb-hero-proof">
                            <div className="cb-avatars">
                                {featured.slice(0, 4).map((h) => (
                                    <span key={h.id} style={{ backgroundImage: `url('${img(h.image)}')` }} />
                                ))}
                            </div>
                            <div className="cb-proof-text">
                                <span className="cb-proof-stars">★★★★★</span> <b>4.9</b> · Loved by <b>2,400+ families</b>
                                <br />Free shipping both ways · Deposit always refundable
                            </div>
                        </div>
                    </div>
                    <div className="cb-hero-art">
                        <div className="img-main">
                            {hero0 && <img src={img(hero0.image)} alt={`${hero0.name} décor`} />}
                        </div>
                        <div className="cb-kit-float">
                            <div className="kf-row">
                                {hero0 && <img className="kf-thumb" src={img(hero0.image)} alt="" />}
                                <div>
                                    <div className="kf-tier">Premium Kit</div>
                                    <div className="kf-name">{hero0?.name ?? "Christmas"}</div>
                                </div>
                            </div>
                            <div className="kf-meta">
                                <div className="kf-price">${lowestPrice(hero0?.kits) ?? 89} <span>/ 30 days</span></div>
                                <div className="kf-rate"><b>★ 4.9</b></div>
                            </div>
                        </div>
                        <div className="img-sub">
                            {hero1 && <img src={img(hero1.image)} alt={`${hero1.name} décor`} />}
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST STRIP */}
            <div className="cb-logos">
                <div className="cb-logos-inner">
                    <span>✦ <b>2,400+</b> celebrations styled</span>
                    <span>🚚 <b>Free</b> shipping both ways</span>
                    <span>💳 <b>100%</b> deposit refunded</span>
                    <span>♻ <b>78%</b> less holiday waste</span>
                    <span>✕ <b>Cancel</b> anytime</span>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <section className="cb-hiw">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">How it works</span>
                        <h2>From subscription to celebration in four steps</h2>
                        <p>No buying, no storing, no stress. Just open the box and host the holiday.</p>
                    </div>
                    <div className="cb-hiw-grid">
                        {[
                            { n: 1, t: "Pick your holidays", d: "Choose the celebrations that matter most to your home this year." },
                            { n: 2, t: "We curate your kit", d: "Our designers hand-pick 10–25 décor pieces for each holiday you choose." },
                            { n: 3, t: "Decorate & celebrate", d: "Open the box, follow the styling card, and host an unforgettable holiday." },
                            { n: 4, t: "Send it back, get refunded", d: "Prepaid label, doorstep pickup, and your full deposit back within five days." },
                        ].map((s) => (
                            <div key={s.n} className="cb-hiw-card">
                                <div className="cb-hiw-num">{s.n}</div>
                                <h3>{s.t}</h3>
                                <p>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED */}
            <section className="cb-featured">
                <div className="cb-container">
                    <div className="cb-featured-header">
                        <div>
                            <span className="eyebrow">Coming up next</span>
                            <h2>Decorate your season</h2>
                        </div>
                        <Link href="/catalog" className="cb-featured-link">Explore all holidays →</Link>
                    </div>
                    <div className="cb-card-grid">
                        {featured.map((h) => {
                            const cat = CATEGORY[h.category as keyof typeof CATEGORY] ?? CATEGORY.TRADITIONAL;
                            const price = lowestPrice(h.kits);
                            return (
                                <Link key={h.id} href={`/catalog/${h.id}`} className="cb-holiday-card">
                                    <img src={img(h.image)} alt={`${h.name} décor kit`} />
                                    <div className="scrim" />
                                    <span className={`cb-cat-badge ${cat.cls}`}>{cat.label}</span>
                                    <div className="meta">
                                        <div className="name">{h.name}</div>
                                        <div className="price">{price !== null ? `From $${price}` : "Coming soon"}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TRIO */}
            <section className="cb-trio">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Why CeleBrease</span>
                        <h2>One mantel. Every holiday. Zero storage.</h2>
                    </div>
                    <div className="cb-trio-images">
                        {featured.slice(0, 3).map((h) => (
                            <img key={h.id} src={img(h.image)} alt={`Home dressed for ${h.name}`} />
                        ))}
                    </div>
                    <div className="cb-trio-grid">
                        <div className="cb-trio-card"><div className="cb-trio-ic">✨</div><h3>Always fresh</h3><p>Brand-new designer looks every season. You&apos;ll never repeat the same kit twice.</p></div>
                        <div className="cb-trio-card"><div className="cb-trio-ic">📦</div><h3>No clutter, no storage</h3><p>We deliver, then pick it up. Your attic and closets stay completely yours.</p></div>
                        <div className="cb-trio-card"><div className="cb-trio-ic">♻️</div><h3>Earth-kind</h3><p>One curated kit serves dozens of homes, cutting holiday waste by up to 78%.</p></div>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="cb-pricing">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Membership</span>
                        <h2>Plans built for the way you celebrate</h2>
                        <p>Switch or cancel anytime. Every plan includes free two-way shipping and full deposit protection.</p>
                    </div>
                    <div className="cb-pricing-grid">
                        <div className="cb-plan-card">
                            <span className="cb-plan-tier">Starter</span>
                            <div className="cb-plan-price">$29<span className="small">/mo</span></div>
                            <p className="cb-plan-count">3 holidays per year</p>
                            <p className="cb-plan-feat">Designer-curated starter kits with full deposit protection and free shipping both ways.</p>
                            <Link href="/subscription" className="btn-out-grad" style={{ marginTop: "auto" }}>Choose Starter</Link>
                        </div>
                        <div className="cb-plan-card elevated">
                            <span className="cb-plan-ribbon">★ Most loved</span>
                            <span className="cb-plan-tier">Premium</span>
                            <div className="cb-plan-price">$49<span className="small">/mo</span></div>
                            <p className="cb-plan-count">6 holidays per year</p>
                            <p className="cb-plan-feat">Premium kits, priority shipping, and free add-ons worth up to $25 every season.</p>
                            <Link href="/subscription" className="btn-fill-grad" style={{ marginTop: "auto" }}>Choose Premium</Link>
                        </div>
                        <div className="cb-plan-card">
                            <span className="cb-plan-tier">Ultimate</span>
                            <div className="cb-plan-price">$89<span className="small">/mo</span></div>
                            <p className="cb-plan-count">Unlimited holidays</p>
                            <p className="cb-plan-feat">Every kit tier, a dedicated stylist, and first access to limited seasonal drops.</p>
                            <Link href="/subscription" className="btn-out-grad" style={{ marginTop: "auto" }}>Choose Ultimate</Link>
                        </div>
                    </div>
                    <p style={{ textAlign: "center" }}><Link href="/subscription" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>Compare all plans in detail →</Link></p>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="cb-testimonials">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Real homes</span>
                        <h2>Loved in living rooms everywhere</h2>
                    </div>
                    <div className="cb-testi-grid">
                        {[
                            { img: featured[0]?.image, q: "Best Christmas our family has ever had — and I didn't stress once about storage.", a: "Sarah M., Chicago" },
                            { img: featured[1]?.image, q: "Subscribed in October and my Halloween was unbelievable. Already booked Christmas.", a: "James T., Austin" },
                            { img: featured[2]?.image, q: "The kit arrived styled and ready. I literally just placed each piece. Done.", a: "Priya K., New York" },
                        ].map((t, i) => (
                            <div key={i} className="cb-testi-card">
                                <img src={img(t.img)} alt="" />
                                <div className="cb-testi-body">
                                    <div className="cb-testi-stars">★★★★★</div>
                                    <p className="cb-testi-quote">&ldquo;{t.q}&rdquo;</p>
                                    <p className="cb-testi-attr">— {t.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="cb-faq">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Good to know</span>
                        <h2>You asked. We answered.</h2>
                    </div>
                    <FaqAccordion items={HOME_FAQS} />
                </div>
            </section>
        </div>
    );
}
