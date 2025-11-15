const addDays = (date, days) => {
    if (!date) {
        throw new Error("Date cannot be null");
    }
    const result = new Date(date.replace(" ", "T") + "Z");
    result.setUTCDate(result.getUTCDate() + days);
    return result.toISOString().replace("T", " ").slice(0, 19);
};

const getCurrentDateTimeUTC = () => new Date().toISOString().replace("T", " ").slice(0, 19);

const convertUTCToLocal = (utcString) => {
    const utcDate = new Date(utcString.replace(" ", "T") + "Z");
    const timezoneOffset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
    return localDate.toISOString().slice(0, 19).replace("T", " ");
};

const formatDate = (dateObj, format = "YYYY-MM-DD HH:mm:ss") => {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) {
        throw new Error("Invalid Date object provided");
    }

    const pad = (num) => String(num).padStart(2, "0");

    const map = {
        YYYY: dateObj.getFullYear(),
        MM: pad(dateObj.getMonth() + 1),
        DD: pad(dateObj.getDate()),
        HH: pad(dateObj.getHours()),
        mm: pad(dateObj.getMinutes()),
        ss: pad(dateObj.getSeconds()),
    };

    let formatted = format;
    for (const key in map) {
        formatted = formatted.replace(key, map[key]);
    }

    return formatted;
};

const convertLocalToUTC = (localString) => {
    if (String(localString).length == 10)
        localString += " " + convertUTCToLocal(getCurrentDateTimeUTC()).slice(11, 19);
    const localDate = new Date(localString.replace(" ", "T") + "Z");
    const timezoneOffset = localDate.getTimezoneOffset();
    const utcDate = new Date(localDate.getTime() + timezoneOffset * 60000);
    return utcDate.toISOString().slice(0, 19).replace("T", " ");
};

const getLocalDateTime = (date, formate = "DATE") => {
    if (!date) return "N/A";
    if (formate === "DATE")
        return new Date(date.replace(" ", "T") + "Z")?.toLocaleDateString("en-GB");
    if (formate === "DATETIME")
        return (
            new Date(date.replace(" ", "T") + "Z")?.toLocaleDateString("en-GB") +
            " " +
            new Date(date.replace(" ", "T") + "Z")?.toLocaleTimeString("en-GB", { hour12: true })
        );
};

const getTimePassed = (utcString) => {
    if (!utcString) return "N/A";

    const localString = convertUTCToLocal(utcString);
    const localDate = new Date(localString.replace(" ", "T"));

    const now = new Date();
    const diffMs = now - localDate;

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

export {
    getTimePassed,
    addDays,
    getCurrentDateTimeUTC,
    convertUTCToLocal,
    formatDate,
    convertLocalToUTC,
    getLocalDateTime,
};
