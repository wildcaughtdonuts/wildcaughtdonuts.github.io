

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://wildcaughtdonuts.github.io/mypage/buildingBoss/')
    .then(response => response.text())
    .then(html => {
      const outputDiv = document.querySelector('.output');
      outputDiv.innerHTML = html;
    })
    .catch(error => console.error(error));
});
