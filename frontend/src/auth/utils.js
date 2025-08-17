import { paths } from "../routes/paths";

import axios from "../utilities/axios";

import { STORAGE_KEY } from "./constants";

export function deleteKeys() {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(`${STORAGE_KEY}-refresh`);
    sessionStorage.removeItem(`${STORAGE_KEY}-user`);
}

export async function getSessionToken() {
    return sessionStorage.getItem(STORAGE_KEY)
}

export function tokenExpired(exp) {
    const currentTime = Date.now();
    const timeLeft = exp * 1000 - currentTime;

    setTimeout(() => {
        try {
            // alert('Token expired!');
            sessionStorage.removeItem(STORAGE_KEY);
            window.location.href = paths.LOGIN;
        } catch (error) {
            console.error('Error during token expiration:', error);
            throw error;
        }
    }, timeLeft);
}


export function jwtDecode(token) {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length < 2) {
            throw new Error('Invalid token!');
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));

        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        throw error;
    }
}

export async function setSession(accessToken) {
    try {
        if (accessToken) {
            sessionStorage.setItem(STORAGE_KEY, accessToken);

            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            const decodedToken = jwtDecode(accessToken);

            if (decodedToken && 'exp' in decodedToken) {
                tokenExpired(decodedToken.exp);
            } else {
                throw new Error('Invalid access token!');
            }
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
            delete axios.defaults.headers.common.Authorization;
        }
    } catch (error) {
        console.error('Error during set session:', error);
        throw error;
    }
}


export async function setUser(user) {
    try {
        sessionStorage.setItem(`${STORAGE_KEY}-user`, JSON.stringify(user));
    } catch (error) {
        console.error('Error during set session:', error);
        throw error;
    }
}

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}