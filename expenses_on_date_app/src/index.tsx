import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ExpensesOnDate from './components/ExpensesOnDate';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ExpensesOnDate />
  </React.StrictMode>
);