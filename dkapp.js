function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('address').value = data.roadAddress;

      // 건축물대장 API 요청
      const buildingCode = data.buildingCode;
      const sggCd = buildingCode.substring(0, 5);
      const bjdCd = buildingCode.substring(5, 10);
      const bunCd = buildingCode.substring(10, 15);
      const jiCd = buildingCode.substring(15, 20);

      const xhr = new XMLHttpRequest();
      const url = `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrBasisOulnInfo?sigunguCd=${sggCd}&bjdongCd=${bjdCd}&platGbCd=0&bun=${bunCd}&ji=${jiCd}&ServiceKey=5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D`;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const result = document.createElement('div');
            const responseXML = xhr.responseXML;
            const platLoc = responseXML.getElementsByTagName('platLoc')[0]?.childNodes[0]?.nodeValue;
            const bldNm = responseXML.getElementsByTagName('bldNm')[0]?.childNodes[0]?.nodeValue;
            const mainPurpsCdNm = responseXML.getElementsByTagName('mainPurpsCdNm')[0]?.childNodes[0]?.nodeValue;
            
            if (platLoc && bldNm && mainPurpsCdNm) {
              result.innerHTML = `주소: ${platLoc}<br>`;
              result.innerHTML += `건물명: ${bldNm}<br>`;
              result.innerHTML += `주용도: ${mainPurpsCdNm}`;
            } else {
              result.innerHTML = "건물 대장 정보가 없습니다.";
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