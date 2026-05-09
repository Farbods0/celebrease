import { Prisma } from "@/generated/prisma/client";
import { ReturnCondition } from "@/generated/prisma/enums";
import { BadRequestException, Injectable } from "@nestjs/common";

type Tx = Prisma.TransactionClient;

type Line = { itemId: string | null; addOnId: string | null; qty: number };

/**
 * Owns every transition between Inventory buckets driven by the order lifecycle.
 *
 *   availableQty ──reserve──▶ reservedQty ──ship──▶ shippedQty ──inspect──▶ cleaning|repair|lost
 *                          (release)               (releaseShipped)
 *
 * Every method takes a Prisma transaction client so the caller can compose it
 * with the rest of an order mutation in a single atomic write.
 */
@Injectable()
export class InventoryAllocationService {
    private async loadOrderLines(tx: Tx, orderId: string): Promise<Line[]> {
        const [items, addOns] = await Promise.all([
            tx.orderItem.findMany({ where: { orderId }, select: { itemId: true, qty: true } }),
            tx.orderAddOn.findMany({ where: { orderId }, select: { addOnId: true, qty: true } }),
        ]);
        return [
            ...items.map((i) => ({ itemId: i.itemId, addOnId: null, qty: i.qty })),
            ...addOns.map((a) => ({ itemId: null, addOnId: a.addOnId, qty: a.qty })),
        ];
    }

    private async findInventory(tx: Tx, line: Line) {
        return tx.inventory.findFirst({
            where: line.itemId ? { itemId: line.itemId } : { addOnId: line.addOnId },
            select: { id: true, availableQty: true, reservedQty: true, shippedQty: true },
        });
    }

    /**
     * Reserve every line on an order. Uses a conditional updateMany so the
     * stock check and the decrement happen atomically under Postgres's row
     * lock — concurrent checkouts for the last unit cannot both succeed.
     * Throws (rolling back the parent $transaction) if any line is short.
     */
    async reserveForOrder(tx: Tx, orderId: string) {
        const lines = await this.loadOrderLines(tx, orderId);
        for (const line of lines) {
            const inv = await this.findInventory(tx, line);
            if (!inv) continue; // No tracking row => skip silently for now.

            const result = await tx.inventory.updateMany({
                where: { id: inv.id, availableQty: { gte: line.qty } },
                data: {
                    availableQty: { decrement: line.qty },
                    reservedQty: { increment: line.qty },
                },
            });
            if (result.count === 0) {
                throw new BadRequestException(
                    `Insufficient stock for ${line.itemId ?? line.addOnId}: need ${line.qty}, have ${inv.availableQty}`,
                );
            }
        }
    }

    /** Cancel before ship: roll reservedQty back to availableQty. */
    async releaseForOrder(tx: Tx, orderId: string) {
        const lines = await this.loadOrderLines(tx, orderId);
        for (const line of lines) {
            const inv = await this.findInventory(tx, line);
            if (!inv) continue;
            const releasable = Math.min(inv.reservedQty, line.qty);
            if (releasable === 0) continue;
            await tx.inventory.update({
                where: { id: inv.id },
                data: {
                    reservedQty: { decrement: releasable },
                    availableQty: { increment: releasable },
                },
            });
        }
    }

    /** Order shipped: move reserved → shipped. */
    async markShippedForOrder(tx: Tx, orderId: string) {
        const lines = await this.loadOrderLines(tx, orderId);
        for (const line of lines) {
            const inv = await this.findInventory(tx, line);
            if (!inv) continue;
            const moveable = Math.min(inv.reservedQty, line.qty);
            if (moveable === 0) continue;
            await tx.inventory.update({
                where: { id: inv.id },
                data: {
                    reservedQty: { decrement: moveable },
                    shippedQty: { increment: moveable },
                },
            });
        }
    }

    /** Cancel after ship (unusual): roll shippedQty back to availableQty. */
    async releaseShippedForOrder(tx: Tx, orderId: string) {
        const lines = await this.loadOrderLines(tx, orderId);
        for (const line of lines) {
            const inv = await this.findInventory(tx, line);
            if (!inv) continue;
            const moveable = Math.min(inv.shippedQty, line.qty);
            if (moveable === 0) continue;
            await tx.inventory.update({
                where: { id: inv.id },
                data: {
                    shippedQty: { decrement: moveable },
                    availableQty: { increment: moveable },
                },
            });
        }
    }

    /**
     * Apply per-line return inspection: shippedQty -= qty, then bump the right
     * destination bucket. MISSING/LOST also reduces totalQty.
     */
    async applyInspection(tx: Tx, lines: { itemId?: string | null; addOnId?: string | null; qty: number; condition: ReturnCondition }[]) {
        for (const line of lines) {
            const inv = await this.findInventory(tx, {
                itemId: line.itemId ?? null,
                addOnId: line.addOnId ?? null,
                qty: line.qty,
            });
            if (!inv) continue;

            const data: Prisma.InventoryUpdateInput = { shippedQty: { decrement: line.qty } };
            switch (line.condition) {
                case "GOOD":
                    data.cleaningQty = { increment: line.qty };
                    break;
                case "DAMAGED":
                    data.repairQty = { increment: line.qty };
                    break;
                case "MISSING":
                case "LOST":
                    data.lostQty = { increment: line.qty };
                    data.totalQty = { decrement: line.qty };
                    break;
            }
            await tx.inventory.update({ where: { id: inv.id }, data });
        }
    }

    /**
     * Reverse a previously-applied inspection. Used to make inspectReturn
     * idempotent — if prior return lines exist on an order, undo their bucket
     * effects before applying the new submission.
     */
    async undoInspection(tx: Tx, lines: { itemId: string | null; addOnId: string | null; qty: number; condition: ReturnCondition }[]) {
        for (const line of lines) {
            const inv = await this.findInventory(tx, line);
            if (!inv) continue;

            const data: Prisma.InventoryUpdateInput = { shippedQty: { increment: line.qty } };
            switch (line.condition) {
                case "GOOD":
                    data.cleaningQty = { decrement: line.qty };
                    break;
                case "DAMAGED":
                    data.repairQty = { decrement: line.qty };
                    break;
                case "MISSING":
                case "LOST":
                    data.lostQty = { decrement: line.qty };
                    data.totalQty = { increment: line.qty };
                    break;
            }
            await tx.inventory.update({ where: { id: inv.id }, data });
        }
    }
}
