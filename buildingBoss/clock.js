//clock.js

const updatedTime = new Date(document.lastModified);
const updatedTimeDiv = document.getElementById('updated-time');
updatedTimeDiv.innerText = `Last updated: ${updatedTime.toLocaleString()}`;