import { ApiHoliday, baseURL, getHolidays } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const img = (path?: string | null) => {
    if (!path) return "";
    if (path.includes("/uploads/")) return path.substring(path.indexOf("/uploads/"));
    if (path.startsWith("http")) return path;
    return path.startsWith("/") ? path : `/${path}`;
};

// Pick N holidays from the list by name hint (fallback to index)
function pick(holidays: ApiHoliday[], hint: string, fallbackIdx: number, defaultName?: string): ApiHoliday | undefined {
    const found = holidays.find((h) => h.name.toLowerCase().includes(hint.toLowerCase()));
    if (found && found.image) return found;
    
    // Fallback to valid holiday in list
    if (holidays.length > 0) {
        return holidays[fallbackIdx % holidays.length];
    }

    return undefined;
}

export default async function AboutPage() {
    let holidays: ApiHoliday[] = [];
    try {
        let data = { items: [] as ApiHoliday[] };
        try {
            data = await getHolidays();
        } catch (e) {
            console.error("Failed to fetch holidays:", e);
        }
        holidays = data.items ?? [];
    } catch {
        holidays = [];
    }

    // Mosaic images (hero collage)
    const mosaic0 = pick(holidays, "christmas", 0, "Christmas");
    const mosaic1 = pick(holidays, "diwali", 1, "Diwali");
    const mosaic2 = pick(holidays, "halloween", 2, "Halloween");
    const mosaic3 = pick(holidays, "nowruz", 3, "Nowruz");
    const mosaic4 = pick(holidays, "thanksgiving", 4, "Birthdays"); // Fallback to Birthday since Thanksgiving image is missing

    // Collage section, 8 cells
    const c0 = pick(holidays, "christmas", 0, "Christmas");
    const c1 = pick(holidays, "halloween", 2, "Halloween");
    const c2 = pick(holidays, "diwali", 1, "Diwali");
    const c3 = pick(holidays, "thanksgiving", 4, "Birthdays");
    const c4 = pick(holidays, "hanukkah", 5, "Hanukkah");
    const c5 = pick(holidays, "nowruz", 3, "Nowruz");
    const c6 = pick(holidays, "eid", 6, "Eid");
    const c7 = pick(holidays, "lunar", 7, "New Year's"); // Fallback

    // Press strip, reuse holiday images
    const press0 = pick(holidays, "valentine", 8, "Valentine's Day");
    const press1 = pick(holidays, "juneteenth", 9, "Eid");
    const press2 = pick(holidays, "mother", 10, "Baby Showers");

    // "And many more" strip
    const more = [
        { key: "easter", label: "Easter", h: pick(holidays, "easter", 11, "Easter") },
        { key: "ramadan", label: "Ramadan", h: pick(holidays, "ramadan", 12, "Ramadan") },
        { key: "new-years", label: "New Year's", h: pick(holidays, "new year", 13, "New Year's") },
        { key: "birthdays", label: "Birthdays", h: pick(holidays, "birthday", 14, "Birthdays") },
        { key: "engagement", label: "Engagements", h: pick(holidays, "engagement", 15, "Engagement Parties") },
    ];

    return (
        <div className="cb">

            {/* ===== ABOUT HERO ===== */}
            <section
                aria-labelledby="hero-heading"
                style={{
                    position: "relative",
                    background: "radial-gradient(1400px 700px at 50% -10%, #FAEFFF 0%, #F6F1FB 55%, #fff 100%)",
                    padding: "clamp(72px,9vw,112px) 24px clamp(56px,7vw,88px)",
                    textAlign: "center",
                    overflow: "hidden",
                }}
            >
                {/* glow blob */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 600,
                        height: 600,
                        left: "50%",
                        top: -200,
                        transform: "translateX(-50%)",
                        background: "radial-gradient(circle, rgba(155,47,201,0.12), transparent 70%)",
                        filter: "blur(20px)",
                        pointerEvents: "none",
                    }}
                />

                {/* eyebrow pill */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#fff",
                        border: "1px solid var(--cb-line)",
                        color: "var(--cb-purple)",
                        fontSize: 12.5,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "7px 14px",
                        borderRadius: "var(--cb-r-pill)",
                        boxShadow: "var(--cb-shadow-xs)",
                        marginBottom: 28,
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--cb-magenta)",
                            boxShadow: "0 0 0 4px rgba(220,0,117,0.15)",
                            display: "inline-block",
                        }}
                    />
                    Our story
                </div>

                <h1
                    id="hero-heading"
                    style={{
                        fontSize: "clamp(2.6rem,5.5vw,4.2rem)",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        maxWidth: 820,
                        margin: "0 auto 22px",
                        position: "relative",
                    }}
                >
                    Your home should{" "}
                    <span className="gradient-text">celebrate</span> with you.
                </h1>

                <p
                    style={{
                        fontSize: "clamp(17px,1.5vw,20px)",
                        color: "var(--cb-ink-muted)",
                        maxWidth: 660,
                        margin: "0 auto 40px",
                        lineHeight: 1.65,
                        position: "relative",
                    }}
                >
                    CeleBrease was built on a simple conviction: every holiday your family marks deserves a
                    beautifully dressed home, without the boxes, the clutter, or the cost of décor used five
                    days a year.
                </p>

                {/* Mosaic image grid */}
                <div
                    role="img"
                    aria-label="A collage of beautifully decorated homes for various holidays"
                    style={{
                        position: "relative",
                        maxWidth: 1080,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr 1fr",
                        gridTemplateRows: "260px 200px",
                        gap: 16,
                    }}
                >
                    {mosaic0 && (
                        <div
                            style={{
                                gridRow: "span 2",
                                borderRadius: "var(--cb-r-lg)",
                                overflow: "hidden",
                                boxShadow: "var(--cb-shadow-lg)",
                            }}
                        >
                            <Image
                                src={img(mosaic0.image)}
                                alt={`${mosaic0.name} decorated home`}
                                width={800} height={1200}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                loading="eager"
                            />
                        </div>
                    )}
                    {[mosaic1, mosaic2, mosaic3, mosaic4].map((h, i) =>
                        h ? (
                            <div
                                key={h.id ?? i}
                                style={{
                                    borderRadius: "var(--cb-r-card)",
                                    overflow: "hidden",
                                    boxShadow: "var(--cb-shadow-sm)",
                                }}
                            >
                                <Image
                                    src={img(h.image)}
                                    alt={`${h.name} décor`}
                                    width={400} height={400}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    loading="eager"
                                />
                            </div>
                        ) : null
                    )}
                </div>
            </section>

            {/* ===== STATS BAND ===== */}
            <div
                aria-label="CeleBrease by the numbers"
                style={{
                    background: "#fff",
                    borderTop: "1px solid var(--cb-line)",
                    borderBottom: "1px solid var(--cb-line)",
                }}
            >
                <div
                    style={{
                        maxWidth: "var(--cb-max)",
                        margin: "0 auto",
                        padding: "48px 24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 32,
                        textAlign: "center",
                    }}
                >
                    {[
                        { num: "2,400+", label: "Celebrations delivered" },
                        { num: "78%", label: "Less holiday waste per home" },
                        { num: "19", label: "Holiday collections" },
                    ].map((s) => (
                        <div key={s.label}>
                            <div
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: "clamp(2.4rem,4vw,3.4rem)",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    background: "var(--cb-gradient-h)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                {s.num}
                            </div>
                            <div style={{ fontSize: 14, color: "var(--cb-ink-muted)", marginTop: 6, fontWeight: 500 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== STORY SECTION ===== */}
            <section
                aria-labelledby="story-heading"
                style={{ background: "#fff", padding: "clamp(64px,7vw,96px) 24px" }}
            >
                <div
                    className="cb-container"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.1fr 1fr",
                        gap: "clamp(40px,6vw,80px)",
                        alignItems: "center",
                    }}
                >
                    {/* Copy */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <span className="eyebrow">Where it started</span>
                        <h2
                            id="story-heading"
                            style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", lineHeight: 1.1, fontWeight: 700 }}
                        >
                            Celebrate everything. Store nothing.
                        </h2>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.72 }}>
                            I have always loved bringing people together. Having a birthday on December 31st turned me into a natural host, and kicking off every new year with a massive celebration set the tone for how I view gatherings.
                        </p>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.72 }}>
                            That passion for hosting quickly bled into the rest of the year. Whether I am designing a complex multi-course menu, prepping clear ice and custom garnishes for a cocktail night, or bringing friends and family together for a big weekend, I believe the atmosphere of the room should always match the effort put into the event itself.
                        </p>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.72 }}>
                            But hosting back-to-back events with completely different aesthetics revealed a massive flaw in how we celebrate. To get the vibe exactly right, we end up spending thousands of dollars on high-end decor for specific milestones, only to stuff it all into a closet the next morning. You should never have to choose between a compromised aesthetic and a lifelong commitment to storing party supplies.
                        </p>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.72 }}>
                            CeleBrease was built to fundamentally change how we host. We believe that if you can rent a tuxedo for a wedding, you should be able to rent professional-grade decor for your biggest life events.
                        </p>
                        <p style={{ color: "var(--cb-ink-muted)", fontSize: 16, lineHeight: 1.72 }}>
                            We offer designer-curated collections for 19 different holidays and milestones. We deliver them perfectly styled right before your celebration, and we pick them up when the party is over. You get a magazine-worthy atmosphere, and we handle the logistics, the cleaning, and the storage.
                        </p>
                        <blockquote
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontStyle: "italic",
                                fontSize: 19,
                                lineHeight: 1.55,
                                color: "var(--cb-ink)",
                                padding: "20px 24px",
                                borderLeft: "3px solid var(--cb-purple)",
                                background: "rgba(155,47,201,0.04)",
                                borderRadius: "0 12px 12px 0",
                                marginTop: 4,
                            }}
                        >
                            &ldquo;We believe the best moments in life should be unforgettable, not permanent.&rdquo;
                        </blockquote>
                    </div>

                    {/* Image */}
                    <div style={{ position: "relative" }}>
                        {mosaic0 && (
                            <Image
                                src={img(mosaic0.image)}
                                alt="CeleBrease team assembling a holiday décor kit"
                                width={800} height={1000}
                                style={{
                                    width: "100%",
                                    aspectRatio: "4/5",
                                    objectFit: "cover",
                                    borderRadius: "var(--cb-r-lg)",
                                    boxShadow: "var(--cb-shadow-lg)",
                                }}
                            />
                        )}
                        {mosaic1 && (
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -24,
                                    left: -24,
                                    width: "46%",
                                    aspectRatio: "1",
                                    borderRadius: "var(--cb-r-card)",
                                    overflow: "hidden",
                                    border: "5px solid #fff",
                                    boxShadow: "var(--cb-shadow-md)",
                                }}
                            >
                                <Image
                                    src={img(mosaic1.image)}
                                    alt="Curated décor collection detail"
                                    width={400} height={400}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== VALUES TRIO ===== */}
            <section
                aria-labelledby="values-heading"
                style={{ background: "var(--cb-cream)", padding: "clamp(64px,7vw,96px) 24px" }}
            >
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">What we stand for</span>
                        <h2 id="values-heading">Four promises we won&apos;t compromise on.</h2>
                        <p>Built into every kit, every delivery, every refund.</p>
                    </div>

                    <div className="cb-trio-grid">
                        {[
                            { ic: "✨", title: "Designer curation", body: "Every kit is hand-styled by our in-house team of interior decorators. Never generic, never repeated, fresh looks every season for every holiday." },
                            { ic: "♻️", title: "Sustainable by design", body: "One kit serves dozens of homes. We've kept literal tons of décor out of landfills, and your attic. Renting cuts holiday décor waste by up to 78%." },
                            { ic: "🌍", title: "Every tradition belongs", body: "19 holidays across faiths and cultures, designed by people who actually celebrate them. Whether it's Eid, Juneteenth, or Lunar New Year, you'll feel seen." },
                        ].map((v) => (
                            <div key={v.title} className="cb-trio-card">
                                <div className="cb-trio-ic" aria-hidden="true">{v.ic}</div>
                                <h3>{v.title}</h3>
                                <p>{v.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="cb-trio-grid" style={{ marginTop: 40 }}>
                        {[
                            { ic: "📦", title: "No clutter, no storage", body: "We deliver, then pick it up. Your attic and closets stay completely yours. Open the box, celebrate, hand it back, that's it." },
                            { ic: "💎", title: "Deposit always refunded", body: "Your deposit is returned in full within five business days of return, every time. No hidden fees, no small print deductions." },
                            { ic: "🚚", title: "Free shipping, both ways", body: "We cover every delivery and pickup with our prepaid label system. Doorstep to doorstep, always included in your plan." },
                        ].map((v) => (
                            <div key={v.title} className="cb-trio-card">
                                <div className="cb-trio-ic" aria-hidden="true">{v.ic}</div>
                                <h3>{v.title}</h3>
                                <p>{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOLIDAYS COLLAGE ===== */}
            <section
                aria-labelledby="collage-heading"
                style={{ background: "#fff", padding: "clamp(64px,7vw,96px) 24px" }}
            >
                <div className="cb-container">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginBottom: 32,
                            flexWrap: "wrap",
                            gap: 14,
                        }}
                    >
                        <div>
                            <span className="eyebrow">Our collections</span>
                            <h2
                                id="collage-heading"
                                style={{ fontSize: "clamp(1.9rem,3.5vw,2.6rem)", marginTop: 6 }}
                            >
                                Every celebration, beautifully dressed.
                            </h2>
                        </div>
                        <Link
                            href="/catalog"
                            aria-label="Browse all holiday collections"
                            style={{ color: "var(--cb-purple)", fontWeight: 600, fontSize: 15 }}
                        >
                            Browse all 19 →
                        </Link>
                    </div>

                    <div
                        aria-label="Gallery of holiday collections"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6,1fr)",
                            gridAutoRows: "180px",
                            gap: 12,
                        }}
                    >
                        {[
                            { h: c0, span: 2, label: c0?.name ?? "Christmas" },
                            { h: c1, span: 2, label: c1?.name ?? "Halloween" },
                            { h: c2, span: 2, label: c2?.name ?? "Diwali" },
                            { h: c3, span: 3, label: c3?.name ?? "Thanksgiving" },
                            { h: c4, span: 1, label: c4?.name ?? "Hanukkah" },
                            { h: c5, span: 2, label: c5?.name ?? "Nowruz" },
                            { h: c6, span: 2, label: c6?.name ?? "Eid" },
                            { h: c7, span: 4, label: c7?.name ?? "Lunar New Year" },
                        ].map((cell, i) =>
                            cell.h ? (
                                <div
                                    key={cell.h.id ?? i}
                                    style={{
                                        gridColumn: `span ${cell.span}`,
                                        borderRadius: "var(--cb-r-card)",
                                        overflow: "hidden",
                                        position: "relative",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Image
                                        src={img(cell.h.image)}
                                        alt={`${cell.label} holiday collection`}
                                        width={600} height={400}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transition: "transform .4s",
                                        }}
                                    />
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg, transparent 45%, rgba(26,11,46,0.72) 100%)",
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: 12,
                                            bottom: 10,
                                            color: "#fff",
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        {cell.label}
                                    </span>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </section>

            {/* ===== PRESS / FEATURED HOMES ===== */}
            <section
                aria-labelledby="press-heading"
                style={{
                    background: "var(--cb-lavender)",
                    padding: "clamp(48px,5vw,72px) 24px",
                }}
            >
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">Seen in real homes</span>
                        <h2 id="press-heading">Celebrations we&apos;re proud of.</h2>
                        <p>A few of the homes our teams have dressed across the country.</p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 24,
                            maxWidth: 960,
                            margin: "0 auto",
                        }}
                    >
                        {[
                            {
                                h: press0,
                                tag: "Chicago · February",
                                title: "A Valentine's dinner she'll never forget",
                                body: "Our Premium Valentine's kit turned a city apartment into a candlelit bistro for the night. Styled in under 40 minutes.",
                            },
                            {
                                h: press1,
                                tag: "Atlanta · June",
                                title: "A Juneteenth gathering full of meaning",
                                body: "Our Juneteenth collection, developed with cultural advisors, brought heritage and joy into one family's backyard.",
                            },
                            {
                                h: press2,
                                tag: "Seattle · May",
                                title: "A Mother's Day brunch, magazine-ready",
                                body: "The styling card made it effortless. Fresh florals, coordinated linens, and a table that looked like it took a day, but took an hour.",
                            },
                        ].map((card, i) => (
                            <article
                                key={i}
                                style={{
                                    background: "#fff",
                                    borderRadius: "var(--cb-r-card)",
                                    overflow: "hidden",
                                    boxShadow: "var(--cb-shadow-sm)",
                                    transition: "transform .25s, box-shadow .25s",
                                }}
                            >
                                {card.h && (
                                    <Image
                                        src={img(card.h.image)}
                                        alt={card.title}
                                        width={600} height={400}
                                        style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover" }}
                                    />
                                )}
                                <div style={{ padding: "22px 24px" }}>
                                    <p
                                        style={{
                                            fontSize: 11,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.1em",
                                            color: "var(--cb-magenta)",
                                            fontWeight: 700,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {card.tag}
                                    </p>
                                    <h3 style={{ fontSize: 18, lineHeight: 1.3, marginBottom: 8 }}>{card.title}</h3>
                                    <p style={{ fontSize: 14, color: "var(--cb-ink-muted)", lineHeight: 1.55 }}>
                                        {card.body}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== MORE HOLIDAYS STRIP ===== */}
            <section
                aria-labelledby="more-heading"
                style={{ background: "#fff", padding: "clamp(48px,5vw,72px) 24px" }}
            >
                <div className="cb-container">
                    <div className="sec-head">
                        <span className="eyebrow">And many more</span>
                        <h2 id="more-heading">Every faith. Every family. Every reason to celebrate.</h2>
                        <p>
                            From intimate baby showers to milestone birthdays to Ramadan evenings, we&apos;ve built a
                            collection for every chapter of your home&apos;s story.
                        </p>
                    </div>

                    <div
                        role="list"
                        aria-label="Additional holiday collections"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5,1fr)",
                            gap: 16,
                            maxWidth: 960,
                            margin: "0 auto",
                        }}
                    >
                        {more.map((m) =>
                            m.h ? (
                                <div
                                    key={m.key}
                                    role="listitem"
                                    style={{
                                        borderRadius: "var(--cb-r-card)",
                                        overflow: "hidden",
                                        aspectRatio: "3/4",
                                        position: "relative",
                                        boxShadow: "var(--cb-shadow-sm)",
                                    }}
                                >
                                    <Image
                                        src={img(m.h.image)}
                                        alt={`${m.label} holiday collection`}
                                        width={400} height={500}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg,transparent 50%,rgba(26,11,46,0.75) 100%)",
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: 12,
                                            bottom: 10,
                                            color: "#fff",
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        {m.label}
                                    </span>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}
