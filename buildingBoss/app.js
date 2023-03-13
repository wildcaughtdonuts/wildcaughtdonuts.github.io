//app.js

const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const urlInput = document.getElementById('url-input');

submitBtn.addEventListener('click', () => {
  const url = urlInput.value;

  fetch(url)
    .then(response => response.text())
    .then(data => {
      resultDiv.innerHTML = data;
    })
    .catch(error => {
      resultDiv.innerHTML = '오류가 발생했습니다. URL을 확인해주세요.';
      console.error(error);
    });
});
