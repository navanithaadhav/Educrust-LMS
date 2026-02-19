import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log("Google Client ID:", clientId);

if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
  console.error("Missing Google Client ID. Please set VITE_GOOGLE_CLIENT_ID in your .env file.");
  // Optionally alert the user visually, though console is usually enough for devs
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={clientId || "YOUR_GOOGLE_CLIENT_ID"}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
