/**
 * Interrupteur central : tant que cette valeur est `true`, TOUS les modules
 * de src/lib/api/* delegue vers les implementations fictives de src/mock/*
 * au lieu d'appeler le backend reel. Aucun `fetch` n'est effectue.
 *
 * Pour rebrancher le vrai backend plus tard : mettre
 * `VITE_USE_MOCK_API=false` dans `.env` (et renseigner VITE_API_BASE_URL).
 */
export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API !== "false"; // true par defaut en dev
