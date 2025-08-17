import axios, { endpoints } from '../utilities/axios.js';

import { deleteKeys, setSession, setUser } from './utils';


export const signInWithPassword = async ({ username, password }) => {
  try {
    const data = { username, password };

    const res = await axios.post(endpoints.auth.signIn, data);

    const { status, message, ...other } = res.data;

    if (!status) {
      throw new Error(message);
    }

    if (status) {
      const { token,  user } = other.data
      setSession(token);
      setUser(user);
    }

    return { status, message };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const registerOnITask = async ({ username, password,email }) => {
  try {
    const data = { username, password,email };

    const res = await axios.post(endpoints.auth.signUp, data);

    const { status, message, ...other } = res.data;

    if (!status) {
      throw new Error(message);
    }

    return { status, message };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};


export const signOut = async () => {
  try {
    deleteKeys();
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
