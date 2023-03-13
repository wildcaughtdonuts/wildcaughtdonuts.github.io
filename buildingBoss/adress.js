const searchBtn = document.getElementById('search-btn');
const resultDiv = document.getElementById('mapResult');

searchBtn.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      const buildingCode = data.buildingCode;
      resultDiv.innerHTML = `<p>buildingCode: ${buildingCode}</p>`;
    }
  }).open();
});