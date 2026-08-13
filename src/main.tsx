import { StrictMode } from "react";
import App from "@/App";
import { createRoot } from "react-dom/client";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store } from "@/state";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistStore(store)}>
                    <App />
                </PersistGate>
            </Provider>
        </StrictMode>,
    );
} else {
    console.error("Root element not found in the DOM.");
}
