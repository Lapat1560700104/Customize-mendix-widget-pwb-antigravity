/**
 * Core date utilities for PWB Advanced DatePicker
 */

/**
 * Gets the number of days in a specific month and year (handles leap years correctly)
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets the starting day of the week for a specific month and year (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

/**
 * Checks if a given date falls on a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
}

/**
 * Formats a Date object using localized token substitutions
 * Supports custom tokens:
 * - DD: Zero-padded day of the month (01 - 31)
 * - MM: Zero-padded month index (01 - 12)
 * - YYYY: Full year with era offset (e.g. 2026 or 2569)
 * - YY: Two-digit short year (e.g. 26 or 69)
 * - hh: Zero-padded hours (00 - 23)
 * - mm: Zero-padded minutes (00 - 59)
 */
export function formatDateStr(
    date: Date,
    dateFormat: string | undefined,
    yearOffset: number,
    showTime: boolean
): string {
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const fullYear = date.getFullYear() + yearOffset;
    const shortYear = String(fullYear).slice(-2);
    const hhStr = String(date.getHours()).padStart(2, "0");
    const mmStr = String(date.getMinutes()).padStart(2, "0");

    let format = dateFormat || "DD/MM/YYYY";
    if (showTime && !format.includes("hh") && !format.includes("mm")) {
        format = `${format} hh:mm`;
    }

    return format
        .replace("DD", dayStr)
        .replace("MM", monthStr)
        .replace("YYYY", String(fullYear))
        .replace("YY", shortYear)
        .replace("hh", hhStr)
        .replace("mm", mmStr);
}
