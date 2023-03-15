//clock.js

const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById('updated-time');
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;

// Google Analytics
document.addEventListener('DOMContentLoaded', () => {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-RT7Z90C0RR');
});
