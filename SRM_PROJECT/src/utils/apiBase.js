export function getApiBaseUrl() {
  let url = (
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1/SUPPLIER-RELATIONSHIP-MANAGEMENT/SRM_PROJECT/backend/api'
  ).trim().replace(/\/$/, '');

  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
}

