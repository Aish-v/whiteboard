import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {  BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.min.css";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
document.getElementById("root")
);