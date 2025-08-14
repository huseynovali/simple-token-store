import axios from "axios";

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let refreshInProgress = false;
let subscribers = [];

function onAccessTokenFetched(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

export function attachAuthInterceptors(getAccessToken, refresh) {
  axiosPrivate.interceptors.request.use((config) => {
    const token = typeof getAccessToken === "function" ? getAccessToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (refreshInProgress) {
          return new Promise((resolve, reject) => {
            addSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosPrivate(originalRequest));
            });
          });
        }

        refreshInProgress = true;
        try {
          const res = await refresh();
          const newToken = res?.data?.data?.accessToken;
          refreshInProgress = false;
          if (!newToken) {
            window.location.href = "/login";
            return Promise.reject(error);
          }
          onAccessTokenFetched(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosPrivate(originalRequest);
        } catch (err) {
          refreshInProgress = false;
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
}
