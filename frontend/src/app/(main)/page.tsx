import { FaqAccordion } from "@/components/main/faq-accordion";
import { ApiHoliday, ApiPlan, baseURL, getHolidays, getPlans } from "@/lib/api";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const CATEGORY = {
    TRADITIONAL: { label: "Traditional", cls: "" },
    CULTURAL: { label: "Cultural", cls: "cultural" },
    EVENT_BASED: { label: "Event", cls: "event" },
} as const;

const HOME_FAQS = [
    { q: "What if I don't like the kit when it arrives?", a: "If you don't love your kit, contact us within 48 hours of delivery. We'll send a replacement, swap it for another holiday, or credit your account, no questions asked." },
    { q: "What if something breaks?", a: "Accidents happen. Minor wear is covered automatically. For major damage, our deposit protection covers up to 90% of replacement cost, you'll never owe more than your deposit." },
    { q: "How does the deposit work?", a: "Your deposit (typically $50) is held when you reserve a kit and refunded in full within five business days of returning it in good condition. Shipping is free both ways." },
    { q: "Can I skip a holiday?", a: "Absolutely. Skip any holiday from your account dashboard up to 14 days before the rental starts. Skipped holidays roll forward to next year, no slot is ever lost." },
];

function lowestPrice(kits: ApiHoliday["kits"]): number | null {
    if (!kits || kits.length === 0) return null;
    return Math.min(...kits.map((k) => Number(k.price30Day)));
}

const img = (path?: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${baseURL}${path}`;
    return path.startsWith("/") ? path : `${baseURL}/${path}`;
};

export default async function HomePage() {
    let data = { items: [] as ApiHoliday[] };
    let plansData = { items: [] as ApiPlan[] };
    try {
        const [hRes, pRes] = await Promise.all([getHolidays(), getPlans()]);
        data = hRes;
        plansData = pRes;
    } catch (e) {
        console.error("Failed to fetch holidays or plans:", e);
    }
    const holidays = data.items;
    const plans = plansData.items;
    
    const desiredOrderKeys = ["christmas", "new year", "halloween", "thanksgiving", "birthday", "valentine"];
    const featured = desiredOrderKeys.map(key => 
        holidays.find(h => h.name.toLowerCase().includes(key))
    ).filter(Boolean) as ApiHoliday[];

    if (featured.length < 6) {
        const remaining = holidays.filter(h => !featured.some(f => f.id === h.id) && !h.name.toLowerCase().includes("nowruz"));
        featured.push(...remaining.slice(0, 6 - featured.length));
    }

    const hero0 = featured[0] ?? null;
    const hero1 = featured[1] ?? featured[0] ?? null;

    return (
        <div className="cb">
            {/* HERO */}
            <section className="cb-hero" style={{ padding: 0 }}>
                <div className="cb-hero-grid">
                    <div className="cb-hero-copy">
                        <span className="cb-hero-eyebrow"><span className="dot" /> Holiday décor, by subscription</span>
                        <h1>Your home, <span className="gradient-text">dressed</span> for every holiday.</h1>
                        <p className="cb-hero-sub">
                            Beautifully curated decoration kits delivered to your door, then picked up when the season ends.
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
                                Loved by <b>2,400+ families</b>
                                <br />Free shipping both ways · Deposit always refundable
                            </div>
                        </div>
                    </div>
                    <div className="cb-hero-art">
                        <div className="img-main">
                            {hero0 && <Image src={img(hero0.image)} alt={`${hero0.name} décor`} width={1000} height={800} sizes="(max-width: 768px) 100vw, 50vw" priority className="w-full h-full object-cover" />}
                        </div>
                        <div className="cb-kit-float">
                            <div className="kf-row">
                                {hero0 && <Image className="kf-thumb" src={img(hero0.image)} alt="" width={64} height={64} style={{ objectFit: "cover" }} />}
                                <div>
                                    <div className="kf-tier">Premium Kit</div>
                                    <div className="kf-name">{hero0?.name ?? "Christmas"}</div>
                                </div>
                            </div>
                            <div className="kf-meta">
                                <div className="kf-price">${lowestPrice(hero0?.kits) ?? 89} <span>/ 30 days</span></div>
                            </div>
                        </div>
                        <div className="img-sub">
                            {hero1 && <Image src={img(hero1.image)} alt={`${hero1.name} décor`} width={600} height={400} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-full object-cover" />}
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
                            { n: 2, t: "We curate your kit", d: "Our designers hand-pick 10, 25 décor pieces for each holiday you choose." },
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
                            <span className="eyebrow">Most popular</span>
                            <h2>Decorate your season</h2>
                        </div>
                        <Link href="/catalog" className="cb-featured-link">Explore all holidays →</Link>
                    </div>
                    <div className="cb-card-grid">
                        {featured.map((h) => {
                            const cat = CATEGORY[h.category as keyof typeof CATEGORY] ?? CATEGORY.TRADITIONAL;
                            const price = lowestPrice(h.kits);
                            return (
                                <Link key={h.id} href={`/catalog/${slugify(h.name)}`} className="cb-holiday-card">
                                    <Image src={img(h.image)} alt={`${h.name} décor kit`} width={600} height={400} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="w-full h-full object-cover" />
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
                            <Image key={h.id} src={img(h.image)} alt={`Home dressed for ${h.name}`} width={600} height={400} className="w-full h-full object-cover" />
                        ))}
                    </div>
                    <div className="cb-trio-grid">
                        <div className="cb-trio-card"><div className="cb-trio-ic">✨</div><h3>Always fresh</h3><p>Brand new designer looks every season. You&apos;ll never repeat the same kit twice.</p></div>
                        <div className="cb-trio-card"><div className="cb-trio-ic">📦</div><h3>No clutter, no storage</h3><p>We deliver, then pick it up. Your attic and closets stay completely yours.</p></div>
                        <div className="cb-trio-card"><div className="cb-trio-ic">♻️</div><h3>Earth kind</h3><p>One curated kit serves dozens of homes, cutting holiday waste by up to 78%.</p></div>
                    </div>
                </div>
            </section>

            {/* ZERO STORAGE TIMELINE */}
            <section style={{ background: "#faf7fc", padding: "80px 0", borderTop: "1px solid #f0e6f5", borderBottom: "1px solid #f0e6f5" }}>
                <div className="cb-container">
                    <div className="sec-head" style={{ marginBottom: "40px" }}>
                        <span className="eyebrow">The Zero Storage Lifestyle</span>
                        <h2>Always celebrating. Never storing totes in the attic.</h2>
                        <p>See how seamlessly CeleBrease fits into your holiday calendar. Your favorite season arrives exactly when you need it and vanishes right after.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        {[
                            { date: "Oct 15", title: "🎃 Halloween Drop", desc: "Your spooky porch and mantel kit arrives styled & ready." },
                            { date: "Nov 05", title: "🦃 Thanksgiving Swap", desc: "Repack Halloween in the reusable box. Doorstep courier picks it up & hands over Thanksgiving!" },
                            { date: "Dec 03", title: "🎄 Christmas Wonderland", desc: "No untangling attic lights. A fresh designer holiday landscape delivered to your living room." },
                            { date: "Jan 05", title: "✨ Effortless Pickup", desc: "Season ends. We collect the boxes & refund 100% of your deposit within 5 days." },
                        ].map((s, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col justify-between relative">
                                {idx < 3 && <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-purple-600 text-white items-center justify-center font-bold text-xs shadow-md">→</div>}
                                <div>
                                    <span className="text-xs font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">{s.date}</span>
                                    <h3 className="font-bold text-lg text-slate-900 mt-4 mb-2">{s.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                                </div>
                                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
                                    <span>✓ ZERO storage required</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="cb-pricing">
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Membership</span>
                        <h2>Plans built for the way you celebrate</h2>
                        <p>Switch or cancel anytime. Every plan includes free two way shipping and full deposit protection.</p>
                    </div>
                    <div className="cb-pricing-grid">
                        {plans && plans.length > 0 ? (
                            plans.map((p) => {
                                const isPop = p.code === "PREMIUM";
                                const desc = p.description ? p.description : `${p.code === "STARTER" ? "Up to $350/yr" : p.code === "PREMIUM" ? "Up to $750/yr" : "Up to $1,500/yr"} equivalent retail value`;
                                return (
                                    <div key={p.id} className={`cb-plan-card${isPop ? " elevated" : ""}`}>
                                        {isPop && <span className="cb-plan-ribbon">★ Most loved</span>}
                                        <span className="cb-plan-tier">{p.name}</span>
                                        <div className="cb-plan-price">${Math.round(Number(p.monthlyPrice))}<span className="small">/mo</span></div>
                                        <p className="cb-plan-count">{p.holidaysPerYear} holidays per year</p>
                                        <p className="text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 mb-3 text-center">✨ {desc}</p>
                                        <p className="cb-plan-feat">
                                            {p.features && p.features.length > 0
                                                ? p.features.slice(0, 2).map((f) => f.text).join(" · ") + "."
                                                : "Designer curated holiday kits with free two way shipping and deposit protection."}
                                        </p>
                                        <Link href="/subscription" className={isPop ? "btn-fill-grad" : "btn-out-grad"} style={{ marginTop: "auto" }}>Choose {p.name}</Link>
                                    </div>
                                );
                            })
                        ) : (
                            <>
                                <div className="cb-plan-card">
                                    <span className="cb-plan-tier">Starter</span>
                                    <div className="cb-plan-price">$49<span className="small">/mo</span></div>
                                    <p className="cb-plan-count">3 holidays per year</p>
                                    <p className="text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 mb-3 text-center">✨ Up to $350 retail value per kit</p>
                                    <p className="cb-plan-feat">Designer curated starter kits with full deposit protection and free shipping both ways.</p>
                                    <Link href="/subscription" className="btn-out-grad" style={{ marginTop: "auto" }}>Choose Starter</Link>
                                </div>
                                <div className="cb-plan-card elevated">
                                    <span className="cb-plan-ribbon">★ Most loved</span>
                                    <span className="cb-plan-tier">Premium</span>
                                    <div className="cb-plan-price">$79<span className="small">/mo</span></div>
                                    <p className="cb-plan-count">5 holidays per year</p>
                                    <p className="text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 mb-3 text-center">✨ Up to $500 retail value per kit</p>
                                    <p className="cb-plan-feat">Premium kits, priority shipping, and 20% off all seasonal decor add ons.</p>
                                    <Link href="/subscription" className="btn-fill-grad" style={{ marginTop: "auto" }}>Choose Premium</Link>
                                </div>
                                <div className="cb-plan-card">
                                    <span className="cb-plan-tier">Ultimate</span>
                                    <div className="cb-plan-price">$119<span className="small">/mo</span></div>
                                    <p className="cb-plan-count">8 holidays per year</p>
                                    <p className="text-xs font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 mb-3 text-center">✨ Up to $750 retail value per kit</p>
                                    <p className="cb-plan-feat">Luxury collection kits, dedicated concierge support, and 25% off all add ons.</p>
                                    <Link href="/subscription" className="btn-out-grad" style={{ marginTop: "auto" }}>Choose Ultimate</Link>
                                </div>
                            </>
                        )}
                    </div>
                    <p style={{ textAlign: "center", marginTop: "30px" }}><Link href="/subscription" style={{ color: "var(--cb-purple)", fontWeight: 700 }}>Compare all plans in detail or view A La Carte pricing →</Link></p>
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
                            { img: featured[0]?.image, q: "Best Christmas our family has ever had, and I didn't stress once about storage.", a: "Sarah M., Chicago" },
                            { img: featured[1]?.image, q: "Subscribed in October and my Halloween was unbelievable. Already booked Christmas.", a: "James T., Austin" },
                            { img: featured[2]?.image, q: "The kit arrived styled and ready. I literally just placed each piece. Done.", a: "Priya K., New York" },
                        ].map((t, i) => (
                            <div key={i} className="cb-testi-card">
                                <Image src={img(t.img)} alt="" width={100} height={100} className="object-cover" />
                                <div className="cb-testi-body">
                                    <p className="cb-testi-quote">&ldquo;{t.q}&rdquo;</p>
                                    <p className="cb-testi-attr">- {t.a}</p>
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
