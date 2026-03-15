const STORAGE_KEY = "taskbot-todos";

export function loadTodos(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveTodos(json: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, json);
}
