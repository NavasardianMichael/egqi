import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux/es/exports";
import { combineReducers, createStore } from "redux";
import listsReducer from "store/lists/reducer";
import settingReducer from "store/settings/reducer";
import valuesReducer from "store/values/reducer";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const store = createStore(
  combineReducers({
    lists: listsReducer,
    values: valuesReducer,
    settings: settingReducer
}))

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch