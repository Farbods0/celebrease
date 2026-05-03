import { useQuery } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { holidaysApi, type ApiHoliday } from "./api";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getHolidays(): { data: ApiHoliday[]; isLoading: boolean } {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["holidays"],
        queryFn: () => holidaysApi.list(),
    });

    if (isError) return { data: [], isLoading: false };
    return { data: data?.items ?? [], isLoading };
}
