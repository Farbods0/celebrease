import AddressDialog from "@/components/account/address-dialog";
import SubscriptionCard from "@/components/account/subscription-card";
import { Button } from "@/components/ui/button";
import { getMyAddress, getMyPaymentMethod, listMyOrders } from "@/lib/api";
import { CalendarIcon, LinkSquare02Icon, PackageIcon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function AccountPage() {
    const [address, paymentMethod, activeOrdersRes, recentOrdersRes] = await Promise.all([
        getMyAddress(),
        getMyPaymentMethod(),
        listMyOrders({ filter: "active", limit: 5 }),
        listMyOrders({ filter: "recent", limit: 10 }),
    ]);

    const activeOrders = activeOrdersRes?.items || [];
    const recentOrders = recentOrdersRes?.items || [];

    return (
        <main className="mt-20 bg-muted">
            <div className="container mx-auto px-6 py-8 md:py-10 lg:py-12 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold">My Account</h3>
                    <p className="text-muted-foreground">Manage your preferences and update your profile settings here.</p>
                </div>

                {/* Active Rentals */}
                {activeOrders.length > 0 && (
                    <div className="bg-white rounded-2xl border p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 lg:size-14 rounded-full border flex justify-center items-center">
                                <HugeiconsIcon icon={PackageIcon} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg lg:text-xl font-medium">Your Active Rental{activeOrders.length > 1 ? "s" : ""}</h2>
                                <span className="text-sm lg:text-base text-muted-foreground">Currently in use</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {activeOrders.map((order) => (
                                <div key={order.id} className="bg-muted rounded-xl border p-4 flex flex-col gap-4">
                                    <div className="flex justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-lg lg:text-xl font-semibold capitalize">{order.holiday.name} {order.kit.tier.toLowerCase()} Kit</h3>
                                            <p className="text-sm lg:text-base flex items-center gap-2">
                                                <HugeiconsIcon icon={CalendarIcon} size={16} />
                                                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(order.startDate))} –{" "}
                                                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.endDate))}
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-sm text-muted-foreground">Deposit Held</p>
                                            <h3 className="text-lg lg:text-xl font-semibold">${Number(order.kitDeposit) + Number(order.addOnDeposit)}</h3>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-2">
                                        <Button variant="black">
                                            <HugeiconsIcon icon={LinkSquare02Icon} />
                                            Track Package
                                        </Button>
                                        <Button variant="outline">
                                            <HugeiconsIcon icon={Upload01Icon} />
                                            Return Label
                                        </Button>
                                        <Button variant="outline">Extend Rental</Button>
                                        <Button variant="outline">Mark Returned</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Middle Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SubscriptionCard />

                    {/* Address */}
                    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Shipping Address</h3>
                        <p className="flex-1 text-sm lg:text-base">
                            {address ? (
                                <>
                                    {address.streetLine1} {address.streetLine2 ? `, ${address.streetLine2}` : ""}
                                    <br />
                                    <span className="text-muted-foreground">
                                        {address.city}, {address.state} {address.postalCode}
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground italic">No shipping address provided yet.</span>
                            )}
                        </p>

                        <AddressDialog address={address} />
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Payment Method</h3>
                        <p className="flex-1 text-sm lg:text-base">
                            {paymentMethod ? (
                                <>
                                    <span className="capitalize">{paymentMethod.brand}</span> ending •••• {paymentMethod.last4}
                                    <br />
                                    <span className="text-muted-foreground">
                                        Expires {paymentMethod.expMonth?.toString().padStart(2, "0")}/
                                        {paymentMethod.expYear?.toString().slice(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground italic">No payment method attached.</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Recent Rentals */}
                {recentOrders.length > 0 && (
                    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4">
                        <h3 className="text-lg lg:text-xl font-semibold">Recent Rentals</h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="rounded-xl border p-4 flex flex-col justify-between gap-4">
                                    {/* Top */}
                                    <div className="flex items-start justify-between">
                                        <div className="size-10 rounded-full border flex items-center justify-center">
                                            <HugeiconsIcon icon={PackageIcon} size={18} />
                                        </div>

                                        <button className="text-muted-foreground">
                                            <HugeiconsIcon icon={LinkSquare02Icon} size={16} />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h4 className="font-medium">{order.holiday.name}</h4>
                                        <p className="text-sm text-muted-foreground capitalize">{order.kit.tier.toLowerCase()} Kit</p>

                                        <div className="mt-3 flex items-center gap-2">
                                            <p className="text-sm flex items-center gap-1 text-muted-foreground">
                                                <HugeiconsIcon icon={CalendarIcon} size={14} />
                                                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(order.startDate))} –{" "}
                                                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.endDate))}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                                                {order.status === "COMPLETED" ? "Returned" : order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
