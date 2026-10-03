import axios, { type Method, type ResponseType } from "axios";

// Active requests, so they can all be cancelled at once (e.g. on 401/403)
const controllers = new Set<AbortController>();

export const cancelAllRequests = () => {
  controllers.forEach((c) => c.abort());
  controllers.clear();
};

function request(method: Method) {
  return async (
    url: string,
    body?: any,
    params?: Record<string, any>,
    type?: string,
    responseType?: ResponseType,
  ) => {
    const headers: Record<string, string> = authHeader(url);
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = type || "application/json";
    }

    const controller = new AbortController();
    controllers.add(controller);

    try {
      const response = await axios({
        method,
        url,
        headers,
        params,
        data: body,
        signal: controller.signal,
        ...(responseType ? { responseType } : {}),
      });

      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return Promise.reject(new Error("Request was cancelled"));
      }

      if (error.response) {
        const { status, data } = error.response;

        if (status === 401 || status === 403) {
          cancelAllRequests();
        }

        // Keep the HTTP status so callers can tell 400 / 409 / 500 apart
        return Promise.reject({
          ...(typeof data === "object" && data !== null
            ? data
            : { message: String(data || error.message) }),
          status,
        });
      }

      // No response = network error / server unreachable (status stays undefined)
      return Promise.reject(error);
    } finally {
      // Runs on success, error and cancel, so nothing leaks
      controllers.delete(controller);
    }
  };
}

function authHeader(_url: string): Record<string, string> {
  // INFO: use this if auth headers are needed
  // return { Authorization: `Bearer ${token}` };
  return {};
}

export const axiosWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
  patch: request("PATCH"),
};

export const fetchWrapper = axiosWrapper;
