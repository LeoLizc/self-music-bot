/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchOptions extends RequestInit {
  body?: any;
  timeout?: number; // This can be typed further based on expected input types
}

export const fetchWithTimeout = async (
  url: string,
  options: FetchOptions
) => {
  // timeout
  const { timeout, ...fetchOptions } = options;
  const controller = new AbortController();
  let id: NodeJS.Timeout | undefined;

  if (timeout) {
    id = setTimeout(() => controller.abort(), timeout);
  }

  // body
  if (fetchOptions.body) {
    if (fetchOptions.body instanceof Object) {
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    fetchOptions.body = new TextEncoder().encode(fetchOptions.body as string);
  }

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    return res;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      const abortError = new Error(`Fetch timeout after ${timeout} milliseconds`);
      abortError.name = "AbortError";
      throw abortError;
    }

    throw error;
  } finally {
    if (id) clearTimeout(id);
  }
};
