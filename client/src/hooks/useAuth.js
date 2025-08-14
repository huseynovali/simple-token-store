import { useState, useEffect } from "react";
import axios from "axios";
import { AuthService } from "../service/AuthService";
import { attachAuthInterceptors } from "../service/axiosService";

axios.defaults.withCredentials = true;

export function useAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const login = async (email, password) => {
    const res = await AuthService.login(email, password);
    setAccessToken(res.data.data.accessToken);
    return res;
  };

  const refresh = async () => {
    try {
      const res = await AuthService.refreshToken();
      const newToken = res?.data?.data?.accessToken;
      setAccessToken(newToken || null);
      return res;
    } catch (err) {
      setAccessToken(null);
      throw err;
    }
  };

  useEffect(() => {
    attachAuthInterceptors(() => accessToken, refresh);

    (async () => {
      try {
        await refresh();
      } catch (e) {
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  const isAuthenticated = Boolean(accessToken);

  return { accessToken, isAuthenticated, initialized, login, refresh };
}
