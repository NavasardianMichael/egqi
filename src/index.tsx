import React from "react";
import ReactDOM from "react-dom/client";
import { combineReducers, createStore } from "redux";
import listsReducer from "store/lists/reducer";
import valuesReducer from "store/values/reducer";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const store = createStore(
  combineReducers({
    lists: listsReducer,
    values: valuesReducer,
}))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch