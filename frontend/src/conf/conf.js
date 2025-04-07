const env = import.meta.env.VITE_ENV;

let BACKEND_URL = "";

if (env === "development") {
   BACKEND_URL = import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;
} else {
   BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
}

export const conf = {
   BACKEND_URL: BACKEND_URL,
   GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
   SECRET_KEY: import.meta.env.VITE_SECRET_KEY,
};
