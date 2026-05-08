import ActiveRentals from "@/components/account/active-rentals";
import AddressCard from "@/components/account/address-card";
import PaymentCard from "@/components/account/payment-card";
import RecentRentals from "@/components/account/recent-rentals";
import SubscriptionCard from "@/components/account/subscription-card";

export default function AccountPage() {
    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">My Account</h3>
                    <p className="text-muted-foreground">Manage your preferences and update your profile settings here.</p>
                </div>

                {/* Active Rentals */}
                <ActiveRentals />

                {/* Middle Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubscriptionCard />

                    {/* Address */}
                    <AddressCard />

                    {/* Payment */}
                    <PaymentCard />
                </div>

                {/* Recent Rentals */}
                <RecentRentals />

                {/* Add-ons / Extend
                <div className="rounded-2xl border p-5 flex flex-col gap-4 bg-white">
                    <div className="space-y-2">
                        <h3 className="font-medium">Previous Add-ons</h3>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                            <li>Extra Lights</li>
                            <li>Table Runner</li>
                        </ul>
                    </div>
                    <hr />
                    <div className="space-y-2">
                        <h3 className="font-medium">Extend Your Rental</h3>
                        <div className="flex gap-2">
                            {["+3 days", "+7 days", "+14 days"].map((item, i) => (
                                <button key={i} className="flex-1 text-sm border rounded-lg py-2 hover:bg-muted transition">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button variant="black" className="mt-2">
                        Request Extension
                    </Button>
                </div> */}
            </div>
        </main>
    );
}
