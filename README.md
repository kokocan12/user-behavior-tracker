# User-behavior-tracker [![Netlify Status](https://api.netlify.com/api/v1/badges/16ccc162-a42e-4f68-ad36-cd11e1f5d0dd/deploy-status)](https://app.netlify.com/sites/bucolic-pie-ca1277/deploys) [![user-behavior-tracker](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/uvruz5/main&style=flat-square&logo=cypress)](https://dashboard.cypress.io/projects/uvruz5/runs) <br/>

## What is User-behavior-tracker?
User-behavior-tracker is a plugin that allows you to track and log user behavior in the browser environment. <br/>
Track the user's keyboard input, page navigation, text dragging, tab exit, tab return, window exit, window return, and image viewing.

## Performance aspect
- When tracking user behavior, it should not affect the performance of your application. <br/>
Internally, it uses [requestIdleCallback](https://developer.mozilla.org/ko/docs/Web/API/Window/requestIdleCallback) to handle user events asynchronously, so it doesn't adversely affect performance. <br />
For browsers that do not support requestIdleCallback API (ex. safari, IOS safari), polyfill is supported. <br />
Polyfill is implemented by referring to React's scheduler.

- Event handlers are not added to all elements on the screen. <br />
The event handlers required for tracking are added to the root element, so there is no need to add an event handler every time the screen is switched.
There is no performance hit caused by event bubbling.

## How can I use it?
