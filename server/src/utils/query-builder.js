/**
 * Converts a JavaScript object into a URL query string.
 * @param {object} params - The object to convert.
 * @returns {string} The resulting query string (e.g., "?key=value&another=123").
 */
export const buildQueryString = (params) => {
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
  return queryString ? `?${queryString}` : "";
};

