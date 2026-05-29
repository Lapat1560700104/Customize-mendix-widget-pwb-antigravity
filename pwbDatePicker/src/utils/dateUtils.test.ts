import { describe, it, expect } from "vitest";
import { getDaysInMonth, getFirstDayOfMonth, isWeekend, formatDateStr, parseDateStr } from "./dateUtils";

describe("PWB Advanced DatePicker - Date Utilities", () => {
    describe("getDaysInMonth", () => {
        it("returns correct number of days for standard months", () => {
            expect(getDaysInMonth(2026, 0)).toBe(31); // Jan
            expect(getDaysInMonth(2026, 3)).toBe(30); // Apr
            expect(getDaysInMonth(2026, 11)).toBe(31); // Dec
        });

        it("handles leap years correctly for February", () => {
            expect(getDaysInMonth(2026, 1)).toBe(28); // 2026 is non-leap
            expect(getDaysInMonth(2024, 1)).toBe(29); // 2024 is leap
            expect(getDaysInMonth(2028, 1)).toBe(29); // 2028 is leap
            expect(getDaysInMonth(2000, 1)).toBe(29); // 2000 is leap
            expect(getDaysInMonth(1900, 1)).toBe(28); // 1900 is non-leap (century rule)
        });
    });

    describe("getFirstDayOfMonth", () => {
        it("returns correct starting weekday of the month", () => {
            // Jan 1st 2026 is a Thursday (4)
            expect(getFirstDayOfMonth(2026, 0)).toBe(4);
            // Feb 1st 2026 is a Sunday (0)
            expect(getFirstDayOfMonth(2026, 1)).toBe(0);
            // Jun 1st 2026 is a Monday (1)
            expect(getFirstDayOfMonth(2026, 5)).toBe(1);
        });
    });

    describe("isWeekend", () => {
        it("identifies Saturdays and Sundays as weekends", () => {
            const sunday = new Date(2026, 4, 3); // May 3, 2026
            const saturday = new Date(2026, 4, 2); // May 2, 2026
            expect(isWeekend(sunday)).toBe(true);
            expect(isWeekend(saturday)).toBe(true);
        });

        it("identifies weekdays as non-weekends", () => {
            const monday = new Date(2026, 4, 4); // May 4, 2026
            const friday = new Date(2026, 4, 8); // May 8, 2026
            expect(isWeekend(monday)).toBe(false);
            expect(isWeekend(friday)).toBe(false);
        });
    });

    describe("formatDateStr", () => {
        const testDate = new Date(2026, 4, 15, 14, 30); // May 15, 2026, 14:30

        it("formats AD date with default DD/MM/YYYY token pattern", () => {
            expect(formatDateStr(testDate, undefined, 0, false)).toBe("15/05/2026");
        });

        it("formats BE date (+543 Offset) with DD/MM/YYYY token pattern", () => {
            expect(formatDateStr(testDate, undefined, 543, false)).toBe("15/05/2569");
        });

        it("respects custom date formats like YYYY-MM-DD", () => {
            expect(formatDateStr(testDate, "YYYY-MM-DD", 0, false)).toBe("2026-05-15");
            expect(formatDateStr(testDate, "YYYY-MM-DD", 543, false)).toBe("2569-05-15");
        });

        it("formats YY short year token correctly", () => {
            expect(formatDateStr(testDate, "DD/MM/YY", 0, false)).toBe("15/05/26");
            expect(formatDateStr(testDate, "DD/MM/YY", 543, false)).toBe("15/05/69");
        });

        it("formats time tokens (hh:mm) if showTime is enabled", () => {
            expect(formatDateStr(testDate, "DD/MM/YYYY hh:mm", 0, true)).toBe("15/05/2026 14:30");
            expect(formatDateStr(testDate, "DD/MM/YYYY hh:mm", 543, true)).toBe("15/05/2569 14:30");
        });

        it("appends time automatically if showTime is enabled but not in template format", () => {
            expect(formatDateStr(testDate, "YYYY-MM-DD", 0, true)).toBe("2026-05-15 14:30");
        });
    });

    describe("parseDateStr", () => {
        it("returns undefined for empty or invalid inputs", () => {
            expect(parseDateStr("", undefined, 0)).toBeUndefined();
            expect(parseDateStr(undefined, undefined, 0)).toBeUndefined();
            expect(parseDateStr("invalid-date", "DD/MM/YYYY", 0)).toBeUndefined();
        });

        it("parses standard date formats correctly", () => {
            const date = parseDateStr("15/05/2026", "DD/MM/YYYY", 0);
            expect(date).toBeDefined();
            expect(date!.getDate()).toBe(15);
            expect(date!.getMonth()).toBe(4); // May
            expect(date!.getFullYear()).toBe(2026);
        });

        it("parses date formats with custom dashes and YYYY-MM-DD pattern", () => {
            const date = parseDateStr("2026-05-15", "YYYY-MM-DD", 0);
            expect(date).toBeDefined();
            expect(date!.getDate()).toBe(15);
            expect(date!.getMonth()).toBe(4);
            expect(date!.getFullYear()).toBe(2026);
        });

        it("parses date with Buddhist Era offset (+543) correctly", () => {
            // "29/05/2569" with offset 543 should parse back to Gregorian 2026-05-29
            const date = parseDateStr("29/05/2569", "DD/MM/YYYY", 543);
            expect(date).toBeDefined();
            expect(date!.getDate()).toBe(29);
            expect(date!.getMonth()).toBe(4);
            expect(date!.getFullYear()).toBe(2026);
        });

        it("parses date and time tokens (hh:mm) correctly", () => {
            const date = parseDateStr("15/05/2026 14:30", "DD/MM/YYYY hh:mm", 0);
            expect(date).toBeDefined();
            expect(date!.getDate()).toBe(15);
            expect(date!.getMonth()).toBe(4);
            expect(date!.getFullYear()).toBe(2026);
            expect(date!.getHours()).toBe(14);
            expect(date!.getMinutes()).toBe(30);
        });

        it("parses short two-digit year (YY) correctly", () => {
            const dateAD = parseDateStr("15/05/26", "DD/MM/YY", 0);
            expect(dateAD!.getFullYear()).toBe(2026);

            const dateBE = parseDateStr("15/05/69", "DD/MM/YY", 543);
            expect(dateBE!.getFullYear()).toBe(2026);
        });

        it("falls back to standard Date.parse for general format matching failures", () => {
            const date = parseDateStr("2026-05-15T14:30:00.000Z", "DD/MM/YYYY", 0);
            expect(date).toBeDefined();
            expect(date!.getUTCFullYear()).toBe(2026);
            expect(date!.getUTCMonth()).toBe(4);
            expect(date!.getUTCDate()).toBe(15);
        });
    });
});
