import React from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { Customer } from '../../data';

function Field({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "available" | "reserved" | "repair" | "status" }) {
    let valueColor: string | undefined;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium" style={valueColor ? { color: valueColor } : undefined}>
                {value}
            </span>
        </div>
    );
}

export default function CustomerView({ item }: { item: Customer }) {
    return (
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {/* TODO: Add inventory view */}
            {/* Inventory Section */}
        </DialogContent>
    );
}
