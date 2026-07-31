import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    customersApi,
    formatBillingCycle,
    formatCustomerDate,
    formatDeposit,
    formatOnTimeReturns,
    formatOrderStatus,
    formatSubStatus,
    formatTier,
    getInitials,
    usersApi,
    type ApiCustomer,
    type ApiCustomerDetail,
} from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function CustomerView({ item }: { item: ApiCustomer }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [toggling, setToggling] = useState(false);

    const { data: detail, isLoading } = useQuery<ApiCustomerDetail>({
        queryKey: ["customer", item.id],
        queryFn: () => customersApi.get(item.id),
    });

    const handleToggleBan = async () => {
        if (!detail) return;
        setToggling(true);
        try {
            await usersApi.update(detail.id, {
                name: detail.name,
                banned: !detail.banned,
                phone: detail.phone ?? undefined,
                region: detail.region ?? undefined,
            });
            toast.success(detail.banned ? "Customer reinstated" : "Customer suspended");
            await queryClient.invalidateQueries({ queryKey: ["customer", item.id] });
            await router.invalidate();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to update");
        } finally {
            setToggling(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>

            {isLoading || !detail ? (
                <div className="flex items-center justify-center py-12">
                    <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Profile */}
                    <section className="flex items-center gap-3">
                        <Avatar className="size-14">
                            <AvatarImage src={detail.image ?? undefined} alt={detail.name} />
                            <AvatarFallback>{getInitials(detail.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{detail.name}</h3>
                            <p className="text-sm text-muted-foreground">{detail.email}</p>
                            {detail.phone && <p className="text-sm text-muted-foreground">{detail.phone}</p>}
                        </div>
                    </section>

                    {/* Stats */}
                    <section>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-secondary/10 p-3 text-center">
                                <p className="text-2xl font-bold">{detail.orderCount}</p>
                                <p className="text-xs text-muted-foreground">Orders</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3 text-center">
                                <p className="text-2xl font-bold">{formatOnTimeReturns(detail.completedCount, detail.orderCount)}</p>
                                <p className="text-xs text-muted-foreground">On-Time Returns</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3 text-center">
                                <p className="text-2xl font-bold">{formatDeposit(detail.depositsHeld)}</p>
                                <p className="text-xs text-muted-foreground">Deposits Held</p>
                            </div>
                            <div className="rounded-lg bg-secondary/10 p-3 text-center">
                                <p className="text-2xl font-bold">{detail.region ?? ", "}</p>
                                <p className="text-xs text-muted-foreground">Region</p>
                            </div>
                        </div>
                    </section>

                    {/* Subscription */}
                    <section>
                        <h3 className="uppercase text-sm font-medium mb-2.5">Subscription</h3>
                        {detail.subscription ? (
                            <div className="bg-secondary/10 p-4 rounded-lg flex gap-3 items-start">
                                <div className="w-1 bg-secondary rounded-full self-stretch" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <h4 className="text-base font-medium">{detail.subscription.plan.name}</h4>
                                        <StatusBadge status={formatSubStatus(detail.subscription.status)} />
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Field label="Billing" value={formatBillingCycle(detail.subscription.billingCycle)} />
                                        <Field label="Started" value={formatCustomerDate(detail.subscription.startedAt)} />
                                        <Field label="Next Billing" value={formatCustomerDate(detail.subscription.nextBillingAt)} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No active subscription</p>
                        )}
                    </section>

                    {/* Address */}
                    <section>
                        <h3 className="uppercase text-sm font-medium mb-2.5">Address</h3>
                        {detail.address ? (
                            <div className="bg-secondary/10 p-4 rounded-lg text-sm space-y-0.5">
                                <p className="font-medium">{detail.address.name}</p>
                                <p className="text-muted-foreground">{detail.address.streetLine1}</p>
                                {detail.address.streetLine2 && <p className="text-muted-foreground">{detail.address.streetLine2}</p>}
                                <p className="text-muted-foreground">
                                    {detail.address.city}, {detail.address.state} {detail.address.postalCode}
                                </p>
                                <p className="text-muted-foreground">{detail.address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No address on file</p>
                        )}
                    </section>

                    {/* Recent Orders */}
                    <section>
                        <h3 className="uppercase text-sm font-medium mb-2.5">Recent Orders</h3>
                        {detail.recentOrders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No orders yet</p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Holiday</TableHead>
                                            <TableHead>Kit</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {detail.recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium text-muted-foreground">{order.orderNumber}</TableCell>
                                                <TableCell>{order.holiday.name}</TableCell>
                                                <TableCell>{formatTier(order.kit.tier)}</TableCell>
                                                <TableCell>${Number(order.total).toFixed(0)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={formatOrderStatus(order.status)} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>

                    {/* Meta */}
                    <section>
                        <div className="grid grid-cols-2 gap-2">
                            <Field label="Joined" value={formatCustomerDate(detail.createdAt)} />
                            <Field label="Status" value={detail.banned ? "Banned" : "Active"} />
                        </div>
                    </section>

                    <Separator />

                    <section className="flex justify-end">
                        <Button
                            variant={detail.banned ? "default" : "destructive"}
                            disabled={toggling}
                            onClick={handleToggleBan}
                        >
                            {toggling ? "..." : detail.banned ? "Reinstate Account" : "Suspend Account"}
                        </Button>
                    </section>
                </div>
            )}
        </DialogContent>
    );
}
