"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items, defaultOpen = -1 }: { items: FaqItem[]; defaultOpen?: number }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="cb-faq-list">
            {items.map((item, i) => (
                <div key={i} className={`cb-faq-item${open === i ? " open" : ""}`}>
                    <button className="cb-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                        {item.q} <span className="arrow">▾</span>
                    </button>
                    <div className="cb-faq-a">
                        <div className="cb-faq-a-inner">{item.a}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
