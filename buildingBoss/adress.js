//adress.js

const searchBtn = document.getElementById('search-btn');
const mapResultDiv = document.getElementById('mapResult');

searchBtn.addEventListener('click', () => {
  new daum.Postcode({
    oncomplete: function (data) {
      const buildingCode = data.buildingCode;
      const apiKey = "5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D";
      const siggCd = buildingCode.substr(0, 5);
      const bjdCd = buildingCode.substr(5, 5);
      const bunCd = buildingCode.substr(11, 4);
      const jiCd = buildingCode.substr(15, 4);
      const apiUrl = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo?sigunguCd=${siggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=${apiKey}`;
      mapResultDiv.innerHTML = `<p>apiUrl: ${apiUrl}</p>`;
    }
  }).open();
});
