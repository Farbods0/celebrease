import Link from "next/link";

export const metadata = {
    title: "Terms of Service & Rental Agreement, CeleBrease",
    description:
        "Read CeleBrease's Terms of Service and Rental Agreement governing subscriptions, kit rentals, deposits, shipping, and customer obligations.",
};

export default function TermsPage() {
    return (
        <div className="cb">

            {/* ===== LEGAL HERO ===== */}
            <section className="cb-legal-hero" aria-label="Terms of Service header">
                <div className="cb-legal-hero-inner">
                    <nav className="cb-legal-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/">Home</Link>
                        <span aria-hidden="true">›</span>
                        <span aria-current="page">Terms of Service</span>
                    </nav>

                    <div className="cb-legal-eyebrow">
                        <span className="dot" aria-hidden="true" />
                        Legal &amp; Rental Agreement
                    </div>

                    <h1>
                        Terms of Service &amp;{" "}
                        <span className="gradient-text">Rental Agreement</span>
                    </h1>

                    <div className="cb-legal-meta">
                        <span className="pill">Last updated: June 2026</span>
                        <span className="sep" aria-hidden="true" />
                        <span>Effective date: January 1, 2026</span>
                        <span className="sep" aria-hidden="true" />
                        <span>~10 min read</span>
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
                                    <li><a href="#acceptance">Acceptance of Terms</a></li>
                                    <li><a href="#subscription">Subscription &amp; Membership</a></li>
                                    <li><a href="#holiday-slots">Holiday Slots &amp; Reservations</a></li>
                                    <li><a href="#rental-period">Rental Period &amp; Returns</a></li>
                                    <li><a href="#deposits">Deposits &amp; Refunds</a></li>
                                    <li><a href="#shipping">Shipping</a></li>
                                    <li><a href="#damage">Damage, Loss &amp; Liability</a></li>
                                    <li><a href="#cancellation">Cancellation &amp; Skipping</a></li>
                                    <li><a href="#billing">Billing &amp; Auto-Renewal</a></li>
                                    <li><a href="#acceptable-use">Acceptable Use</a></li>
                                    <li><a href="#limitation">Limitation of Liability</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                </ul>
                                <div className="cb-toc-contact">
                                    <p>Legal questions?</p>
                                    <a href="mailto:legal@celebrease.com">legal@celebrease.com</a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* LEGAL CONTENT */}
                    <article className="cb-legal-content" aria-label="Terms of service content">

                        {/* 1. Acceptance of Terms */}
                        <section className="cb-legal-section" id="acceptance" aria-labelledby="acceptance-heading">
                            <h2 id="acceptance-heading">
                                <span className="cb-legal-num" aria-hidden="true">1</span>
                                Acceptance of Terms
                            </h2>
                            <div className="cb-highlight-box">
                                <strong>Plain English:</strong> By creating an account or placing a rental order you
                                agree to these terms in full. If you do not agree, please do not use the Service.
                            </div>
                            <p>
                                These Terms of Service and Rental Agreement (&ldquo;Terms&rdquo;) constitute a legally
                                binding agreement between you (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or
                                &ldquo;your&rdquo;) and CeleBrease, Inc. (&ldquo;CeleBrease,&rdquo; &ldquo;we,&rdquo;
                                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) governing your access to and use of the
                                CeleBrease website, mobile-optimised web app, and holiday decoration rental
                                subscription service (collectively, the &ldquo;Service&rdquo;).
                            </p>
                            <p>
                                By registering for an account, subscribing to a plan, placing a rental order, or
                                otherwise using the Service, you confirm that you are at least 18 years of age, that
                                you have read and understood these Terms, and that you agree to be bound by them. If
                                you are using the Service on behalf of a business or organization, you represent that
                                you have authority to bind that entity to these Terms.
                            </p>
                            <p>
                                We may update these Terms from time to time. We will notify you of material changes by
                                email at least 14 days before they take effect. Your continued use of the Service
                                after the effective date constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        {/* 2. Subscription & Membership */}
                        <section className="cb-legal-section" id="subscription" aria-labelledby="subscription-heading">
                            <h2 id="subscription-heading">
                                <span className="cb-legal-num" aria-hidden="true">2</span>
                                Subscription &amp; Membership
                            </h2>
                            <p>
                                CeleBrease operates as a subscription-based rental service. To rent decoration kits
                                you must hold an active subscription plan. We currently offer three plan tiers, {" "}
                                <strong>Silver</strong>, <strong>Gold</strong>, and <strong>Platinum</strong>, each available on monthly or annual billing cycles.
                            </p>

                            <h3>What your plan includes</h3>
                            <ul>
                                <li>
                                    A fixed number of <strong>holiday slots</strong> per subscription year, the
                                    occasions you can decorate under your plan.
                                </li>
                                <li>
                                    Access to kit tiers at or below your plan tier (e.g., a Premium subscriber may
                                    rent Starter or Gold Kits).
                                </li>
                                <li>
                                    Tiered discounts on kit rental prices and optional add ons as specified on the
                                    Subscription page.
                                </li>
                                <li>
                                    Free standard outbound and return shipping on all kit rentals (see Section 6).
                                </li>
                            </ul>

                            <h3>What your plan does not include</h3>
                            <ul>
                                <li>
                                    Kit rental deposits, these are held separately and refunded on clean return (see
                                    Section 5).
                                </li>
                                <li>
                                    Express shipping upgrades, which are priced separately at checkout.
                                </li>
                                <li>
                                    Rentals for holidays outside your allocated slots or beyond your plan&apos;s
                                    kit-tier entitlement.
                                </li>
                            </ul>

                            <p>
                                Subscription benefits are non transferable and may only be used by the account holder.
                                Sharing account credentials to allow third parties to benefit from your subscription is
                                prohibited.
                            </p>
                        </section>

                        {/* 3. Holiday Slots & Kit Reservations */}
                        <section className="cb-legal-section" id="holiday-slots" aria-labelledby="slots-heading">
                            <h2 id="slots-heading">
                                <span className="cb-legal-num" aria-hidden="true">3</span>
                                Holiday Slots &amp; Kit Reservations
                            </h2>
                            <p>
                                Upon activating a subscription, your account is credited with the number of holiday
                                slots allocated to your plan for the current subscription year. You may assign each
                                slot to a specific holiday from our catalog at any time.
                            </p>
                            <ul>
                                <li>
                                    <strong>Pending slots</strong> are unassigned and can be freely reassigned to any
                                    available holiday up until you place a rental order for that occasion.
                                </li>
                                <li>
                                    <strong>Reserved slots</strong> are confirmed once you complete checkout for a kit.
                                    Reserved slots may be cancelled subject to the cancellation policy in Section 8.
                                </li>
                                <li>
                                    Unused slots at the end of a subscription year <strong>do not roll over</strong> to
                                    the following year unless you are on an annual plan and have not yet completed your
                                    full allocation, in that case, unused slots expire at the end of the annual term.
                                </li>
                                <li>
                                    Kit inventory is limited and allocated on a first-come, first-served basis.
                                    Reserving your slot early secures availability for popular holidays.
                                </li>
                            </ul>
                            <div className="cb-highlight-box">
                                <strong>Tip:</strong> You can reassign a Pending slot to a different holiday at any
                                time from your account dashboard, no fee, no waiting. Only slots that have already
                                been reserved (i.e., a kit has been ordered) are subject to the cancellation terms in
                                Section 8.
                            </div>
                        </section>

                        {/* 4. Rental Period & Returns */}
                        <section className="cb-legal-section" id="rental-period" aria-labelledby="rental-heading">
                            <h2 id="rental-heading">
                                <span className="cb-legal-num" aria-hidden="true">4</span>
                                Rental Period &amp; Returns
                            </h2>
                            <p>
                                Each kit rental is for a fixed term selected at checkout: either <strong>30 days</strong>{" "}
                                or <strong>60 days</strong>. The rental period begins on the date of delivery as
                                confirmed by the carrier tracking update.
                            </p>

                            <h3>Returning your kit</h3>
                            <p>
                                A prepaid return shipping label is included in every kit shipment. To return your kit:
                            </p>
                            <ol>
                                <li>Repack all items using the original packaging materials provided.</li>
                                <li>Affix the prepaid return label to the outside of the box.</li>
                                <li>
                                    Drop the package at any authorised carrier location by the last day of your rental
                                    period.
                                </li>
                                <li>Keep your drop-off receipt until your deposit refund is confirmed.</li>
                            </ol>

                            <h3>Late returns</h3>
                            <p>
                                If a kit is not dropped off for return by the last day of the rental period, a late fee
                                of <strong>$15 per day</strong> will be charged to the payment method on file, up to a
                                maximum of 30 additional days. After 30 days of non-return, the kit is considered lost
                                and the full replacement cost is charged per Section 7.
                            </p>
                            <p>
                                If you need to extend your rental, you may request an extension from your account
                                dashboard up to 3 days before the end of the rental period, subject to inventory
                                availability. Extensions are billed at the applicable daily rate for your kit.
                            </p>
                        </section>

                        {/* 5. Deposits & Refunds */}
                        <section className="cb-legal-section" id="deposits" aria-labelledby="deposits-heading">
                            <h2 id="deposits-heading">
                                <span className="cb-legal-num" aria-hidden="true">5</span>
                                Deposits &amp; Refunds
                            </h2>
                            <p>
                                A refundable security deposit is charged at the time of rental checkout for each kit.
                                The deposit amount is displayed on the kit detail page and at checkout. The deposit is
                                held to cover potential damage to or loss of rental items.
                            </p>

                            <h3>Deposit refund timeline</h3>
                            <ul>
                                <li>
                                    Upon return receipt, our fulfilment team inspects the kit within 2 business days.
                                </li>
                                <li>
                                    If all items are returned in <strong>good condition</strong> (normal wear and tear
                                    accepted), <strong>100% of the deposit is refunded within 5 business days</strong>{" "}
                                    to the original payment method.
                                </li>
                                <li>
                                    If minor cleaning or reconditioning is required, a cleaning fee of up to $25 may be
                                    deducted before refund.
                                </li>
                                <li>
                                    If items sustain <strong>major damage</strong> (breakage, staining, structural
                                    damage), we will deduct the cost to repair or replace the affected items, up to{" "}
                                    <strong>90% of the replacement cost per item</strong>. The total deduction shall
                                    never exceed the deposit amount held.
                                </li>
                                <li>
                                    If items are <strong>lost or not returned</strong>, we will charge the full
                                    replacement cost of those items, which may exceed the deposit; any amount above the
                                    deposit will be charged to the payment method on file (see Section 7).
                                </li>
                            </ul>
                            <div className="cb-highlight-box">
                                <strong>Our promise:</strong> We will never charge you more than the deposit for
                                damage, the damage deduction is capped at the deposit. Only in cases of total loss or
                                unreturned items may additional charges apply.
                            </div>
                            <p>
                                Deposit refunds are processed automatically. If you believe an assessment is incorrect,
                                you may dispute it within 14 days of the refund notice by contacting{" "}
                                <a href="mailto:support@celebrease.com">support@celebrease.com</a>. We will review
                                photographs taken at intake and respond within 5 business days.
                            </p>
                        </section>

                        {/* 6. Shipping */}
                        <section className="cb-legal-section" id="shipping" aria-labelledby="shipping-heading">
                            <h2 id="shipping-heading">
                                <span className="cb-legal-num" aria-hidden="true">6</span>
                                Shipping
                            </h2>
                            <p>
                                CeleBrease includes free standard outbound delivery and free return shipping on all kit
                                rentals. Shipping is available to the contiguous United States (48 states). We do not
                                currently ship to Alaska, Hawaii, U.S. territories, or internationally.
                            </p>

                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Shipping option</th>
                                        <th scope="col">Estimated transit</th>
                                        <th scope="col">Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Standard (outbound)</strong></td>
                                        <td>5, 7 business days</td>
                                        <td>Free</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Express (outbound)</strong></td>
                                        <td>2, 3 business days</td>
                                        <td>$25 per shipment</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Standard return</strong></td>
                                        <td>Prepaid label included</td>
                                        <td>Free</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p>
                                Shipping times are estimates and not guaranteed. CeleBrease is not liable for carrier
                                delays beyond our control, including weather events, holidays, or carrier disruptions.
                                We will provide tracking information by email once your kit ships.
                            </p>
                            <p>
                                You are responsible for ensuring your delivery address is accurate. Redelivery or
                                address-correction fees charged by the carrier may be passed to you. If a kit is
                                returned to us undeliverable, we will contact you to arrange re-shipment at the
                                standard rate.
                            </p>
                        </section>

                        {/* 7. Damage, Loss & Liability */}
                        <section className="cb-legal-section" id="damage" aria-labelledby="damage-heading">
                            <h2 id="damage-heading">
                                <span className="cb-legal-num" aria-hidden="true">7</span>
                                Damage, Loss &amp; Liability
                            </h2>
                            <p>
                                All rental items remain the property of CeleBrease at all times. From the moment a kit
                                is delivered to your address until it is received back at our fulfilment centre, you
                                are responsible for its safekeeping.
                            </p>

                            <h3>Your responsibilities</h3>
                            <ul>
                                <li>
                                    Use rental items only for their intended decorative purpose in a private
                                    residential or commercial setting.
                                </li>
                                <li>Do not alter, paint, glue, or permanently modify any rental item.</li>
                                <li>
                                    Keep items away from fire hazards, excessive moisture, and pets that may cause
                                    damage.
                                </li>
                                <li>
                                    Repack items carefully using the original packaging; do not discard packaging
                                    materials.
                                </li>
                            </ul>

                            <h3>Damage assessment</h3>
                            <p>
                                Our team photographs and inspects every kit at fulfilment before shipment and again
                                upon return. These records are used to assess damage fairly. We distinguish between:
                            </p>
                            <ul>
                                <li>
                                    <strong>Normal wear and tear</strong>, minor scuffs or surface dust incidental to
                                    normal decorative use. No charge.
                                </li>
                                <li>
                                    <strong>Damage requiring repair or cleaning</strong>, staining, broken components,
                                    missing hardware. Charged at cost of repair, deducted from deposit.
                                </li>
                                <li>
                                    <strong>Total loss</strong>, items destroyed beyond repair or not returned.
                                    Charged at full replacement cost, which may exceed your deposit. Excess charges are
                                    billed to the payment method on file.
                                </li>
                            </ul>

                            <p>
                                CeleBrease is not liable for personal injury, property damage, or any consequential
                                losses arising from your use of rental items. You use all rental items at your own
                                risk.
                            </p>
                        </section>

                        {/* 8. Cancellation & Skipping Holidays */}
                        <section className="cb-legal-section" id="cancellation" aria-labelledby="cancellation-heading">
                            <h2 id="cancellation-heading">
                                <span className="cb-legal-num" aria-hidden="true">8</span>
                                Cancellation &amp; Skipping Holidays
                            </h2>

                            <h3>Skipping a holiday</h3>
                            <p>
                                You may skip an upcoming rental, cancelling your kit reservation for a specific
                                holiday, at no charge, provided you do so at least{" "}
                                <strong>14 days before the scheduled ship date</strong> for that rental. Skipped slots
                                are returned to a Pending state and can be reassigned to a different holiday in the
                                same subscription year.
                            </p>
                            <p>
                                Cancellations made fewer than 14 days but more than 3 days before the scheduled ship
                                date will incur a $25 restocking fee, deducted from your next billing cycle.
                                Cancellations within 3 days of the scheduled ship date are not permitted once the kit
                                has entered the packing stage; you may return the kit immediately upon delivery at your
                                expense, and the standard return inspection and deposit refund process will apply.
                            </p>

                            <h3>Cancelling your subscription</h3>
                            <p>
                                You may cancel your subscription at any time from your account dashboard. Upon
                                cancellation:
                            </p>
                            <ul>
                                <li>
                                    Your subscription remains active until the end of the current billing period. No
                                    partial-period refunds are issued.
                                </li>
                                <li>
                                    Any active kit rentals must be returned by the original rental end date. Normal
                                    late fees apply.
                                </li>
                                <li>
                                    Pending holiday slots expire at the end of the billing period and are not refunded.
                                </li>
                                <li>
                                    Deposits for active rentals are refunded per the standard process after kit
                                    inspection.
                                </li>
                            </ul>

                            <div className="cb-highlight-box">
                                <strong>Annual plans:</strong> If you cancel an annual subscription before the renewal
                                date, the remaining subscription months are forfeited. We do not issue pro-rata
                                refunds for unused annual billing periods.
                            </div>
                        </section>

                        {/* 9. Billing & Auto-Renewal */}
                        <section className="cb-legal-section" id="billing" aria-labelledby="billing-heading">
                            <h2 id="billing-heading">
                                <span className="cb-legal-num" aria-hidden="true">9</span>
                                Billing &amp; Auto-Renewal
                            </h2>
                            <p>
                                Subscription fees are billed in advance on a recurring basis, monthly or annually
                                depending on your chosen billing cycle. All prices are in U.S. dollars and are
                                exclusive of applicable sales tax, which is calculated and displayed at checkout.
                            </p>
                            <ul>
                                <li>
                                    Your subscription <strong>auto-renews</strong> on the same day of each billing
                                    cycle. By subscribing you authorise CeleBrease to charge your payment method
                                    automatically at each renewal.
                                </li>
                                <li>
                                    You will receive an email reminder at least 7 days before an annual renewal and 3
                                    days before a monthly renewal.
                                </li>
                                <li>
                                    Kit rental charges (including deposits and any express shipping fees) are billed
                                    separately at checkout and do not form part of the subscription fee.
                                </li>
                                <li>
                                    If a payment fails, we will retry your card up to three times over 7 days. If
                                    payment cannot be collected, your subscription will be suspended and active rental
                                    orders may be placed on hold.
                                </li>
                                <li>
                                    Price changes to subscription plans take effect at the next renewal after 30 days&apos;
                                    written notice. You may cancel before the new price takes effect if you do not agree.
                                </li>
                            </ul>
                            <p>
                                All payments are processed securely through Stripe. CeleBrease does not store your
                                full payment card details. By providing a payment method you represent that you are
                                authorised to use it.
                            </p>
                        </section>

                        {/* 10. Acceptable Use */}
                        <section className="cb-legal-section" id="acceptable-use" aria-labelledby="use-heading">
                            <h2 id="use-heading">
                                <span className="cb-legal-num" aria-hidden="true">10</span>
                                Acceptable Use
                            </h2>
                            <p>
                                You agree to use the Service only for lawful purposes and in accordance with these
                                Terms. You must not:
                            </p>
                            <ul>
                                <li>
                                    Provide false information when creating an account, placing an order, or submitting
                                    a damage dispute.
                                </li>
                                <li>
                                    Use the Service to rent items for commercial resale, subletting, or staging for
                                    property listings without our prior written consent.
                                </li>
                                <li>
                                    Tamper with, reverse-engineer, or attempt to circumvent any security or access
                                    control feature of the website or Service.
                                </li>
                                <li>Submit fraudulent reviews or manipulate the review system.</li>
                                <li>
                                    Use automated tools, scrapers, or bots to access the Service in a manner that
                                    degrades performance for other users.
                                </li>
                                <li>
                                    Harass, threaten, or abuse CeleBrease staff, fulfilment partners, or other
                                    customers.
                                </li>
                            </ul>
                            <p>
                                We reserve the right to suspend or permanently terminate accounts that violate these
                                terms, with or without prior notice, and to pursue any legal remedies available to us.
                                Account termination does not relieve you of outstanding financial obligations including
                                unreturned kit charges and unpaid subscription fees.
                            </p>
                        </section>

                        {/* 11. Limitation of Liability */}
                        <section className="cb-legal-section" id="limitation" aria-labelledby="limitation-heading">
                            <h2 id="limitation-heading">
                                <span className="cb-legal-num" aria-hidden="true">11</span>
                                Limitation of Liability
                            </h2>
                            <p>
                                To the fullest extent permitted by applicable law, CeleBrease and its officers,
                                directors, employees, agents, and partners shall not be liable for any indirect,
                                incidental, special, consequential, or punitive damages, including but not limited to
                                loss of profits, loss of data, loss of goodwill, or business interruption, arising out
                                of or in connection with:
                            </p>
                            <ul>
                                <li>Your use of or inability to use the Service.</li>
                                <li>
                                    Damage to your property caused by rental items, except to the extent such damage
                                    results directly from our negligence.
                                </li>
                                <li>
                                    Delays in delivery or return transit caused by third party carriers.
                                </li>
                                <li>
                                    Unauthorized access to or alteration of your account or data.
                                </li>
                            </ul>
                            <p>
                                In any event, CeleBrease&apos;s total cumulative liability to you for all claims
                                arising from or related to the Service shall not exceed the greater of (a) the total
                                subscription fees you paid in the 12 months preceding the claim, or (b) $200.
                            </p>
                            <div className="cb-highlight-box">
                                Some jurisdictions do not allow the exclusion or limitation of certain warranties or
                                liabilities, so some of the above limitations may not apply to you. Nothing in these
                                Terms limits our liability for death or personal injury caused by our negligence, or
                                for fraud or fraudulent misrepresentation.
                            </div>
                            <p>
                                The Service and all rental items are provided &ldquo;as is&rdquo; and &ldquo;as
                                available.&rdquo; We make no warranty, express or implied, that the Service will be
                                uninterrupted, error-free, or that rental items will be free from defects beyond what
                                is disclosed on the kit detail page.
                            </p>
                            <p>
                                These Terms are governed by the laws of the State of Delaware, without regard to
                                conflict of law principles. Any dispute not resolved through our support process shall
                                be subject to binding arbitration in accordance with the American Arbitration
                                Association&apos;s Consumer Arbitration Rules, or, where arbitration is unavailable,
                                the exclusive jurisdiction of the state and federal courts of Delaware.
                            </p>
                        </section>

                        {/* 12. Contact */}
                        <section className="cb-legal-section" id="contact" aria-labelledby="contact-heading">
                            <h2 id="contact-heading">
                                <span className="cb-legal-num" aria-hidden="true">12</span>
                                Contact
                            </h2>
                            <p>
                                If you have questions about these Terms, your rental, a damage dispute, or your
                                subscription, our team is here to help:
                            </p>
                            <ul>
                                <li>
                                    <strong>General support &amp; rental questions:</strong>{" "}
                                    <a href="mailto:support@celebrease.com">support@celebrease.com</a>
                                </li>
                                <li>
                                    <strong>Legal &amp; compliance inquiries:</strong>{" "}
                                    <a href="mailto:legal@celebrease.com">legal@celebrease.com</a>
                                </li>
                                <li>
                                    <strong>Damage disputes:</strong>{" "}
                                    <a href="mailto:support@celebrease.com">support@celebrease.com</a>, include your
                                    order number and photographs.
                                </li>
                                <li>
                                    <strong>Response time:</strong> We respond to all inquiries within 2 business
                                    days. Urgent rental-related issues are prioritised.
                                </li>
                                <li>
                                    <strong>Mailing address:</strong> CeleBrease, Inc. · Legal Department · [Address
                                    on file at launch]
                                </li>
                            </ul>
                            <div className="cb-highlight-box">
                                Before escalating a dispute, we strongly encourage you to contact our support team
                                first. The vast majority of issues, from deposit questions to late fees, are resolved
                                quickly and fairly when you reach out directly.
                            </div>
                        </section>

                    </article>
                </div>
            </main>

        </div>
    );
}
