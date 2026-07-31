import Link from "next/link";

export default function RentalAgreementPage() {
    return (
        <div className="cb">

            {/* ===== HERO BANNER ===== */}
            <section
                aria-label="Rental Agreement header"
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
                    {/* breadcrumb */}
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
                            style={{
                                color: "var(--cb-purple)",
                                fontWeight: 600,
                                transition: "opacity .2s",
                            }}
                        >
                            Home
                        </Link>
                        <span aria-hidden="true" style={{ color: "var(--cb-ink-soft)" }}>›</span>
                        <span aria-current="page">Rental Agreement</span>
                    </nav>

                    {/* eyebrow pill */}
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
                        Rental <span className="gradient-text">Agreement</span>
                    </h1>

                    {/* meta row */}
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
                            Last updated: June 2026
                        </span>
                        <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-ink-soft)", display: "inline-block" }} />
                        <span>Effective date: June 1, 2026</span>
                        <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cb-ink-soft)", display: "inline-block" }} />
                        <span>~6 min read</span>
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
                    className="cb-legal-layout"
                >

                    {/* ===== STICKY TOC ===== */}
                    <aside aria-label="Table of contents" className="cb-legal-toc-wrapper">
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
                                        { href: "#parties", label: "Parties & Definitions" },
                                        { href: "#rental-term", label: "Rental Term" },
                                        { href: "#title-ownership", label: "Title & Ownership" },
                                        { href: "#permitted-use", label: "Permitted Use" },
                                        { href: "#care-handling", label: "Care & Handling" },
                                        { href: "#deposit-charges", label: "Deposit & Charges" },
                                        { href: "#return-obligations", label: "Return Obligations" },
                                        { href: "#default-liability", label: "Default & Liability" },
                                        { href: "#governing-law", label: "Governing Law" },
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
                                                    textDecoration: "none",
                                                }}
                                                className="cb-toc-link"
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
                                        Rental questions?
                                    </p>
                                    <a
                                        href="mailto:support@celebrease.com"
                                        style={{
                                            fontSize: 13,
                                            color: "var(--cb-purple)",
                                            fontWeight: 600,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        support@celebrease.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ===== LEGAL CONTENT ===== */}
                    <article aria-label="Rental agreement content" style={{ minWidth: 0 }}>

                        {/* 1. Parties & Definitions */}
                        <section id="parties" aria-labelledby="parties-heading" className="cb-legal-section">
                            <h2 id="parties-heading">
                                <span className="cb-legal-num" aria-hidden="true">1</span>
                                Parties &amp; Definitions
                            </h2>
                            <div className="cb-legal-highlight">
                                <strong>Plain English:</strong> This agreement is between you (the customer) and CeleBrease. It covers every kit you rent through us, the items stay ours, you use them for the agreed period, and we send a prepaid label when it&apos;s time to return them.
                            </div>
                            <p>This Rental Agreement (&ldquo;Agreement&rdquo;) is entered into between <strong>CeleBrease, Inc.</strong> (&ldquo;CeleBrease,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), a Delaware corporation, and the individual or entity who places a rental order through the CeleBrease platform (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;).</p>
                            <p>By completing checkout for any kit rental, you acknowledge that you have read, understood, and agree to be bound by this Agreement in full. This Agreement incorporates by reference our <Link href="/privacy">Privacy Policy</Link> and any applicable subscription plan terms.</p>

                            <h3>Defined terms</h3>
                            <ul>
                                <li><strong>&ldquo;Kit&rdquo;</strong>, a curated holiday decoration bundle offered by CeleBrease, comprising one or more Items selected by our design team for a specific holiday occasion.</li>
                                <li><strong>&ldquo;Item&rdquo; or &ldquo;Items&rdquo;</strong>, individual physical decoration pieces included within a Kit, including props, textiles, lighting, signage, and any other décor components.</li>
                                <li><strong>&ldquo;Rental Period&rdquo;</strong>, the agreed duration (30-day or 60-day) beginning on the date of delivery to Customer&apos;s address as confirmed by our logistics partner.</li>
                                <li><strong>&ldquo;Deposit&rdquo;</strong>, a refundable security amount collected at the time of reservation to cover potential damage or loss of Items, as detailed in Section 6.</li>
                                <li><strong>&ldquo;Add-Ons&rdquo;</strong>, optional supplementary items available for inclusion with a Kit rental at additional cost.</li>
                                <li><strong>&ldquo;Platform&rdquo;</strong>, the CeleBrease website, web application, and any associated digital services at celebrease.com.</li>
                            </ul>
                        </section>

                        {/* 2. Rental Term */}
                        <section id="rental-term" aria-labelledby="rental-term-heading" className="cb-legal-section">
                            <h2 id="rental-term-heading">
                                <span className="cb-legal-num" aria-hidden="true">2</span>
                                Rental Term
                            </h2>
                            <p>The Rental Period begins on the date of confirmed delivery to the address specified in your order. CeleBrease offers two standard rental durations: <strong>30 days</strong> and <strong>60 days</strong>. Your selected duration is displayed in your order summary and confirmed in your order confirmation email.</p>
                            <p>The Rental Period ends on the last day of your selected duration. You must initiate a return no later than that final day by following the return process described in Section 7. Items received back at our fulfilment centre within <strong>5 business days</strong> after the period end date will be treated as on-time returns without late fees.</p>

                            <h3>Extensions</h3>
                            <p>If you wish to extend your Rental Period, you may request an extension through your account dashboard before the period end date, subject to availability and payment of the applicable extension fee. Extension requests are not guaranteed and are granted at CeleBrease&apos;s sole discretion based on inventory availability.</p>

                            <h3>Early returns</h3>
                            <p>You may return a Kit before the end of your Rental Period at no penalty. Early returns do not entitle you to a partial refund of the rental fee, but your Deposit will be processed on the same schedule as any standard return (see Section 6).</p>
                        </section>

                        {/* 3. Title & Ownership */}
                        <section id="title-ownership" aria-labelledby="title-heading" className="cb-legal-section">
                            <h2 id="title-heading">
                                <span className="cb-legal-num" aria-hidden="true">3</span>
                                Title &amp; Ownership
                            </h2>
                            <p>All Items and Kits made available through the CeleBrease Platform are and shall remain the exclusive property of CeleBrease, Inc. at all times. This Agreement conveys a limited, non-exclusive, non-transferable license to use the Items during the Rental Period only and for the purposes described in Section 4. No title, ownership interest, or proprietary right in any Item passes to you at any point.</p>
                            <p>You may not sell, sublease, pledge, encumber, or otherwise transfer any Item or any interest in any Item to any third party. Any attempt to do so is null and void and constitutes a material breach of this Agreement.</p>
                            <div className="cb-legal-highlight">
                                <strong>Important:</strong> Because Items remain CeleBrease property throughout the rental, you are responsible for their safekeeping from delivery to pickup. Treat every Item as you would a valuable personal loan from a trusted source.
                            </div>
                            <p>CeleBrease reserves the right to affix discreet identifying tags or markings to Items. You must not remove, alter, or obscure any such markings.</p>
                        </section>

                        {/* 4. Permitted Use */}
                        <section id="permitted-use" aria-labelledby="permitted-use-heading" className="cb-legal-section">
                            <h2 id="permitted-use-heading">
                                <span className="cb-legal-num" aria-hidden="true">4</span>
                                Permitted Use
                            </h2>
                            <p>Items may be used solely for personal, non-commercial holiday decoration at the residential delivery address on file in your order. The following uses are expressly <strong>prohibited</strong>:</p>
                            <ul>
                                <li>Commercial use, including staging for real-estate photography, event rentals to third parties, or use in commercial film or photography productions without prior written consent from CeleBrease.</li>
                                <li>Outdoor installation beyond covered porches or entryways unless Items are specifically designated as outdoor-rated in the Kit description.</li>
                                <li>Modification, painting, drilling, or structural alteration of any Item.</li>
                                <li>Use of electrical Items with extension cords, power strips, or adapters not approved in the Kit&apos;s care guide.</li>
                                <li>Allowing pets unsupervised access to Items that include small components, fragile glass, or electrical elements.</li>
                                <li>Transporting Items to a different address than the delivery address without prior written approval from CeleBrease.</li>
                            </ul>
                            <p>CeleBrease reserves the right to terminate a rental and demand immediate return of Items if we have reasonable grounds to believe Items are being used in a prohibited manner.</p>
                        </section>

                        {/* 5. Care & Handling */}
                        <section id="care-handling" aria-labelledby="care-heading" className="cb-legal-section">
                            <h2 id="care-heading">
                                <span className="cb-legal-num" aria-hidden="true">5</span>
                                Care &amp; Handling
                            </h2>
                            <p>You agree to exercise reasonable care with all Items during the Rental Period. Each Kit ships with a care guide that provides specific handling instructions. You are responsible for reading and following those instructions.</p>

                            <h3>Your care obligations include</h3>
                            <ul>
                                <li>Storing Items in a clean, dry, temperature-stable environment when not in active display.</li>
                                <li>Keeping Items away from open flame, direct heat sources, and excessive moisture unless otherwise specified in the care guide.</li>
                                <li>Handling fragile Items, including glass ornaments, resin figurines, and ceramic pieces, with appropriate care and padding when moving them.</li>
                                <li>Repacking Items in the original packaging materials provided at delivery in preparation for return.</li>
                                <li>Notifying CeleBrease within <strong>48 hours</strong> of delivery if any Item arrives damaged, missing, or not as described, by emailing <a href="mailto:support@celebrease.com">support@celebrease.com</a> with photos.</li>
                            </ul>

                            <h3>Normal wear vs. damage</h3>
                            <p>CeleBrease distinguishes between <em>normal wear</em> (minor surface scuffs, light fading consistent with holiday use) and <em>damage</em> (cracks, breaks, stains, burns, missing components, or alterations). Normal wear is accepted. Damage is subject to the charges described in Section 6.</p>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Condition on return</th>
                                        <th scope="col">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Good condition, normal wear only</td>
                                        <td>Full Deposit refunded within 5 business days</td>
                                    </tr>
                                    <tr>
                                        <td>Minor damage (repairable)</td>
                                        <td>Repair cost deducted from Deposit; remainder refunded</td>
                                    </tr>
                                    <tr>
                                        <td>Significant damage or loss of individual Item</td>
                                        <td>Up to 90% of Item replacement cost deducted, never exceeding total Deposit held</td>
                                    </tr>
                                    <tr>
                                        <td>Complete Kit loss or unreturned after 30 days past period end</td>
                                        <td>Full Deposit retained; additional recovery action may apply</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* 6. Deposit & Charges */}
                        <section id="deposit-charges" aria-labelledby="deposit-heading" className="cb-legal-section">
                            <h2 id="deposit-heading">
                                <span className="cb-legal-num" aria-hidden="true">6</span>
                                Deposit &amp; Charges
                            </h2>

                            <h3>Deposit collection</h3>
                            <p>A refundable Deposit is authorised on your payment method at the time of reservation. The Deposit amount varies by Kit and is displayed clearly in your cart and order summary before checkout. The Deposit is separate from the rental fee and any applicable taxes or shipping charges.</p>
                            <p>The Deposit authorisation is converted to a charge when your Kit ships. It is held in trust throughout the Rental Period and applied against any damage or loss charges after your return is inspected.</p>

                            <h3>Deposit refund</h3>
                            <p>Provided that all Items are returned in good condition (normal wear accepted), the full Deposit will be refunded to your original payment method within <strong>5 business days</strong> of CeleBrease completing its return inspection. You will receive an email confirmation when your refund is processed. Please allow an additional 3, 7 business days for your bank or card issuer to post the credit.</p>

                            <h3>Damage charges</h3>
                            <p>If Items are returned with damage beyond normal wear, CeleBrease will:</p>
                            <ol>
                                <li>Notify you by email within 3 business days of inspection, with photo documentation of the damage.</li>
                                <li>Provide an itemised damage assessment, including the assessed repair or replacement cost for each affected Item.</li>
                                <li>Deduct the lesser of (a) the actual repair or replacement cost or (b) <strong>90% of the Item&apos;s listed replacement value</strong> from your Deposit. In no event will damage charges exceed the total Deposit amount held.</li>
                                <li>Refund any remaining Deposit balance within 5 business days of issuing the damage notice.</li>
                            </ol>

                            <div className="cb-legal-highlight">
                                <strong>Damage cap:</strong> Your liability for Item damage is capped at 90% of each Item&apos;s replacement cost and can never exceed the total Deposit you paid. CeleBrease will not charge your payment method for damage beyond the Deposit held.
                            </div>

                            <h3>Late return fees</h3>
                            <p>Items returned more than 5 business days after the Rental Period end date are subject to a late fee of <strong>$15 per day</strong> per Kit, charged to your payment method on file, until Items are received at our fulfilment centre or the Deposit is fully exhausted, whichever comes first.</p>
                        </section>

                        {/* 7. Return Obligations */}
                        <section id="return-obligations" aria-labelledby="return-heading" className="cb-legal-section">
                            <h2 id="return-heading">
                                <span className="cb-legal-num" aria-hidden="true">7</span>
                                Return Obligations
                            </h2>
                            <p>Returning your Kit is designed to be as simple as possible. You are responsible for initiating the return process and ensuring Items are packaged safely for transit.</p>

                            <h3>How to return</h3>
                            <ol>
                                <li>Log in to your CeleBrease account and navigate to <strong>My Orders</strong>.</li>
                                <li>Select the active rental and click <strong>Request Return</strong> any time during your Rental Period or up to the period end date.</li>
                                <li>CeleBrease will email you a <strong>free prepaid shipping label</strong> within 1 business day of your return request.</li>
                                <li>Pack all Items securely in the original packaging provided with your Kit. Attach the prepaid label to the outer box.</li>
                                <li>Drop the package at any authorised carrier location listed on your label, or schedule a <strong>free doorstep pickup</strong> directly through the carrier using the tracking link in your label email.</li>
                            </ol>

                            <div className="cb-legal-highlight">
                                <strong>No return shipping cost to you:</strong> CeleBrease covers all return shipping. You will never be charged for the return label or doorstep pickup under standard return conditions.
                            </div>

                            <h3>Packaging responsibility</h3>
                            <p>You are responsible for packing Items with reasonable care to prevent transit damage. Use the original packaging inserts, bubble wrap, or tissue paper provided. If original packaging is unavailable, use equivalent protective materials. Damage caused by inadequate packaging during return transit is your responsibility and subject to the damage charges in Section 6.</p>

                            <h3>Missing Items</h3>
                            <p>If any Item is missing from your return shipment, CeleBrease will notify you and deduct the applicable replacement cost from your Deposit per the schedule in Section 6. If you discover a missing Item before shipping your return, contact us at <a href="mailto:support@celebrease.com">support@celebrease.com</a> and we will arrange separate collection.</p>
                        </section>

                        {/* 8. Default & Liability */}
                        <section id="default-liability" aria-labelledby="default-heading" className="cb-legal-section">
                            <h2 id="default-heading">
                                <span className="cb-legal-num" aria-hidden="true">8</span>
                                Default &amp; Liability
                            </h2>

                            <h3>Events of default</h3>
                            <p>You will be in default of this Agreement if you:</p>
                            <ul>
                                <li>Fail to return Items within 30 calendar days after the Rental Period end date.</li>
                                <li>Use Items in a manner prohibited by Section 4 or in violation of any applicable law.</li>
                                <li>Attempt to sell, transfer, or encumber Items as described in Section 3.</li>
                                <li>Provide materially false information in connection with your order or account.</li>
                                <li>Fail to pay any rental fees, damage charges, or late fees when due.</li>
                            </ul>
                            <p>Upon an event of default, CeleBrease may, without limiting any other remedy, (a) declare all amounts owed immediately due and payable, (b) charge your payment method on file for any outstanding amounts up to the Deposit held, (c) pursue legal remedies for recovery of Items or damages exceeding the Deposit, and (d) suspend or terminate your CeleBrease account.</p>

                            <h3>Limitation of liability</h3>
                            <p>To the fullest extent permitted by applicable law, CeleBrease&apos;s total aggregate liability to you under or in connection with this Agreement shall not exceed the total rental fees paid by you for the specific Kit that is the subject of the claim in the 12 months preceding the claim. CeleBrease is not liable for any indirect, incidental, consequential, or punitive damages arising from your use of Items or the Platform.</p>

                            <h3>Indemnification</h3>
                            <p>You agree to indemnify, defend, and hold harmless CeleBrease, its officers, employees, and agents from any claim, damage, loss, or expense (including reasonable attorneys&apos; fees) arising out of your breach of this Agreement, your misuse of Items, or your violation of any applicable law.</p>
                        </section>

                        {/* 9. Governing Law */}
                        <section id="governing-law" aria-labelledby="governing-heading" className="cb-legal-section">
                            <h2 id="governing-heading">
                                <span className="cb-legal-num" aria-hidden="true">9</span>
                                Governing Law
                            </h2>
                            <p>This Agreement is governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict-of-law principles. Any dispute arising out of or relating to this Agreement that cannot be resolved informally shall be submitted to binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, with proceedings conducted in English in Dover, Delaware.</p>
                            <p>Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights or to compel return of Items.</p>
                            <p>You and CeleBrease agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. If for any reason a claim proceeds in court rather than in arbitration, you waive any right to a jury trial.</p>
                            <div className="cb-legal-highlight">
                                <strong>Informal resolution first:</strong> Before initiating arbitration, please contact us at <a href="mailto:support@celebrease.com">support@celebrease.com</a>. We resolve the vast majority of concerns quickly and without formal proceedings.
                            </div>
                        </section>

                        {/* 10. Contact */}
                        <section id="contact" aria-labelledby="contact-heading" className="cb-legal-section">
                            <h2 id="contact-heading">
                                <span className="cb-legal-num" aria-hidden="true">10</span>
                                Contact
                            </h2>
                            <p>If you have questions about this Rental Agreement, a rental in progress, a Deposit refund, or a damage assessment, our Customer Experience team is here to help:</p>

                            <ul>
                                <li><strong>Email:</strong> <a href="mailto:support@celebrease.com">support@celebrease.com</a></li>
                                <li><strong>Rental disputes:</strong> <a href="mailto:rentals@celebrease.com">rentals@celebrease.com</a></li>
                                <li><strong>Response time:</strong> We aim to respond to all inquiries within 2 business days.</li>
                                <li><strong>Mailing address:</strong> CeleBrease, Inc. &middot; Customer Experience &middot; [Address on file at launch]</li>
                            </ul>

                            <div className="cb-legal-highlight">
                                For the fastest resolution on active rentals, including damage reports, return label requests, or Deposit inquiries, always include your <strong>order number</strong> in your message subject line.
                            </div>
                        </section>

                    </article>
                </div>
            </main>

            <style>{`
                /* ===== LEGAL PAGE STYLES ===== */
                .cb-legal-section {
                    margin-bottom: 52px;
                    padding-bottom: 52px;
                    border-bottom: 1px solid var(--cb-line);
                }
                .cb-legal-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .cb-legal-section h2 {
                    font-size: clamp(1.35rem, 2.4vw, 1.75rem);
                    font-weight: 700;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    line-height: 1.15;
                }
                .cb-legal-section p {
                    font-size: 15.5px;
                    color: var(--cb-ink-muted);
                    line-height: 1.75;
                    margin-bottom: 14px;
                }
                .cb-legal-section p:last-child { margin-bottom: 0; }
                .cb-legal-section h3 {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--cb-ink);
                    margin: 22px 0 10px;
                    font-family: 'Playfair Display', Georgia, serif;
                }
                .cb-legal-section a {
                    color: var(--cb-purple);
                    font-weight: 600;
                    transition: opacity .2s;
                }
                .cb-legal-section a:hover { text-decoration: underline; opacity: .8; }
                .cb-legal-section ul,
                .cb-legal-section ol {
                    padding-left: 0;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin: 16px 0;
                }
                .cb-legal-section ul li,
                .cb-legal-section ol li {
                    display: flex;
                    gap: 12px;
                    font-size: 15px;
                    color: var(--cb-ink-muted);
                    line-height: 1.65;
                }
                .cb-legal-section ul li::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--cb-magenta);
                    margin-top: 8px;
                    flex-shrink: 0;
                }
                .cb-legal-section ol {
                    counter-reset: ol-counter;
                }
                .cb-legal-section ol li {
                    counter-increment: ol-counter;
                }
                .cb-legal-section ol li::before {
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
                }
                .cb-legal-num {
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
                }
                .cb-legal-highlight {
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
                .cb-legal-highlight strong { color: var(--cb-purple); font-weight: 700; }
                .cb-legal-section table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 14.5px;
                }
                .cb-legal-section table th {
                    background: var(--cb-lavender);
                    color: var(--cb-ink);
                    font-weight: 700;
                    padding: 12px 16px;
                    text-align: left;
                    border: 1px solid var(--cb-line);
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .cb-legal-section table td {
                    padding: 12px 16px;
                    border: 1px solid var(--cb-line);
                    color: var(--cb-ink-muted);
                    line-height: 1.55;
                    vertical-align: top;
                }
                .cb-legal-section table tr:hover td { background: var(--cb-lavender); }
                .cb-toc-link:hover {
                    background: #fff;
                    color: var(--cb-purple) !important;
                    font-weight: 600 !important;
                    box-shadow: var(--cb-shadow-xs);
                }
                @media (max-width: 860px) {
                    .cb-legal-layout {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                    .cb-legal-toc-wrapper {
                        margin-bottom: 40px;
                    }
                    .cb-legal-toc-wrapper > div {
                        position: static !important;
                    }
                    .cb-legal-toc-wrapper ul {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        gap: 6px !important;
                    }
                    .cb-legal-toc-wrapper ul li a {
                        padding: 6px 12px !important;
                        font-size: 13px !important;
                    }
                }
                @media (max-width: 600px) {
                    .cb-legal-section h2 { font-size: 1.25rem; flex-wrap: wrap; }
                }
            `}</style>
        </div>
    );
}
