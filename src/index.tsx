import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux/es/exports";
import { combineReducers, createStore } from "redux";
import { countriesReducer } from "store/countries/reducer";
import { indicatorsReducer } from "store/indicators/reducer";
import indicesReducer from "store/indices/reducer";
import { yearsReducer } from "store/years/reducer";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const store = createStore(
  combineReducers({
    countries: countriesReducer,
    years: yearsReducer,
    indicators: indicatorsReducer,
    indices: indicesReducer
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