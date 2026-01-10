import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      ,
      <Toaster
        position="right-bottom"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          // Define default options
          duration: 1000,
          removeDelay: 1000,
          style: {
            background: "white",
            color: "black",
          },
        }}
      />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
