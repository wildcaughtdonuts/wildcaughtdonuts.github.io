//adress.js

const searchBtn = document.getElementById('search-btn');
const mapResultDiv = document.getElementById('mapResult');

searchBtn.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      const buildingCode = data.buildingCode;
      mapResultDiv.innerHTML = `<p>buildingCode: ${buildingCode}</p>`;
    }
  }).open();
});