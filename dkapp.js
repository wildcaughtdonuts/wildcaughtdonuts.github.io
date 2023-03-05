function openDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      document.getElementById('address').value = data.roadAddress;

      // 검색 결과 데이터 추출
      const sigunguCode = data.sigunguCode;
      const bcode = data.bcode;
      const roadnameCode = data.roadnameCode;
      const query = data.query;

      // 건축물대장 API 요청
      const xhr = new XMLHttpRequest();
      const url = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrBasisOulnInfo?sigunguCd=${sigunguCode}&bjdongCd=${bcode}&platGbCd=0&bun=${query}&ji=&ServiceKey=5A1ar8VsZgpiuOpuMbwPSgtsHIl%2FDCfu%2FMINUxKvTbwgL6nXfgG42fYYAHIq4gmp1bUZcQHO%2F1B2ilg7w8Hlzw%3D%3D`;

      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            // API 응답 결과 처리
            const result = document.getElementById('result');
            const responseXML = xhr.responseXML;
            const platLoc = responseXML.getElementsByTagName('platLoc')[0].childNodes[0].nodeValue;
            const bldNm = responseXML.getElementsByTagName('bldNm')[0].childNodes[0].nodeValue;
            const mainPurpsCdNm = responseXML.getElementsByTagName('mainPurpsCdNm')[0].childNodes[0].nodeValue;

            result.innerHTML = `주소: ${platLoc}<br>`;
            result.innerHTML += `건물명: ${bldNm}<br>`;
            result.innerHTML += `주용도: ${mainPurpsCdNm}`;
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
