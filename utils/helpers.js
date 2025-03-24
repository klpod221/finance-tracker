import { DateTime } from "luxon";
import pluralize from "pluralize";

/**
 * Format a date string to a more readable format.
 *
 * @param {string} dateString - The date string to format.
 * @param {string} format - The format to use for the date.
 * @param {string} timezone - The timezone to use for the date.
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateString, format = "DD", timezone = "") {
  // check if dateString is a string
  if (typeof dateString !== "string") {
    return "-";
  }

  if (!dateString.trim()) return "-";

  if (!timezone) {
    return DateTime.fromISO(dateString).toFormat(format);
  } else {
    return DateTime.fromISO(dateString, { zone: timezone }).toFormat(format);
  }
}

/**
 * Format money value to a more readable format.
 *
 * @param {number} value - The money value to format.
 * @param {string} currency - The currency to use for formatting.
 * @param {string} locale - The locale to use for formatting.
 * @return {string} - The formatted money value.
 */
export function formatMoney(value, currency = "VND", locale = "vi-VN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Singularize a word 
 * 
 * @param {string} word - The word to singularize
 * @return {string} - The singularized word
 */
export function singularize(word) {
  return pluralize.singular(word);
}
