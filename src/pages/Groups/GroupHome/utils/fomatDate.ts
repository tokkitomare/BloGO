import { fullDate, relative } from "../constants";

export function formatDate(value: string | number | Date): string {
    const date = new Date(value);
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const abs = Math.abs(diffSeconds);

    if (abs < 60) return "agora há pouco";
    if (abs < 3600) return relative.format(Math.round(diffSeconds / 60), "minute");
    if (abs < 86400) return relative.format(Math.round(diffSeconds / 3600), "hour");
    if (abs < 86400 * 7) return relative.format(Math.round(diffSeconds / 86400), "day");
    return fullDate.format(date);
}