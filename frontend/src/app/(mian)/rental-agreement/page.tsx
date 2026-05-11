import SectionHeader from "@/components/main/section-header";

export default function RentalAgreementPage() {
    return (
        <section className="bg-linear-to-b from-primary/10 to-transparent">
            <div className="h-20" />
            <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20 relative">
                <SectionHeader title="Rental Agreement & Terms" subtitle="Legal" />

                <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-6 md:p-10 lg:p-12 space-y-10">
                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">1. Rental Period</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            Each décor kit is rented for a period agreed upon at checkout, typically 30 days. The rental period begins on
                            the date of delivery. Late returns may incur additional daily fees as outlined in your order summary.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">2. Deposit</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            A refundable security deposit is required for each rental. The deposit is fully refunded once the kit is
                            returned in its original condition. We reserve the right to deduct costs for missing or damaged items from the
                            deposit.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">3. Condition & Care</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            Renters agree to use the décor kits with reasonable care. Items must not be altered, painted, glued, or
                            permanently modified. Outdoor items should be protected from extreme weather. Normal wear is acceptable;
                            excessive damage will be charged accordingly.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">4. Delivery & Pickup</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            CeleBrease handles delivery and pickup via our trusted logistics partners. Please ensure someone is available to
                            receive the package at the scheduled delivery time. For returns, repack the kit in the original box, attach the
                            prepaid label, and leave it at your door on the scheduled pickup date.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">5. Subscription Plans</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            Subscription plans renew automatically unless canceled before the next billing cycle. You may pause or skip a
                            delivery directly from your account dashboard. Upgrades and downgrades take effect at the start of the next
                            billing cycle.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">6. Cancellation</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            One-off rentals can be canceled for a full refund if the kit has not yet shipped. Subscription cancellations
                            stop future charges but do not refund the current active period. Please contact support within 48 hours of
                            delivery if you wish to dispute any charges.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-semibold font-heading">7. Liability</h3>
                        <p className="text-base lg:text-lg leading-relaxed text-muted-foreground">
                            CeleBrease is not liable for indirect, incidental, or consequential damages arising from the use of our
                            products. Our total liability is limited to the amount paid for the specific rental in question.
                        </p>
                    </section>

                    <p className="text-sm text-muted-foreground pt-4 border-t">
                        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. If you have questions
                        about these terms, please contact us at support@celebrease.com.
                    </p>
                </div>
            </div>
        </section>
    );
}
