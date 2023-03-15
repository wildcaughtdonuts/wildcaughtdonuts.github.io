//clock.js

const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById('updated-time');
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;

//구글 아날리틱스
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-RT7Z90C0RR');