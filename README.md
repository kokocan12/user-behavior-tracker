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
The event handlers required for tracking are added to the root element, so there is no need to add event handlers every time the screen is switched.
There is no performance hit caused by event bubbling.

## How to use it?
In your local directory, enter the command below
```
yarn build
```
then, you can see the ***dist*** directory.

If you want to use it in **esm** format
```
import { track } from '../dist/esm';

track(document.getElementById('root'), (log) => {
  // some tasks...
});

```
If you want to use it in the **script tag**
```
<script src="../dist/bundle.js"></script>
```

## Demo
In your local directory, enter the command below
```
yarn build
yarn demo
```
then, access http://localhost:1234 through your browser.<br />
Or visit [my demo page](https://bucolic-pie-ca1277.netlify.app/)


## Test other websites using dev tools
Copy the code below, then paste the code into your dev tools.
```
var Tracker=function(e){function t(e){var t=new Date(e),r=n(t.getHours()),a=n(t.getMinutes()),i=n(t.getSeconds());return"".concat(r,":").concat(a,":").concat(i)}function n(e){return e>=10?"".concat(e):"0".concat(e)}var r="INPUT",a="keyboard",i=null;function o(e){clearTimeout(i);var t=function(){var t=function(){if(document.activeElement.tagName===r)return document.activeElement;return null}();t&&G({evt:Object.assign(Object.assign({},e),{target:t}),timestamp:R(),syncType:A,eventType:a})};"Enter"===e.key?t():i=setTimeout(t,300)}function c(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return u(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var s="IMG",m="pointer-move",p=R(),f="",v=R(),l={};function y(e){R()-p>10&&(G({eventType:m,evt:e,syncType:A,timestamp:R()}),p=R())}function d(e){return e.tagName===s?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}function g(e,n){var r=e.evt,a=e.timestamp,i=r.target;if(function(e){if(e.tagName===s)return!0;for(var t=0,n=c(e.childNodes);n.length;){var r=n.shift();r.tagName===s?t+=1:r.childNodes.forEach((function(e){return n.push(e)}))}return 1===t}(i)){var o=document.createTreeWalker(i,NodeFilter.SHOW_ELEMENT,d);if(o.currentNode.tagName===s||o.nextNode()){var u=o.currentNode.getAttribute("src");if(f!==u)f=u,v=R();else{var m=Object(l).hasOwnProperty(u);R()-v>1e3&&!m&&(l[u]=!0,n({contents:u,time:t(a),timestamp:a,type:"image-viewing"}))}}}}var T="pointer-up";function b(e){G({evt:e,eventType:T,syncType:A,timestamp:R()})}var h=0,w=0,E=!0,k="focus",N="focus-change";function I(){w+=1}function S(){G({evt:new Event(k),eventType:k,syncType:A,timestamp:R()})}var A=0,L=[],O=[],M=[],j=function(){},C=3,F=0,P=new MessageChannel,_=P.port2;function R(){return(new Date).valueOf()}function q(){return F-R()}function x(e){for(e||(e={timeRemaining:q,didTimeout:!1});2===C||e.timeRemaining();){var t=null;if($(L)?W(t=z(L)):3===C&&$(O)?W(t=z(O)):3===C&&$(M)&&(t=z(M),j(t)),null===t)break}($(L)||$(O)||$(M))&&_.postMessage(null),C=3}var D="function"==typeof requestIdleCallback?function(){requestIdleCallback(x)}:function(){F=R()+20,x()};function H(e,t){return e.timestamp-t.timestamp}function U(e){for(var t=e.length-1;t>0;){var n=t-1>>1,r=e[t],a=e[n];if(!(a&&H(r,a)<0))break;e[t]=a,e[n]=r,t=n}}function W(e){switch(e.eventType){case a:!function(e,n){var r=e.evt,i=e.timestamp,o=r.target.value;o&&n({contents:o,timestamp:i,type:a,time:t(i)})}(e,K);break;case B:n=K,r=e.timestamp,(i=window.location.pathname)!==Q&&(Q=i,n({contents:i,timestamp:r,time:t(r),type:J}));break;case k:!function(e,n){var r=e.timestamp,a=document.hasFocus();E!==a&&n(a?{contents:h!==w?"[move-to-current-tab]":"[move-to-current-window]",timestamp:r,type:N,time:t(r)}:{contents:h!==w?"[move-to-another-tab]":"[move-to-another-window]",timestamp:r,type:N,time:t(r)}),h=w,E=a,setTimeout((function(){S()}),150)}(e,K);break;case T:!function(e,n){var r=e.timestamp,a=document.getSelection().toString();a&&n({contents:a,time:t(r),timestamp:r,type:"text-select"})}(e,K);break;case m:g(e,K);break;default:K({type:"",contents:1===e.syncType?"sync":"async",time:"",timestamp:e.timestamp})}var n,r,i}function G(e){var t=e.evt,n=e.timestamp,r=e.syncType,a=e.eventType;r===A?(O.push({evt:t,timestamp:n,syncType:r,eventType:a}),U(O),_.postMessage(null)):1===r&&(L.push({evt:t,timestamp:n,syncType:r,eventType:a}),U(L),C=2,x())}function K(e){M.push(e),U(M)}function $(e){return e[0]?e[0]:null}function z(e){if(!e[0])return null;var t=e[0],n=e.pop();return n!==t&&(e[0]=n,function(e){for(var t=0,n=e.length;t<n;){var r=2*t+1,a=r+1,i=e[r],o=e[a],c=e[t];if(i&&H(i,c)<0)o&&H(o,i)<0?(e[t]=o,e[a]=c,t=a):(e[t]=i,e[r]=c,t=r);else{if(!(o&&H(o,c)<0))return;e[t]=o,e[a]=c}}}(e)),t}P.port1.onmessage=D;var B="click",J="page-navigate",Q=window.location.pathname;function V(e){G({evt:e,timestamp:R(),eventType:B,syncType:A})}return e.track=function(e,t){var n;e&&(e.addEventListener("keyup",o),e.addEventListener("click",V),window.addEventListener("popstate",V),document.addEventListener("visibilitychange",I),e.addEventListener("pointerup",b),S(),e.addEventListener("pointermove",y),"function"==typeof(n=t)&&(j=n))},Object.defineProperty(e,"__esModule",{value:!0}),e}({});
Tracker.track(document.body, function(log){console.log(log)})
```
<br/>

![c](https://user-images.githubusercontent.com/49009864/170848067-74f051a7-acf7-4655-81bd-051c97339eed.gif)


# License 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright (c) 2022 이형준

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
