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

/**
 * Parses a formatted date string back into a Date object based on a matching format pattern.
 * Supports custom tokens:
 * - DD: Day of month (1 or 2 digits)
 * - MM: Month (1 or 2 digits)
 * - YYYY: Full year (with or without era offset)
 * - YY: Two-digit short year
 * - hh: Hours
 * - mm: Minutes
 */
export function parseDateStr(
    dateStr: string | undefined,
    dateFormat: string | undefined,
    yearOffset: number
): Date | undefined {
    if (!dateStr || !dateStr.trim()) {
        return undefined;
    }

    const format = dateFormat || "DD/MM/YYYY";

    let day = 1;
    let month = 0; // 0-indexed
    let year = new Date().getFullYear();
    let hour = 0;
    let minute = 0;

    const tokens = ["YYYY", "YY", "DD", "MM", "hh", "mm"];

    const positions: Array<{ token: string; index: number }> = [];
    const matchedIndices = new Set<number>();

    // Find non-overlapping token positions
    tokens.forEach(t => {
        let idx = format.indexOf(t);
        while (idx !== -1) {
            let alreadyMatched = false;
            for (let charIdx = idx; charIdx < idx + t.length; charIdx++) {
                if (matchedIndices.has(charIdx)) {
                    alreadyMatched = true;
                    break;
                }
            }

            if (!alreadyMatched) {
                positions.push({ token: t, index: idx });
                for (let charIdx = idx; charIdx < idx + t.length; charIdx++) {
                    matchedIndices.add(charIdx);
                }
            }
            idx = format.indexOf(t, idx + 1);
        }
    });

    // Sort positions by index ascending to rebuild regex left-to-right
    positions.sort((a, b) => a.index - b.index);

    let regexStr = "^";
    let lastIdx = 0;

    positions.forEach(pos => {
        const literal = format.slice(lastIdx, pos.index);
        regexStr += literal.replace(new RegExp("[-/\\\\^$*+?.()|[\\]{}]", "g"), "\\$&");
        regexStr += "(\\d+)";
        lastIdx = pos.index + pos.token.length;
    });

    const remaining = format.slice(lastIdx);
    regexStr += remaining.replace(new RegExp("[-/\\\\^$*+?.()|[\\]{}]", "g"), "\\$&");
    regexStr += "$";

    const regex = new RegExp(regexStr);
    const match = dateStr.match(regex);
    if (!match) {
        // Fallback: try parsing with Date.parse if it doesn't match the custom format
        const timestamp = Date.parse(dateStr);
        return isNaN(timestamp) ? undefined : new Date(timestamp);
    }

    // Now extract captures based on their positions
    for (let i = 0; i < positions.length; i++) {
        const val = parseInt(match[i + 1], 10);
        if (isNaN(val)) {
            continue;
        }

        const token = positions[i].token;
        if (token === "DD") {
            day = val;
        } else if (token === "MM") {
            month = val - 1; // 0-indexed month
        } else if (token === "YYYY") {
            year = val - yearOffset;
        } else if (token === "YY") {
            // Compute the century in the era-offset timeline, not standard Gregorian AD
            const currentCentury = Math.floor((new Date().getFullYear() + yearOffset) / 100) * 100;
            year = currentCentury + val - yearOffset;
        } else if (token === "hh") {
            hour = val;
        } else if (token === "mm") {
            minute = val;
        }
    }

    const parsedDate = new Date(year, month, day, hour, minute);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}
