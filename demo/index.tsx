import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { track } from '../dist/esm';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

const logView = document.getElementById('log-view');

// track(HTMLElement, [callback])
track(document.getElementById('root'), ({ time, type, contents }) => {
  const logContainer = document.createElement('div');

  logContainer.innerHTML = `<div class="log">
                              <div class="log-time">${time}</div>
                              <div class="log-type">${type}</div>
                              <div class="log-content">${contents}</div>
                            </div>`;
  logView.appendChild(logContainer.children[0]);

  logView.scrollTo(0, logView.scrollHeight);
});
