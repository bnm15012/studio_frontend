/** Date parsing/formatting utilities: parseDateTime, formatDateTime, addDays, and related helpers for "YYYY-MM-DD HH:mm:ss" strings. */
export const parseDateTime = (str: string | null | undefined): Date | null => {
    if (!str) return null;

    const [d, t = "00:00:00"] = str.split(" ");
    if (!d) return null;

    const [y, m, day] = d.split("-").map(Number);
    const [h = 0, min = 0, s = 0] = t.split(":").map(Number);

    const date = new Date(y, m - 1, day, h, min, s);
    return isNaN(date.getTime()) ? null : date;
};

// ✅ Format Date → "YYYY-MM-DD HH:mm:ss"
export const formatDateTime = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// ✅ Add days (LOCAL)
export const addDays = (date: string, days: number): string | null => {
    const parsed = parseDateTime(date);
    if (!parsed) throw new Error("Invalid date");

    parsed.setDate(parsed.getDate() + days);
    return formatDateTime(parsed);
};

// ✅ Check if today (LOCAL)
export const isToday = (dateString: string | null | undefined): boolean => {
    const date = parseDateTime(dateString);
    if (!date) return false;

    const now = new Date();

    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
};

// ✅ Check if past (LOCAL)
export const isPast = (dateString: string | null | undefined): boolean => {
    const date = parseDateTime(dateString);
    if (!date) return false;

    return date.getTime() < Date.now();
};

// ✅ Current local datetime
export const getCurrentDateTimeLocal = (): string => formatDateTime(new Date());

export const getCurrentDateLocal = (): string => formatDate(new Date(), "YYYY-MM-DD");

// ✅ Generic formatter
export const formatDate = (dateObj: Date, format = "YYYY-MM-DD HH:mm:ss"): string => {
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date object");
    }

    const pad = (n: number) => String(n).padStart(2, "0");

    const map: Record<string, string | number> = {
        YYYY: dateObj.getFullYear(),
        MM: pad(dateObj.getMonth() + 1),
        DD: pad(dateObj.getDate()),
        HH: pad(dateObj.getHours()),
        mm: pad(dateObj.getMinutes()),
        ss: pad(dateObj.getSeconds()),
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => String(map[k]));
};

// ✅ Display helper
export const getLocalDateTime = (date: string | null | undefined, format = "DATE"): string => {
    const localDate = parseDateTime(date);
    if (!localDate) return "N/A";

    if (format === "DATE") {
        return localDate.toLocaleDateString("en-GB");
    }

    if (format === "DATETIME") {
        return (
            localDate.toLocaleDateString("en-GB") +
            " " +
            localDate.toLocaleTimeString("en-GB", { hour12: true })
        );
    }

    return "Invalid format";
};

// ✅ Time ago
export const getTimePassed = (dateString: string | null | undefined): string => {
    const date = parseDateTime(dateString);
    if (!date) return "N/A";

    const diffMs = Date.now() - date.getTime();

    if (diffMs < 0) return "In future";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} days ago`;
};

export const getDateRangeLocal = (startDate: string, endDate: string): Date[] => {
    const dates: Date[] = [];

    const current = parseDateTime(startDate);
    const end = parseDateTime(endDate);

    if (!current || !end) return [];

    current.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};
