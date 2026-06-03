export const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export function normalizeApiResponse<T>(response: any): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response == null) {
    return [];
  }

  return response.results ?? response.data ?? response.items ?? [];
}
