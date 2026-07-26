import Link from "next/link";

export const metadata = {
    title: "Privacy Policy — CeleBrease",
    description:
        "Read how CeleBrease collects, uses, and protects your personal information when you use our holiday decoration rental subscription service.",
};

export default function PrivacyPage() {
    return (
        <div className="cb">

            {/* ===== HERO BANNER ===== */}
            <section className="cb-legal-hero" aria-label="Privacy Policy header">
                <div className="cb-legal-hero-inner">
                    <nav className="cb-legal-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/">Home</Link>
                        <span aria-hidden="true">›</span>
                        <span aria-current="page">Privacy Policy</span>
                    </nav>

                    <div className="cb-legal-eyebrow">
                        <span className="dot" aria-hidden="true" />
                        Legal &amp; Trust
                    </div>

                    <h1>
                        Privacy <span className="gradient-text">Policy</span>
                    </h1>

                    <div className="cb-legal-meta">
                        <span className="pill">Last updated: June 15, 2026</span>
                        <span className="sep" aria-hidden="true" />
                        <span>Effective date: January 1, 2026</span>
                        <span className="sep" aria-hidden="true" />
                        <span>~8 min read</span>
                    </div>
                </div>
            </section>

            {/* ===== MAIN LAYOUT ===== */}
            <main id="main-content">
                <div className="cb-legal-layout">

                    {/* STICKY TABLE OF CONTENTS */}
                    <aside aria-label="Table of contents">
                        <div className="cb-toc">
                            <div className="cb-toc-inner">
                                <p className="cb-toc-label">On this page</p>
                                <ul className="cb-toc-list" role="list">
                                    <li><a href="#overview">Overview</a></li>
                                    <li><a href="#information-we-collect">Information We Collect</a></li>
                                    <li><a href="#how-we-use">How We Use It</a></li>
                                    <li><a href="#sharing">Sharing &amp; Disclosure</a></li>
                                    <li><a href="#cookies">Cookies</a></li>
                                    <li><a href="#data-retention">Data Retention</a></li>
                                    <li><a href="#your-rights">Your Rights</a></li>
                                    <li><a href="#children">Children&apos;s Privacy</a></li>
                                    <li><a href="#security">Security</a></li>
                                    <li><a href="#changes">Changes to This Policy</a></li>
                                    <li><a href="#contact">Contact Us</a></li>
                                </ul>
                                <div className="cb-toc-contact">
                                    <p>Privacy questions?</p>
                                    <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* LEGAL CONTENT */}
                    <article className="cb-legal-content" aria-label="Privacy policy content">

                        {/* 1. Overview */}
                        <section className="cb-legal-section" id="overview" aria-labelledby="overview-heading">
                            <h2 id="overview-heading">
                                <span className="cb-legal-num" aria-hidden="true">1</span>
                                Overview
                            </h2>
                            <div className="cb-highlight-box">
                                <strong>The short version:</strong> We collect only what we need to deliver your kits,
                                process your rental, and keep your account safe. We never sell your personal data, and
                                we never will.
                            </div>
                            <p>
                                CeleBrease, Inc. (&ldquo;CeleBrease,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                                &ldquo;us&rdquo;) operates the CeleBrease website and holiday decoration rental
                                subscription service (the &ldquo;Service&rdquo;). This Privacy Policy explains what
                                personal information we collect, how we use it, when we share it, and what choices you
                                have.
                            </p>
                            <p>
                                By subscribing to or using our Service, you agree to the collection and use of
                                information in accordance with this Policy. If you do not agree, please do not use our
                                Service.
                            </p>
                            <p>
                                This Policy applies to information collected through our website at{" "}
                                <a href="https://www.celebrease.com">celebrease.com</a>, our mobile-optimized web app,
                                email communications, and any other means by which you interact with CeleBrease.
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section className="cb-legal-section" id="information-we-collect" aria-labelledby="collect-heading">
                            <h2 id="collect-heading">
                                <span className="cb-legal-num" aria-hidden="true">2</span>
                                Information We Collect
                            </h2>
                            <p>
                                We collect information you give us directly, information we receive automatically when
                                you use our Service, and information from third-party partners.
                            </p>

                            <h3>Information you provide directly</h3>
                            <ul>
                                <li><span><strong>Account information:</strong> name, email address, phone number, and password when you create an account.</span></li>
                                <li><span><strong>Delivery &amp; billing details:</strong> shipping address, billing address, and payment card information (processed securely through Stripe — we never store your full card number).</span></li>
                                <li><span><strong>Subscription preferences:</strong> which holidays you select, kit tier preferences, rental duration, and any add-ons you choose.</span></li>
                                <li><span><strong>Communications:</strong> messages you send us via contact forms, support requests, or email — including feedback and reviews you submit.</span></li>
                                <li><span><strong>Newsletter opt-in:</strong> your email address if you subscribe to seasonal inspiration updates.</span></li>
                            </ul>

                            <h3>Information collected automatically</h3>
                            <ul>
                                <li><span><strong>Usage data:</strong> pages viewed, links clicked, time on page, scroll depth, and navigation paths.</span></li>
                                <li><span><strong>Device &amp; technical data:</strong> IP address, browser type and version, operating system, device identifiers, and referring URLs.</span></li>
                                <li><span><strong>Cookies and similar tracking technologies:</strong> session cookies, preference cookies, and analytics cookies (detailed in Section 5).</span></li>
                                <li><span><strong>Location data:</strong> approximate location derived from your IP address to provide region-appropriate shipping options and holiday timing.</span></li>
                            </ul>

                            <h3>Information from third parties</h3>
                            <ul>
                                <li><span><strong>Payment processors:</strong> Stripe provides us with transaction confirmations, payment status, and fraud signals — but never your full card details.</span></li>
                                <li><span><strong>Authentication providers:</strong> if you sign in with Google or Apple, we receive your name, email, and profile photo from that provider.</span></li>
                                <li><span><strong>Shipping carriers:</strong> tracking updates and delivery confirmation from our logistics partners.</span></li>
                            </ul>
                        </section>

                        {/* 3. How We Use It */}
                        <section className="cb-legal-section" id="how-we-use" aria-labelledby="use-heading">
                            <h2 id="use-heading">
                                <span className="cb-legal-num" aria-hidden="true">3</span>
                                How We Use Your Information
                            </h2>
                            <p>
                                We use the information we collect to operate the Service, improve it, and communicate
                                with you. The specific purposes are:
                            </p>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Purpose</th>
                                        <th scope="col">Legal basis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Processing your subscription, rental orders, deposits, and refunds</td>
                                        <td>Contract performance</td>
                                    </tr>
                                    <tr>
                                        <td>Scheduling kit delivery and pickup logistics</td>
                                        <td>Contract performance</td>
                                    </tr>
                                    <tr>
                                        <td>Sending order confirmations, shipping updates, and deposit refund notices</td>
                                        <td>Contract performance</td>
                                    </tr>
                                    <tr>
                                        <td>Detecting fraud, preventing chargebacks, and verifying payment</td>
                                        <td>Legitimate interest / Legal obligation</td>
                                    </tr>
                                    <tr>
                                        <td>Personalising holiday recommendations based on your past rentals</td>
                                        <td>Legitimate interest (you can opt out)</td>
                                    </tr>
                                    <tr>
                                        <td>Sending promotional emails and seasonal inspiration (newsletter)</td>
                                        <td>Consent (opt-in only; unsubscribe anytime)</td>
                                    </tr>
                                    <tr>
                                        <td>Analysing usage to improve product design and kit curation</td>
                                        <td>Legitimate interest</td>
                                    </tr>
                                    <tr>
                                        <td>Complying with applicable law and responding to legal requests</td>
                                        <td>Legal obligation</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p>
                                We do not use your information to train external AI models, and we do not sell it for
                                advertising purposes.
                            </p>
                        </section>

                        {/* 4. Sharing & Disclosure */}
                        <section className="cb-legal-section" id="sharing" aria-labelledby="sharing-heading">
                            <h2 id="sharing-heading">
                                <span className="cb-legal-num" aria-hidden="true">4</span>
                                Sharing &amp; Disclosure
                            </h2>
                            <p>
                                We do not sell, rent, or trade your personal information. We share it only in the
                                limited circumstances below:
                            </p>

                            <ul>
                                <li><span><strong>Service providers:</strong> trusted vendors who help us operate — Stripe (payments), our logistics carrier partners (shipping), Brevo (newsletter delivery), and our cloud infrastructure provider. Each is bound by a data processing agreement and may use your data only to perform services for us.</span></li>
                                <li><span><strong>Kit deposit protection:</strong> where required to assess damage claims, we may share order details with our fulfilment partners.</span></li>
                                <li><span><strong>Legal requirements:</strong> we may disclose information if required by law, court order, or to protect the rights, property, or safety of CeleBrease, our customers, or the public.</span></li>
                                <li><span><strong>Business transfers:</strong> if CeleBrease is acquired, merged, or sells substantially all of its assets, your data may transfer as part of that transaction. We will notify you by email before any such transfer takes effect and you will be given the opportunity to delete your account.</span></li>
                                <li><span><strong>With your consent:</strong> for any other purpose, only with your explicit prior consent.</span></li>
                            </ul>

                            <div className="cb-highlight-box">
                                We never share your data with advertising networks, data brokers, or social media
                                companies for targeting purposes.
                            </div>
                        </section>

                        {/* 5. Cookies */}
                        <section className="cb-legal-section" id="cookies" aria-labelledby="cookies-heading">
                            <h2 id="cookies-heading">
                                <span className="cb-legal-num" aria-hidden="true">5</span>
                                Cookies &amp; Tracking Technologies
                            </h2>
                            <p>
                                We use cookies and similar technologies to keep you signed in, remember your
                                preferences, and understand how customers use our site. Here is what we use and why:
                            </p>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Category</th>
                                        <th scope="col">Purpose</th>
                                        <th scope="col">Can you opt out?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Essential</strong></td>
                                        <td>Session authentication, shopping cart state, CSRF protection</td>
                                        <td>No — required to use the Service</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Functional</strong></td>
                                        <td>Remembering your holiday preferences and region</td>
                                        <td>Yes — via account settings</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Analytics</strong></td>
                                        <td>Understanding page performance and navigation patterns (anonymised)</td>
                                        <td>Yes — via cookie banner or browser settings</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p>
                                We do not use advertising or cross-site tracking cookies. You can manage cookie
                                preferences through your browser settings at any time. Note that disabling essential
                                cookies will prevent you from signing in or completing a rental.
                            </p>
                        </section>

                        {/* 6. Data Retention */}
                        <section className="cb-legal-section" id="data-retention" aria-labelledby="retention-heading">
                            <h2 id="retention-heading">
                                <span className="cb-legal-num" aria-hidden="true">6</span>
                                Data Retention
                            </h2>
                            <p>
                                We retain your personal information for as long as your account is active or as needed
                                to provide the Service. Specific retention periods:
                            </p>

                            <ul>
                                <li><span><strong>Account data:</strong> kept for the life of your account plus 30 days after deletion, to allow for accidental deletion recovery.</span></li>
                                <li><span><strong>Order and transaction records:</strong> retained for 7 years to satisfy financial, tax, and legal audit requirements.</span></li>
                                <li><span><strong>Deposit records:</strong> retained for 3 years after the final deposit is settled.</span></li>
                                <li><span><strong>Support communications:</strong> retained for 2 years after the conversation closes.</span></li>
                                <li><span><strong>Newsletter / marketing preferences:</strong> retained until you unsubscribe or request deletion.</span></li>
                                <li><span><strong>Analytics data:</strong> aggregated and anonymised after 13 months; no individual-level retention beyond that point.</span></li>
                            </ul>

                            <p>
                                When data is no longer needed, we securely delete or anonymise it in accordance with
                                industry-standard practices.
                            </p>
                        </section>

                        {/* 7. Your Rights */}
                        <section className="cb-legal-section" id="your-rights" aria-labelledby="rights-heading">
                            <h2 id="rights-heading">
                                <span className="cb-legal-num" aria-hidden="true">7</span>
                                Your Rights &amp; Choices
                            </h2>
                            <p>
                                Depending on where you live, you may have the following rights with respect to your
                                personal information. We honour all of these requests regardless of your location:
                            </p>

                            <ul>
                                <li><span><strong>Access:</strong> request a copy of the personal data we hold about you.</span></li>
                                <li><span><strong>Correction:</strong> ask us to fix inaccurate or incomplete information in your account.</span></li>
                                <li><span><strong>Deletion:</strong> request that we delete your account and associated personal data (subject to our legal retention obligations above).</span></li>
                                <li><span><strong>Portability:</strong> receive your data in a machine-readable format (JSON or CSV) to transfer to another service.</span></li>
                                <li><span><strong>Restriction:</strong> ask us to stop processing your data in certain ways without deleting it.</span></li>
                                <li><span><strong>Objection:</strong> object to processing based on legitimate interests, including personalised recommendations.</span></li>
                                <li><span><strong>Withdrawal of consent:</strong> unsubscribe from marketing at any time via the link in any email or by updating your account settings. Withdrawal does not affect the lawfulness of processing prior to withdrawal.</span></li>
                            </ul>

                            <p>
                                To exercise any of these rights, email us at{" "}
                                <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a> or use the privacy
                                controls in your account dashboard. We will respond within 30 days. We may need to
                                verify your identity before fulfilling the request.
                            </p>

                            <div className="cb-highlight-box">
                                <strong>California residents (CCPA/CPRA):</strong> You have the right to know, delete,
                                and opt out of the sale of personal information. We do not sell personal information.
                                You may still submit a request at{" "}
                                <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a>.
                            </div>
                        </section>

                        {/* 8. Children's Privacy */}
                        <section className="cb-legal-section" id="children" aria-labelledby="children-heading">
                            <h2 id="children-heading">
                                <span className="cb-legal-num" aria-hidden="true">8</span>
                                Children&apos;s Privacy
                            </h2>
                            <p>
                                The CeleBrease Service is intended for individuals who are 18 years of age or older.
                                We do not knowingly collect, solicit, or retain personal information from anyone under
                                the age of 13.
                            </p>
                            <p>
                                If we discover that we have inadvertently collected personal information from a child
                                under 13, we will delete it promptly. If you believe we may have collected information
                                from a child under your care, please contact us at{" "}
                                <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a> immediately.
                            </p>
                        </section>

                        {/* 9. Security */}
                        <section className="cb-legal-section" id="security" aria-labelledby="security-heading">
                            <h2 id="security-heading">
                                <span className="cb-legal-num" aria-hidden="true">9</span>
                                Security
                            </h2>
                            <p>
                                We take the security of your personal information seriously and implement technical and
                                organisational measures to protect it against unauthorised access, loss, or misuse.
                                These measures include:
                            </p>

                            <ul>
                                <li><span>TLS encryption for all data in transit between your browser and our servers.</span></li>
                                <li><span>Payment card data is processed entirely by Stripe (PCI DSS Level 1 compliant) — CeleBrease never touches or stores raw card numbers.</span></li>
                                <li><span>Passwords are stored using a strong one-way hash (bcrypt). We cannot recover your plain-text password.</span></li>
                                <li><span>Access to production databases is restricted to authorised personnel and logged.</span></li>
                                <li><span>Regular security audits and dependency vulnerability scanning.</span></li>
                            </ul>

                            <p>
                                However, no method of transmission over the internet or electronic storage is 100%
                                secure. While we strive to use commercially acceptable means to protect your
                                information, we cannot guarantee absolute security. If you suspect unauthorised access
                                to your account, contact us immediately at{" "}
                                <a href="mailto:security@celebrease.com">security@celebrease.com</a>.
                            </p>
                        </section>

                        {/* 10. Changes */}
                        <section className="cb-legal-section" id="changes" aria-labelledby="changes-heading">
                            <h2 id="changes-heading">
                                <span className="cb-legal-num" aria-hidden="true">10</span>
                                Changes to This Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy from time to time to reflect changes in our
                                practices, technology, legal requirements, or for other operational reasons. When we
                                do, we will:
                            </p>

                            <ol>
                                <li><span>Update the &ldquo;Last updated&rdquo; date at the top of this page.</span></li>
                                <li><span>Email all registered subscribers at least 14 days before material changes take effect.</span></li>
                                <li><span>Display a prominent notice on our website for 30 days after a material change.</span></li>
                            </ol>

                            <p>
                                Your continued use of the Service after the effective date of any updated Policy
                                constitutes your acceptance of the changes. If you do not agree to a material change,
                                you may close your account before the effective date and request deletion of your data.
                            </p>
                            <p>
                                Previous versions of this Policy are available on request by emailing{" "}
                                <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a>.
                            </p>
                        </section>

                        {/* 11. Contact */}
                        <section className="cb-legal-section" id="contact" aria-labelledby="contact-heading">
                            <h2 id="contact-heading">
                                <span className="cb-legal-num" aria-hidden="true">11</span>
                                Contact Us
                            </h2>
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or how
                                we handle your personal information, please reach out to our Privacy team:
                            </p>

                            <ul>
                                <li><span><strong>Email:</strong> <a href="mailto:privacy@celebrease.com">privacy@celebrease.com</a></span></li>
                                <li><span><strong>Response time:</strong> We aim to respond within 5 business days; legally required requests are completed within 30 days.</span></li>
                                <li><span><strong>Mailing address:</strong> CeleBrease, Inc. · Privacy Team · [Address on file at launch]</span></li>
                            </ul>

                            <div className="cb-highlight-box">
                                You also have the right to lodge a complaint with your local data protection authority
                                if you believe we have not handled your information properly. In the United States,
                                this is the FTC. In the EU/UK, contact your relevant DPA.
                            </div>
                        </section>

                    </article>
                </div>
            </main>

        </div>
    );
}
