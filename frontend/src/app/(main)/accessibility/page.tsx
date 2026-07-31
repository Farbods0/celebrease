import type React from "react";
import Link from "next/link";

export default function AccessibilityPage() {
    return (
        <div className="cb">

            {/* ===== HERO BANNER ===== */}
            <section
                aria-label="Accessibility Statement header"
                style={{
                    background: "radial-gradient(1100px 400px at 20% 0%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
                    padding: "clamp(56px,7vw,96px) 24px clamp(48px,6vw,72px)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* glow blob */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        width: 420,
                        height: 420,
                        right: -100,
                        top: -100,
                        background: "radial-gradient(circle, rgba(220,0,117,0.14), transparent 70%)",
                        filter: "blur(16px)",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13.5,
                            color: "var(--cb-ink-soft)",
                            marginBottom: 22,
                            fontWeight: 500,
                        }}
                    >
                        <Link
                            href="/"
                            style={{ color: "var(--cb-purple)", fontWeight: 600 }}
                        >
                            Home
                        </Link>
                        <span aria-hidden="true">›</span>
                        <span aria-current="page">Accessibility Statement</span>
                    </nav>

                    {/* Eyebrow pill */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#fff",
                            border: "1px solid var(--cb-line)",
                            color: "var(--cb-purple)",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "6px 14px",
                            borderRadius: "var(--cb-r-pill)",
                            boxShadow: "var(--cb-shadow-xs)",
                            marginBottom: 18,
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "var(--cb-magenta)",
                                boxShadow: "0 0 0 3px rgba(220,0,117,0.15)",
                                display: "inline-block",
                            }}
                        />
                        Legal &amp; Trust
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                            lineHeight: 1.05,
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        Accessibility <span className="gradient-text">Statement</span>
                    </h1>

                    {/* Meta row */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            flexWrap: "wrap",
                            fontSize: 14,
                            color: "var(--cb-ink-muted)",
                            marginTop: 8,
                        }}
                    >
                        <span
                            style={{
                                background: "#EFE6F9",
                                color: "var(--cb-purple)",
                                padding: "4px 14px",
                                borderRadius: "var(--cb-r-pill)",
                                fontSize: 12.5,
                                fontWeight: 600,
                            }}
                        >
                            Last updated: June 15, 2026
                        </span>
                        <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-ink-soft)", display: "inline-block" }} />
                        <span>Effective date: January 1, 2026</span>
                        <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-ink-soft)", display: "inline-block" }} />
                        <span>~5 min read</span>
                    </div>
                </div>
            </section>

            {/* ===== MAIN LAYOUT ===== */}
            <main id="main-content">
                <div
                    style={{
                        maxWidth: 1060,
                        margin: "0 auto",
                        padding: "clamp(48px,6vw,80px) 24px clamp(64px,8vw,100px)",
                        display: "grid",
                        gridTemplateColumns: "220px 1fr",
                        gap: 56,
                        alignItems: "start",
                    }}
                    className="accessibility-layout"
                >

                    {/* ===== STICKY TOC ===== */}
                    <aside aria-label="Table of contents">
                        <div
                            style={{
                                position: "sticky",
                                top: 88,
                            }}
                        >
                            <div
                                style={{
                                    background: "var(--cb-lavender)",
                                    border: "1px solid var(--cb-line)",
                                    borderRadius: 18,
                                    padding: "22px 20px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 11,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.12em",
                                        color: "var(--cb-ink-soft)",
                                        fontWeight: 700,
                                        marginBottom: 14,
                                    }}
                                >
                                    On this page
                                </p>
                                <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                                    {[
                                        { href: "#commitment", label: "Our Commitment" },
                                        { href: "#conformance", label: "Conformance Status" },
                                        { href: "#features", label: "Accessibility Features" },
                                        { href: "#limitations", label: "Known Limitations" },
                                        { href: "#feedback", label: "Feedback & Contact" },
                                        { href: "#compatibility", label: "Compatibility" },
                                    ].map((item) => (
                                        <li key={item.href}>
                                            <a
                                                href={item.href}
                                                style={{
                                                    display: "block",
                                                    padding: "7px 10px",
                                                    borderRadius: 10,
                                                    fontSize: 13.5,
                                                    color: "var(--cb-ink-muted)",
                                                    fontWeight: 500,
                                                    lineHeight: 1.35,
                                                    transition: "background .2s, color .2s",
                                                }}
                                                className="toc-link"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div
                                    style={{
                                        marginTop: 18,
                                        paddingTop: 18,
                                        borderTop: "1px solid var(--cb-line)",
                                    }}
                                >
                                    <p style={{ fontSize: 12.5, color: "var(--cb-ink-soft)", lineHeight: 1.5, marginBottom: 8 }}>
                                        Accessibility questions?
                                    </p>
                                    <a
                                        href="mailto:accessibility@celebrease.com"
                                        style={{ fontSize: 13, color: "var(--cb-purple)", fontWeight: 600, wordBreak: "break-word" }}
                                    >
                                        accessibility@celebrease.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ===== LEGAL CONTENT ===== */}
                    <article aria-label="Accessibility statement content" style={{ minWidth: 0 }}>

                        {/* 1. Our Commitment */}
                        <LegalSection id="commitment" num={1} title="Our Commitment">
                            <HighlightBox>
                                <strong style={{ color: "var(--cb-purple)", fontWeight: 700 }}>Celebration is for everyone.</strong>{" "}
                                CeleBrease is committed to ensuring that our website and service are accessible to all people, including those with disabilities, on equal terms.
                            </HighlightBox>
                            <p>CeleBrease, Inc. (&ldquo;CeleBrease,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) believes that every customer, regardless of ability, deserves to discover, browse, and rent holiday decoration kits with ease and dignity. We work continuously to improve the accessibility of our digital experience in line with internationally recognised standards.</p>
                            <p>We have invested in ongoing accessibility auditing, user testing with assistive technology users, and a dedicated internal review process for every major product release. Accessibility is not a checkbox for us; it is a design principle embedded from the earliest stages of each feature.</p>
                            <p>This statement applies to our main website at{" "}
                                <a href="https://www.celebrease.com" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>celebrease.com</a>
                                {" "}and all pages served under that domain, including the customer account portal and catalog.</p>
                        </LegalSection>

                        {/* 2. Conformance Status */}
                        <LegalSection id="conformance" num={2} title="Conformance Status">
                            <div
                                role="img"
                                aria-label="WCAG 2.1 Level AA, Partially conformant"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    background: "#fff",
                                    border: "1.5px solid rgba(155,47,201,0.25)",
                                    borderRadius: 14,
                                    padding: "14px 18px",
                                    margin: "20px 0",
                                    boxShadow: "var(--cb-shadow-xs)",
                                }}
                            >
                                <div
                                    aria-hidden="true"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        background: "var(--cb-gradient-h)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: 18,
                                        flexShrink: 0,
                                    }}
                                >
                                    ✓
                                </div>
                                <div>
                                    <strong style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--cb-ink)", marginBottom: 2 }}>
                                        WCAG 2.1 Level AA
                                    </strong>
                                    <span style={{ fontSize: 13, color: "var(--cb-ink-soft)" }}>
                                        Partially conformant, we are actively working toward full conformance
                                    </span>
                                </div>
                            </div>

                            <p>The{" "}
                                <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" rel="noopener noreferrer" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>
                                    Web Content Accessibility Guidelines (WCAG)
                                </a>
                                {" "}2.1, published by the World Wide Web Consortium (W3C), define requirements for making web content accessible to people with disabilities. We target{" "}
                                <strong>Level AA</strong> compliance across the four principles: Perceivable, Operable, Understandable, and Robust.
                            </p>

                            <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14.5 }}>
                                <thead>
                                    <tr>
                                        {["WCAG Principle", "Status", "Notes"].map((h) => (
                                            <th key={h} scope="col" style={{ background: "var(--cb-lavender)", color: "var(--cb-ink)", fontWeight: 700, padding: "12px 16px", textAlign: "left", border: "1px solid var(--cb-line)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { principle: <><strong>Perceivable</strong>, 1.x</>, status: "Substantially met", notes: "All images have alt text; colour contrast meets AA on core pages; captions provided where video is used" },
                                        { principle: <><strong>Operable</strong>, 2.x</>, status: "Substantially met", notes: "Full keyboard navigation supported; skip-to-content link present; no seizure-triggering animations" },
                                        { principle: <><strong>Understandable</strong>, 3.x</>, status: "Substantially met", notes: "Language attribute set on all pages; error messages are descriptive; form labels are explicit" },
                                        { principle: <><strong>Robust</strong>, 4.x</>, status: "Partially met", notes: "Core flows validated with NVDA, JAWS, and VoiceOver; some third party widgets have outstanding issues (see Known Limitations)" },
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: "12px 16px", border: "1px solid var(--cb-line)", color: "var(--cb-ink-muted)", lineHeight: 1.55, verticalAlign: "top" }}>{row.principle}</td>
                                            <td style={{ padding: "12px 16px", border: "1px solid var(--cb-line)", color: "var(--cb-ink-muted)", lineHeight: 1.55, verticalAlign: "top" }}>{row.status}</td>
                                            <td style={{ padding: "12px 16px", border: "1px solid var(--cb-line)", color: "var(--cb-ink-muted)", lineHeight: 1.55, verticalAlign: "top" }}>{row.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p>Our last comprehensive third party audit was completed in March 2026. We conduct internal automated scans with axe-core on every deployment.</p>
                        </LegalSection>

                        {/* 3. Accessibility Features */}
                        <LegalSection id="features" num={3} title="Accessibility Features">
                            <p>The following features are built into the CeleBrease website to support a wide range of users and assistive technologies:</p>

                            <h3 style={h3Style}>Navigation &amp; structure</h3>
                            <LegalList items={[
                                <>A visible <strong>skip to main content</strong> link appears at the top of every page when keyboard focus arrives, allowing keyboard and screen reader users to bypass repetitive navigation.</>,
                                <>Consistent landmark regions (<code>nav</code>, <code>main</code>, <code>aside</code>, <code>footer</code>) on all pages so screen reader users can jump directly to any section.</>,
                                <>Logical heading hierarchy (h1 → h2 → h3) maintained throughout to provide a clear document outline.</>,
                                <>Breadcrumb navigation with proper ARIA labels on all interior pages.</>,
                            ]} />

                            <h3 style={h3Style}>Images &amp; media</h3>
                            <LegalList items={[
                                <>All meaningful images carry descriptive <code>alt</code> text matched to their context. Decorative images use empty <code>alt=&quot;&quot;</code> so screen readers skip them.</>,
                                <>Holiday kit photography is described in accompanying card text, ensuring product information is not conveyed by images alone.</>,
                                <>No auto playing video or audio is present anywhere on the site.</>,
                            ]} />

                            <h3 style={h3Style}>Keyboard &amp; focus</h3>
                            <LegalList items={[
                                <>All interactive elements, links, buttons, form fields, dropdowns, and modal dialogs, are fully operable using a keyboard alone.</>,
                                <>Visible focus indicators with a minimum 3:1 contrast ratio are present on all focusable elements; we use custom focus rings styled with the brand gradient rather than the browser default where needed.</>,
                                <>The mobile navigation drawer traps focus while open and returns focus to the trigger button when closed.</>,
                                <>The checkout flow and account forms support full tab order and Enter/Space activation.</>,
                            ]} />

                            <h3 style={h3Style}>Colour &amp; contrast</h3>
                            <LegalList items={[
                                <>Body text meets a minimum contrast ratio of 4.5:1 against its background (WCAG 1.4.3 AA).</>,
                                <>Large text and UI components meet the 3:1 ratio requirement (WCAG 1.4.11).</>,
                                <>Information is never conveyed by colour alone, status badges use both colour and text labels.</>,
                            ]} />

                            <h3 style={h3Style}>Forms &amp; error handling</h3>
                            <LegalList items={[
                                <>Every form input has an explicit, visible <code>&lt;label&gt;</code> element, no placeholder only labelling.</>,
                                <>Required fields are marked both visually and programmatically with <code>aria-required=&quot;true&quot;</code>.</>,
                                <>Inline error messages are associated with their fields via <code>aria-describedby</code> and are announced immediately to screen readers using <code>aria-live</code> regions.</>,
                                <>The checkout summary page provides a clear review step before any payment is submitted.</>,
                            ]} />

                            <h3 style={h3Style}>Reduced motion</h3>
                            <LegalList items={[
                                <>All animations and transitions respect the <code>prefers-reduced-motion</code> media query. Users with vestibular disorders or motion sensitivity will see static transitions instead of kinetic effects.</>,
                            ]} />
                        </LegalSection>

                        {/* 4. Known Limitations */}
                        <LegalSection id="limitations" num={4} title="Known Limitations">
                            <p>Despite our best efforts, some areas of the website have known accessibility gaps we are actively working to resolve. We document them transparently here, along with workarounds where they exist:</p>

                            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    {
                                        tag: "In progress",
                                        content: (
                                            <><strong>Stripe payment iframe:</strong>{" "}The embedded Stripe Checkout frame is a third party component. Some screen readers may announce card field labels inconsistently. Workaround: Stripe&apos;s hosted payment page at checkout is fully accessible and will be offered as an alternative by contacting support.</>
                                        ),
                                    },
                                    {
                                        tag: "In progress",
                                        content: (
                                            <><strong>Kit image carousel on mobile:</strong>{" "}The scrollable kit card row on the catalog page does not yet expose full ARIA carousel semantics. Keyboard users can still scroll the row using arrow keys after focusing the first card; however, a dedicated previous/next button control will be added in Q3 2026.</>
                                        ),
                                    },
                                    {
                                        tag: "Planned Q3 2026",
                                        content: (
                                            <><strong>PDF rental agreement:</strong>{" "}The downloadable rental agreement PDF has not yet been tagged for screen reader accessibility. A fully accessible HTML version of the agreement is available on the{" "}<a href="/terms" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>Terms page</a>.</>
                                        ),
                                    },
                                    {
                                        tag: "Monitoring",
                                        content: (
                                            <><strong>Toast notifications:</strong>{" "}Transient toast messages (e.g., &ldquo;Added to cart&rdquo;) are announced via an ARIA live region; however, on some versions of JAWS with Firefox the announcement may be delayed by up to 2 seconds. We are tracking this upstream.</>
                                        ),
                                    },
                                ].map((item, i) => (
                                    <li key={i} style={{ display: "flex", gap: 12, fontSize: 15, color: "var(--cb-ink-muted)", lineHeight: 1.65 }}>
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                background: "var(--cb-magenta)",
                                                marginTop: 8,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <div>
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    background: "#FFF5F8",
                                                    border: "1px solid rgba(220,0,117,0.2)",
                                                    borderRadius: "var(--cb-r-pill)",
                                                    padding: "3px 12px",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "var(--cb-magenta)",
                                                    marginBottom: 6,
                                                }}
                                            >
                                                {item.tag}
                                            </span>
                                            <br />
                                            {item.content}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <HighlightBox>
                                <strong style={{ color: "var(--cb-purple)", fontWeight: 700 }}>Our commitment:</strong>{" "}
                                Every known limitation has a tracked issue in our engineering backlog with an assigned remediation milestone. We publish this list and update it after each major release cycle.
                            </HighlightBox>
                        </LegalSection>

                        {/* 5. Feedback & Contact */}
                        <LegalSection id="feedback" num={5} title="Feedback &amp; Contact">
                            <p>We welcome feedback on the accessibility of CeleBrease. If you experience a barrier that prevents you from accessing any part of our website, or if you need content in an alternative format, please contact us and we will do our best to help within 5 business days.</p>

                            <LegalList items={[
                                <><strong>Email:</strong>{" "}<a href="mailto:accessibility@celebrease.com" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>accessibility@celebrease.com</a></>,
                                <><strong>Response time:</strong> We acknowledge all accessibility related reports within 2 business days and aim to resolve critical barriers within 10 business days.</>,
                                <><strong>Phone:</strong> +1 (800) 555-0180, available Monday to Friday, 9 am, 5 pm PT. Relay service callers are welcome.</>,
                                <><strong>Postal address:</strong> CeleBrease, Inc. · Accessibility Team · [Address on file at launch]</>,
                            ]} />

                            <p>If you are not satisfied with our response, you may contact the{" "}
                                <a href="https://www.ada.gov/" rel="noopener noreferrer" style={{ color: "var(--cb-purple)", fontWeight: 600 }}>ADA National Network</a>
                                {" "}for guidance, or your local accessibility authority if you are outside the United States.
                            </p>

                            <HighlightBox>
                                We use all accessibility feedback to inform our ongoing improvement roadmap. Your report directly influences what gets fixed next.
                            </HighlightBox>
                        </LegalSection>

                        {/* 6. Compatibility */}
                        <LegalSection id="compatibility" num={6} title="Compatibility">
                            <p>CeleBrease is designed to be compatible with the following browsers and assistive technologies. We test against these combinations before every major release:</p>

                            <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14.5 }}>
                                <thead>
                                    <tr>
                                        {["Assistive Technology", "Browser", "Platform", "Status"].map((h) => (
                                            <th key={h} scope="col" style={{ background: "var(--cb-lavender)", color: "var(--cb-ink)", fontWeight: 700, padding: "12px 16px", textAlign: "left", border: "1px solid var(--cb-line)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["VoiceOver", "Safari 17+", "macOS 14 / iOS 17", "Fully supported"],
                                        ["NVDA 2024+", "Chrome 120+ / Firefox 122+", "Windows 10/11", "Fully supported"],
                                        ["JAWS 2024+", "Chrome 120+ / Edge 120+", "Windows 10/11", "Substantially supported"],
                                        ["TalkBack", "Chrome for Android", "Android 13+", "Substantially supported"],
                                        ["Keyboard only (no AT)", "All modern browsers", "Any desktop OS", "Fully supported"],
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j} style={{ padding: "12px 16px", border: "1px solid var(--cb-line)", color: "var(--cb-ink-muted)", lineHeight: 1.55, verticalAlign: "top" }}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p>We recommend using the latest version of your preferred browser and assistive technology for the best experience. Internet Explorer is not supported.</p>

                            <h3 style={h3Style}>Technical approach</h3>
                            <p>CeleBrease is built with Next.js and React, using semantic HTML5 elements, ARIA attributes applied conservatively and correctly, and no JavaScript-dependent content that cannot be perceived by assistive technologies. Our style sheet respects user agent font sizing and zoom up to 400% without loss of content or functionality.</p>

                            <HighlightBox>
                                <strong style={{ color: "var(--cb-purple)", fontWeight: 700 }}>Formal accessibility assessments</strong>{" "}
                                are conducted by our internal team supplemented by third party reviews from specialist accessibility consultants. This statement was last reviewed on June 15, 2026.
                            </HighlightBox>
                        </LegalSection>

                    </article>
                </div>
            </main>

            <style>{`
                .legal-section:last-child {
                    border-bottom: none !important;
                    margin-bottom: 0 !important;
                    padding-bottom: 0 !important;
                }
                .legal-section-body p {
                    margin-bottom: 14px;
                }
                .legal-section-body p:last-child {
                    margin-bottom: 0;
                }
                .accessibility-layout {
                    /* responsive: single column on narrow */
                }
                @media (max-width: 860px) {
                    .accessibility-layout {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                    .accessibility-layout aside {
                        margin-bottom: 40px;
                    }
                    .accessibility-layout aside > div {
                        position: static !important;
                    }
                    .accessibility-layout .toc-list {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        gap: 6px !important;
                    }
                    .accessibility-layout .toc-contact {
                        display: none !important;
                    }
                }
                @media (max-width: 600px) {
                    .accessibility-layout h1 { font-size: 2rem !important; }
                }
                .toc-link:hover {
                    background: #fff;
                    color: var(--cb-purple) !important;
                    font-weight: 600 !important;
                    box-shadow: var(--cb-shadow-xs);
                }
                .cb .legal-section table tr:hover td {
                    background: var(--cb-lavender);
                }
            `}</style>

        </div>
    );
}

// ---- Sub-components ----

const h3Style: React.CSSProperties = {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--cb-ink)",
    margin: "22px 0 10px",
};

function LegalSection({
    id,
    num,
    title,
    children,
}: {
    id: string;
    num: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-heading`}
            style={{
                marginBottom: 52,
                paddingBottom: 52,
                borderBottom: "1px solid var(--cb-line)",
            }}
            className="legal-section"
        >
            <h2
                id={`${id}-heading`}
                style={{
                    fontSize: "clamp(1.35rem, 2.4vw, 1.75rem)",
                    fontWeight: 700,
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    lineHeight: 1.15,
                }}
            >
                <span
                    aria-hidden="true"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "var(--cb-gradient-h)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(155,47,201,0.25)",
                        flexShrink: 0,
                    }}
                >
                    {num}
                </span>
                {/* render title as HTML to handle &amp; etc */}
                <span dangerouslySetInnerHTML={{ __html: title }} />
            </h2>
            <div
                style={{
                    fontSize: 15.5,
                    color: "var(--cb-ink-muted)",
                    lineHeight: 1.75,
                }}
                className="legal-section-body"
            >
                {children}
            </div>
        </section>
    );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                background: "var(--cb-lavender)",
                border: "1px solid var(--cb-line)",
                borderLeft: "3px solid var(--cb-purple)",
                borderRadius: 12,
                padding: "18px 20px",
                margin: "20px 0",
                fontSize: 15,
                color: "var(--cb-ink-muted)",
                lineHeight: 1.7,
            }}
        >
            {children}
        </div>
    );
}

function LegalList({ items }: { items: React.ReactNode[] }) {
    return (
        <ul style={{ listStyle: "none", padding: 0, margin: "16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 12, fontSize: 15, color: "var(--cb-ink-muted)", lineHeight: 1.65 }}>
                    <span
                        aria-hidden="true"
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--cb-magenta)",
                            marginTop: 8,
                            flexShrink: 0,
                        }}
                    />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}
