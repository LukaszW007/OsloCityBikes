import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App2 from './App2';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter >
    <Routes>
      <Route path="/" element={<App pageId={'1'}/>} />
      <Route path="/:id" element={<App pageId={()=>useParams()}/>} />
    </Routes>
  </BrowserRouter >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
