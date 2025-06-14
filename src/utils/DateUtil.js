const addDays = (date, days) => {
  if (!date) {
    throw new Error("Date cannot be null");
  }
  const result = new Date(date.replace(" ", "T") + "Z");
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().replace("T", " ").slice(0, 19);
};

const getCurrentDateTimeUTC = () => {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
};


const convertUTCToLocal = (utcString) => {
  const utcDate = new Date(utcString.replace(" ", "T") + "Z");
  const timezoneOffset = utcDate.getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
  return localDate.toISOString().slice(0, 19).replace("T", " ");
};


const convertLocalToUTC = (localString) => {
  if (String(localString).length == 10) localString += " " + convertUTCToLocal(getCurrentDateTimeUTC()).slice(11, 19);
  const localDate = new Date(localString.replace(" ", "T") + "Z");
  const timezoneOffset = localDate.getTimezoneOffset();
  const utcDate = new Date(localDate.getTime() + timezoneOffset * 60000);
  return utcDate.toISOString().slice(0, 19).replace("T", " ");
};

const getLocalDateTime = (date, formate="DATE") => {
  if(!date) return "N/A";
  if(formate === "DATE") return new Date(date.replace(" ", "T") + "Z")?.toLocaleDateString("en-GB");
  if(formate === "DATETIME") return new Date(date.replace(" ", "T") + "Z")?.toLocaleDateString("en-GB") + " " + new Date(date.replace(" ", "T") + "Z")?.toLocaleTimeString("en-GB", { hour12: true });
}

export { addDays, getCurrentDateTimeUTC, convertUTCToLocal, convertLocalToUTC, getLocalDateTime };
