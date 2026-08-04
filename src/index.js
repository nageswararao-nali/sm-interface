import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
// import "./i18n"
import { Provider } from "react-redux"
import * as serviceWorker from "./serviceWorker"
import store from "./store"
const root = ReactDOM.createRoot(document.getElementById('root'));
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

root.render(app);

