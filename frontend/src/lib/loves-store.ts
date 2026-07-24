"use client";

import { getMyHolidayLoves, loveHoliday, unloveHoliday } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LovesState = {
    loved: Set<string>;
    hydrated: boolean;
    hydrate: () => Promise<void>;
    reset: () => void;
    toggle: (holidayId: string) => Promise<void>;
};

export const useLovesStore = create<LovesState>()(
    persist(
        (set, get) => ({
            loved: new Set<string>(),
            hydrated: false,
            hydrate: async () => {
                try {
                    const { holidayIds } = await getMyHolidayLoves();
                    set({ loved: new Set(holidayIds), hydrated: true });
                } catch {
                    set({ hydrated: true });
                }
            },
            reset: () => set({ loved: new Set<string>(), hydrated: false }),
            toggle: async (holidayId) => {
                const wasLoved = get().loved.has(holidayId);

                const next = new Set(get().loved);
                wasLoved ? next.delete(holidayId) : next.add(holidayId);
                set({ loved: next });

                try {
                    if (wasLoved) {
                        await unloveHoliday(holidayId);
                    } else {
                        await loveHoliday(holidayId);
                    }
                } catch (e) {
                    const revert = new Set(get().loved);
                    wasLoved ? revert.add(holidayId) : revert.delete(holidayId);
                    set({ loved: revert });
                    toast.error(e instanceof Error ? e.message : "Failed to update favorite");
                }
            },
        }),
        {
            name: "celebrease-loves",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                loved: Array.from(state.loved),
            }),
            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.loved)) {
                    state.loved = new Set(state.loved as unknown as string[]);
                }
            },
        }
    )
);

export function useHydrateLoves(isAuthenticated: boolean) {
    const hydrate = useLovesStore((s) => s.hydrate);
    const reset = useLovesStore((s) => s.reset);

    useEffect(() => {
        if (isAuthenticated) {
            hydrate();
        } else {
            reset();
        }
    }, [isAuthenticated, hydrate, reset]);
}
