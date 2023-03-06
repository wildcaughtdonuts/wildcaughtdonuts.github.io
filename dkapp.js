function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('address').value = data.roadAddress;

      // 건축물대장 API 요청
      const buildingCode = data.buildingCode;
      const sggCd = buildingCode.substring(0, 5);
      const bjdCd = buildingCode.substring(5, 10);
      const bunCd = buildingCode.substring(11, 15);
      const jiCd = buildingCode.substring(15, 19);

      const xhr = new XMLHttpRequest();
      const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrBasisOulnInfo?sigunguCd=${sggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D`;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const result = document.createElement('div');
            const response = JSON.parse(xhr.responseText).response.body.items.item;

            if (response.platLoc === '') {
              result.innerHTML = '건물 대장 정보가 없습니다. <br> API 요청 주소: ' + url;
            } else {
              let text = '';
              for (const key in response) {
                text += `${key}: ${response[key]}<br>`;
              }
              result.innerHTML = text;
            }

            const target = document.getElementById('result');
            target.innerHTML = '';
            target.appendChild(result);
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      
      
      xhr.open('GET', url, true);
      xhr.send();
    }
  }).open();
}
