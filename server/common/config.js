let CURRENT_KEY = 0;
const GOOGLE_API_KEYS = process.env.GOOGLE_API_KEYS.split(',');

export const MONGODB_URI = process.env.MONGODB_URI;
export const QUERY = 'football';
export const TIME_DELTA = 10 * 1000; // in seconds

// Fetches the API Key that hasn't exceeded its quota yet.
export const getGoogleAPIKey = () => GOOGLE_API_KEYS[CURRENT_KEY];

// Circle around the API Keys to ensure quota usage isn't exhausted.
export const incrementCurrentKey = () =>
  (CURRENT_KEY = (CURRENT_KEY + 1) % GOOGLE_API_KEYS.length);
