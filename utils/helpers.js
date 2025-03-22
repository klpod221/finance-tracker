import { DateTime } from "luxon";

/**
 * Format a date string to a more readable format.
 *
 * @param {string} dateString - The date string to format.
 * @param {string} format - The format to use for the date.
 * @param {string} timezone - The timezone to use for the date.
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateString, format = "DD", timezone = "") {
  if (!dateString.trim()) return "-";

  if (!timezone) {
    return DateTime.fromISO(dateString).toFormat(format);
  } else {
    return DateTime.fromISO(dateString, { zone: timezone }).toFormat(format);
  }
}

const helpers = {
  formatDate,
};

export default helpers;
