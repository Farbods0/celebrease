import Link from "next/link";

export default function ReturnPolicyPage() {
    return (
        <div className="cb">

            {/* ===== HERO BANNER ===== */}
            <section
                aria-label="Return and Deposit Policy header"
                style={{
                    background:
                        "radial-gradient(1100px 400px at 20% 0%, #FAEFFF 0%, var(--cb-lavender) 50%, #fff 100%)",
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
                        className="rp-breadcrumb"
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
                        <span aria-current="page">Return &amp; Deposit Policy</span>
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
                        Rental Agreement
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                            lineHeight: 1.05,
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        Return &amp; Deposit{" "}
                        <span className="gradient-text">Policy</span>
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
                                background: "var(--cb-lavender)",
                                color: "var(--cb-purple)",
                                padding: "4px 14px",
                                borderRadius: "var(--cb-r-pill)",
                                fontSize: 12.5,
                                fontWeight: 600,
                            }}
                        >
                            Last updated: June 15, 2026
                        </span>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: "var(--cb-ink-soft)",
                                display: "inline-block",
                            }}
                        />
                        <span>Effective date: January 1, 2026</span>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: "var(--cb-ink-soft)",
                                display: "inline-block",
                            }}
                        />
                        <span>~5 min read</span>
                    </div>
                </div>
            </section>

            {/* ===== MAIN LAYOUT ===== */}
            <main id="main-content">
                <div
                    className="rp-layout"
                    style={{
                        maxWidth: 1060,
                        margin: "0 auto",
                        padding: "clamp(48px,6vw,80px) 24px clamp(64px,8vw,100px)",
                        display: "grid",
                        gridTemplateColumns: "220px 1fr",
                        gap: 56,
                        alignItems: "start",
                    }}
                >
                    {/* ===== STICKY TOC ===== */}
                    <aside aria-label="Table of contents">
                        <div style={{ position: "sticky", top: 88 }}>
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
                                <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2, padding: 0, margin: 0 }}>
                                    {[
                                        { href: "#overview", label: "Overview" },
                                        { href: "#return-window", label: "Return Window & Process" },
                                        { href: "#prepaid-labels", label: "Prepaid Labels & Pickup" },
                                        { href: "#deposit-refund", label: "Deposit Refund Timeline" },
                                        { href: "#condition-standards", label: "Condition Standards" },
                                        { href: "#damage-charges", label: "Damage & Replacement Charges" },
                                        { href: "#lost-kits", label: "Lost or Unreturned Kits" },
                                        { href: "#contact", label: "Contact" },
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
                                                    transition: "background .2s, color .2s",
                                                    lineHeight: 1.35,
                                                }}
                                                className="rp-toc-link"
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
                                        Return questions?
                                    </p>
                                    <a
                                        href="mailto:returns@celebrease.com"
                                        style={{ fontSize: 13, color: "var(--cb-purple)", fontWeight: 600, wordBreak: "break-word" }}
                                    >
                                        returns@celebrease.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ===== LEGAL CONTENT ===== */}
                    <article
                        className="rp-content"
                        aria-label="Return and deposit policy content"
                        style={{ minWidth: 0 }}
                    >

                        {/* ── 1. Overview ── */}
                        <section className="rp-section" id="overview" aria-labelledby="overview-heading">
                            <h2 id="overview-heading">
                                <span className="rp-num" aria-hidden="true">1</span>
                                Overview
                            </h2>
                            <div className="rp-highlight">
                                <strong>The short version:</strong> Return your kit within the rental window, in the same condition it arrived, using the prepaid label we provide. We inspect within 2 business days and refund your deposit within 5 business days of clearance, no phone calls needed.
                            </div>
                            <p>At CeleBrease, every kit is professionally cleaned, inspected, and photographed before it ships to you. Our deposit system is designed to be fair and transparent: you know exactly what you paid, exactly what condition standards apply, and exactly when your money comes back. This policy covers all CeleBrease holiday kit rentals, add on items, and accessories included in your order.</p>
                            <p>This policy forms part of your Rental Agreement. By accepting delivery of a CeleBrease kit, you agree to the return and deposit terms described here.</p>
                        </section>

                        {/* ── 2. Return Window & Process ── */}
                        <section className="rp-section" id="return-window" aria-labelledby="return-window-heading">
                            <h2 id="return-window-heading">
                                <span className="rp-num" aria-hidden="true">2</span>
                                Return Window &amp; Process
                            </h2>
                            <p>Your rental period begins on the confirmed delivery date and ends on the date shown in your order confirmation. Two rental durations are available at booking:</p>

                            <table className="rp-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Rental Duration</th>
                                        <th scope="col">Return Deadline</th>
                                        <th scope="col">Late Return Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>30 day rental</td>
                                        <td>Day 30 from delivery (11:59 PM local time)</td>
                                        <td>$12/day, capped at 14 days</td>
                                    </tr>
                                    <tr>
                                        <td>60-day rental</td>
                                        <td>Day 60 from delivery (11:59 PM local time)</td>
                                        <td>$12/day, capped at 14 days</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3>How to initiate a return</h3>
                            <ol>
                                <li>Log in to your account and go to <strong>Orders → Request Return</strong>. You can do this any time during your rental window, you do not need to wait until the last day.</li>
                                <li>Select the items you are returning. If you are returning the full kit, select &ldquo;Return entire order.&rdquo;</li>
                                <li>Download or print your prepaid return label from the confirmation screen. It is also emailed to you automatically.</li>
                                <li>Pack items securely in the original packaging or comparable protective wrapping. Loose items should be individually wrapped to prevent transit damage.</li>
                                <li>Drop off the sealed package at any compatible carrier location (UPS, FedEx, or USPS depending on your label) within 48 hours of initiating the return.</li>
                            </ol>

                            <div className="rp-highlight">
                                <strong>Important:</strong> Your return window is measured from the carrier&apos;s scan of the outgoing package, not from when items arrive at our facility. As long as you drop off before your deadline, you are on time, even if transit takes a few days.
                            </div>
                        </section>

                        {/* ── 3. Prepaid Labels & Pickup ── */}
                        <section className="rp-section" id="prepaid-labels" aria-labelledby="labels-heading">
                            <h2 id="labels-heading">
                                <span className="rp-num" aria-hidden="true">3</span>
                                Prepaid Return Labels &amp; Pickup
                            </h2>
                            <p>Every CeleBrease rental includes one complimentary prepaid return label. You never pay return shipping on a standard return, it is included in your rental fee.</p>

                            <ul>
                                <li><strong>Label generation:</strong> Labels are created automatically when you initiate a return through your account dashboard. They are valid for 10 days from the date of generation.</li>
                                <li><strong>Carrier:</strong> We match the carrier to your region for fastest transit, typically UPS for residential addresses and FedEx for business addresses. Your label will specify the carrier clearly.</li>
                                <li><strong>Scheduled pickup:</strong> If dropping off at a carrier location is inconvenient, you may request a free home pickup by selecting &ldquo;Schedule Pickup&rdquo; after generating your label. Pickups are available Monday, Saturday, 8 AM, 8 PM, and can be booked up to 5 days in advance.</li>
                                <li><strong>Replacement labels:</strong> If your label is lost or expires before use, log in to your order and select &ldquo;Reissue Label.&rdquo; One replacement is provided at no charge; subsequent replacements are $4 each.</li>
                                <li><strong>Oversized kits:</strong> Ultimate-tier kits shipping to addresses without standard carrier access may require freight pickup. We will arrange this at no additional cost and contact you 7 days before your return deadline.</li>
                            </ul>

                            <p>All return shipments are tracked in real time. You will receive an email when the carrier scans your package, when it arrives at our facility, and when the inspection is complete.</p>
                        </section>

                        {/* ── 4. Deposit Refund Timeline ── */}
                        <section className="rp-section" id="deposit-refund" aria-labelledby="deposit-heading">
                            <h2 id="deposit-heading">
                                <span className="rp-num" aria-hidden="true">4</span>
                                Deposit Refund Timeline
                            </h2>
                            <p>Your deposit is held in full when your order is placed and is refunded, in full or in part, depending on item condition, after our inspection team reviews the returned kit.</p>

                            <table className="rp-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Step</th>
                                        <th scope="col">When it happens</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Package received at CeleBrease facility</td>
                                        <td>Typically 1, 3 business days after carrier pickup</td>
                                    </tr>
                                    <tr>
                                        <td>Inspection completed</td>
                                        <td>Within 2 business days of receipt</td>
                                    </tr>
                                    <tr>
                                        <td>Inspection report emailed to you</td>
                                        <td>Same day inspection is completed</td>
                                    </tr>
                                    <tr>
                                        <td>Deposit refund initiated</td>
                                        <td>Within 1 business day of inspection clearance</td>
                                    </tr>
                                    <tr>
                                        <td>Funds visible in your account</td>
                                        <td>Within 5 business days of refund initiation (bank timing varies)</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="rp-highlight">
                                <strong>5 business days guaranteed:</strong> We commit to initiating your deposit refund within 5 business days of your package arriving at our facility, or we will add a $10 courtesy credit to your CeleBrease account automatically.
                            </div>

                            <p>
                                Refunds are issued to the original payment method. If your card has been replaced or cancelled, contact us at{" "}
                                <a href="mailto:returns@celebrease.com">returns@celebrease.com</a> before initiating your return so we can update your payment details.
                            </p>
                        </section>

                        {/* ── 5. Condition Standards ── */}
                        <section className="rp-section" id="condition-standards" aria-labelledby="condition-heading">
                            <h2 id="condition-heading">
                                <span className="rp-num" aria-hidden="true">5</span>
                                Condition Standards
                            </h2>
                            <p>We inspect every returned item against the same four-point scale used when the kit was packed for your order. Our inspection team photographs any deviations and includes them in your inspection report. The four condition ratings are:</p>

                            <div className="rp-condition-grid">
                                <div className="rp-ccard">
                                    <span className="rp-badge rp-badge-mint">Mint</span>
                                    <h4>Mint Condition</h4>
                                    <p>Item is returned exactly as shipped, no marks, scuffs, missing pieces, or odors. Original packaging intact.</p>
                                    <div className="rp-deposit-note"><strong>Deposit outcome:</strong> Full refund. No deductions.</div>
                                </div>
                                <div className="rp-ccard">
                                    <span className="rp-badge rp-badge-good">Good</span>
                                    <h4>Good Condition</h4>
                                    <p>Light surface dust or minor scuff consistent with careful normal use. All pieces present. Packaging shows minor wear.</p>
                                    <div className="rp-deposit-note"><strong>Deposit outcome:</strong> Full refund. Normal wear is expected and never charged.</div>
                                </div>
                                <div className="rp-ccard">
                                    <span className="rp-badge rp-badge-worn">Worn</span>
                                    <h4>Worn / Needs Refresh</h4>
                                    <p>Visible scratches, missing non-structural accessories (e.g., ribbon, clips), or light staining that requires professional cleaning beyond standard.</p>
                                    <div className="rp-deposit-note"><strong>Deposit outcome:</strong> Partial deduction, typically 15, 35% of the item&apos;s deposit share, depending on restoration cost.</div>
                                </div>
                                <div className="rp-ccard">
                                    <span className="rp-badge rp-badge-damaged">Damaged</span>
                                    <h4>Damaged / Non Restorable</h4>
                                    <p>Broken structural components, deep stains, burn marks, missing principal pieces, or irreparable alteration. Item cannot be re-rented.</p>
                                    <div className="rp-deposit-note"><strong>Deposit outcome:</strong> Deduction up to 90% of the item&apos;s deposit share (see Section 6). Replacement cost capped at full deposit amount.</div>
                                </div>
                            </div>

                            <p>
                                We pre-photograph every item at our facility before shipping. If a return inspection reveals damage, we compare departure photos against return photos to ensure claims are fair and evidence-based. You may request our departure photographs at any time by contacting{" "}
                                <a href="mailto:returns@celebrease.com">returns@celebrease.com</a>.
                            </p>
                        </section>

                        {/* ── 6. Damage & Replacement Charges ── */}
                        <section className="rp-section" id="damage-charges" aria-labelledby="damage-heading">
                            <h2 id="damage-heading">
                                <span className="rp-num" aria-hidden="true">6</span>
                                Damage &amp; Replacement Charges
                            </h2>
                            <p>Damage charges are calculated per item and are always proportional, we do not charge replacement value for items that can be professionally restored. Our charge structure:</p>

                            <ul>
                                <li><strong>Restoration cleaning:</strong> $15, $45 per item, depending on the extent of cleaning required. Applied for &ldquo;Worn&rdquo; rated items where standard cleaning is insufficient.</li>
                                <li><strong>Component replacement:</strong> Cost of the specific damaged component (e.g., a broken ornament holder, a snapped garland clip), not the full kit. Itemised in your inspection report.</li>
                                <li><strong>Full item replacement:</strong> Applied only when an item is rated &ldquo;Damaged / Non Restorable.&rdquo; Charged at up to 90% of that item&apos;s listed wholesale replacement value.</li>
                            </ul>

                            <div className="rp-highlight">
                                <strong>Charge cap:</strong> Total damage and replacement charges for any single order will never exceed the deposit amount you paid at checkout, regardless of the number or cost of damaged items. Your deposit is your maximum liability.
                            </div>

                            <h3>Dispute process</h3>
                            <p>
                                If you disagree with an inspection finding, you have 7 days from receipt of your inspection report to submit a dispute by emailing{" "}
                                <a href="mailto:returns@celebrease.com">returns@celebrease.com</a> with the subject line &ldquo;Inspection Dispute, [Order #].&rdquo; Please include any photos you took upon delivery or during the rental period. A senior inspector will review the dispute within 3 business days and issue a revised finding. Dispute outcomes are final.
                            </p>

                            <h3>Items exempt from damage charges</h3>
                            <ul>
                                <li>Candles, consumable items, and single use decorations marked as &ldquo;keep after use&rdquo; in your packing slip.</li>
                                <li>Items pre noted as having minor cosmetic wear in your departure inspection report (already reflected in their condition rating at shipment).</li>
                                <li>Packaging material, boxes, tissue, and wrapping paper are expected to show wear and are not charged.</li>
                            </ul>
                        </section>

                        {/* ── 7. Lost or Unreturned Kits ── */}
                        <section className="rp-section" id="lost-kits" aria-labelledby="lost-heading">
                            <h2 id="lost-heading">
                                <span className="rp-num" aria-hidden="true">7</span>
                                Lost or Unreturned Kits
                            </h2>
                            <p>If a kit is not returned within the late return window (14 days past your rental deadline) and we have received no communication from you, it is classified as unreturned. We understand that life happens, if you need more time, contact us before your deadline and we will do our best to accommodate.</p>

                            <ul>
                                <li><strong>Late return fees:</strong> $12 per day per order, beginning the day after your rental deadline, for up to 14 days. These fees are charged to the payment method on file.</li>
                                <li><strong>Unreturned kit charge:</strong> After 14 days without return or contact, your full deposit is forfeited and a kit replacement charge of up to 150% of the deposit may be applied to recover the replacement cost of non-returnable items.</li>
                                <li><strong>Carrier loss in transit:</strong> If a carrier loses your return shipment after you have a valid scan confirmation, you are not liable. File a claim with us within 5 business days of the expected delivery window and we will pursue the claim with the carrier on your behalf. Your deposit will be refunded in full while the claim is being processed.</li>
                                <li><strong>Theft or force majeure:</strong> If your kit is stolen or damaged due to a natural disaster, contact us with documentation (e.g., a police report or insurance claim) and we will review your case individually. CeleBrease reserves the right to waive or reduce charges at its discretion.</li>
                            </ul>

                            <div className="rp-highlight">
                                <strong>Communication is key.</strong> If you are experiencing an issue, delivery delay, illness, damage in transit, reach out before your deadline. We have never sent a kit replacement charge to a customer who communicated proactively.
                            </div>
                        </section>

                        {/* ── 8. Contact ── */}
                        <section className="rp-section" id="contact" aria-labelledby="contact-heading">
                            <h2 id="contact-heading">
                                <span className="rp-num" aria-hidden="true">8</span>
                                Contact
                            </h2>
                            <p>Our returns team is here to make the process smooth. Whether you need a replacement label, want to extend your rental, or have a question about a deposit deduction, reach out:</p>

                            <ul>
                                <li><strong>Email (preferred):</strong> <a href="mailto:returns@celebrease.com">returns@celebrease.com</a>, responses within 1 business day.</li>
                                <li><strong>Live chat:</strong> Available in your account dashboard, Monday, Friday 9 AM, 6 PM ET.</li>
                                <li><strong>Inspection disputes:</strong> Email <a href="mailto:returns@celebrease.com">returns@celebrease.com</a> with subject &ldquo;Inspection Dispute, [Order #]&rdquo; within 7 days of your inspection report.</li>
                                <li><strong>Mailing address:</strong> CeleBrease, Inc. · Returns Team · [Address on file at launch]</li>
                            </ul>

                            <div className="rp-highlight">
                                We want your deposit back in your account as quickly as possible, and we want you excited to rent again. If anything about this process feels unclear or unfair, tell us and we will make it right.
                            </div>
                        </section>

                    </article>
                </div>
            </main>

            {/* Page-scoped styles */}
            <style>{`
                /* ── TOC link hover ── */
                .rp-toc-link:hover {
                    background: #fff;
                    color: var(--cb-purple) !important;
                    font-weight: 600 !important;
                    box-shadow: var(--cb-shadow-xs);
                }

                /* ── Section dividers ── */
                .rp-section {
                    margin-bottom: 52px;
                    padding-bottom: 52px;
                    border-bottom: 1px solid var(--cb-line);
                }
                .rp-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }

                /* ── Section number badge ── */
                .rp-num {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: var(--cb-gradient-h);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                    box-shadow: 0 4px 12px rgba(155,47,201,0.25);
                    flex-shrink: 0;
                    font-family: 'Geist Sans', 'Inter', sans-serif;
                }

                /* ── Section headings ── */
                .rp-section h2 {
                    font-size: clamp(1.35rem, 2.4vw, 1.75rem);
                    font-weight: 700;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    line-height: 1.15;
                }
                .rp-section p {
                    font-size: 15.5px;
                    color: var(--cb-ink-muted);
                    line-height: 1.75;
                    margin-bottom: 14px;
                }
                .rp-section p:last-child { margin-bottom: 0; }
                .rp-section h3 {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--cb-ink);
                    margin: 22px 0 10px;
                    font-family: 'Playfair Display', Georgia, serif;
                }
                .rp-section a {
                    color: var(--cb-purple);
                    font-weight: 600;
                    transition: opacity .2s;
                }
                .rp-section a:hover { text-decoration: underline; opacity: .8; }

                /* ── Lists ── */
                .rp-section ul,
                .rp-section ol {
                    padding-left: 0;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin: 16px 0;
                }
                .rp-section ul li,
                .rp-section ol li {
                    display: flex;
                    gap: 12px;
                    font-size: 15px;
                    color: var(--cb-ink-muted);
                    line-height: 1.65;
                }
                .rp-section ul li::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--cb-magenta);
                    margin-top: 8px;
                    flex-shrink: 0;
                }
                .rp-section ol {
                    counter-reset: ol-counter;
                }
                .rp-section ol li {
                    counter-increment: ol-counter;
                }
                .rp-section ol li::before {
                    content: counter(ol-counter);
                    min-width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #EFE6F9;
                    color: var(--cb-purple);
                    font-size: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-top: 3px;
                    font-family: 'Geist Sans', 'Inter', sans-serif;
                }

                /* ── Highlight box ── */
                .rp-highlight {
                    background: var(--cb-lavender);
                    border: 1px solid var(--cb-line);
                    border-left: 3px solid var(--cb-purple);
                    border-radius: 12px;
                    padding: 18px 20px;
                    margin: 20px 0;
                    font-size: 15px;
                    color: var(--cb-ink-muted);
                    line-height: 1.7;
                }
                .rp-highlight strong {
                    color: var(--cb-purple);
                    font-weight: 700;
                }

                /* ── Table ── */
                .rp-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 14.5px;
                }
                .rp-table th {
                    background: var(--cb-lavender);
                    color: var(--cb-ink);
                    font-weight: 700;
                    padding: 12px 16px;
                    text-align: left;
                    border: 1px solid var(--cb-line);
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    font-family: 'Geist Sans', 'Inter', sans-serif;
                }
                .rp-table td {
                    padding: 12px 16px;
                    border: 1px solid var(--cb-line);
                    color: var(--cb-ink-muted);
                    line-height: 1.55;
                    vertical-align: top;
                }
                .rp-table tr:hover td { background: var(--cb-lavender); }

                /* ── Condition cards ── */
                .rp-condition-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin: 24px 0;
                }
                .rp-ccard {
                    background: #fff;
                    border: 1.5px solid var(--cb-line);
                    border-radius: 16px;
                    padding: 20px 20px 18px;
                    box-shadow: var(--cb-shadow-xs);
                    transition: box-shadow .2s, border-color .2s;
                }
                .rp-ccard:hover {
                    box-shadow: var(--cb-shadow-sm);
                    border-color: rgba(155,47,201,0.28);
                }
                .rp-badge {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.09em;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    margin-bottom: 10px;
                    font-family: 'Geist Sans', 'Inter', sans-serif;
                }
                .rp-badge-mint { background: #ECFDF5; color: #059669; }
                .rp-badge-good { background: #EFE6F9; color: var(--cb-purple); }
                .rp-badge-worn { background: #FFF7ED; color: #D97706; }
                .rp-badge-damaged { background: #FEF2F2; color: #DC2626; }
                .rp-ccard h4 {
                    font-family: 'Geist Sans', 'Inter', sans-serif;
                    font-size: 14.5px;
                    font-weight: 700;
                    color: var(--cb-ink);
                    margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .rp-ccard p {
                    font-size: 13.5px !important;
                    color: var(--cb-ink-muted);
                    line-height: 1.55 !important;
                    margin-bottom: 0 !important;
                }
                .rp-deposit-note {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid var(--cb-line);
                    font-size: 12.5px;
                    color: var(--cb-ink-soft);
                }
                .rp-deposit-note strong { color: var(--cb-ink); }

                /* ── Responsive ── */
                @media (max-width: 860px) {
                    .rp-layout {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                    .rp-layout aside {
                        margin-bottom: 40px;
                    }
                    .rp-layout aside > div {
                        position: static !important;
                    }
                    .rp-layout aside ul {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        gap: 6px !important;
                    }
                    .rp-toc-link { padding: 6px 12px !important; font-size: 13px !important; }
                    .rp-layout aside .rp-toc-contact { display: none; }
                    .rp-condition-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .rp-section h2 { font-size: 1.25rem; flex-wrap: wrap; }
                }
            `}</style>

        </div>
    );
}
