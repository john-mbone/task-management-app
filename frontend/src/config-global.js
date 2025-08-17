import packageJson from '../package.json';

export const CONFIG = {
  appName: 'ITask',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  SECRET_KEY: import.meta.env.VITE_SECRET_KEY ?? ''
};
