import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './locale/i18n';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
