export function CheckoutProgress({ activeStep = 1 }: { activeStep?: number }) {
    return (
        <div className="bg-white rounded-2xl p-4 mb-6 border flex items-center justify-between max-w-sm">
            <div className="flex items-center gap-2">
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #9B2FC9, #DC0075)" }}
                >
                    {activeStep}
                </div>
                <span className="text-sm font-semibold">Confirm Details</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-px h-4 bg-border mx-1" />
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-border text-muted-foreground">
                    2
                </div>
                <span className="text-sm">Pay with Stripe</span>
            </div>
        </div>
    );
}

const TRUST_BADGES = [
    { icon: "🔒", title: "256-bit SSL", subtitle: "Encrypted Checkout" },
    { icon: "♻️", title: "Easy Returns", subtitle: "Free Pickup" },
    { icon: "💸", title: "Deposit", subtitle: "Fully Refundable" },
    { icon: "🚚", title: "Free Delivery", subtitle: "On Subscriptions" },
];

export function CheckoutTrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {TRUST_BADGES.map((b) => (
                <div
                    key={b.title}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 border"
                >
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight truncate">{b.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
